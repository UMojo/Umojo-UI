winkstart.module('voip', 'menu', {
        css: [
            'css/menu.css'
        ],

        templates: {
            menu: 'tmpl/menu.html',
            edit: 'tmpl/edit.html'
        },

        subscribe: {
            'menu.activate': 'activate',
            'menu.edit': 'edit_menu',
        },

        validation: [
            { name: '#name',                 regex: /^.*/ },
            { name: '#retries',              regex: /^[0-9]+$/ },
            { name: '#record_pin',           regex: /^[0-9]*$/ },
            { name: '#timeout',              regex: /^[0-9]+$/ },
            { name: '#max_extension_length', regex: /^[0-9]*$/ },
            { name: '#hunt_allow',           regex: /^.*$/ },
            { name: '#hunt_deny',            regex: /^.*$/ }
        ],

        resources: {
            'menu.list': {
                url: '{api_url}/accounts/{account_id}/menus',
                contentType: 'application/json',
                verb: 'GET'
            },
            'menu.get': {
                url: '{api_url}/accounts/{account_id}/menus/{menu_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'menu.create': {
                url: '{api_url}/accounts/{account_id}/menus',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'menu.update': {
                url: '{api_url}/accounts/{account_id}/menus/{menu_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'menu.delete': {
                url: '{api_url}/accounts/{account_id}/menus/{menu_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);

        winkstart.publish('subnav.add', {
            whapp: 'voip',
            module: THIS.__module,
            label: 'Menus',
            icon: 'menu',
            weight: '40'
        });
    },

    {
        save_menu: function(form_data, data, _parent) {
            var THIS = this,
                parent = _parent || $('#menu-content');

            if (typeof data.data == 'object' && 'id' in data.data) {
                winkstart.request(true, 'menu.update', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        menu_id: data.data.id,
                        data: $.extend(true, {}, data.data, form_data)
                    },
                    function (_data, status) {
                        THIS.render_list(parent);

                        THIS.edit_menu({ id: _data.data.id }, parent);
                    }
                );
            } 
            else {
                winkstart.request(true, 'menu.create', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        data: form_data
                    },
                    function (_data, status) {
                        THIS.render_list(parent);

                        THIS.edit_menu({ id: _data.data.id }, parent);
                    }
                );
            }
        },

        edit_menu: function(data, _parent){
            var THIS = this,
                parent = _parent || $('#menu-content'),
                defaults = {
                    data: {
                        retries: '3',
                        timeout: '10000',
                        media: {}
                    },
                    field_data: {
                        media: []
                    }
                };

            winkstart.request(true, 'media.list', {
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function(_data, status) {
                    _data.data.unshift({
                        id: '',
                        name: '- Not set -'
                    });

                    defaults.field_data.media = _data.data;

                    if(typeof data == 'object' && 'id' in data) {
                        winkstart.request(true, 'menu.get', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url,
                                menu_id: data.id
                            },
                            function(_data, status) {
                                THIS.render_menu($.extend(true, defaults, _data), parent);
                            }
                        );
                    }   
                    else {
                        THIS.render_menu(defaults, parent);
                    }
                }
            );
        },

        delete_menu: function(data, _parent) {
            var THIS = this;
                parent = _parent || $('#menu-content');
            
            if('id' in data.data) {
                winkstart.request(true, 'menu.delete', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        menu_id: data.data.id
                    },
                    function(_data, status) {
                        $('#menu-view', parent).empty();

                        THIS.render_list(parent);
                    }
                );
            }
        },

        render_menu: function(data, _parent){
            var THIS = this,
                parent = _parent || $('#menu-content'),
                menu_html = THIS.templates.edit.tmpl(data);

            winkstart.validate.set(THIS.config.validation, menu_html);

            $('*[tooltip]', menu_html).each(function() {
                $(this).tooltip({ attach: menu_html });
            });

            $('ul.settings1', menu_html).tabs($('.pane > div', menu_html));
            $('ul.settings2', menu_html).tabs($('.advanced_pane > div', menu_html));

            $('#name', menu_html).focus();

            $('.advanced_pane', menu_html).hide();
            $('.advanced_tabs_wrapper', menu_html).hide();

            $('#advanced_settings_link', menu_html).click(function() {
                if($(this).attr('enabled')=='true') {
                    $(this).attr('enabled', 'false');

                    $('.advanced_pane', menu_html).slideToggle(function() {
                        $('.advanced_tabs_wrapper').animate({ width: 'toggle' });
                    });
                }
                else {
                    $(this).attr('enabled', 'true');

                    $('.advanced_tabs_wrapper').animate({
                        width: 'toggle'
                    }, function() {
                        $('.advanced_pane').slideToggle();
                    });
                }
            });

            $('.menu-save', menu_html).click(function(ev) {
                ev.preventDefault();
        
                winkstart.validate.is_valid(THIS.config.validation, menu_html, function() {
                        var form_data = form2object('menu-form');

                        THIS.clean_form_data(form_data);

                        if('field_data' in data) {
                            delete data.field_data;
                        }
                                        
                        THIS.save_menu(form_data, data, parent);    
                    }, 
                    function() {
                        alert('There were errors on the form, please correct!');
                    } 
                );
            });

            $('.menu-delete', menu_html).click(function(ev) {
                ev.preventDefault();

                THIS.delete_menu(data, parent);
            });

            $('#menu-view', parent)
                .empty()
                .append(menu_html);
        },

        clean_form_data: function(form_data) {

            if(form_data.record_pin.length == 0) {
                form_data.max_extension_length = 5;
                delete form_data.record_pin;
            }   
            else if(form_data.max_extension_length < form_data.record_pin.length) {
                form_data.max_extension_length = form_data.record_pin.length;
            } 

            if(form_data.hunt_allow == '') {
                delete form_data.hunt_allow;
            }

            if(form_data.hunt_deny == '') {
                delete form_data.hunt_deny;
            }
            
            if(form_data.media.greeting == '') {
                delete form_data.media.greeting;
            }

            /* Hack to put timeout in ms in database. */
            form_data.timeout = form_data.timeout * 1000;
        },

        render_list: function(_parent){
            var THIS = this,
                parent = _parent || $('#menu-content');;

            winkstart.request(true, 'menu.list', {
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                }, 
                function (data, status) {
                    var map_crossbar_data = function(data) {
                       var new_list = [];
        
                        if(data.length > 0) {
                            $.each(data, function(key, val) {
                                new_list.push({
                                    id: val.id,
                                    title: val.name || '(no name)'
                                });
                            });
                        }
                        
                        new_list.sort(function(a, b) {
                            return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
                        });

                        return new_list;
                    };

                    $('#menu-listpanel', parent)
                        .empty()
                        .listpanel({
                            label: 'Menus',
                            identifier: 'menu-listview',
                            new_entity_label: 'Add Menu',
                            data: map_crossbar_data(data.data),
                            publisher: winkstart.publish,
                            notifyMethod: 'menu.edit',
                            notifyCreateMethod: 'menu.edit',
                            notifyParent: parent             
                        });
                }
            );
        },

        activate: function(parent) {
            var THIS = this,
                menu_html = THIS.templates.menu.tmpl();

            (parent || $('#ws-content'))
                .empty()
                .append(menu_html);

            THIS.render_list(menu_html);
        }
    }
);
