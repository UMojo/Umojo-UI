winkstart.module('voip', 'callflow', {
        css: [
            'css/style.css',
            'css/popups.css',
            'css/ringgroup.css',
            'css/callflow.css'
        ],

        templates: {
            callflow: 'tmpl/callflow.html',
            callflow_main: 'tmpl/callflow_main.html',
            branch: 'tmpl/branch.html',
            tools: 'tmpl/tools.html',
            root: 'tmpl/root.html',
            node: 'tmpl/node.html',
            add_number: 'tmpl/add_number.html',
            ring_group_dialog: 'tmpl/ring_group_dialog.html',
            edit_dialog: 'tmpl/edit_dialog.html'
        },

        elements: {
            flow: '#ws_cf_flow',
            tools: '#ws_cf_tools',
            save: '#ws_cf_save',
            buf: '#ws_cf_buf'
        },

        menu_options: {
            '_': 'default action',
            '0': '0',
            '1': '1',
            '2': '2',
            '3': '3',
            '4': '4',
            '5': '5',
            '6': '6',
            '7': '7',
            '8': '8',
            '9': '9',
            '*': '*',
            '#': '#'
        },

        subscribe: {
            'callflow.activate' : 'activate',
            'callflow.list-panel-click' : 'editCallflow',
            'callflow.edit-callflow' : 'editCallflow',
            'callflow.define_callflow_nodes': 'define_callflow_nodes'
        },

        resources: {
            'callflow.list': {
                url: '{api_url}/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.get': {
                url: '{api_url}/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'callflow.create': {
                url: '{api_url}/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'callflow.update': {
                url: '{api_url}/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'callflow.delete': {
                url: '{api_url}/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    },
    function (args) {
        winkstart.registerResources(this.__whapp, this.config.resources);

        winkstart.publish('subnav.add', {
            whapp: 'voip',
            module: this.__module,
            label: 'Callflows',
            icon: 'callflow',
            weight: '50'
        });
    },
    {
        actions: {},

        activate: function () {
            var THIS = this;

            $('#ws-content').empty();
            THIS.templates.callflow_main.tmpl({}).appendTo($('#ws-content'));

            THIS.renderList(function() { 
                THIS.templates.callflow.tmpl(THIS.config.elements).appendTo($('#callflow-view'));
            });

            winkstart.publish('callflow.define_callflow_nodes', THIS.actions);

            $(this.config.elements.save).click(function() {
                THIS.save();
            }).hover(function() {
                    $(this).addClass('active');
                },
                function() {
                    $(this).removeClass('active');
                }
            );
        },

        editCallflow: function(data) {
            var THIS = this;

            THIS._resetFlow();

            if(data && data.id) {
                winkstart.getJSON('callflow.get', {
                        crossbar: true,
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        callflow_id: data.id
                    },
                    function(json) {
                        THIS._resetFlow();
                        THIS.flow.id = json.data.id;
                        THIS.flow.caption_map = json.data.metadata;

                        if(json.data.flow.module != undefined) {
                            THIS.flow.root = THIS.buildFlow(json.data.flow, THIS.flow.root, 0, '_');
                        }

                        THIS.flow.numbers = json.data.numbers;
                        THIS.renderFlow();
                    }
                );
            }
            else {
                THIS._resetFlow();
                THIS.renderFlow();
            }

            THIS.renderTools();
        },

        buildFlow: function (json, parent, id, key) {
            var THIS = this,

            branch = THIS.branch(json.module);

            branch.data.data = ('data' in json) ? json.data : {};
            branch.id = ++id;
            branch.key = key;

            branch.caption = THIS.actions[branch.actionName].caption(branch, THIS.flow.caption_map);

            $.each(json.children, function(key, child) {
                branch = THIS.buildFlow(child, branch, id, key);
            });

            parent.addChild(branch);

            return parent;
        },

        renderFlow: function () {
            var target = $(this.config.elements.flow).empty();

            target.append(this._renderFlow());
        },

      // Create a new branch node for the flow
      branch: function (actionName) {
         var THIS = this;

         function branch (actionName) {

            // ---------- SO MUCH WIN ON THIS LINE ----------
            var that = this;
            // ----------------------------------------------

            this.id = -1;                   // id for direct access
            //Hack so that resources are treated as offnets
            this.actionName = (actionName == 'resource') ? 'offnet' : actionName;
            this.module = actionName;
            this.key = '_';
            this.parent = null;
            this.children = {};
            this.data = {};                 // data caried by the node
            this.caption = '';

            // returns a list of potential child actions that can be added to the branch
            this.potentialChildren = function () {
               var list = [];

               for (var i in THIS.actions) if (THIS.actions[i].isUsable) list[i] = i;

               for (var i in THIS.actions[this.actionName].rules) {
                  var rule = THIS.actions[this.actionName].rules[i];

                  switch (rule.type) {
                     case 'quantity': {
                        if (THIS._count(this.children) >= rule.maxSize) list = [];
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
                $.each(this.children, function(i, child) {
                    if(child.id == branch.id) {
                        delete that.children[i];
                    }
                });
            }

            this.addChild = function (branch) {
               if (!(branch.actionName in this.potentialChildren())) return false;
               if (branch.contains(this)) return false;
               if (branch.parent) branch.parent.removeChild(branch);
               branch.parent = this;
               this.children[THIS._count(this.children)] = branch;
               return true;
            }

            this.getMetadata = function(key) {
                if('data' in this.data && key in this.data.data) {
                    return this.data.data[key]
                }

                return false;
            }

            this.setMetadata = function(key, value) {
                if(!('data' in this.data)) {
                    this.data.data = {};
                }

                this.data.data[key] = value;
            }

            this.deleteMetadata = function(key) {
                if('data' in this.data && key in this.data.data) {
                    delete node.data.data[key];
                }
            }

            this.index = function (index) {
               this.id = index;
               $.each(this.children, function() {
                    index = this.index(index+1);
               });
               return index;
            }

            this.nodes = function () {
               var nodes = {};
               nodes[this.id] = this;
               $.each(this.children, function() {
                  var buf = this.nodes();
                  $.each(buf, function() {
                    nodes[this.id] = this;
                  });
               });
               return nodes;
            }

            this.serialize = function () {
               var json = THIS._clone(this.data);
               json.module = this.module;
               json.children = {};
               $.each(this.children, function() {
                    json.children[this.key] = this.serialize();
               });
               return json;
            }
         }

         return new branch(actionName);
      },

        _count: function(json) {
            var count = 0;

            $.each(json, function() {
                count++;
            });

            return count;
        },

        categories: { },

        flow: { },

        _resetFlow: function () {
            var THIS = this;

            THIS.flow = {};
            THIS.flow.root = THIS.branch('root');    // head of the flow tree
            THIS.flow.root.key = 'flow';
            THIS.flow.numbers = [];
            THIS.flow.caption_map = {};
            THIS._formatFlow();
        },

        _formatFlow: function () {
            var THIS = this;

            THIS.flow.root.index(0);
            THIS.flow.nodes = THIS.flow.root.nodes();
        },

        getDetails: function(id, field) {
            var THIS = this;

            if(field != undefined) {
                return THIS.flow.metadata[id][field];
            }
            else {
                return THIS.flow.metadata[id];
            }
        },

        setDetails: function(id, data) {
            var THIS = this;

            THIS.flow.metadata[id] = data;
        },
       
      _renderFlow: function () {
         var THIS = this;
         this._formatFlow();

         var layout = this._renderBranch(this.flow.root);
         layout.find('.node').hover(function () { $(this).addClass('over'); }, function () { $(this).removeClass('over'); });

         layout.find('.node').each(function () {
            var node_html, node = THIS.flow.nodes[$(this).attr('id')], $node = $(this);
            if (node.actionName == 'root') {
               $node.removeClass('icons_black root');
               node_html = THIS.templates.root.tmpl({numbers: THIS.flow.numbers.toString()});

               node_html.find('.btn_plus_sm').click(function() {
                    var dialog = THIS.templates.add_number.tmpl({}).dialog({width: 400, title: 'Add a number', resizable: 'false'});
                    
                    dialog.find('.submit_btn').click(function() {
                        THIS.flow.numbers.push(dialog.find('#add_number_text').val());
                        dialog.dialog('close');
                        THIS.renderFlow();
                    });
               });

               node_html.find('.save').click(function() {
                    THIS.save();
               });

               node_html.find('.trash').click(function() {
                    winkstart.deleteJSON('callflow.delete', {account_id: winkstart.apps['voip'].account_id, api_url: winkstart.apps['voip'].api_url, callflow_id: THIS.flow.id}, function() {
                        THIS.renderList();
                        THIS._resetFlow();
                    });
               });
            }
            else {
                node.details = '';
                node_html = THIS.templates.node.tmpl(node);

                $('.module', node_html).click(function() {
                    THIS.actions[node.actionName].edit(node, node_html, function() {
                        THIS.renderFlow();
                    });
                });
            }
            /*
            else if(node.actionName == 'ring_group') {
                node.details = '';
                node_html = THIS.templates.node.tmpl(node);

                $('.module', node_html).click(function() {
                    var node_name = node.actionName,
                        popup = THIS.templates.ring_group_dialog.tmpl({});

                    winkstart.log(node.data.data);
                    winkstart.getJSON('device.list', {account_id: winkstart.apps['voip'].account_id, api_url: winkstart.apps['voip'].api_url}, function(json) {
                        $.each(json.data, function() {
                            $('.available ul', popup).append('<li id="' + this.id + '"><a href="#" class="drag_btn"></a>&nbsp;&nbsp;' + this.name.substr(0,15) + '</li>');
                        });

                        if(node.data.data == undefined) {
                            node.data.data = {};
                        }
                        else { 
                            if(node.data.data.endpoints != undefined) {
                                $.each(node.data.data.endpoints, function() { 
                                    winkstart.log(this);
                                    $('.available ul #' + this.id, popup).detach().appendTo($('.ring_group ul', popup));
                                });
                            }

                            if(node.data.data.strategy != undefined) {
                                $('#strategy', popup).val(node.data.data.strategy);
                            }

                            if(node.data.data.timeout != undefined) {
                                $('#timeout', popup).val(node.data.data.timeout);
                            }
                        }

                        popup.dialog({width:500, title: 'Ring group', resizable: 'false'});

                        $('.scrollable', popup).jScrollPane();

                        $('.available ul, .ring_group ul', popup).sortable({
                            connectWith: '#ringgroup .wrapper .connect',
                            zIndex: 2000,
                            helper: 'clone',
                            appendTo: '#ringgroup .wrapper',
                            receive: function() {
                                $(this).parents('.scrollable').data('jsp').reinitialise();
                            },
                            remove: function() {
                                $(this).parents('.scrollable').data('jsp').reinitialise();
                            }
                        });

                        $('.submit_btn', popup).click(function() {
                            if(node.data.data == undefined) {
                                node.data.data = {};
                            }
                            node.data.data.endpoints = [];
                            $('.ring_group ul li', popup).each(function() {
                                node.data.data.endpoints.push({id: $(this).attr('id')});
                            });
                            
                            node.data.data.strategy = $('#strategy', popup).val();
                            node.data.data.timeout = $('#timeout', popup).val();

                            popup.dialog('close');
                        });
                    });
                });  
            }
            else {
               //node.details = '';
               if(node.actionName == 'offnet') {
                   if(node.module == 'offnet') {
                       node.details = 'Global';
                   }
                   else {
                       node.details = 'Local';
                   }
               } 
               else if(node.actionName == 'temporal_route') {
                   //TODO
                   if(node.data.data != undefined && node.data.data.timezone != undefined) {
                       node.details = 'PST';
                   }
               }
               else if(node.actionName == 'conference') {
                    if(node.data.data != undefined && node.data.data.id != undefined) {
                       node.details = THIS.getDetails(node.data.data.id, 'name');
                    }
                    else node.details = "Conference Server";
               }
               else {
                   if(node.data.data != undefined && node.data.data.id != undefined) {
                       node.details = THIS.getDetails(node.data.data.id, 'name');
                   }    
               }
               if(node.details == undefined) node.details = '';
               
               node_html = THIS.templates.node.tmpl(node);

               //node_html.find('.edit').click(function() {
               node_html.find('.module').click(function() {
                    var node_name = node.actionName, general, options;

                    general = function(json, other) {
                        var dialog, data;
                        if(node_name == 'temporal_route') {
                            data = {
                                title: 'Configure your time of day route',
                                objects: {
                                    type: 'Timezone',
                                    items: [ 
                                        {id: 'America/Los_Angeles', name: 'PST'}
                                    ],
                                    selected: (node.data.data == undefined) ? 0 : node.data.data.timezone
                                }
                            };
                        }
                        else if(node_name == 'offnet') {
                            data = {
                                title: 'Configure your offnet',
                                objects: {
                                    type: 'Resource type',
                                    items: [
                                        {id: 'resource', name: 'Local'},
                                        {id: 'offnet', name: 'Global'}
                                    ],
                                    selected: node.module
                                }
                            };
                        }
                        else if(node_name == 'conference') {
                            json.data.push({id:'!', name: '*Conference Server*'});

                            data = {
                                title: 'Configure the conference',
                                objects: {
                                    type: node_name,
                                    items: json.data,
                                    selected: (node.data.data == undefined || node.data.data.id == undefined) ? '!' : node.data.data.id
                                }
                            };
                        }
                        else if(node_name == 'callflow') {
                            var list = [];
                            $.each(json.data, function(i, val) {
                                //Sanity Check! Don't reference the same callflow!
                                if(this.id != THIS.flow.id) {
                                    this.name = this.numbers.toString();
                                    list.push(this);
                                }
                            });

                            data = {
                                title: 'Select the callflow',
                                objects: {
                                    type: node_name,
                                    items: list,
                                    selected: (node.data.data == undefined) ? 0 : node.data.data.id
                                }
                            };
                        }
                        else if(node_name == 'device') {
                            data = {
                                title: 'Select the ' + node_name,
                                parameter: {
                                    name: 'timeout',
                                    value: (node.data.data == undefined || node.data.data.timeout == undefined) ? '20' : node.data.data.timeout
                                },
                                objects: {
                                    type: node_name,
                                    items: json.data,
                                    selected: (node.data.data == undefined) ? 0 : node.data.data.id
                                }
                            };

                        }
                        else {
                            data = {
                                title: 'Select the ' + node_name,
                                objects: {
                                    type: node_name,
                                    items: json.data,
                                    selected: (node.data.data == undefined) ? 0 : node.data.data.id
                                }
                            };
                        }

                        dialog = THIS.templates.edit_dialog.tmpl(data).dialog({
                            title : data.title,
                            resizable : false,
                            modal: true,
                            width: 400
                        });
                    
                        $('#create_new_item', dialog).click(function() {
                            winkstart.publish(node_name+'.popup');
                        });
    
                        dialog.find('.submit_btn').click(function() {
                            var temp;

                            if(node.data.data == undefined) {
                                node.data.data = {};
                            }
                            //TODO: We want to remove this?
                            //if(node.parent.actionName == 'menu' || node.parent.actionName == 'temporal_route') {
                            //    node.key = $('#option-selector', dialog).val();
                            //}
                            if(node_name == 'device') {
                                node.data.data.timeout = $('#parameter_input', dialog).val();
                            }

                            if(node_name == 'temporal_route') {
                                node.data.data.timezone = $('#object-selector', dialog).val();
                            }
                            else if(node_name == 'offnet') {
                                node.module = $('#object-selector', dialog).val();
                            }
                            else if(node_name == 'conference') {
                                temp = $('#object-selector', dialog).val();

                                if(temp == '!') {
                                    delete node.data.data.id;
                                }
                                else {
                                    node.data.data.id = temp;
                                }
                            }
                            else {
                                node.data.data.id = $('#object-selector', dialog).val();
                            }

                            if(node_name != 'temporal_route' && node_name != 'offnet') {
                                THIS.setDetails(node.data.data.id, { 'name' : $('#object-selector option:selected', dialog).text()});
                            } 
                            else {
                            }

                            dialog.dialog('close');
                            THIS.renderFlow();
                        });
                    };

                    test = function(other) {
                        if(node_name == 'temporal_route' || node_name == 'offnet') {
                            general({}, other);
                        }
                        else {
                            winkstart.getJSON(THIS.nodes[node_name].module + '.list', {account_id: winkstart.apps['voip'].account_id, api_url: winkstart.apps['voip'].api_url}, function(json) {
                                general(json, other);
                            });
                        }
                    };

                    if(node.parent.actionName == 'temporal_route') {
                        winkstart.getJSON('timeofday.list', {account_id: winkstart.apps['voip'].account_id, api_url: winkstart.apps['voip'].api_url}, function(json) {
                            var list = json.data,
                                json_list = {};

                            list.push({name: 'All other times (default action)', id:'_'});

                            $.each(list, function() {
                                json_list[this.id] = this.name;
                            });

                            test(json_list);
                        });
                    }
                    else {
                        test({});
                    }
               });
            }*/
            $(this).append(node_html);

            $(this).droppable({
               drop: function (event, ui) {
                  var target = THIS.flow.nodes[$(this).attr('id')];
                  if (ui.draggable.hasClass('action')) {
                     var action = ui.draggable.attr('name'),
                         branch = THIS.branch(action);
                         branch.caption = THIS.actions[action].caption(branch, THIS.flow.caption_map);
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
         return layout;
      },

      _renderBranch: function (branch) {
         var THIS = this;
         if(branch.parent != undefined && (branch.parent.actionName == 'menu' || branch.parent.actionName == 'offnet')) {
             if(branch.key != '_') {
                 branch.key_details = branch.key;
             }
             else branch.key_details = 'Default';
         }
         else if(branch.parent != undefined && branch.parent.actionName == 'temporal_route') {
             if(branch.key != '_') {
                 branch.key_details = THIS.getDetails(branch.key, 'name');
             } 
             else branch.key_details = 'All other times';
         }
        

         if(branch.countChildren == undefined) branch.countChildren = 1;
         var flow = this.templates.branch.tmpl(branch);
         var countChildren = 0;
         $.each(branch.children, function() {
             countChildren++;
         }); 
         flow.find('.a_link_option').click( function() {
            var data = {}, popup = function(){
                var dialog = THIS.templates.edit_dialog.tmpl(data).dialog({width: 400, title: 'Settings'});
                dialog.find('.submit_btn').click(function() {
                        branch.key = $('#option-selector', dialog).val();
                        if(branch.parent.actionName != 'menu' && branch.parent.actionName != 'offnet') {
                            THIS.setDetails(branch.key, {'name': $('#option-selector option:selected', dialog).text()});
                        }
                        dialog.dialog('close');
                        THIS.renderFlow();
                }); 
            };

            if(branch.actionNameParent == 'menu') {
                 data.options = {
                                    type: 'menu option',
                                    items: THIS.config.menu_options,
                                    selected: branch.key
                                };
            }
            else if(branch.actionNameParent == 'temporal_route') {
                 data.options = {
                                type: 'temporal rule',
                                items: {},
                                selected: 0
                            };
                winkstart.getJSON('timeofday.list', {account_id: winkstart.apps['voip'].account_id, api_url: winkstart.apps['voip'].api_url}, function(json) {
                        var list = json.data,
                            json_list = {};

                        list.push({name: 'All other times (default action)', id:'_'});

                        $.each(list, function() {
                            json_list[this.id] = this.name;
                        });

                        data.options.items = json_list;
                        data.options.selected = branch.key;

                        popup();
                });
            }
            if(data.options != undefined && branch.parent.actionName != 'temporal_route') {
                popup();
            }

         });

         var children = flow.find('.children');
         var firstChildren = true;
         var countEach = 0;
         $.each(branch.children, function() {
            countEach++;
            this.actionNameParent = branch.actionName;
            this.countChildren = countChildren;

            if(firstChildren) {
                this.firstChildren = "true";
                firstChildren = false; 
            }
            else {
                this.firstChildren = "false";
            }

            countEach == countChildren ? this.lastChildren = "true" : this.lastChildren = "false";
            children.append(THIS._renderBranch(this));
         });
         return flow;
      },

        renderTools: function () {
            var THIS = this,
                buf = $(THIS.config.elements.buf),
                target,
                tools;

            THIS.categories = {};

            $.each(THIS.actions, function(i, data) {
                if('category' in data) {
                    data.category in THIS.categories ? true : THIS.categories[data.category] = [];
                    THIS.categories[data.category].push(i);
                }
            });

            tools = THIS.templates.tools.tmpl({
                categories: THIS.categories,
                nodes: THIS.actions
            });

            $('.category', tools).click(function () {
                var current = $(this);

                if($('.arrow_category', $(this)).hasClass('activeArrow')) {
                    $('.arrow_category', $(this)).removeClass('activeArrow').addClass('inactiveArrow')
                    $('.text_category', $(this)).removeClass('activeText').addClass('inactiveText')
                }
                else {
                    $('.arrow_category', $(this)).removeClass('inactiveArrow').addClass('activeArrow');
                    $('.text_category', $(this)).removeClass('inactiveText').addClass('activeText');
                }
                

                while(current.next().hasClass('tool') || current.next().hasClass('app_list_nav') || current.next().hasClass('clear')) {
                    current = current.next();
                    current.toggle();
                }
            });

            $('.tool', tools).hover(
                function () {
                    $(this).addClass('active');
                }, 
                function () {
                    $(this).removeClass('active');
                }
            );

            function action (el) {
                el.draggable({
                    start: function () {
                        var clone = $(this).clone();

                        THIS._enableDestinations($(this));

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

            $('.action', tools).each(function() {
                action($(this));
            });
                
            target = $(THIS.config.elements.tools).empty();
            target.append(tools);
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
         var THIS = this;

         if(THIS.flow.id) {
            winkstart.postJSON('callflow.update', {
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url,
                    callflow_id: THIS.flow.id,
                    data: {
                        numbers: THIS.flow.numbers,
                        flow: (THIS.flow.root.children['0'] == undefined) ? {} : THIS.flow.root.children['0'].serialize()
                    }
                }, function(json) {
                    THIS.renderList();
                    THIS.editCallflow({id: json.data.id});
                }
            );
         }
         else {
            winkstart.putJSON('callflow.create', {
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url,
                    data: {
                        numbers: THIS.flow.numbers,
                        flow: (THIS.flow.root.children['0'] == undefined) ? {} : THIS.flow.root.children['0'].serialize()
                    }
                }, function(json) {
                    THIS.renderList();
                    THIS.editCallflow({id: json.data.id});
                }
            );
         }
      },

/*****************************************************************************
 *  Deep object cloning  ***
 *****************************************************************************/
        _clone: function (obj) {
            var o;

            if (obj == null || typeof(obj) != 'object') return obj;

            o = new obj.constructor(); 
            for (var key in obj) o[key] = this._clone(obj[key]);

            return o;
        }, 

        renderList: function(callback){
            var THIS = this;

            winkstart.getJSON('callflow.list', {
                    crossbar: true,
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function (data, status) {

                    // List Data that would be sent back from server
                    function map_crossbar_data(crossbar_data){
                        var new_list = [],
                            answer;

                        if(crossbar_data.length > 0) {
                            _.each(crossbar_data, function(elem){
                                new_list.push({
                                    id: elem.id,
                                    title: elem.numbers.toString()
                                });
                            });
                        }

                        new_list.sort(function(a, b) {
                            a.title.toLowerCase() < b.title.toLowerCase() ? answer = -1 : answer = 1;

                            return answer;
                        });

                        return new_list;
                    }

                    var options = {};
                    options.label = 'Callflow Module';
                    options.identifier = 'callflow-module-listview';
                    options.new_entity_label = 'Callflow';
                    options.data = map_crossbar_data(data.data);
                    options.publisher = winkstart.publish;
                    options.notifyMethod = 'callflow.list-panel-click';
                    options.notifyCreateMethod = 'callflow.edit-callflow';  /* Edit with no ID = Create */

                    $("#callflow-listpanel").empty();
                    $("#callflow-listpanel").listpanel(options);

                    if(typeof callback == 'function') {
                        callback();
                    }
                }
            );
        },

        define_callflow_nodes: function(callflow_nodes) {
            var THIS = this;
                
            $.extend(callflow_nodes, {
                'root': {
                    'name': 'Root',
                    'rules': [ 
                        {
                            'type': 'quantity',
                            'maxSize' : '1'
                        } 
                    ],
                    'isUsable' : 'false'
                },
                'device': {
                    'name': 'Device',
                    'icon': 'phone',
                    'category': 'basic',
                    'module': 'device',
                    'rules': [
                        {
                            'type': 'quantity',
                            'maxSize': '1'
                        }
                    ],
                    'isUsable': 'true',
                    'caption': function(node, caption_map) {
                        var id = node.getMetadata('id');

                        return (id) ? caption_map[id].name : '';
                    },
                    'edit': function(node, node_html, callback) {
                        winkstart.getJSON('device.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html;
                                
                                popup_html = THIS.templates.edit_dialog.tmpl({
                                    parameter: {
                                        name: 'timeout',
                                        value: node.getMetadata('timeout') || '20'
                                    },
                                    objects: {
                                        type: 'device',
                                        items: data.data,
                                        selected: node.getMetadata('id') || 0
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Device' });

                                $('.submit_btn', popup).click(function() {
                                    node.setMetadata('id', $('#object-selector', popup).val());
                                    node.setMetadata('timeout', $('#parameter_input', popup).val());

                                    node.caption = $('#object-selector option:selected', popup).text();

                                    popup.dialog('close');

                                    if(typeof callback == 'function') {
                                        callback();
                                    }
                                });
                            }
                        );
                    }
                },
                'conference': {
                    'name': 'Conference',
                    'icon': 'conference',
                    'category': 'basic',
                    'module': 'conference',
                    'rules': [
                        {
                            'type': 'quantity',
                            'maxSize': '1'
                        }
                    ],
                    'isUsable': 'true',
                    'caption': function(node) {
                        var id = node.getMetadata('id');

                        return (id) ? caption_map[id] : '*Conference Server*';
                    },
                    'edit': function(node, node_html, callback) {
                        winkstart.getJSON('conference.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html;

                                // Add the conference server option
                                data.data.push({
                                    id: '!',
                                    name: '*Conference Server*'
                                });

                                popup_html = THIS.templates.edit_dialog.tmpl({
                                    objects: {
                                        type: 'conference',
                                        items: data.data,
                                        selected: node.getMetadata('id') || '!'
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Conference' });

                                $('.submit_btn', popup).click(function() {
                                    var id = $('#object-selector', popup).val();

                                    if(id == '!') {
                                        node.deleteMetadata('id');
                                    }
                                    else {
                                        node.setMetadata('id', id);
                                    }

                                    node.caption = $('#object-selector option:selected', popup).text();

                                    popup.dialog('close');

                                    if(typeof callback == 'function') {
                                        callback();
                                    }
                                });
                            }
                        );
                    }
                },
                'menu': {
                    'name': 'Menu',
                    'icon': 'menu',
                    'category': 'basic',
                    'module': 'menu',
                    'rules': [
                        {
                            'type': 'quantity',
                            'maxSize': '9'
                        }
                    ],
                    'isUsable': 'true',
                    'edit': function(node, node_html) {

                    }
                },
                'callflow': {
                    'name': 'Callflow',
                    'icon': 'callflow',
                    'category': 'basic',
                    'module': 'callflow',
                    'rules': [
                        {
                            'type': 'quantity',
                            'maxSize': '1'
                        }
                    ],
                    'isUsable': 'true',
                    'caption': function(node, caption_map) {
                        var id = node.getMetadata('id');

                        return (id) ? caption_map[id].numbers.toString() : '';
                    },
                    'edit': function(node, node_html, callback) {
                        winkstart.getJSON('callflow.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html, _data = [];

                                $.each(data.data, function() {
                                    if(this.id != THIS.flow.id) {
                                        this.name = this.numbers.toString();

                                        _data.push(this);
                                    }
                                });

                                popup_html = THIS.templates.edit_dialog.tmpl({
                                    objects: {
                                        type: 'callflow',
                                        items: _data,
                                        selected: node.getMetadata('id') || ''
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Callflow' });

                                $('.submit_btn', popup).click(function() {
                                    node.setMetadata('id', $('#object-selector', popup).val());

                                    node.caption = $('#object-selector option:selected', popup).text();

                                    popup.dialog('close');

                                    if(typeof callback == 'function') {
                                        callback();
                                    }
                                });
                            }
                        );
                    }
                },
                'voicemail': {
                    'name': 'Voicemail',
                    'icon': 'voicemail',
                    'category': 'basic',
                    'module': 'vmbox',
                    'rules': [
                        {
                            'type': 'quantity',
                            'maxSize' : '1'
                        }
                    ],
                    'isUsable': 'true',
                    'edit': function(node, node_html) {

                    }
                },
                'play': {
                    'name': 'Play',
                    'icon': 'play',
                    'category': 'basic',
                    'module': 'media',
                    'rules': [
                        {
                            'type': 'quantity',
                            'maxSize': '1'
                        }
                    ],
                    'isUsable': 'true',
                    'edit': function(node, node_html) {

                    }
                },
                'offnet': {
                    'name': 'Offnet',
                    'icon': 'offnet',
                    'category': 'basic',
                    'module': 'offnet',
                    'rules': [
                        {
                            'type': 'quantity',
                            'maxSize': '9'
                        }
                    ],
                    'isUsable': 'true',
                    'edit': function(node, node_html) {

                    }
                },
                'ringgroup': {
                    'name': 'Ring Group',
                    'icon': 'ring_group',
                    'category': 'basic',
                    'module': 'ring_group',
                    'rules': [
                        {
                            'type': 'quantity',
                            'maxSize': '1'
                        }
                    ],
                    'isUsable': 'true',
                    'edit': function(node, node_html) {

                    }
                },
                'timeofday': {
                    'name': 'Time of Day',
                    'icon': 'temporal_route',
                    'category': 'basic',
                    'module': 'temporal_route',
                    'rules': [
                        {
                            'type': 'quantity',
                            'maxSize': '9'
                        }
                    ],
                    'isUsable': 'true',
                    'edit': function(node, node_html) {

                    }
                }
            });
        }
    }
);
