winkstart.module('voip', 'callflow',
   {
      css: [
         'css/style.css',
         'css/callflow.css'
      ],

      templates: {
         callflow: 'tmpl/callflow.html',
         callflow_main: 'tmpl/callflow_main.html',
         branch: 'tmpl/branch.html',
         tools: 'tmpl/tools.html',
         root: 'tmpl/root.html',
         node: 'tmpl/node.html',
      },

      elements: {
         flow: '#ws_cf_flow',
         tools: '#ws_cf_tools',
         save: '#ws_cf_save',
         buf: '#ws_cf_buf'
      },

      actions: {
          "root"        : { "name" : "root",        "rules" : [ {"type" : "quantity", "maxSize" : "1"} ], "isUsable" : "false"},
          "device"      : { "name" : "device",      "rules" : [ {"type" : "quantity", "maxSize" : "1"} ], "isUsable" : "true"},
          "conference"  : { "name" : "conference",  "rules" : [ {"type" : "quantity", "maxSize" : "1"} ], "isUsable" : "true"},
          "hangup"      : { "name" : "hangup",      "rules" : [ {"type" : "quantity", "maxSize" : "0"} ], "isUsable" : "true"},
          "menu"        : { "name" : "menu",        "rules" : [ {"type" : "quantity", "maxSize" : "9"} ], "isUsable" : "true"},
          "voicemail"   : { "name" : "voicemail",   "rules" : [ {"type" : "quantity", "maxSize" : "1"} ], "isUsable" : "true"},
          "call_forward": { "name" : "call_forward", "rules" : [ {"type" : "quantity", "maxSize" : "1"} ], "isUsable" : "true"},
          "play"        : { "name" : "play",        "rules" : [ {"type" : "quantity", "maxSize" : "1"} ], "isUsable" : "true"},
          "offnet"      : { "name" : "offnet",        "rules" : [ {"type" : "quantity", "maxSize" : "9"} ], "isUsable" : "true"},
          "ring_group"  : { "name" : "ring_group",  "rules" : [ {"type" : "quantity", "maxSize" : "1"} ], "isUsable" : "true"},
          "temporal_route"  : { "name" : "temporal_route",  "rules" : [ {"type" : "quantity", "maxSize" : "1"} ], "isUsable" : "true"},
          "response"  : { "name" : "response",  "rules" : [ {"type" : "quantity", "maxSize" : "1"} ], "isUsable" : "true"}
      },

      categories: {
         "basic" : ["answer","conference","hangup","menu","voicemail"],
         "dialplan": ["answer", "hangup", "tone"]
      },

      subscribe: {
         'callflow.activate' : 'activate',
         'callflow.list-panel-click' : 'editCallflow',
         'callflow.edit-callflow' : 'editCallflow'
      },
      resources: {
            "callflow.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'GET'
            },
            "callflow.get": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
      }

   },
   function (args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Callflows'
        });
   },
   {
      activate: function () {
         var THIS = this;

         winkstart.registerResources(THIS.config.resources);

         $('#ws-content').empty();
         THIS.templates.callflow_main.tmpl({}).appendTo($('#ws-content'));
         THIS.renderList();

         THIS.actions = THIS.config.actions;
         THIS.categories = THIS.config.categories;

         //THIS._activate({target: $('#callflow-view')});
         THIS.templates.callflow.tmpl(this.config.elements).appendTo($('#callflow-view'));
         THIS.renderTools();

         $(this.config.elements.save).click(function () { THIS.save(); }).hover(function () { $(this).addClass('active'); }, function () { $(this).removeClass('active'); });
      },

      editCallflow: function(data) {
         var THIS = this;

         THIS._resetFlow();

         winkstart.getJSON('callflow.get', {
            crossbar: true,
            account_id: MASTER_ACCOUNT_ID,
            callflow_id: data.id
         }, function(json) {
            THIS._resetFlow();
            THIS.flow.root = THIS.buildFlow(json.data.flow, THIS.flow.root, 0);
            //console.log(THIS.flow.root);
            THIS.renderFlow();
         });
      },

      buildFlow: function (json, parent, id) {
         var THIS = this,
             branch = THIS.branch(json.module);

         branch.id = ++id;
         console.log('Recursing.... ' + json.module);

         $.each(json.children, function(i, child) {
            branch = THIS.buildFlow(child, branch, id);
         });
         console.log(branch);
         console.log(parent.addChild(branch));
         console.log(parent);

         return parent;
      },

      renderFlow: function () {
         var target = $(this.config.elements.flow).empty();
         target.append(this._renderFlow());
      },

      renderTools: function () {
         var target = $(this.config.elements.tools).empty();
         target.append(this._renderTools());
      },

      // Create a new branch node for the flow
      branch: function (actionName) {
         var THIS = this;

         function branch (actionName) {
            this.id = -1;                   // id for direct access
            this.actionName = actionName;
            this.parent = null;
            this.children = new Array();
            this.data = {};                 // data caried by the node

            // returns a list of potential child actions that can be added to the branch
            this.potentialChildren = function () {
               var list = [];

               for (var i in THIS.actions) if (THIS.actions[i].isUsable) list[THIS.actions[i].name] = THIS.actions[i].name;

               for (var i in THIS.actions[this.actionName].rules) {
                  var rule = THIS.actions[this.actionName].rules[i];

                  switch (rule.type) {
                     case 'quantity': {
                        if (this.children.length >= rule.maxSize) list = [];
                     } break;
                     // ADD MORE RULE PROCESSING HERE ////////////////////
                  }
               }

               return list;
            }

            this.contains = function (branch) {
               var toCheck = branch;
               while(toCheck.parent) if (this.id == toCheck.id) return true; else toCheck = toCheck.parent;
               return false;
            }

            this.removeChild = function (branch) {
               var children = new Array();
               for (var i in this.children) if (this.children[i].id != branch.id) children.push(this.children[i]);
               this.children = children;
            }

            this.addChild = function (branch) {
               console.log('checking');
               if (!(branch.actionName in this.potentialChildren())) return false;
               console.log('pass');
               if (branch.contains(this)) return false;
               console.log('pass');
               if (branch.parent) branch.parent.removeChild(branch);
               branch.parent = this;
               this.children.push(branch);
               return true;
            }

            this.index = function (index) {
               this.id = index;
               for (var i in this.children) index = this.children[i].index(index+1);
               return index;
            }

            this.nodes = function () {
               var nodes = new Array();
               nodes[this.id] = this;
               for (var i in this.children) {
                  var buf = this.children[i].nodes();
                  for (var j in buf) nodes[j] = buf[j];
               }
               return nodes;
            }

            this.serialize = function () {
               var json = THIS._clone(this.data);
               json.children = {};
               for (var i in this.children) json.children[i] = (this.children[i].serialize());
               return json;
            }
         }

         return new branch(actionName);
      },

      count: function (obj) {
         var count = 0;
         for (var i in obj) count++;
         return count;
      },

// A set of actions: modules/apps tied together with rules, restricting dependencies between the actions
      root: { name : 'root', rules : [ {type : 'quantity', maxSize : 1} ], isUsable : false},

      actions: { root : this.root },

// Action categories
      categories: { },

      flow: { },

      _resetFlow: function () {
         this.flow = {};
         this.flow.root = this.branch('root');    // head of the flow tree
         this._formatFlow();
      },

      _formatFlow: function () {
         this.flow.root.index(0);
         this.flow.nodes = this.flow.root.nodes();
      },



// FLOW /////////////////////////////////////////////////////////////////
      _renderFlow: function () {
         var THIS = this;
         this._formatFlow();

         var layout = this._renderBranch(this.flow.root);

         layout.find('.node').hover(function () { $(this).addClass('over'); }, function () { $(this).removeClass('over'); });

         layout.find('.node').each(function () {
            var node;
            if ($(this).hasClass('root')) {
               $(this).removeClass('icons_black root');
               node = THIS.templates.root.tmpl(THIS.flow.nodes[$(this).attr('id')]);
            }
            else {
               node = THIS.templates.node.tmpl(THIS.flow.nodes[$(this).attr('id')]);
            }
            $(this).append(node);

            $(this).droppable({
               drop: function (event, ui) {
                  var target = THIS.flow.nodes[$(this).attr('id')];
                  if (ui.draggable.hasClass('action')) {
                     var action = ui.draggable.attr('name'),
                         branch = THIS.branch(action);
                     if (target.addChild(branch)) {
                        var popup = THIS.actions[action].popup;
                        if (popup) winkstart.publish(popup+'.popup', target.children[target.children.length-1]);
                        THIS.renderFlow();
                     }
                  }
                  if (ui.draggable.hasClass('node')) {
                     var branch = THIS.flow.nodes[ui.draggable.attr('id')];
                     if (target.addChild(branch)) { ui.draggable.remove(); THIS.renderFlow(); }
                  }
               }
            });

            // dragging the whole branch
            $(this).draggable({
               start: function () {
                  THIS._enableDestinations($(this));

                  var children = $(this).next();
                  var t = children.offset().top - $(this).offset().top;
                  var l = children.offset().left - $(this).offset().left;
                  $(this).attr('t', t); $(this).attr('l', l);
               },
               drag: function () {
                  var children = $(this).next();
                  var t = $(this).position().top + parseInt($(this).attr('t'));
                  var l = $(this).position().left + parseInt($(this).attr('l'));
                  children.offset({ top: t, left: l });
               },
               stop: function () {
                  THIS._disableDestinations();
                  THIS.renderFlow();
               }
            });
         });

         layout.find('.delete').click(function() {
            var node = THIS.flow.nodes[$(this).attr('id')];
            if (node.parent) {
               node.parent.removeChild(node);
               THIS.renderFlow();
            }
         });

         layout.find('.edit').click(function() {
            var node = THIS.flow.nodes[$(this).attr('id')],
                popup = THIS.actions[node.actionName].popup;
            if (popup) winkstart.publish(popup+'.popup', node);
         });

         return layout;
      },

      _renderBranch: function (branch) {
         var flow = this.templates.branch.tmpl(branch);
         var children = flow.find('.children');
         for (var i in branch.children) children.append(this._renderBranch(branch.children[i]));
         return flow;
      },


// TOOL BAR /////////////////////////////////////////////////////////////
      _renderTools: function () {
         var THIS = this;
         var buf = $(this.config.elements.buf);
         var tools = THIS.templates.tools.tmpl({categories: THIS.categories});

         tools.find('.category').click(function () {
            $(this).toggleClass('voicemail_apps');
            $(this).children().toggleClass('open');
            var current = $(this);
            while(current.next().hasClass('tool') ||
                  current.next().hasClass('app_list_nav') ||
                  current.next().hasClass('clear')) {
               current = current.next();
               current.toggle();
            }
         });

//         tools.find('.category').click();

         tools.find('.tool').hover(function () {$(this).addClass('active');}, function () {$(this).removeClass('active');})

         function action (el) {
            el.draggable({
               start: function () {
                  THIS._enableDestinations($(this));

                  var clone = $(this).clone();
                  action(clone);
                  clone.addClass('inactive');
                  clone.insertBefore($(this));

                  $(this).addClass('active');
               },
               drag: function () {
               },
               stop: function () {
                  THIS._disableDestinations();
                  $(this).prev().removeClass('inactive');
                  $(this).remove();
               }
            });
         }

         tools.find('.action').each(function () { action($(this)); });

         return tools;
      },

// DESTINATION POINTS ///////////////////////////////////////
      _enableDestinations: function (el) {
         var THIS = this;

         $('.node').each(function () {
            var activate = true;
            var target = THIS.flow.nodes[$(this).attr('id')];
            if (el.attr('name') in target.potentialChildren()) {
               if (el.hasClass('node') && THIS.flow.nodes[el.attr('id')].contains(target)) {
                  activate = false;
               }
            }
            else activate = false;
            if (activate) $(this).addClass('active');
            else {
               $(this).addClass('inactive');
               $(this).droppable('disable');
            }
         });
      },

      _disableDestinations: function () {
         $('.node').each(function () {
            $(this).removeClass('active');
            $(this).removeClass('inactive');
            $(this).droppable('enable');
         });
         $('.tool').removeClass('active');
      },

      save: function () {
         var flow = this.flow.root;
             cf = {
            numbers : 'some number list',
            flow : flow.children.length > 0 ? flow.children[0].serialize() : { }
         }

         alert(JSON.stringify(cf));

         //POSTING THE DATA SHOULD BE HERE....
      },

/*****************************************************************************
 *  Deep object cloning  ***
 *****************************************************************************/
      _clone: function (obj) {
         if (obj == null || typeof(obj) != 'object') return obj;
         var o = new obj.constructor(); 
         for (var key in obj) o[key] = this._clone(obj[key]);
         return o;
      }, 

   //Regular WS JS here:
    renderList: function(){
        var THIS = this;

        winkstart.getJSON('callflow.list', {
            crossbar: true,
            account_id: MASTER_ACCOUNT_ID
        }, function (json, xhr) {

            // List Data that would be sent back from server
            function map_crossbar_data(crossbar_data){
                var new_list = [];
                if(crossbar_data.length > 0) {
                    _.each(crossbar_data, function(elem){
                        new_list.push({
                            id: elem.id,
                            title: elem.id
                        });
                    });
                }
                return new_list;
            }

            var options = {};
            options.label = 'Callflow Module';
            options.identifier = 'callflow-module-listview';
            options.new_entity_label = 'Callflow';
            options.data = map_crossbar_data(json.data);
            options.publisher = winkstart.publish;
            options.notifyMethod = 'callflow.list-panel-click';
            options.notifyCreateMethod = 'callflow.edit-callflow';  /* Edit with no ID = Create */

            $("#callflow-listpanel").empty();
            $("#callflow-listpanel").listpanel(options);

        });
    }
});
