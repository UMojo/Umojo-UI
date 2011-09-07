winkstart.module('voip', 'callflow', {
        css: [
            'css/style.css',
            'css/popups.css',
            'css/two_columns.css',
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
            edit_dialog: 'tmpl/edit_dialog.html',
            two_column: 'tmpl/two_column.html',
            ring_group_dialog: 'tmpl/ring_group_dialog.html'
        },

        elements: {
            flow: '#ws_cf_flow',
            tools: '#ws_cf_tools',
            save: '#ws_cf_save',
            buf: '#ws_cf_buf'
        },

        menu_options: [
            {id: '_', name: 'Default action'},
            {id: '1', name: '1'},
            {id: '2', name: '2'},
            {id: '3', name: '3'},
            {id: '4', name: '4'},
            {id: '5', name: '5'},
            {id: '6', name: '6'},
            {id: '7', name: '7'},
            {id: '8', name: '8'},
            {id: '9', name: '9'},
            {id: '0', name: '0'},
            {id: '#', name: '#'},
            {id: '*', name: '*'}
        ],

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

            branch = THIS.branch(THIS.construct_action(json));

            branch.data.data = ('data' in json) ? json.data : {};
            branch.id = ++id;
            branch.key = key;

            branch.caption = THIS.actions[branch.actionName].caption(branch, THIS.flow.caption_map);

            if('key_caption' in THIS.actions[parent.actionName]) {
                branch.key_caption = THIS.actions[parent.actionName].key_caption(branch, THIS.flow.caption_map);
            }

            $.each(json.children, function(key, child) {
                branch = THIS.buildFlow(child, branch, id, key);
            });

            parent.addChild(branch);

            return parent;
        },

        construct_action: function(json) {
            var action = '';

            if('data' in json) {
                if('id' in json.data) {
                    action = 'id=*,';
                }

                if('action' in json.data) {
                    action += 'action=' + json.data.action + ',';
                }
            }

            if(action != '') {
                action = '[' + action.replace(/,$/, ']');
            }
            else {
                action = '[]';
            }

            return json.module + action;
        },

        renderFlow: function() {
            var target = $(this.config.elements.flow).empty();

            target.append(this._renderFlow());
        },

        // Create a new branch node for the flow
        branch: function(actionName) {
            var THIS = this;

            function branch(actionName) {
                var that = this;
                this.id = -1;  
                this.actionName = actionName;
                this.module = THIS.actions[this.actionName].module;
                this.key = '_';
                this.parent = null;
                this.children = {};
                this.data = { 
                data: THIS.actions[this.actionName].data
                };
                this.caption = '';
                this.key_caption = '';

                this.potentialChildren = function() {
                    var list = [];

                    for(var i in THIS.actions) {
                        if(THIS.actions[i].isUsable) {
                            list[i] = i;
                        }
                    }

                    for(var i in THIS.actions[this.actionName].rules) {
                        var rule = THIS.actions[this.actionName].rules[i];

                        switch (rule.type) {
                            case 'quantity':
                                if(THIS._count(this.children) >= rule.maxSize) {
                                    list = [];
                                }
                                break;
                        }
                    }

                    return list;
                }

                this.contains = function(branch) {
                    var toCheck = branch;

                    while(toCheck.parent) {
                        if(this.id == toCheck.id) {
                            return true;
                        }
                        else {
                            toCheck = toCheck.parent;
                        }
                    }

                    return false;
                }

                this.removeChild = function(branch) {
                    $.each(this.children, function(i, child) {
                        if(child.id == branch.id) {
                            delete that.children[i];
                        }
                    });
                }

                this.addChild = function(branch) {
                    if(!(branch.actionName in this.potentialChildren())) {
                        return false;
                    }

                    if(branch.contains(this)) {
                        return false;
                    }

                    if(branch.parent) {
                        branch.parent.removeChild(branch);
                    }

                    branch.parent = this;

                    this.children[THIS._count(this.children)] = branch;

                    return true;
                }

                this.getMetadata = function(key) {
                    var value;

                    if('data' in this.data && key in this.data.data) {
                        value = this.data.data[key];

                        return (value == 'null') ? null : value;
                    }

                    return false;
                }

                this.setMetadata = function(key, value) {
                    if(!('data' in this.data)) {
                        this.data.data = {};
                    }

                    this.data.data[key] = (value == null) ? 'null' : value;
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

                this.nodes = function() {
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
                    var json = $.extend(true, {}, this.data);

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

        _resetFlow: function() {
            var THIS = this;

            THIS.flow = {};
            THIS.flow.root = THIS.branch('root');    // head of the flow tree
            THIS.flow.root.key = 'flow';
            THIS.flow.numbers = [];
            THIS.flow.caption_map = {};
            THIS._formatFlow();
        },

        _formatFlow: function() {
            var THIS = this;

            THIS.flow.root.index(0);
            THIS.flow.nodes = THIS.flow.root.nodes();
        },

        _renderFlow: function() {
            var THIS = this;

            THIS._formatFlow();

            var layout = THIS._renderBranch(THIS.flow.root);

            $('.node', layout).hover(function() {
                    $(this).addClass('over');
                },
                function() {
                    $(this).removeClass('over');
                }
            );

            $('.node', layout).each(function() {
                var node_html, node = THIS.flow.nodes[$(this).attr('id')], $node = $(this);

                if (node.actionName == 'root') {
                    $node.removeClass('icons_black root');

                    node_html = THIS.templates.root.tmpl({ numbers: THIS.flow.numbers.toString() });

                    $('.btn_plus_sm', node_html).click(function() {
                        var dialog = THIS.templates.add_number.tmpl({}).dialog({
                            width: 400,
                            title: 'Add a number',
                            resizable: 'false'
                        });

                        $('.submit_btn', dialog).click(function() {
                            THIS.flow.numbers.push(dialog.find('#add_number_text').val());

                            dialog.dialog('close');
                            THIS.renderFlow();
                        });
                    });

                    $('.save', node_html).click(function() {
                        THIS.save();
                    });

                    $('.trash', node_html).click(function() {
                        winkstart.deleteJSON('callflow.delete', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url,
                                callflow_id: THIS.flow.id
                            },
                            function() {
                                $('#ws_callflow').empty();
                                THIS.renderList();
                                THIS._resetFlow();
                            }
                        );
                    });
                }
                else {
                    node_html = THIS.templates.node.tmpl({
                        node: node,
                        callflow: THIS.actions[node.actionName]
                    });

                    $('.module', node_html).click(function() {
                        THIS.actions[node.actionName].edit(node, function() {
                            THIS.renderFlow();
                        });
                    });
                }

                $(this).append(node_html);

                $(this).droppable({
                    drop: function (event, ui) {
                        var target = THIS.flow.nodes[$(this).attr('id')],
                            action;

                        if (ui.draggable.hasClass('action')) {
                            action = ui.draggable.attr('name'),

                            branch = THIS.branch(action);
                            branch.caption = THIS.actions[action].caption(branch, THIS.flow.caption_map);

                            if (target.addChild(branch)) {
                                if(branch.parent && ('key_caption' in THIS.actions[branch.parent.actionName])) { 
                                    branch.key_caption = THIS.actions[branch.parent.actionName].key_caption(branch, THIS.flow.caption_map);
                                }

                                THIS.renderFlow();
                            }
                        }

                        if (ui.draggable.hasClass('node')) {
                            var branch = THIS.flow.nodes[ui.draggable.attr('id')];

                            if (target.addChild(branch)) {
                                // If we move a node, destroy its key
                                branch.key = '_';

                                if(branch.parent && ('key_caption' in THIS.actions[branch.parent.actionName])) { 
                                    branch.key_caption = THIS.actions[branch.parent.actionName].key_caption(branch, THIS.flow.caption_map);
                                }

                                ui.draggable.remove();
                                THIS.renderFlow();
                            }
                        }
                    }
                });

                // dragging the whole branch
                $(this).draggable({
                    start: function () {
                        var children = $(this).next(),
                            t = children.offset().top - $(this).offset().top,
                            l = children.offset().left - $(this).offset().left;

                        THIS._enableDestinations($(this));

                        $(this).attr('t', t); $(this).attr('l', l);
                    },
                    drag: function () {
                        var children = $(this).next(),
                            t = $(this).offset().top + parseInt($(this).attr('t')),
                            l = $(this).offset().left + parseInt($(this).attr('l'));

                        children.offset({ top: t, left: l });
                    },
                    stop: function () {
                        THIS._disableDestinations();

                        THIS.renderFlow();
                    }
                });
            });

            $('.delete', layout).click(function() {
                var node = THIS.flow.nodes[$(this).attr('id')];

                if (node.parent) {
                    node.parent.removeChild(node);

                    THIS.renderFlow();
                }
            });

            return layout;
        },

        _renderBranch: function(branch) {
            var THIS = this,
                flow = THIS.templates.branch.tmpl({
                    node: branch,
                    display_key: branch.parent && ('key_caption' in THIS.actions[branch.parent.actionName])
                }),
                children;
            
            if(branch.parent && ('key_edit' in THIS.actions[branch.parent.actionName])) {
                $('.div_option', flow).click(function() {
                    THIS.actions[branch.parent.actionName].key_edit(branch, function() {
                        THIS.renderFlow();
                    });
                });
            }

            // This need to be evaluated before the children start adding content
            children = $('.children', flow);

            $.each(branch.children, function() {
                children.append(THIS._renderBranch(this));
            });

            return flow;
        },

        renderTools: function() {
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

            $('.tool, .app_list_nav, .clear', tools).hide();

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

        _enableDestinations: function(el) {
            var THIS = this;

            $('.node').each(function () {
                var activate = true,
                    target = THIS.flow.nodes[$(this).attr('id')];

                if (el.attr('name') in target.potentialChildren()) {
                    if (el.hasClass('node') && THIS.flow.nodes[el.attr('id')].contains(target)) {
                        activate = false;
                    }
                }
                else {
                    activate = false;
                }

                if (activate) {
                    $(this).addClass('active');
                }
                else {
                    $(this).addClass('inactive');
                    $(this).droppable('disable');
                }
            });
        },

        _disableDestinations: function() {
            $('.node').each(function () {
                $(this).removeClass('active');
                $(this).removeClass('inactive');
                $(this).droppable('enable');
            });

            $('.tool').removeClass('active');
        },

        save: function() {
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
                    },
                    function(json) {
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
                    },
                    function(json) {
                        THIS.renderList();
                        THIS.editCallflow({id: json.data.id});
                    }
                );
            }
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
                    name: 'Root',
                    rules: [ 
                        {
                            type: 'quantity',
                            maxSize: '1'
                        } 
                    ],
                    isUsable : 'false'
                },
                'device[id=*]': {
                    name: 'Device',
                    icon: 'phone',
                    category: 'basic',
                    module: 'device',
                    data: {
                        id: 'null'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        var id = node.getMetadata('id');

                        return (id && id != '') ? caption_map[id].name : '';
                    },
                    edit: function(node, callback) {
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
                                        selected: node.getMetadata('id') || ''
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
                'conference[]': {
                    name: 'Conference Server',
                    icon: 'conference',
                    category: 'advanced',
                    module: 'conference',
                    data: {},
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node) {
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                },
                'conference[id=*]': {
                    name: 'Conference',
                    icon: 'conference',
                    category: 'basic',
                    module: 'conference',
                    data: {
                        id: 'null'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        var id = node.getMetadata('id');

                        return (id && id != '') ? caption_map[id] : '';
                    },
                    edit: function(node, callback) {
                        winkstart.getJSON('conference.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html;

                                popup_html = THIS.templates.edit_dialog.tmpl({
                                    objects: {
                                        type: 'conference',
                                        items: data.data,
                                        selected: node.getMetadata('id') || '!'
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Conference' });

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
                'callflow[id=*]': {
                    name: 'Callflow',
                    icon: 'callflow',
                    category: 'basic',
                    module: 'callflow',
                    data: {
                        id: 'null'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        var id = node.getMetadata('id');

                        return (id) ? caption_map[id].numbers.toString() : '';
                    },
                    edit: function(node, callback) {
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
                'voicemail[id=*]': {
                    name: 'Voicemail',
                    icon: 'voicemail',
                    category: 'basic',
                    module: 'voicemail',
                    data: {
                        id: 'null'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        var id = node.getMetadata('id');

                        return (id) ? caption_map[id].name : '';
                    },
                    edit: function(node, callback) {
                        winkstart.getJSON('vmbox.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html;

                                popup_html = THIS.templates.edit_dialog.tmpl({
                                    objects: {
                                        type: 'voicemail',
                                        items: data.data,
                                        selected: node.getMetadata('id') || ''
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Voicemail' });

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
                'voicemail[action=check]': {
                    name: 'Check Voicemail',
                    icon: 'voicemail',
                    category: 'advanced',
                    module: 'voicemail',
                    data: {
                        action: 'check'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                },
                'play[id=*]': {
                    name: 'Play Media',
                    icon: 'play',
                    category: 'advanced',
                    module: 'play',
                    data: {
                        id: 'null'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        var id = node.getMetadata('id');

                        return (id) ? caption_map[id].name : '';
                    },
                    edit: function(node, callback) {
                        winkstart.getJSON('media.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html;

                                popup_html = THIS.templates.edit_dialog.tmpl({
                                    objects: {
                                        type: 'media',
                                        items: data.data,
                                        selected: node.getMetadata('id') || ''
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Play Media' });

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
                'menu[id=*]': {
                    name: 'Menu',
                    icon: 'menu',
                    category: 'basic',
                    module: 'menu',
                    data: {
                        id: 'null'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '9'
                        }
                    ],
                    isUsable: 'true',
                    key_caption: function(child_node, caption_map) {
                        var key = child_node.key;

                        return (key != '_') ? key : 'Default action';
                    },
                    key_edit: function(child_node, callback) {
                        var popup, popup_html;

                        popup_html = THIS.templates.edit_dialog.tmpl({
                            objects: {
                                type: 'menu option',
                                items: THIS.config.menu_options,
                                selected: child_node.key
                            }
                        });

                        popup = winkstart.dialog(popup_html, { title: 'Menu Option' });

                        $('.submit_btn', popup).click(function() {
                            child_node.key = $('#object-selector', popup).val();

                            child_node.key_caption = $('#object-selector option:selected', popup).text();

                            popup.dialog('close');

                            if(typeof callback == 'function') {
                                callback();
                            }
                        });
                    },
                    caption: function(node, caption_map) {
                        var id = node.getMetadata('id');

                        return (id) ? caption_map[id].name : '';
                    },
                    edit: function(node, callback) {
                        winkstart.getJSON('menu.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html;

                                popup_html = THIS.templates.edit_dialog.tmpl({
                                    objects: {
                                        type: 'menu',
                                        items: data.data,
                                        selected: node.getMetadata('id') || ''
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Menu' });

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
                'temporal_route[]': {
                    name: 'Time of Day',
                    icon: 'temporal_route',
                    category: 'basic',
                    module: 'temporal_route',
                    data: {},
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '9'
                        }
                    ],
                    isUsable: 'true',
                    key_caption: function(child_node, caption_map) {
                        var key = child_node.key;

                        return (key != '_') ? caption_map[key].name : 'All other times';
                    },
                    key_edit: function(child_node, callback) {
                        winkstart.getJSON('timeofday.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html;

                                data.data.push({ id: '_', name: 'All other times' });

                                popup_html = THIS.templates.edit_dialog.tmpl({
                                    objects: {
                                        type: 'temporal rule',
                                        items: data.data,
                                        selected: child_node.key
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Time of Day' });

                                $('.submit_btn', popup).click(function() {
                                    child_node.key = $('#object-selector', popup).val();

                                    child_node.key_caption = $('#object-selector option:selected', popup).text();

                                    popup.dialog('close');

                                    if(typeof callback == 'function') {
                                        callback();
                                    }
                                });
                            }
                        );
                    },
                    caption: function(node, caption_map) {
                        return node.getMetadata('timezone') || '';
                    },
                    edit: function(node, callback) {
                        var popup, popup_html;

                        popup_html = THIS.templates.edit_dialog.tmpl({
                            objects: {
                                type: 'timezone',
                                items: {},
                                selected: {}
                            }
                        });

                        winkstart.timezone.populate_dropdown($('#object-selector', popup_html), node.getMetadata('timezone') || '');

                        popup = winkstart.dialog(popup_html, { title: 'Time of Day' });

                        $('.submit_btn', popup).click(function() {
                            node.setMetadata('timezone', $('#object-selector', popup).val());

                            node.caption = $('#object-selector option:selected', popup).text();

                            popup.dialog('close');

                            if(typeof callback == 'function') {
                                callback();
                            }
                        });
                    }
                },
                'temporal_route[action=enable]': {
                    name: 'Enable Time of Day',
                    icon: 'temporal_route',
                    category: 'advanced',
                    module: 'temporal_route',
                    data: {
                        action: 'enable',
                        rules: []
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                        winkstart.getJSON('timeofday.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html, rules,
                                    unselected_rules = [],
                                    selected_rules = [];

                                if(rules = node.getMetadata('rules')) {
                                    $.each(data.data, function(i, obj) {
                                        if($.inArray(obj.id, rules) != -1) {
                                            selected_rules.push(obj);
                                        }
                                        else {
                                            unselected_rules.push(obj);
                                        }
                                    });
                                }
                                else {
                                    unselected_rules = data.data;
                                }

                                popup_html = THIS.templates.two_column.tmpl({
                                    left: {
                                        title: 'Unselected time of day rules',
                                        items: unselected_rules
                                    },
                                    right: {
                                        title: 'Selected time of day rules',
                                        items: selected_rules
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Enable Time of Day rules' });

                                $('.scrollable', popup).jScrollPane();

                                $('.connect', popup).sortable({
                                    connectWith: $('.connect', popup),
                                    zIndex: 2000,
                                    helper: 'clone',
                                    appendTo: $('.wrapper', popup),
                                    receive: function() {
                                        $('.scrollable', popup).data('jsp').reinitialise();
                                    },
                                    remove: function() {
                                        $('.scrollable', popup).data('jsp').reinitialise();
                                    }
                                });

                                $('.submit_btn', popup).click(function() {
                                    var _rules = [];

                                    $('.right .connect li', popup).each(function() {
                                        _rules.push($(this).dataset('id'));
                                    });

                                    node.setMetadata('rules', _rules);

                                    popup.dialog('close');

                                    if(typeof callback == 'function') {
                                        callback();
                                    }
                                });
                            }
                        );
                    }
                },
                'temporal_route[action=disable]': {
                    name: 'Disable Time of Day',
                    icon: 'temporal_route',
                    category: 'advanced',
                    module: 'temporal_route',
                    data: {
                        action: 'disable',
                        rules: []
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                        winkstart.getJSON('timeofday.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html, rules,
                                    unselected_rules = [],
                                    selected_rules = [];

                                if(rules = node.getMetadata('rules')) {
                                    $.each(data.data, function(i, obj) {
                                        if($.inArray(obj.id, rules) != -1) {
                                            selected_rules.push(obj);
                                        }
                                        else {
                                            unselected_rules.push(obj);
                                        }
                                    });
                                }
                                else {
                                    unselected_rules = data.data;
                                }

                                popup_html = THIS.templates.two_column.tmpl({
                                    left: {
                                        title: 'Unselected time of day rules',
                                        items: unselected_rules
                                    },
                                    right: {
                                        title: 'Selected time of day rules',
                                        items: selected_rules
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Disable Time of Day rules' });

                                $('.scrollable', popup).jScrollPane();

                                $('.connect', popup).sortable({
                                    connectWith: $('.connect', popup),
                                    zIndex: 2000,
                                    helper: 'clone',
                                    appendTo: $('.wrapper', popup),
                                    receive: function() {
                                        $('.scrollable', popup).data('jsp').reinitialise();
                                    },
                                    remove: function() {
                                        $('.scrollable', popup).data('jsp').reinitialise();
                                    }
                                });

                                $('.submit_btn', popup).click(function() {
                                    var _rules = [];

                                    $('.right .connect li', popup).each(function() {
                                        _rules.push($(this).dataset('id'));
                                    });

                                    node.setMetadata('rules', _rules);

                                    popup.dialog('close');

                                    if(typeof callback == 'function') {
                                        callback();
                                    }
                                });
                            }
                        );
                    }
                },
                'temporal_route[action=reset]': {
                    name: 'Reset Time of Day',
                    icon: 'temporal_route',
                    category: 'advanced',
                    module: 'temporal_route',
                    data: {
                        action: 'reset',
                        rules: []
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                        winkstart.getJSON('timeofday.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html, rules,
                                    unselected_rules = [],
                                    selected_rules = [];

                                if(rules = node.getMetadata('rules')) {
                                    $.each(data.data, function(i, obj) {
                                        if($.inArray(obj.id, rules) != -1) {
                                            selected_rules.push(obj);
                                        }
                                        else {
                                            unselected_rules.push(obj);
                                        }
                                    });
                                }
                                else {
                                    unselected_rules = data.data;
                                }

                                popup_html = THIS.templates.two_column.tmpl({
                                    left: {
                                        title: 'Unselected time of day rules',
                                        items: unselected_rules
                                    },
                                    right: {
                                        title: 'Selected time of day rules',
                                        items: selected_rules
                                    }
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Reset Time of Day rules' });

                                $('.scrollable', popup).jScrollPane();

                                $('.connect', popup).sortable({
                                    connectWith: $('.connect', popup),
                                    zIndex: 2000,
                                    helper: 'clone',
                                    appendTo: $('.wrapper', popup),
                                    receive: function() {
                                        $('.scrollable', popup).data('jsp').reinitialise();
                                    },
                                    remove: function() {
                                        $('.scrollable', popup).data('jsp').reinitialise();
                                    }
                                });

                                $('.submit_btn', popup).click(function() {
                                    var _rules = [];

                                    $('.right .connect li', popup).each(function() {
                                        _rules.push($(this).dataset('id'));
                                    });

                                    node.setMetadata('rules', _rules);

                                    popup.dialog('close');

                                    if(typeof callback == 'function') {
                                        callback();
                                    }
                                });
                            }
                        );
                    }
                }, 
                'ring_group[]': {
                    name: 'Ring Group',
                    icon: 'ring_group',
                    category: 'basic',
                    module: 'ring_group',
                    data: {
                        name: ''
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return node.getMetadata('name') || '';
                    },
                    edit: function(node, callback) {
                        winkstart.getJSON('device.list', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url
                            },
                            function(data, status) {
                                var popup, popup_html, index, endpoints
                                    selected_endpoints = {},
                                    unselected_endpoints = [];

                                if(endpoints = node.getMetadata('endpoints')) {
                                    // We need to translate the endpoints to prevent nasty O(N^2) time complexities,
                                    // we also need to clone to preven managing of objects
                                    $.each($.extend(true, {}, endpoints), function(i, obj) {
                                        obj.name = 'Undefined';
                                        selected_endpoints[obj.id] = obj; 
                                    });

                                    $.each(data.data, function(i, obj) {
                                        if(obj.id in selected_endpoints) {
                                            selected_endpoints[obj.id].name = obj.name;
                                        }
                                        else {
                                            unselected_endpoints.push(obj);
                                        }
                                    });
                                }
                                else {
                                    unselected_endpoints = data.data;
                                }

                                popup_html = THIS.templates.ring_group_dialog.tmpl({
                                    left: {
                                        title: 'Unselected devices',
                                        items: unselected_endpoints
                                    },
                                    right: {
                                        title: 'Selected devices',
                                        items: selected_endpoints
                                    },
                                    form: {
                                        name: node.getMetadata('name') || '',
                                        strategy: {
                                            items: [
                                                {   
                                                    id: 'simultaneous',
                                                    name: 'At the same time'
                                                },
                                                {
                                                    id: 'single',
                                                    name: 'In order'
                                                }
                                            ],
                                            selected: node.getMetadata('strategy') || 'simultaneous'
                                        },
                                        timeout: node.getMetadata('timeout') || '30'
                                    }
                                });

                                $('.column.left .options', popup_html).hide();

                                $('.options .option', popup_html).each(function() {
                                    $(this).tooltip({
                                        attach: 'body'
                                    });
                                });

                                $('.options .option.delay', popup_html).bind('change blur focus', function() {
                                    $(this).parents('li').dataset('delay', $(this).val());
                                });

                                $('.options .option.timeout', popup_html).bind('change blur focus', function() {
                                    $(this).parents('li').dataset('timeout', $(this).val());
                                });

                                popup = winkstart.dialog(popup_html, { title: 'Ring Group' });

                                $('.scrollable', popup).jScrollPane();

                                $('.connect', popup).sortable({
                                    connectWith: $('.connect', popup),
                                    zIndex: 2000,
                                    helper: 'clone',
                                    appendTo: $('.wrapper', popup),
                                    receive: function(ev, ui) {
                                        if($(this).parents('.column').hasClass('left')) {
                                            $('.options', ui.item).hide();
                                        }
                                        else {
                                            $('.options', ui.item).show();
                                        }

                                        $('.scrollable', popup).data('jsp').reinitialise();
                                    },
                                    remove: function(ev, ui) {
                                        $('.scrollable', popup).data('jsp').reinitialise();
                                    }
                                });

                                $('.submit_btn', popup).click(function() {
                                    var name = $('#name', popup).val();

                                    endpoints = [];

                                    $('.right .connect li', popup).each(function() {
                                        endpoints.push($(this).dataset());
                                    });

                                    node.setMetadata('endpoints', endpoints);
                                    node.setMetadata('name', name);
                                    node.setMetadata('strategy', $('#strategy', popup).val());
                                    node.setMetadata('timeout', $('#timeout', popup).val());

                                    node.caption = name;

                                    popup.dialog('close');

                                    if(typeof callback == 'function') {
                                        callback();
                                    }
                                });
                            }
                        );
                    }
                },
                'call_forward[action=activate]': {
                    name: 'Enable call forwarding',
                    icon: 'rightarrow',
                    category: 'advanced',
                    module: 'call_forward',
                    data: {
                        action: 'activate'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                },
                'call_forward[action=deactivate]': {
                    name: 'Disable call forwarding',
                    icon: 'rightarrow',
                    category: 'advanced',
                    module: 'call_forward',
                    data: {
                        action: 'deactivate'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                },
                'call_forward[action=update]': {
                    name: 'Update call forwarding',
                    icon: 'rightarrow',
                    category: 'advanced',
                    module: 'call_forward',
                    data: {
                        action: 'update'
                    },
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '1'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                },
                'offnet[]': {
                    name: 'Global Resource',
                    icon: 'offnet',
                    category: 'basic',
                    module: 'offnet',
                    data: {},
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '0'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                },
                'resource[]': {
                    name: 'Resource',
                    icon: 'resource',
                    category: 'basic',
                    module: 'resource',
                    data: {},
                    rules: [
                        {
                            type: 'quantity',
                            maxSize: '0'
                        }
                    ],
                    isUsable: 'true',
                    caption: function(node, caption_map) {
                        return '';
                    },
                    edit: function(node, callback) {
                    }
                }
            });
        }
    }
);
