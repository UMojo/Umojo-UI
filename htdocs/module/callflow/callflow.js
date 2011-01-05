winkstart.module('callflow',
   {
      css: [
         'callflow.css',
      ],

      templates: {
         callflow: 'callflow.html',
         branch: 'branch.html',
         tools: 'tools.html',
         node: 'node.html'
      },

      elements: {
         flow: '#ws_cf_flow',
         tools: '#ws_cf_tools',
         buf: '#ws_cf_buf'
      },

      requests: {
//         'provisioner.get' : { url : 'serverside script that spits json' }
      },

      subscribe: {
         'callflow.activate' : 'activate'
      }
   },
   function (args) {
      winkstart.publish('nav.add', { module: this.__module, label: 'Call Flow' });
   },
   {
      activate: function (args) {
         args.target.empty();
         this.templates.callflow.tmpl(this.config.elements).appendTo( args.target );
         this.renderTools();
         this._resetFlow();
         this.renderFlow();
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
               if (!(branch.actionName in this.potentialChildren())) return false;
               if (branch.contains(this)) return false;
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
               var json = '{"module":"'+this.actionName+'","id":"'+this.id+'","data":"'+this.data+'","children":[';
               for (var i in this.children) {
                  json += this.children[i].serialize();
                  if ((i+1) in this.children) json += ',';
               }
               json += ']}';
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



// A set of actions: modules/apps tighted together with rules, restricting dependencies between the actions
      actions: {
         root       : { name : 'root',         rules : [ {type : 'quantity', maxSize : 1} ], isUsable : false },
         answer     : { name : 'answer',       rules : [ {type : 'quantity', maxSize : 1} ], isUsable : true },
         conference : { name : 'conference',   rules : [ {type : 'quantity', maxSize : 1} ], isUsable : true },
         hangup     : { name : 'hangup',       rules : [ {type : 'quantity', maxSize : 0} ], isUsable : true },
         menu       : { name : 'menu',         rules : [ ],                                  isUsable : true },
         voicemail  : { name : 'voicemail',    rules : [ {type : 'quantity', maxSize : 1} ], isUsable : true }
      },

// Action categories
      categories: {
         'basic' : ['answer','conference','hangup','menu','voicemail']
      },

      flow: {},

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

         layout.find('.node').each(function () {
            var node = THIS.templates.node.tmpl(THIS.flow.nodes[$(this).attr('id')]);
            $(this).append(node);

            $(this).droppable({
               drop: function (event, ui) {
                  var target = THIS.flow.nodes[$(this).attr('id')];
                  if (ui.draggable.hasClass('action')) {
                     var branch = THIS.branch(ui.draggable.attr('name'));
                     if (target.addChild(branch)) THIS.renderFlow();
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
                  THIS.renderFlow();
               }
            });
         });

         layout.find('.close').click(function() {
            var node = THIS.flow.nodes[$(this).attr('id')];
            if (node.parent) {
               node.parent.removeChild(node);
               THIS.renderFlow();
            }
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
         var tools = this.templates.tools.tmpl({categories: this.categories});

         tools.find('.category').click(function () {
            var current = $(this);
            while(current.next().hasClass('tool')) {
               current = current.next();
               current.toggle();
            }
         });

         tools.find('.tool').hover(function () {$(this).addClass('active');}, function () {$(this).removeClass('active');})

         function action (el) {
            el.draggable({
               start: function () {
                  THIS._enableDestinations($(this));

                  var clone = $(this).clone();
                  action(clone);
                  clone.insertBefore($(this));

                  $(this).addClass('active');
               },
               drag: function () {
               },
               stop: function () {
                  THIS._disableDestinations();
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
            else $(this).droppable('disable');
         });
      },

      _disableDestinations: function () {
         $('.node').each(function () {
            $(this).removeClass('active');
            $(this).removeClass('inactive');
            $(this).droppable('enable');
         });
      }
   }
);
