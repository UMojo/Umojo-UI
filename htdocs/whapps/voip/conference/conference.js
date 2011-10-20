winkstart.module('voip', 'conference', {
        css: [
            'css/style.css'
        ],

        templates: {
            conference: 'tmpl/conference.html',
            edit: 'tmpl/edit.html'
            //conference_callflow: 'tmpl/conference_callflow.html'
        },

        subscribe: {
            'conference.activate': 'activate',
            'conference.edit': 'edit_conference',
        },

        resources: {
            'conference.list': {
                url: '{api_url}/accounts/{account_id}/conferences',
                contentType: 'application/json',
                verb: 'GET'
            },
            'conference.get': {
                url: '{api_url}/accounts/{account_id}/conferences/{conference_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'conference.create': {
                url: '{api_url}/accounts/{account_id}/conferences',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'conference.update': {
                url: '{api_url}/accounts/{account_id}/conferences/{conference_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'conference.delete': {
                url: '{api_url}/accounts/{account_id}/conferences/{conference_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            'user.list': {
                url: '{api_url}/accounts/{account_id}/users',
                contentType: 'application/json',
                verb: 'GET'
            }
        },

        validation: [
            { name: '#name', regex: /^.+$/ },
            { name: '#member_pins', regex: /^[a-z0-9A-Z]*$/ },
            { name: '#conference_numbers', regex: /^[0-9]+$/ },
            { name: '#moderator_pins', regex: /^[a-z0-9A-Z]*$/ }
        ]
    },
    function(args) {
        var THIS = this;

        winkstart.registerResources(this.__whapp, this.config.resources);

        winkstart.publish('subnav.add', {
            whapp: 'voip',
            module: this.__module,
            label: 'Conferences',
            icon: 'conference',
            weight: '05'
        });
    },
    {	
        get_pin_number: function(start_pin) {
            var finalPinMember = '';
            
            $.each(start_pin, function(index, value) {
                if(!(isNaN(value))) {
                    finalPinMember += value;
                } else {
                    if(value.match(/^[aAbBcC]$/)) {
                        finalPinMember += 2
                    } else if(value.match(/^[dDeEfF]$/)) {
                        finalPinMember += 3
                    } else if(value.match(/^[gGhHiI]$/)) {
                        finalPinMember += 4
                    } else if(value.match(/^[jJkKlL]$/)) {
                        finalPinMember += 5
                    } else if(value.match(/^[mMnNoO]$/)) {
                        finalPinMember += 6
                    } else if(value.match(/^[pPqQrRsS]$/)) {
                        finalPinMember += 7
                    } else if(value.match(/^[tTuUvV]$/)) {
                        finalPinMember += 8
                    } else if(value.match(/^[wWxXyYzZ]$/)) {
                        finalPinMember += 9
                    }
                }
            })
            
            return finalPinMember;
        },

        save_conference: function(form_data, data, success, error) {
            var THIS = this;

            if(typeof data.data == 'object' && data.data.id) {
                winkstart.request(true, 'conference.update', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        conference_id: data.data.id,
                        data: $.extend(true, {}, data.data, form_data)
                    },
                    function(_data, status) {
                        if(typeof success == 'function') {
                            success(_data, status, 'update');
                        }
                    },
                    function(_data, status) {
                        if(typeof error == 'function') {
                            error(_data, status, 'update');
                        }
                    }
                );
            }
            else {
                winkstart.request(true, 'conference.create', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        data: form_data
                    },
                    function(_data, status) {
                        if(typeof success == 'function') {
                            success(_data, status, 'create');
                        }
                    },
                    function(_data, status) {
                        if(typeof error == 'function') {
                            error(_data, status, 'create');
                        }
                    }
                );
            }
        },

        edit_conference: function(data, _parent, _target, _callbacks){
            var THIS = this,
                parent = _parent || $('#conference-content'),
                target = _target || $('#conference-view', parent),
                _callbacks = _callbacks || {},
                callbacks = {
                    save_success: _callbacks.save_success || function(_data) {
                        THIS.render_list(parent);

                        THIS.edit_conference({ id: _data.data.id }, parent, target, callbacks);
                    },
                    
                    save_error: _callbacks.save_error,

                    delete_success: _callbacks.delete_success || function() {
                        target.empty(),
        
                        THIS.render_list(parent);
                    },
            
                    delete_error: _callbacks.delete_error,

                    after_render: _callbacks.after_render
                },
                defaults = {
                    data: {
                        moderator_play_name: true, 
                        member_play_name: true, 
                        member: { pins: [] }, 
                        moderator: { pins: [] }, 
                        conference_numbers: []
                    },
                    field_data: {
                        users: [],
                    }
                };
                
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

                    if(typeof data == 'object' && data.id) {
                        winkstart.request(true, 'conference.get', {
                                account_id: winkstart.apps['voip'].account_id,
                                api_url: winkstart.apps['voip'].api_url,
                                conference_id: data.id
                            },
                            function(_data, status) {
                                THIS.render_conference($.extend(true, defaults, _data), target, callbacks);

                                if(typeof callbacks.after_render == 'function') {
                                    callbacks.after_render();
                                }
                            }
                        );
                    }
                    else {
                        THIS.render_conference(defaults, target, callbacks);

                        if(typeof callbacks.after_render == 'function') {
                            callbacks.after_render();            
                        } 
                    }                            
                }
            );
        },

        delete_conference: function(data, success, error) {
            var THIS = this;

            if(data.data.id) {
                winkstart.request(true, 'conference.delete', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        conference_id: data.data.id
                    },
                    function(_data, status) {
                        if(typeof success == 'function') {
                            success(_data, status);
                        } 
                    },
                    function(_data, status) {
                        if(typeof error == 'function') {
                            error(_data, status);
                        }
                    }
                );
            }                     
        },

        render_conference: function(data, target, callbacks){
            var THIS = this,
                conference_html = THIS.templates.edit.tmpl(data);

            winkstart.validate.set(THIS.config.validation, conference_html);

            $('*[tooltip]', conference_html).each(function() {
                $(this).tooltip({ attach: conference_html });
            });

            $('ul.settings1', conference_html).tabs($('.pane > div', conference_html));
            $('ul.settings2', conference_html).tabs($('.advanced_pane > div', conference_html));

            $('#name', conference_html).focus();
            
            $('.advanced_pane', conference_html).hide();
            $('.advanced_tabs_wrapper', conference_html).hide();

            $('#advanced_settings_link', conference_html).click(function() {
                if($(this).attr('enabled') === 'true') {
                    $(this).attr('enabled', 'false');
                    $('.advanced_pane', conference_html).slideToggle(function() {
                        $('.advanced_tabs_wrapper', conference_html).animate({width: 'toggle'});
                    });
                }
                else {
                    $(this).attr('enabled', 'true');

                    $('.advanced_tabs_wrapper', conference_html).animate({width: 'toggle'}, function() {
                        $('.advanced_pane', conference_html).slideToggle();
                    });
                }
            });

            $('.conference-save', conference_html).click(function(ev) {
                ev.preventDefault();
            
                winkstart.validate.is_valid(THIS.config.validation, conference_html, function() {
                        var form_data = form2object('conference-form');

                        THIS.clean_form_data(form_data);
    
                        if('field_data' in data) {
                            delete data.field_data;
                        }
        
                        THIS.save_conference(form_data, data, callbacks.save_success, callbacks.save_error);
                    },
                    function() {
                        alert('There were errors on the form, please correct!');
                    }
                );
            });

            $('.conference-delete', conference_html).click(function(ev) {
                ev.preventDefault();

                THIS.delete_conference(data, callbacks.delete_success, callbacks.delete_error);
            });
            
            (target)
                .empty()
                .append(conference_html);
        },

        clean_form_data: function(form_data){
            var THIS = this;

            if(form_data.member.pins[0] != '') { 
                form_data.member.pins[0] = THIS.get_pin_number(form_data.member.pins[0].split(''));
            }
            else {
                delete form_data.member;
            }

            if(form_data.moderator.pins[0] != '') {
                form_data.moderator.pins[0] = THIS.get_pin_number(form_data.moderator.pins[0].split(''));
            } 
            else {
                delete form_data.moderator;   
            }

            return form_data;
        },

        render_list: function(parent){
            var THIS = this;

            winkstart.request(true, 'conference.list', {
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
                                    title: val.name || '(name)'
                                });
                            });
                        }
                    
                        new_list.sort(function(a, b) {
                            return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
                        });

                        return new_list;
                };

                $('#conference-listpanel', parent) 
                    .empty()
                    .listpanel({
                        label: 'Conferences',
                        identifier: 'conference-listview',
                        new_entity_label: 'Add Conference',
                        data: map_crossbar_data(data.data),
                        publisher: winkstart.publish,
                        notifyMethod: 'conference.edit',
                        notifyCreateMethod: 'conference.edit',
                        notifyParent: parent
                    });
               });
        },
               
        activate: function(parent) {
            var THIS = this,
                conference_html = THIS.templates.conference.tmpl();

            (parent || $('#ws-content'))
                .empty()
                .append(conference_html);

            THIS.render_list(conference_html);
        }
    }
);
