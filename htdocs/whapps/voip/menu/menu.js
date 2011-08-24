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
            'menu.edit-menu' : 'editMenu',
            'menu.popup' : 'popupMenu'
        },

        validation : [
                {name : '#name', regex: /^.*/},
                {name : '#retries', regex : /^[0-9]+$/},
                {name : '#record_pin', regex : /^[0-9]+$/},
                {name : '#timeout', regex : /^[0-9]+$/},
                {name : '#max_extension_length', regex : /^[0-9]*$/},
                {name : '#hunt_allow', regex : /^.*$/},
                {name : '#hunt_deny', regex : /^.*$/},
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "menu.list": {
                url: '{api_url}/accounts/{account_id}/menus',
                contentType: 'application/json',
                verb: 'GET'
            },
            "menu.get": {
                url: '{api_url}/accounts/{account_id}/menus/{menu_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "menu.create": {
                url: '{api_url}/accounts/{account_id}/menus',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "menu.update": {
                url: '{api_url}/accounts/{account_id}/menus/{menu_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "menu.delete": {
                url: '{api_url}/accounts/{account_id}/menus/{menu_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.__whapp, this.config.resources);

        winkstart.publish('subnav.add', {
            whapp: 'voip',
            module: this.__module,
            label: 'Menus',
            icon: 'menu',
            weight: '40'
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

        saveMenu: function(menu_id, form_data, popup) {
            var THIS = this;

            /* Check validation before saving */
            THIS.validateForm('save');

            if(!$('.invalid').size()) {
                /* Construct the JSON we're going to send */
                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.account_id = winkstart.apps['voip'].account_id;
                rest_data.api_url = winkstart.apps['voip'].api_url;
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
                        if(popup != undefined) {
                            popup.dialog("close");
                            popup.remove(); 
                            
                        } else {
                            THIS.renderList();
                            THIS.editMenu({
                                id: json.data.id
                            });
                        }
                    });
                }
            } else {
                alert('Please correct errors that you have on the form.');
            }
        },
        
        popupMenu: function(data) {
            var THIS = this;
            var form_data = {
                data: { retries: "3", timeout: "10000" },
                field_data: {},
                value: {}
            };
            
            THIS.renderMenu(form_data, true);
        },

        /*
         * Create/Edit menu properties (don't pass an ID field to cause a create instead of an edit)
         */
        editMenu: function(data){
            $('#menu-view').empty();
            var THIS = this;
            var form_data = {
                data: { retries: "3", timeout: "10000", media: {}},   
                field_data: {},
                value: {}
            };
            form_data.field_data.medias = [];

            winkstart.getJSON('media.list', {
                    crossbar: true,
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function(json, xhr) {
                    var listMedias = [];
                    listMedias.push({media_id: '', title: '- Not set -'});
                    if(json.data.length > 0) {
                        _.each(json.data, function(elem) {
                            var title = elem.name;  
                            listMedias.push({
                                media_id: elem.id,
                                title: title
                            });
                        });
                    }
                    form_data.field_data.medias = listMedias;
    
                     if (data && data.id) {
                        /* This is an existing menu - Grab JSON data from server for menu_id */
                        winkstart.getJSON('menu.get', {
                            crossbar: true,
                            account_id: winkstart.apps['voip'].account_id,
                            api_url: winkstart.apps['voip'].api_url,
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

                }
            );
        },

        deleteMenu: function(menu_id) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: winkstart.apps['voip'].account_id,
                api_url: winkstart.apps['voip'].api_url,
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
        renderMenu: function(form_data, popup){
            var THIS = this;

            if(typeof(popup) == undefined) {
                popup = false;
            }

            var menu_id = form_data.data.id;
            winkstart.log(form_data);
            //Hack to display time in seconds for the user.
            form_data.data.timeout = form_data.data.timeout / 1000;
            // Paint the template with HTML of form fields onto the page 
            if(popup==true) {
                var dialog = THIS.templates.editMenu.tmpl(form_data).appendTo($('#callflow-view')).dialog({width:800});
                //var dialog = THIS.templates.editMenu.tmpl(form_data).appendTo($('#childForm'));
            }
            else {
                THIS.templates.editMenu.tmpl(form_data).appendTo( $('#menu-view') );
            }

            winkstart.cleanForm();

            // Initialize form field validation 
            THIS.validateForm();

            $("ul.settings1").tabs("div.pane > div");
            $("ul.settings2").tabs("div.advanced_pane > div");
            $("#name").focus();

            $(".advanced_pane").hide();
            $(".advanced_tabs_wrapper").hide();

            $("#advanced_settings_link").click(function(event) {
                if($(this).attr("enabled")=="true") {
                    $(this).attr("enabled", "false");
                    $(".advanced_pane").slideToggle(function(event) {
                        $(".advanced_tabs_wrapper").animate({width: 'toggle'});
                    });
                }
                else {
                    $(this).attr("enabled", "true");
                    $(".advanced_tabs_wrapper").animate({width: 'toggle'}, function(event) {
                        $(".advanced_pane").slideToggle();
                    });
                }
            });

            // Listen for the submit event (i.e. they click "save") 
            $('.menu-save').click(function(event) {
                // Save the data after they've clicked save 

                // Ignore the normal behavior of a submit button and do our stuff instead 
                event.preventDefault();

                // Grab all the form field data 
                var form_data = form2object('menu-form');
                winkstart.log(form_data);

                if(form_data.max_extension_length == undefined) {
                    form_data.max_extension_length = form_data.record_pin.length;
                }
                else if(form_data.max_extension_length < form_data.record_pin.length) {
                    form_data.max_extension_length = form_data.record_pin.length;
                }                

                // Hack to put timeout in ms in database.
                form_data.timeout = form_data.timeout * 1000;
                
                THIS.saveMenu(menu_id, form_data, dialog);

                return false;
            });

            $('.menu-cancel').click(function(event) {
                event.preventDefault();
                // Cheat - just delete the main content area. Nothing else needs doing really 
                if(popup == false) {
                    $('#menu-view').empty();
                } else {
                    dialog.dialog("close");
                }

                return false;
            });

            $('.menu-delete').click(function(event) {
                // Save the data after they've clicked save 

                // Ignore the normal behavior of a submit button and do our stuff instead 
                event.preventDefault();

                THIS.deleteMenu(menu_id);

                return false;
            });

            $.each($('body').find('*[tooltip]'), function(){
                $(this).tooltip({attach:'body'});
            });
        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        renderList: function(){
            var THIS = this;

            winkstart.getJSON('menu.list', {
                crossbar: true,
                account_id: winkstart.apps['voip'].account_id,
                api_url: winkstart.apps['voip'].api_url
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
                    new_list.sort(function(a, b) {
                        var answer;
                        a.title.toLowerCase() < b.title.toLowerCase() ? answer = -1 : answer = 1;
                        return answer;
                    });

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
