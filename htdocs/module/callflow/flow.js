///////////////////////////////////////////////////////////
//  DATA LAYER  ///////////////////////////////////////////
///////////////////////////////////////////////////////////
//  Actions
//
//  Associative array of Actions (modules or apps) tighed
//  together with sets of rules, restricting dependencies
//  between the Actions
//
//  action = { 
//     name : '', 
//     rules : [{type : ''}], 
//     isUsable : true
//  }
//
//

var Actions = {
   root       : { name : 'root',         rules : [ {type : 'quantity', maxSize : 1} ], isUsable : false },
   answer     : { name : 'answer',       rules : [ {type : 'quantity', maxSize : 1} ], isUsable : true },
   conference : { name : 'conference',   rules : [ {type : 'quantity', maxSize : 1} ], isUsable : true },
   hangup     : { name : 'hangup',       rules : [ {type : 'quantity', maxSize : 0} ], isUsable : true },
   menu       : { name : 'menu',         rules : [ ],                                  isUsable : true },
   voicemail  : { name : 'voicemail',    rules : [ {type : 'quantity', maxSize : 1} ], isUsable : true }
}

//
///////////////////////////////////////////////////////////
//  Categories
//
//  Associative array of action name sets
//
//

var Categories = {
   'basic' : ['answer','conference','hangup','menu','voicemail']
}

//
///////////////////////////////////////////////////////////
//  ActionNode
//
//  flow of Actions
//
//

function ActionNode (actionName) {
   this.id = -1;                    // id for direct access
   this.actionName = actionName;
   this.parentNode = null;
   this.children = [];
}

// returns a list of Actions that can be referenced through
// the children ActionNodes
ActionNode.prototype.potentialChildActionNames = function () {
   var list = [];

   // every usable action can be a potential child
   for (var i in Actions) {
      if (Actions[i].isUsable) {
         var name = Actions[i].name;
         list[name] = name;
      }
   }

   for (var i in Actions[this.actionName].rules) {
      var rule = Actions[this.actionName].rules[i];

      switch (rule.type) {
         case 'quantity': {
            if (count(this.children) >= rule.maxSize) list = [];
         } break;
      }
   }

   return list;
}

//
///////////////////////////////////////////////////////////
//  Flow
//
//  ActionNode tree manager
//
//

var Flow = {
   next : 0,                        // index of the next generated node

   root : new ActionNode('root'),   // head of the flow tree

   nodes : [],                      // direct access to every node

   // Resetting the flow
   reset : function () {
      this.next = -1;
      this.root = new ActionNode('root');
      this.nodes['-1'] = this.root;
   },

   // Adding an action to an existing node in the flow
   // returns true in case of success
   add : function (actionName, parentId) {
      if (!(parentId in this.nodes))
         return false;           // parent doesn't exist
      var parentNode = this.nodes[parentId];
      if (!(actionName in parentNode.potentialChildActionNames())) 
         return false;           // addition is not permitted

      // creating a new ActionNode and establishing
      // parent - child relationship
      var node = new ActionNode(actionName);
      node.id = ++this.next;
      node.parentNode = parentNode;
      parentNode.children[node.id] = node;

      this.nodes[node.id] = node; // establishing direct access
      return true;                // the node is successfully added
   },

   // Removing a node / branch by node id
   remove : function (id) {
      if (id == this.root.id) { 
         alert('root id: ' + id);
         return false;   // try resetting the flow!
      }
      if (!(id in this.nodes)) {
         return false;  // nothing to delete
      }

      var node = this.nodes[id];

      // recursively remove children of the node
      for (var i in node.children) this.remove(node.children[i].id);

      // now we are ready to remove the node
      delete node.parentNode.children[node.id];
      delete this.nodes[node.id];
      return true;
   },

   // move an existing branch to another location on the tree
   move : function (branchId, parentId) {
      if (!(branchId in this.nodes)) {
         alert ('branch doesn\'t exist');
         return false;                // branch doesn't exist
      }
      if (!(parentId in this.nodes)) {
         alert ('location doesn\'t exist');
         return false;                // location doesn't exist
      }
      if (this.contains(parentId, branchId)) {
         alert ('circular dependance');
         return false;                // cannot allow circular dependance
      }

      var branch = this.nodes[branchId];
      var parentNode = this.nodes[parentId];
      if (!(branch.actionName in parentNode.potentialChildActionNames())) {
         alert ('move is not permitted');
         return false;               // move is not permitted
      }

      // we can move the branch to a new location
      delete branch.parentNode.children[branch.id];
      delete this.nodes[branch.id];

      branch.id = ++this.next;
      this.nodes[branch.id] = branch;
      branch.parentNode = parentNode;
      parentNode.children[branch.id] = branch;

      return true;
   },

   // check if the node is in the branch
   contains : function (nodeId, branchId) {
      if (!(nodeId in this.nodes)) {
         return false;      // nonexistant node cannot be in the tree
      }
      if (!(nodeId in this.nodes)) {
         return false;      // nonexistant branch cannot contain the node
      }

      // looking through all the parents
      var parentNode = this.nodes[nodeId];
      while (parentNode.id != this.root.id) {
         if (parentNode.id == branchId) return true;
         parentNode = parentNode.parentNode;
      }
      return false;
   },

   serialize : function () {
      return this.serializeNode(this.root);
   },

   serializeNode : function (node) {
      var result = "{ module : " + node.actionName + ", id : " + node.id;
      result += ", children : [ ";
      for (var i in node.children) {
         result += Flow.serializeNode(node.children[i]) + " ";
      }
      result += "] }";
      return result;
   }
}































//
///////////////////////////////////////////////////////////
//  PRESENTATION LAYER  ///////////////////////////////////
///////////////////////////////////////////////////////////
//  Manager
//
//  generated user interface for manipulating
//  the data layer of a call flow
//
//

///////////////////////////////////////////////////////////
//  Setting up the templates
//
//

// branch template
$.template('branch',
           '<div id="${id}" class="branch">'+
              '<div name="head" class="head"></div>'+
              '<div name="children" class="children"></div>'+
           '</div>'
);
$.template('node',
           '<div state="${state}" type="${type}" action="${action}" id="${id}" class="node {{if type=="root"}}root{{/if}}">'+
              '<div target="${id}" name="remove" class="remove"><h1>-</h1></div>'+
              '<div name="title"><h1>${title}</h1></div>'+
              '<div name="addChild" class="green">ADD CHILD</div>'+
              '<div name="msg"><h3>${msg}</h3></div>'+
           '</div>'
);
$.template('socket',
           '<div><div parentId="${parentId}" name="socket" class="socket">'+
              '<h1>DROP HERE</h1>'+
           '</div></div>'
);
$.template('child',
           '<div class="child"></div>'
);

var Manager = {
   ///////////////////////////////////////////////////////////
   //  Settings
   //

   managerId : 'callFlowManager',
   categories : [],
   mouse: { x:0, y:0 },
   pos: { x:0, y:0 },

   //
   ///////////////////////////////////////////////////////////
   //  Building
   //

   build : function (id) {
      $(document).mousemove(function (e) { Manager.mouse.x = e.clientX; Manager.mouse.y = e.clientY; });
      // if we are not using the default container
      if (id != null) this.managerId = id;

      // generating basic containers
      var manager = $('#'+this.managerId);
      manager.addClass('manager');
      var chart = $('<div id="chart"></div>');
      chart.append($('<div><h1>Chart</h1></div>'));
      var cCanvas = $('<div name="canvas" class="canvas"></div>');
      cCanvas.scroll(function (e) { Manager.pos.x = 0; Manager.pos.y = 0; });

      var tools = $('<div id="tools"></div>');
      tools.append($('<div><h1>Tools</h1></div>'));
      var tCanvas = $('<div name="canvas" class="canvas"></div>');
      

      // displaying the manager 
      chart.append(cCanvas);
      tools.append(tCanvas);
      manager.append(chart);
      manager.append(tools);

      // rebuilding tools and chart
      this.rebuildTools();
      this.rebuildChart();
   },

   // rerendering the chart
   rebuildChart : function () {
      var chart = $('#chart');
      var canvas = chart.children('.canvas');
      canvas.empty();
      canvas.append(this.buildFlowTree(Flow.root));
      $('#debug').html(Flow.serialize());
      Manager.disableActiveDestinations();
   },

   // rerendering the tool bar
   rebuildTools : function () {
      var tools = $('#tools');
      var canvas = tools.children('.canvas');
      canvas.empty();
      canvas.append(this.buildToolCategory());
   },

   //
   ///////////////////////////////////////////////////////////
   //  Flow Chart
   //

   // generate JQuery object representing a flow node
   buildFlowNode : function (node) {
      // shrinking the area of the node to minimize the view
      function shrink (node, speed) {
         switch (node.attr('state')) {
            case 'init'        : {
               node.children('div[name="addChild"]').hide();
               node.children('div[name="remove"]').hide();
               node.droppable('disable');
               node.attr('state', '');
            }
            case 'makeDefault' : {
               node.children('div[name="addChild"]').hide(speed);
               node.children('div[name="remove"]').hide(speed);
               node.removeClass('inactive');
               node.removeClass('active');
               node.droppable('disable');
               node.attr('state', '');
            }
            case 'inactive'    : {
            }
            case 'active'      : {
               node.removeClass('highlight');
            }
            default : {
               node.children('div[name="remove"]').hide(speed);
            }
         }
      }
      // expanding the area of the node to show more controls
      function expand (node, speed) {
         switch (node.attr('state')) {
            case 'makeHead'     : {
               node.addClass('active');
               node.attr('state', 'head');
            } break;
            case 'makeInactive' : {
               node.addClass('inactive');
               node.attr('state', 'inactive');
            } break;
            case 'makeActive'   : {
               node.addClass('active');
               node.children('div[name="addChild"]').show(speed);
               node.attr('state', 'active');
               node.droppable('enable');
            } break;
            case 'head'         : {
            }
            case 'inactive'     : {
            } break;
            case 'active'       : {
               node.addClass('highlight');
            } break;
            default : {
               if (node.attr('type') != 'root') node.children('div[name="remove"]').show(speed);
            }
         }
      }

      var state = 'makeDefault';
      var type = node.parentNode == null ? 'root' : 'branch';
      var action = node.actionName;
      var id = node.id;
      var msg = 'comment';

      var flowNode = $.tmpl('node', {'state' : state, 'type' : type, 'action' : action, 'id' : id, 'title' : action, 'msg' : msg});
      flowNode.hover(function () { expand($(this), "fast"); }, function () { shrink($(this), "fast"); });
      flowNode.children('div[name="remove"]').click(function () {
         if (Flow.remove($(this).attr('target'))) Manager.rebuildChart(); 
         else alert('couldn\'t remove the branch: '+$(this).attr('target'));
      });
      
      flowNode.droppable(this.ondrop);
      flowNode.draggable(this.onnodedrag);

      return flowNode;
   },

   buildSocketNode : function (parentId) {
      var socket = $.tmpl('socket', {'parentId' : parentId});
      socket.hover(function () {$(this).addClass('highlight');}, function () {$(this).removeClass('highlight');});
      socket.children().droppable(this.ondrop);

      return socket;
   },

   // generate JQuery object representing a flow tree / branch
   buildFlowTree : function (node) {
      var flowTree = $.tmpl('branch', {'id' : node.id});
      Manager.buildFlowNode(node).appendTo(flowTree.children('div[name="head"]'));
      //$.tmpl('child').appendTo(flowTree.children('div[name="children"]'));
      for (var i in node.children) {
         $.tmpl('child').append(Manager.buildFlowTree(node.children[i])).appendTo(flowTree.children('div[name="children"]'));
      }
      if (count(node.potentialChildActionNames()) > 0) {
//         $.tmpl('child').append(Manager.buildSocketNode(node.id)).appendTo(flowTree.children('div[name="children"]'));
      }
      return flowTree;
   },

   // disabling all active droppable nodes
   disableActiveDestinations : function (speed) {
      $('.node').each(function () { 
         $(this).attr('state', 'makeDefault'); 
         $(this).mouseout();
      });
      $('.socket').each(function() {
         $(this).parent().hide(speed);
      });
   },

   // enabling all droppable nodes that can accept the action
   enableDestinations : function (actionName, branchId, speed) {
      $('.node').each(function () {
         var check = branchId == null ? true : !Flow.contains($(this).attr('id'), branchId);
         // if the action is appropriate activate destination
         if ((actionName in Flow.nodes[$(this).attr('id')].potentialChildActionNames()) && check) {
            $(this).attr('state', 'makeActive');
         }
         else {
            if ($(this).attr('id') == branchId) $(this).attr('state', 'makeHead');
            else $(this).attr('state', 'makeInactive');
         }
         $(this).mouseover();
      });
      $('.socket').each(function () {
         var check = branchId == null ? true : !Flow.contains($(this).attr('parentId'), branchId);
         if (actionName in Flow.nodes[$(this).attr('parentId')].potentialChildActionNames() && check) {
            $(this).parent().show("slide", function () {}, speed);
         }
      });
   },

   ondrop : {
      over : function (event, ui) {
         $(this).mouseover();
      },
      out : function (event, ui) {
         $(this).mouseout();
      },
      drop : function (event, ui) {
         // the most important part in the whole manager....
         var type = ui.draggable.attr('type');
         var id = $(this).attr('id') == '' ? $(this).attr('parentId') : $(this).attr('id');

         if (type == 'action') {
            // and now add a new node to the tree
            var actionName = ui.draggable.attr('name');
            Flow.add(actionName, id);
         }
         else if (type == 'branch') {
            //var branchId = ui.draggable.children('.node').last().attr('id');
            var branchId = ui.draggable.attr('id');
            Flow.move(branchId, id);
         }

         ui.draggable.remove();
         Manager.rebuildChart();
      }
   },

   onnodedrag : {
      start : function () {
         var branchId = $(this).attr('id');
         var children = $(this).parent().parent().children('div[name="children"]');
         var t = $(this).parent().parent().offset().top;
         var l = $(this).parent().parent().offset().left;
         children.attr('t', $(this).offset().top - children.offset().top);
         children.attr('l', $(this).offset().left - children.offset().left);
         Manager.enableDestinations(Flow.nodes[branchId].actionName, branchId, 1000);
         $(this).parent().parent().offset({top: t, left: l});
      },

      drag : function (index, ui) {
         var t = Manager.mouse.y;
         var l = Manager.mouse.x;
         var children = $(this).parent().parent().children('div[name="children"]');
         t = $(this).offset().top - children.attr('t'); 
         l = $(this).offset().left - children.attr('l');
         children.offset({top: t, left: l});
      },

      stop : function () {
         Manager.disableActiveDestinations();
         Manager.rebuildChart();
      }
   },

   //
   ///////////////////////////////////////////////////////////
   ///////////////////////////////////////////////////////////
   //  Tool Bar
   //

   // returns a JQuery object of an action tool
   buildActionTool : function (actionName) {
      var tool = $('<div name="'+actionName+'"><h2>'+actionName+'</h2></div>');
      tool.attr('type', 'action');
      tool.draggable(this.ondrag);
      return tool;
   },

   // returns a JQuery object of a tool category
   buildToolCategory : function (category) {
      var toolCategory = $('<div class="category"></div>');
      var toolSet = $('<div class="set"></div>');

      var tools = [];             // tools to build

      if (category == null) {     // 'All' category is selected
         category = 'all';
         for (var i in Actions) if (Actions[i].isUsable) tools.push(Actions[i].name);
      }
      else {                      // try loading requested category
         for (var i in Categories[category]) if (Actions[i].isUsable) tools.push(Actions[i].name);
      }

      toolCategory.attr('id', category);
      toolSet.attr('id', 'toolset_'+category);

      // setting up the title
      var title = $('<div name="title" class="title">'+category+'</div>');
      title.attr('toolset', category);
      title.click(function () { 
         $('#toolset_'+$(this).attr('toolset')).slideToggle('fast');
      });

      toolCategory.append(title);

      // creating and adding tools to the category
      for (var i in tools) {
         var toolContainer = $('<div class="tool"></div>');
         var tool = this.buildActionTool(tools[i]);
         toolContainer.append(tool);
         toolSet.append(toolContainer);
      }
      toolCategory.append(toolSet);

      return toolCategory;
   },

   ondrag : {
      start : function () {       // on start dragging
         var actionName = $(this).attr('name');

         // replacing current tool with a copy
         var copy = Manager.buildActionTool(actionName);
         copy.appendTo($(this).parent());
         // give a bigger scope to the tool
         $(this).appendTo($('#chart'));

         $(this).addClass('action');

         Manager.enableDestinations(actionName, -1, 1000);
      },

      drag : function () {
      },

      stop : function () {        // on stop dragging
         // disable all active destinations
         Manager.disableActiveDestinations("slow");
         // the tool served it's purpose
         $(this).remove();
      }
   }
}

//
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

// count members of an object
function count(obj) {
   var count = 0;
   for (var i in obj) count ++;
   return count;
}

///////////////////////////////////////////////////////////
//  AND NOW LAUNCHING!!!  /////////////////////////////////
//

$(document).ready(function () {
   Flow.reset();
   Manager.build('flowManager');
});
