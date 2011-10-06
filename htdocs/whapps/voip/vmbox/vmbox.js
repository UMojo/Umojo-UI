winkstart.module('voip', 'vmbox', {
        css: [
            'css/vmbox.css'
        ],

        templates: {
            vmbox: 'tmpl/vmbox.html',
            edit: 'tmpl/edit.html'
        },

        subscribe: {
            'vmbox.activate' : 'activate',
            'vmbox.edit' : 'edit_vmbox'
        },

        validation : [
            { name: '#name',    regex: /^[a-zA-Z0-9\s_']+$/ },
            { name: '#mailbox', regex: /^[0-9]+$/ },
            { name: '#pin',     regex: /^[0-9]+$/ }
        ],

        resources: {
            'vmbox.list': {
                url: '{api_url}/accounts/{account_id}/vmboxes',
                contentType: 'application/json',
                verb: 'GET'
            },
            'vmbox.get': {
                url: '{api_url}/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'vmbox.create': {
                url: '{api_url}/accounts/{account_id}/vmboxes',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'vmbox.update': {
                url: '{api_url}/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'vmbox.delete': {
                url: '{api_url}/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            'user.list': {
                url: '{api_url}/accounts/{account_id}/users',
                contentType: 'application/json',
                verb: 'GET'
            },
            'user.get': {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);

        winkstart.publish('subnav.add', {
            whapp: 'voip',
            module: THIS.__module,
            label: 'Voicemail Boxes',
            icon: 'vmbox',
            weight: '30'
        });
    },

    {
        save_vmbox: function(form_data, data, _parent) {
            var THIS = this,
                parent = _parent || $('#vmbox-content');

            if(typeof data.data == 'object' && 'id' in data.data) {
                winkstart.request(true, 'vmbox.update', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        vmbox_id: data.data.id,
                        data: $.extend(true, {}, data.data, form_data) 
                    },
                    function(_data, status) {
                        THIS.render_list(parent);

                        THIS.edit_vmbox({ id: _data.data.id }, parent);
                    }
                );
            }
            else {
                winkstart.request(true, 'vmbox.create', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        data: form_data
                    },
                    function(_data, status) {
                        THIS.render_list(parent);

                        THIS.edit_vmbox({ id: _data.data.id }, parent);
                    }
                );
            }
        },

        edit_vmbox: function(data, _parent){
            var THIS = this,
                parent = _parent || $('#vmbox-content'),
                defaults = {
                    data: {
                        require_pin: true,
                        check_if_owner: true,
                        pin: winkstart.random_string(4, '0123456789'),
                        media: {}
                    },
                    field_data: {
                        users: [],
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

                    winkstart.request(true, 'user.list', {
                            account_id: winkstart.apps['voip'].account_id,
                            api_url: winkstart.apps['voip'].api_url
                        },
                        function(_data, status) {
                            _data.data.unshift({
                                id: '',
                                first_name: '- No',
                                last_name: 'owner -'
                            });

                            defaults.field_data.users = _data.data;

                            if(typeof data == 'object' && 'id' in data) {
                                winkstart.request(true, 'vmbox.get', {
                                        account_id: winkstart.apps['voip'].account_id,
                                        api_url: winkstart.apps['voip'].api_url,
                                        vmbox_id: data.id
                                    },
                                    function(_data, status) {
                                        THIS.render_vmbox($.extend(true, defaults, _data), parent);
                                    }
                                );
                            }
                            else {
                                THIS.render_vmbox(defaults, parent);
                            }
                        }
                    );
                }
            );
        },

        delete_vmbox: function(data, _parent) {
            var THIS = this,
                parent = _parent || $('#vmbox-content');

            if('id' in data.data) {
                winkstart.request(true, 'vmbox.delete', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        vmbox_id: data.data.id
                    },
                    function(data, status) {
                        $('#vmbox-view', parent).empty();

                        THIS.render_list(parent);
                    }
                );
            }
        },

        render_vmbox: function(data, _parent) {
            var THIS = this,
                parent = _parent || $('#vmbox-content'),
                vmbox_html = THIS.templates.edit.tmpl(data);

            winkstart.timezone.populate_dropdown($('#timezone', vmbox_html), data.data.timezone);
            
            winkstart.validate.set(THIS.config.validation, vmbox_html);

            $.each($('*[tooltip]', vmbox_html), function() {
                $(this).tooltip({ attach: vmbox_html });
            });

            $('ul.settings1', vmbox_html).tabs($('pane > div', vmbox_html)); 
            $('ul.settings2', vmbox_html).tabs($('advanced_pane > div', vmbox_html));

            $('#name', vmbox_html);

            $('.advanced_pane', vmbox_html).hide();
            $('.advanced_tabs_wrapper', vmbox_html).hide();

            $('#advanced_settings_link', vmbox_html).click(function() {
                if($(this).attr('enabled') === 'true') {
                    $(this).attr('enabled', 'false');

                    $('.advanced_pane', vmbox_html).slideToggle(function() {
                        $('.advanced_tabs_wrapper').animate({ width: 'toggle' });
                    });
                }
                else {
                    $(this).attr('enabled', 'true');
                    
                    $('.advanced_tabs_wrapper').animate({
                            width: 'toggle' 
                        },
                        function() {
                            $('.advanced_pane').slideToggle();
                        }
                    );
                }
            });

            $('#owner_id', vmbox_html).change(function() {
                winkstart.request(true, 'user.get', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        user_id: $(this).val()
                    },
                    function(data, status) {
                        if('timezone' in data.data) {
                            $('#timezone', vmbox_html).val(data.data.timezone);
                        }
                    }
                );
            });

            $('.vmbox-save', vmbox_html).click(function(ev) {
                ev.preventDefault();

                winkstart.validate.is_valid(THIS.config.validation, vmbox_html, function() {
                        if('field_data' in data) {
                            delete data.field_data;
                        }

                        THIS.save_vmbox(form2object('vmbox-form'), data, parent);
                    },
                    function() {
                        alert('There were errors on the form, please correct!');
                    }
                );
            });

            $('.vmbox-delete', vmbox_html).click(function(ev) {
                ev.preventDefault();

                THIS.delete_vmbox(data, parent);
            });

            $('#vmbox-view', parent)
                .empty()
                .append(vmbox_html);
        },

        render_list: function(_parent) {
            var THIS = this,
                parent = _parent || $('#vmbox-content');

            winkstart.request(true, 'vmbox.list', {
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function(data, status) {
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

                    $('#vmbox-listpanel', parent)
                        .empty()
                        .listpanel({
                            label: 'Voicemail Boxes',
                            identifier: 'vmbox-listview',
                            new_entity_label: 'Add Voicemail Box',
                            data: map_crossbar_data(data.data),
                            publisher: winkstart.publish,
                            notifyMethod: 'vmbox.edit',
                            notifyCreateMethod: 'vmbox.edit',
                            notifyParent: parent
                        });
                }
            );
        },

        activate: function(parent) {
            var THIS = this,
                vmbox_html = THIS.templates.vmbox.tmpl();

            (parent || $('#ws-content'))
                .empty()
                .append(vmbox_html);

            THIS.render_list(vmbox_html);
        }
    }
);
