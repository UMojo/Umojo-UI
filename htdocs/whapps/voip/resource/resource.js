winkstart.module('voip', 'resource',
    {
        css: [
            'css/resource.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            resource: 'tmpl/resource.html',
            editResource: 'tmpl/edit.html',
            gateway: 'tmpl/gateway.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'resource.activate' : 'activate',
            'resource.list-panel-click' : 'editResource',
            'resource.edit-resource' : 'editResource'
        },

        formData: {
             invite_format: [{value: 'Username'}, {value:'NPANXXXXX'}, {value:'E. 164'}],
             caller_id_options_type: [{value: 'external'}, {value:'internal'}, {value:'emergency'}],
                    codecs: [{field_id:'gateway_codecs', field_name: 'gateways[0].codecs[]', field_label: 'G729', value: 'G729', caption: 'G729 - 8kbps (Requires License)'},
                            {field_id:'gateway_codecs', field_name: 'gateways[0].codecs[]', field_label: 'G711u / PCMU', value: 'PCMU', caption: 'G711u / PCMU - 64kbps (North America)'},
                            {field_id:'gateway_codecs', field_name: 'gateways[0].codecs[]', field_label: 'G711a / PCMA', value: 'PCMA', caption: 'G711a / PCMA - 64kbps (Elsewhere)'},
                            {field_id:'gateway_codecs', field_name: 'gateways[0].codecs[]', field_label: 'G722 (HD) @ 16kHz', value: 'G722_16', caption: 'G722 (HD) @ 16kHz'},
                            {field_id:'gateway_codecs', field_name: 'gateways[0].codecs[]', field_label: 'G722_32G722.1 (HD) @ 32kHz', value: 'G722_32', caption: 'G722_32G722.1 (HD) @ 32 kHz'},
                            {field_id:'gateway_codecs', field_name: 'gateways[0].codecs[]', field_label: 'Siren (HD) @ 48kHz', value: 'CELT_48', caption: 'Siren (HD) @ 48kHz'},
                            {field_id:'gateway_codecs', field_name: 'gateways[0].codecs[]', field_label: 'Siren (HD) @ 64kHz', value: 'CELT_64', caption: 'Siren (HD) @ 64 kHz'}
                    ],
        },

        validation : [
            {name : '#name', regex : /^\w+$/},
            {name : '#weight_cost', regex : /^[0-9]+$/},
            {name : '#rules', regex : /^.*$/},
            {name : '#flags', regex : /^.*$/},
            {name : '#caller_id_options_type', regex : /^\w*$/},
            {name : '#gateways_server', regex : /^[0-9A-Za-z\-\.\:\_]+$/},
            {name : '#gateways_realm', regex : /^[0-9A-Za-z\-\.\:\_]+$/},
            {name : '#gateways_username', regex : /^\w+$/},
            {name : '#gateways_password', regex : /^[^\s]*$/},
            {name : '#gateways_prefix', regex : /^[\+]?[\#0-9]*$/},
            {name : '#gateways_suffix', regex : /^[0-9]*$/},
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            'local_resource.list': {
                url: '{api_url}/accounts/{account_id}/local_resources',
                contentType: 'application/json',
                verb: 'GET'
            },
            'local_resource.get': {
                url: '{api_url}/accounts/{account_id}/local_resources/{resource_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'local_resource.create': {
                url: '{api_url}/accounts/{account_id}/local_resources',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'local_resource.update': {
                url: '{api_url}/accounts/{account_id}/local_resources/{resource_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'local_resource.delete': {
                url: '{api_url}/accounts/{account_id}/local_resources/{resource_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            'global_resource.list': {
                url: '{api_url}/accounts/{account_id}/global_resources',
                contentType: 'application/json',
                verb: 'GET'
            },
            'global_resource.get': {
                url: '{api_url}/accounts/{account_id}/global_resources/{resource_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'global_resource.create': {
                url: '{api_url}/accounts/{account_id}/global_resources',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'global_resource.update': {
                url: '{api_url}/accounts/{account_id}/global_resources/{resource_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'global_resource.delete': {
                url: '{api_url}/accounts/{account_id}/global_resources/{resource_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            'account.get': {
                url: '{api_url}/accounts/{account_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.__whapp, this.config.resources);

        winkstart.publish('subnav.add', {
            whapp: 'voip',
            module: this.__module,
            label: 'Resources',
            icon: 'resource',
            weight: '35'
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

        saveResource: function(resource_id, type, form_data) {
            var THIS = this;
                
            /* Check validation before saving */
            THIS.validateForm('save');

            if(!$('.invalid').size()) {
                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.account_id = winkstart.apps['voip'].account_id;
                rest_data.api_url = winkstart.apps['voip'].api_url;
                rest_data.data = form_data;

                /* Is this a create or edit? See if there's a known ID */
                if (resource_id) {
                    /* EDIT */
                    rest_data.resource_id = resource_id;
                    winkstart.postJSON(type + '_resource.update', rest_data, function (json, xhr) {
                        /* Refresh the list and the edit content */
                        THIS.renderList();
                        THIS.editResource({
                            id: resource_id,
                            type: type
                        });
                    });
                } else {
                    /* CREATE */

                    winkstart.putJSON(type + '_resource.create', rest_data, function (json, xhr) {
                        THIS.renderList();
                        THIS.editResource({
                            id: json.data.id,
                            type: type
                        });
                    });
                }
            } else {
                alert('Please correct errors that you have on the form.');
            }
        },
        //Function to generate random usernames and passwords
        generateRandomString: function(pLength){
            var chars = '0123456789ABCDEFGHIJKLMNPQRSTUVWXTZabcdefghiklmnpqrstuvwxyz';
            var sRandomString = '';
            for (var i=0; i<pLength; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                sRandomString += chars.substring(rnum,rnum+1);
            }
            return sRandomString;
        },
        /*
         * Create/Edit resource properties (don't pass an ID field to cause a create instead of an edit)
         */
        editResource: function(data){
            $('#resource-view').empty();
            var THIS = this;

            var generatedUsername = 'user_' + THIS.generateRandomString(6);
            var generatedPassword = THIS.generateRandomString(12);
            

            winkstart.getJSON('account.get', {crossbar: true, account_id: winkstart.apps['voip'].account_id, api_url: winkstart.apps['voip'].api_url}, function(json, xhr) {
                var account_realm = json.data.realm;

                var form_data = {
                    data: { weight_cost: '100', enabled: true, gateways: [{ realm: account_realm, username: generatedUsername, password: generatedPassword, prefix: '+1',  codecs: ['PCMU', 'PCMA']}], rules: [], caller_id_options: { type: 'external'}, flags: []},
                    field_data: THIS.config.formData,
                    value: {}
                };

                if (data && data.id && data.type) {
                    form_data = {
                        data: { gateways: [{ codecs: []}], rules: [], caller_id_options: {}, flags: []},
                        field_data: THIS.config.formData,
                        value: {},
                        type: data.type
                    };
                    winkstart.getJSON(data.type + '_resource.get', {
                        crossbar: true,
                        account_id: winkstart.apps['voip'].account_id,
                        api_url: winkstart.apps['voip'].api_url,
                        resource_id: data.id
                    }, function(json, xhr) {
                        $.extend(true, form_data, json);
                        if(form_data.data.gateways[0].codecs == undefined) {
                            form_data.data.gateways[0].codecs = {};
                        }
                        THIS.renderResource(form_data);
                    });
                } else {
                    if(!('admin' in winkstart.apps['voip']) || !winkstart.apps['voip'].admin) {
                       form_data.type = 'local'; 
                    }

                    THIS.renderResource(form_data);
                }

            });
        },

        deleteResource: function(resource_id, type) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: winkstart.apps['voip'].account_id,
                api_url: winkstart.apps['voip'].api_url,
                resource_id: resource_id
            };

            /* Actually send the JSON data to the server */
            winkstart.deleteJSON(type + '_resource.delete', rest_data, function (json, xhr) {
                THIS.renderList();
                $('#resource-view').empty();
            });
        },

        /**
         * Draw resource fields/template and populate data, add validation. Works for both create & edit
         */
        renderResource: function(form_data){
            var THIS = this,
                resource_id = form_data.data.id,
                type = form_data.type || 'local';

            /* Paint the template with HTML of form fields onto the page */
            THIS.templates.editResource.tmpl(form_data).appendTo( $('#resource-view') );
            $.each(form_data.data.gateways, function(i, obj) {
                THIS.templates.gateway.tmpl({data: this, field_data: form_data.field_data, index: i}).appendTo($('#resource-view #gateways'));
            });

            winkstart.cleanForm();

            /* Initialize form field validation */
            THIS.validateForm();

            $('ul.settings1').tabs('div.pane > div');
            $('ul.settings2').tabs('div.advanced_pane > div');
            $('#name').focus();

            $('.advanced_pane').hide();
            $('.advanced_tabs_wrapper').hide();

            $('#advanced_settings_link').click(function(event) {
                if($(this).attr('enabled')=='true') {
                    $(this).attr('enabled', 'false');
                    $('.advanced_pane').slideToggle(function(event) {
                        $('.advanced_tabs_wrapper').animate({width: 'toggle'});
                    });
                }
                else {
                    $(this).attr('enabled', 'true');
                    $('.advanced_tabs_wrapper').animate({width: 'toggle'}, function(event) {
                        $('.advanced_pane').slideToggle();
                    });
                }
            });

            /* Listen for the submit event (i.e. they click 'save') */
            $('.resource-save').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                /* Grab all the form field data */
                var form_data = form2object('resource-form');

                if(!resource_id) {
                    type = form_data.type;
                }

                form_data = THIS.cleanFormData(form_data);
                THIS.saveResource(resource_id, type, form_data);

                return false;
            });

            $('.resource-cancel').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                $('#resource-view').empty();

                return false;
            });

            $('.resource-delete').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                THIS.deleteResource(resource_id, type);

                return false;
            });

            $.each($('body').find('*[tooltip]'), function(){
                $(this).tooltip({attach:'body'});
            });
        },

        list_local_resources: function(callback) {
            winkstart.getJSON('local_resource.list', {
                    crossbar: true,
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function(data, status) {
                    if(typeof callback == 'function') {
                        callback(data);
                    }
                }
            );
        },

        list_global_resources: function(callback) {
            winkstart.getJSON('global_resource.list', {
                    crossbar: true,
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url
                },
                function(data, status) {
                    if(typeof callback == 'function') {
                        callback(data);
                    }
                }
            );
        },

        renderList: function(){
            var THIS = this,
                setup_list = function (local_data, global_data) {
                    var resources;
                    function map_crossbar_data(crossbar_data, type){
                        var new_list = [];
                        if(crossbar_data.length > 0) {
                            _.each(crossbar_data, function(elem){
                                new_list.push({
                                    id: elem.id,
                                    title: elem.name,
                                    type: type
                                });
                            });
                        }

                        return new_list;
                    }

                    var options = {};
                    options.label = 'Resources Module';
                    options.identifier = 'resource-module-listview';
                    options.new_entity_label = 'Add Resource';

                    resources = [].concat(map_crossbar_data(local_data, 'local'), map_crossbar_data(global_data, 'global'));
                    resources.sort(function(a, b) {
                        var answer;
                        a.title.toLowerCase() < b.title.toLowerCase() ? answer = -1 : answer = 1;
                        return answer;
                    });

                    options.data = resources;
                    options.publisher = winkstart.publish;
                    options.notifyMethod = 'resource.list-panel-click';
                    options.notifyCreateMethod = 'resource.edit-resource';  /* Edit with no ID = Create */

                    $('#resource-listpanel').empty();
                    $('#resource-listpanel').listpanel(options);
                };

            if('admin' in winkstart.apps['voip'] && winkstart.apps['voip'].admin === true) {
                THIS.list_global_resources(function(global_data) {
                    THIS.list_local_resources(function(local_data) {
                        setup_list(local_data.data, global_data.data);
                    });
                });
            }
            else {
                THIS.list_local_resources(function(local_data) {
                    setup_list(local_data.data, []);
                });
            }
        },
        cleanFormData: function(form_data) {
            var audioCodecs;

            if('type' in form_data) {
                delete form_data.type;
            }
            
            $.each(form_data.gateways, function(indexGateway, gateway) {
                audioCodecs = [];
                $.each(gateway.codecs, function(indexCodec, codec) {
                    if(codec)
                    {
                        audioCodecs.push(codec);
                    }    
                });
                form_data.gateways[indexGateway].codecs = audioCodecs;
            });
            
            return form_data;
        },
        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            this.templates.resource.tmpl({}).appendTo( $('#ws-content') );

            winkstart.loadFormHelper('forms');

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Resources Management',
                module: this.__module
            });

            $('.edit-resource').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var resource_id = target.getAttribute('rel');
                    winkstart.publish('resource.edit-resource', {
                        'resource_id' : resource_id
                    });
                }
            });

            THIS.renderList();
        }
    }
);
