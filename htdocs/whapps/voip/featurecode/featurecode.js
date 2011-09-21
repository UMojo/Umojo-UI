winkstart.module('voip', 'featurecode', {
        css: [
            'css/featurecode.css'
        ],

        templates: {
            featurecode: 'tmpl/featurecode.html',
       },

        subscribe: {
            'featurecode.activate' : 'activate',
            'featurecode.define_featurecodes': 'define_featurecodes'
        },

        resources: {
            'featurecode.list': {
                url: '{api_url}/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'GET'
            },
            'featurecode.get': {
                url: '{api_url}/accounts/{account_id}/callflows/{featurecode_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'featurecode.create': {
                url: '{api_url}/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'featurecode.update': {
                url: '{api_url}/accounts/{account_id}/callflows/{featurecode_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'featurecode.delete': {
                url: '{api_url}/accounts/{account_id}/callflows/{featurecode_id}',
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
            label: 'Feature Codes',
            icon: 'sip',
            weight: '95'
        });
    },
    {
        actions: {},
        categories: {},

        activate: function () {
            var THIS = this,
                featurecode_html;

            $('#ws-content').empty();
            THIS.categories = {};
            THIS.actions = {};
            winkstart.publish('featurecode.define_featurecodes', THIS.actions);

            $.each(THIS.actions, function(i, data) {
                this.tag = i;
                this.number = data.number == undefined ? data.default_number : data.number;
                if('category' in data) {
                    data.category in THIS.categories ? true : THIS.categories[data.category] = [];
                    THIS.categories[data.category].push(data);
                }
            });
            
            winkstart.getJSON('featurecode.list', {
                    crossbar: true, 
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function(data, status) {
                    $.each(data.data, function() {
                        if('featurecode' in this && this.featurecode != false) {
                            if(this.featurecode.name in THIS.actions) {
                                THIS.actions[this.featurecode.name].id = this.id;
                                THIS.actions[this.featurecode.name].enabled = true;
                                THIS.actions[this.featurecode.name].number = this.featurecode.number;
                            }  
                        }
                    });
                    var data = {'categories': THIS.categories, 'label':'data' };
                    $('#ws-content').empty();
                    var featurecode_html = THIS.templates.featurecode.tmpl(data).appendTo($('#ws-content'));

                    $('.featurecode_number', featurecode_html).bind('blur keyup focus', function(){
                        var action_wrapper = $(this).parents('.action_wrapper');

                        action_wrapper.dataset('number', $(this).val());
                        
                        if($(this).val() != THIS.actions[action_wrapper.dataset('action')].number) {
                            action_wrapper.addClass('changed');
                        } else {
                            action_wrapper.removeClass('changed');
                        }
                    });

                    $('.featurecode_enabled', featurecode_html).change(function() {
                        var action_wrapper = $(this).parents('.action_wrapper');
                        if(!$(this).is(':checked') && action_wrapper.dataset('enabled') == 'true') {
                            action_wrapper.addClass('disabled');
                        } else if($(this).is(':checked') && action_wrapper.dataset('enabled') == 'false'){
                            action_wrapper.addClass('enabled');
                        } else {
                            action_wrapper.removeClass('enabled');
                            action_wrapper.removeClass('disabled');
                        }
                    });

                    /* Listen for the submit event (i.e. they click "save") */
                    $('.featurecode-save', featurecode_html).click(function() {
                        var form_data = THIS.clean_form_data();

                        THIS.update_list_featurecodes(form_data);

                        return false;
                    });
                }
            );
        },
        update_list_featurecodes: function(form_data) {
            console.log(form_data);
            var THIS = this;

            $.each(form_data.created_callflows, function() {
                winkstart.putJSON('featurecode.create', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        featurecode_id: this.id,
                        data: {
                            flow: this.flow,
                            patterns: this.patterns, 
                            featurecode: {
                                name: this.action,
                                number: this.number
                            }
                        }
                    }, 
                    function(data, status) {
                        winkstart.publish('featurecode.activate');
                        //THIS.render_featurecodes();
                    }
                );
            });

            $.each(form_data.updated_callflows, function() {
                winkstart.postJSON('featurecode.update', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        featurecode_id: this.id,
                        data: {
                            flow: this.flow,
                            patterns: this.patterns,
                            featurecode: {
                                name: this.action,
                                number: this.number
                            }
                        }
                    },
                    function(data, status) {
                        winkstart.publish('featurecode.activate');
                        //THIS.render_featurecodes();
                    }
                );
            });


            $.each(form_data.deleted_callflows, function() {
                winkstart.deleteJSON('featurecode.delete', {
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        featurecode_id: this.id
                    },
                    function() {
                        winkstart.publish('featurecode.activate');
                        //THIS.render_featurecodes();
                    }
                );
            });

        },
        render_featurecodes: function() {
            var THIS = this;

            winkstart.getJSON('featurecode.list', {
                    crossbar: true,
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function(data, status) {
                    $.each(data.data, function() {
                        if('featurecode' in this && this.featurecode != false) {
                            if(this.featurecode.name in THIS.actions) {
                                THIS.actions[this.featurecode.name].id = this.id;
                                THIS.actions[this.featurecode.name].enabled = true;
                                THIS.actions[this.featurecode.name].number = this.featurecode.number;
                            }
                        }
                    });
                    var data = {'categories': THIS.categories, 'label':'data' };
                    $('#ws-content').empty();
                    var featurecode_html = THIS.templates.featurecode.tmpl(data).appendTo($('#ws-content'));
            });
        },
        clean_form_data: function() {
            var THIS = this;

            var form_data = { 
                created_callflows: [], 
                deleted_callflows: [], 
                updated_callflows: []
            };

            $('.enabled', '#featurecode-view').each(function() { 
                var callflow = $(this).dataset();
                callflow.flow = {
                    data: THIS.actions[callflow.action].data,
                    module: THIS.actions[callflow.action].module,
                    children: {}
                }; 
                callflow.patterns = [THIS.actions[callflow.action].build_regex(callflow.number)];

                form_data.created_callflows.push(callflow);
            });

            $('.disabled', '#featurecode-view').each(function() {
                var callflow = $(this).dataset();
                form_data.deleted_callflows.push(callflow);
            });
            $('.changed:not(.enabled, .disabled)', '#featurecode-view').each(function() {
                if($(this).dataset('enabled') == 'true') {
                    var callflow = $(this).dataset();
                     callflow.flow = {
                         data: THIS.actions[callflow.action].data,
                         module: THIS.actions[callflow.action].module,
                         children: {}
                     };

                callflow.patterns = [THIS.actions[callflow.action].build_regex(callflow.number)];

                form_data.updated_callflows.push(callflow);
                }
            });

            return form_data;
        },

        construct_action: function(json) {
            var action = [];

            if('data' in json) {
                if('action' in json.data) {
                    action += '{action=' + json.data.action + '}';
                }
            }

            return json.module + action;
        },

        define_featurecodes: function(featurecodes) {
            var THIS = this;
                
            $.extend(featurecodes, {
               'call_forward[action=enable]': {
                    name: 'Enable Call-Forward',
                    icon: 'phone',
                    category: 'Call-Forward',
                    module: 'call_forward',
                    data: {
                        action: 'enable'
                    },
                    enabled: false,
                    default_number: '72',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'call_forward[action=disable]': {
                    name: 'Disable Call-Forward',
                    icon: 'phone',
                    category: 'Call-Forward',
                    module: 'call_forward',
                    data: {
                        action: 'disable'
                    },
                    enabled: false,
                    default_number: '73',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'call_forward[action="toggle"]': {
                    name: 'Toggle Call-Forward',
                    icon: 'phone',
                    category: 'Call-Forward',
                    module: 'call_forward',
                    data: {
                        action: 'toggle'
                    },
                    enabled: false,
                    default_number: '74',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'call_forward[action=on_busy_enable]': {
                    name: 'Enable Call-Forward on Busy',
                    icon: 'phone',
                    category: 'Call-Forward',
                    module: 'call_forward',
                    data: {
                        action: 'on_busy_enable'
                    },
                    enabled: false,
                    default_number: '90',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'call_forward[action=on_busy_disable]': {
                    name: 'Disable Call-Forward on Busy',
                    icon: 'phone',
                    category: 'Call-Forward',
                    module: 'call_forward',
                    data: {
                        action: 'on_busy_disable'
                    },
                    enabled: false,
                    default_number: '91',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'call_forward[action=no_answer_enable]': {
                    name: 'Enable Call-Forward No Answer',
                    icon: 'phone',
                    category: 'Call-Forward',
                    module: 'call_forward',
                    data: {
                        action: 'no_answer_enable'
                    },
                    enabled: false,
                    default_number: '53',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'call_forward[action=no_answer_disable]': {
                    name: 'Disable Call-Forward No Answer',
                    icon: 'phone',
                    category: 'Call-Forward',
                    module: 'call_forward',
                    data: {
                        action: 'no_answer_disable'
                    },
                    enabled: false,
                    default_number: '52',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'donotdisturb[action="enable"]': {
                    name: 'Enable Do not disturb',
                    icon: 'phone',
                    category: 'Do not disturb',
                    module: 'do_not_disturb',
                    data: {
                        action: 'enable'
                    },
                    enabled: false,
                    default_number: '78',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'donotdisturb[action="disable"]': {
                    name: 'Disable Do not disturb',
                    icon: 'phone',
                    category: 'Do not disturb',
                    module: 'do_not_disturb',
                    data: {
                        action: 'disable'
                    },
                    enabled: false,
                    default_number: '79',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'donotdisturb[action="toggle"]': {
                    name: 'Toggle Do not disturb',
                    icon: 'phone',
                    category: 'Do not disturb',
                    module: 'do_not_disturb',
                    data: {
                        action: 'toggle'
                    },
                    enabled: false,
                    default_number: '76',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'directory': {
                    name: 'Directory',
                    icon: 'phone',
                    category: 'Miscellaneous',
                    module: 'directory',
                    data: {
                        action: ''
                    },
                    enabled: false,
                    default_number: '411',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'time': {
                    name: 'Check Time',
                    icon: 'phone',
                    category: 'Miscellaneous',
                    module: 'time',
                    data: {
                        action: ''
                    },
                    enabled: false,
                    default_number: '60',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'call_waiting[action=enable]': {
                    name: 'Enable Call-Waiting',
                    icon: 'phone',
                    category: 'Miscellaneous',
                    module: 'call_waiting',
                    data: {
                        action: 'enable'
                    },
                    enabled: false,
                    default_number: '70',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'call_waiting[action=disable]': {
                    name: 'Disable Call-Waiting',
                    icon: 'phone',
                    category: 'Miscellaneous',
                    module: 'call_waiting',
                    data: {
                        action: 'enable'
                    },
                    enabled: false,
                    default_number: '71',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'hot_desking[action=enable]': {
                    name: 'Enable Hot Desking',
                    icon: 'phone',
                    category: 'Miscellaneous',
                    module: 'hot_desking',
                    data: {
                        action: 'enable'
                    },
                    enabled: false,
                    default_number: '11',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'hot_desking[action=disable]': {
                    name: 'Disable Hot Desking',
                    icon: 'phone',
                    category: 'Miscellaneous',
                    module: 'hot_desking',
                    data: {
                        action: 'disable'
                    },
                    enabled: false,
                    default_number: '12',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'sound_test_service': {
                    name: 'Sound Test Service',
                    icon: 'phone',
                    category: 'Miscellaneous',
                    module: '',
                    data: {
                        action: ''
                    },
                    enabled: false,
                    default_number: '43',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'voicemail[action=check]': {
                    name: 'Check Voicemail',
                    icon: 'phone',
                    category: 'Miscellaneous',
                    module: 'voicemail',
                    data: {
                        action: 'check'
                    },
                    enabled: false,
                    default_number: '97',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                },
                'call_recording': {
                    name: 'Call Recording',
                    icon: 'phone',
                    category: 'Miscellaneous',
                    module: 'call_recording',
                    data: {
                        action: ''
                    },
                    enabled: false,
                    default_number: '1',
                    number: this.default_number,
                    build_regex: function(number) {
                        return '^\\*'+number+'([0-9]*)$';
                    }
                }
            });
        }
    }
);
