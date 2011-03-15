winkstart.module('callflow',
   {
      css: [
         'css/style.css',
         'css/callflow.css'
      ],

      templates: {
         callflow: 'tmpl/callflow.html',
         branch: 'tmpl/branch.html',
         tools: 'tmpl/tools.html',
         root: 'tmpl/root.html',
         node: 'tmpl/node.html',
         iframe: 'tmpl/iframe.html'
      },

      elements: {
         flow: '#ws_cf_flow',
         tools: '#ws_cf_tools',
         save: '#ws_cf_save',
         buf: '#ws_cf_buf'
      },

      json: { // uris to json data
          actions: 'module/callflow/actions.json',
          categories: 'module/callflow/categories.json'
      },

      popup: 'module/callflow/app/',

      subscribe: {
         'callflow.activate' : 'activate'
      }
   },
   function (args) {
      winkstart.publish('nav.add', { 
			module: this.__module, 
			label: 'CALL FLOW', 
			sub: [
				{
					title: 'Sub Nav 1',
					links: [
						{ module: this.__module, label: 'Devices'},
						{ module: this.__module, label: 'Ring Group'},
						{ module: this.__module, label: 'Call Flow'},
						{ module: this.__module, label: 'Conferences'},
						{ module: this.__module, label: 'Feature Codes'}
					]
				},
				{
					title: 'Sub Nav 1',
					links: [
						{ module: this.__module, label: 'Devices'},
						{ module: this.__module, label: 'Ring Group'},
						{ module: this.__module, label: 'Call Flow'},
						{ module: this.__module, label: 'Conferences'},
						{ module: this.__module, label: 'Feature Codes'}
					]
				}
			]
		});
   },
   {
      activate: function (args) {
         var THIS = this, count = 1,
             tryRun = function ( ) { count--; if (count == 0) THIS._activate(args); };
         count++;
         $.getJSON(this.config.json.actions, function (data) {
            THIS.actions = data;
            tryRun();
         });
         count++;
         $.getJSON(this.config.json.categories, function (data) {
            THIS.categories = data;
            tryRun();
         });
         tryRun();
      },

      _activate: function (args) {
         var THIS = this

         args.target.empty();
         this.templates.callflow.tmpl(this.config.elements).appendTo( args.target );

         this.renderTools();
         this._resetFlow();
         this.renderFlow();
         
         winkstart.publish('layout.updateLoadedModule', {label: 'Callflow Management', module: this.__module});
         $(this.config.elements.save).click(function () { THIS.save(); }).hover(function () { $(this).addClass('active'); }, function () { $(this).removeClass('active'); });
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
               var json = '{"module":"'+this.actionName+'","id":"'+this.id+'","data":"'+'data'/*this.data*/+'","children":[';
               for (var i in this.children) {
                  json += this.children[i].serialize();
                  if ((parseInt(i)+1) in this.children) json += ',';
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
               // ADD ONCLICK EVENT FOR MODIFYING DATA
            }
            $(this).append(node);

            $(this).droppable({
               drop: function (event, ui) {
                  var target = THIS.flow.nodes[$(this).attr('id')];
                  if (ui.draggable.hasClass('action')) {
                     var action = ui.draggable.attr('name'),
                         branch = THIS.branch(action);
                     if (target.addChild(branch)) {
                        // OPENNING POPUP FORM WINDOW FOR POPULATING DATA PORTION OF THE NODE
                        if (THIS.actions[action].popup) alert('calling '+action+' module to setup node data');
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
         var cf = {
            numbers : 'some number list',
            flow : this.flow.root.child(0).serialize()
         }

         alert(cf);

         //POSTING THE DATA SHOULD BE HERE....
      },
   }
);
