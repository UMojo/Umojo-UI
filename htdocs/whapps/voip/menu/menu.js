winkstart.module('voip', 'menu',
    {
        css: [
            'css/menu.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            menu: 'tmpl/menu.html',
            editMenu: 'tmpl/edit.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'menu.activate' : 'activate',
            'menu.list-panel-click' : 'editMenu',
            'menu.edit-menu' : 'editMenu'
        },

        validation : [
                {name : '#name', regex: /^.*/},
                {name : '#retries', regex : /^[0-9]+$/},
                {name : '#record_pin', regex : /^[0-9]+$/},
                {name : '#timeout', regex : /^[0-9]+$/},
                {name : '#max_extension_length', regex : /^[0-9]+$/},
                {name : '#hunt_allow', regex : /^.*$/},
                {name : '#hunt_deny', regex : /^.*$/},
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "menu.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/menus',
                contentType: 'application/json',
                verb: 'GET'
            },
            "menu.get": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/menus/{menu_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "menu.create": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/menus',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "menu.update": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/menus/{menu_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "menu.delete": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/menus/{menu_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Menus',
            icon: 'menu'
        });
    },

    {
        validateForm: function(state) {
            var THIS = this;
            
            $(THIS.config.validation).each(function(k, v) {
                if(state == undefined) {
                    winkstart.validate.add($(v.name), v.regex);
                } else if (state == 'save') {
                    winkstart.validate.save($(v.name), v.regex);
                }
            });
        },

        saveMenu: function(menu_id, form_data) {
            var THIS = this;

            /* Check validation before saving */
            THIS.validateForm('save');

            if(!$('.invalid').size()) {
                /* Construct the JSON we're going to send */
                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.account_id = MASTER_ACCOUNT_ID;
                rest_data.data = form_data;

                /* Is this a create or edit? See if there's a known ID */
                if (menu_id) {
                    /* EDIT */
                    rest_data.menu_id = menu_id;
                    winkstart.postJSON('menu.update', rest_data, function (json, xhr) {
                        /* Refresh the list and the edit content */
                        THIS.renderList();
                        THIS.editMenu({
                            id: menu_id
                        });
                    });
                } else {
                    /* CREATE */

                    /* Actually send the JSON data to the server */
                    winkstart.putJSON('menu.create', rest_data, function (json, xhr) {
                        THIS.renderList();
                        THIS.editMenu({
                            id: json.data.id
                        });
                    });
                }
            } else {
                alert('Please correct errors that you have on the form.');
            }
        },

        /*
         * Create/Edit menu properties (don't pass an ID field to cause a create instead of an edit)
         */
        editMenu: function(data){
            $('#menu-view').empty();
            var THIS = this;
            var form_data = {
                data: {},   
                field_data: {},
                value: {}
            };

            if (data && data.id) {
                /* This is an existing menu - Grab JSON data from server for menu_id */
                winkstart.getJSON('menu.get', {
                    crossbar: true,
                    account_id: MASTER_ACCOUNT_ID,
                    menu_id: data.id
                }, function(json, xhr) {
                    /* On success, take JSON and merge with default/empty fields */
                    $.extend(true, form_data, json);

                    THIS.renderMenu(form_data);
                });
            } else {
                /* This is a new menu - pass along empty params */
                THIS.renderMenu(form_data);
            }
            
        },

        deleteMenu: function(menu_id) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: MASTER_ACCOUNT_ID,
                menu_id: menu_id
            };

            /* Actually send the JSON data to the server */
            winkstart.deleteJSON('menu.delete', rest_data, function (json, xhr) {
                THIS.renderList();
                $('#menu-view').empty();
            });
        },

        /**
         * Draw menu fields/template and populate data, add validation. Works for both create & edit
         */
        renderMenu: function(form_data){
            var THIS = this;
            var menu_id = form_data.data.id;
            console.log(form_data);    
            /* Paint the template with HTML of form fields onto the page */
            THIS.templates.editMenu.tmpl(form_data).appendTo( $('#menu-view') );

            winkstart.cleanForm();

            /* Initialize form field validation */
            THIS.validateForm();

            $("ul.settings1").tabs("div.pane > div");
            $("ul.settings2").tabs("div.advanced_pane > div");
            $("#name").focus();

            /* Listen for the submit event (i.e. they click "save") */
            $('.menu-save').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                /* Grab all the form field data */
                var form_data = form2object('menu-form');
                THIS.saveMenu(menu_id, form_data);

                return false;
            });

            $('.menu-cancel').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                $('#menu-view').empty();

                return false;
            });

            $('.menu-delete').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                THIS.deleteMenu(menu_id);

                return false;
            });
        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        renderList: function(){
            var THIS = this;

            winkstart.getJSON('menu.list', {
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
                                title: elem.name
                            });
                        });
                    }
                    return new_list;
                }

                var options = {};
                options.label = 'Menu Module';
                options.identifier = 'menu-module-listview';
                options.new_entity_label = 'Menu';
                options.data = map_crossbar_data(json.data);
                options.publisher = winkstart.publish;
                options.notifyMethod = 'menu.list-panel-click';
                options.notifyCreateMethod = 'menu.edit-menu';  /* Edit with no ID = Create */

                $("#menu-listpanel").empty();
                $("#menu-listpanel").listpanel(options);

            });
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            this.templates.menu.tmpl({}).appendTo( $('#ws-content') );

            winkstart.loadFormHelper('forms');

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Menus Management',
                module: this.__module
            });

            $('.edit-menu').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var vmbox_id = target.getAttribute('rel');
                    winkstart.publish('menu.edit-menu', {
                        'menu_id' : menu_id
                    });
                }
            });

            THIS.renderList();
        }
    }
);
