winkstart.module('voip', 'device',
    {
        css: [
            'css/device.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            device: 'tmpl/device.html',
            editDevice: 'tmpl/edit.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'device.activate' : 'activate',
            'device.list-panel-click' : 'editDevice',
            'device.edit-device' : 'editDevice'
        },

        formData: {
                    status_types: [{value: 'Enabled'}, {value:'Disabled'}],
                    auth_methods: [{value: 'Password'}, {value:'IP Address'}],
                    invite_formats: [{value: 'Username'}, {value:'NPANXXXXX'}, {value:'E. 164'}],
                    bypass_media_types: [{value: 'Automatic'}, {value:'Never'}, {value:'Always'}],
                    media_audio_codecs: [
                            {field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G729', value: 'G729', caption: '8kbps (Requires License)'},
                            {field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G711u / PCMU', value: 'PCMU', caption: '64kbps (North America)'},
                            {field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G711a / PCMA', value: 'PCMA', caption: '64kbps (Elsewhere)'},
                            {field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G722 (HD) @ 16kHz', value: 'G722_16', caption: '48kbps'},
                            {field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G722_32G722.1 (HD) @ 32kHz', value: 'G722_32', caption: '56kbps'},
                            {field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'Siren (HD) @ 48kHz', value: 'CELT_48', caption: '56kbps'},
                            {field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'Siren (HD) @ 64kHz', value: 'CELT_64', caption: '64kbps'}
                    ],
                    media_video_codecs: [
                            {field_id:'media_video_codecs', field_name: 'media.video.codecs[]', field_label: 'H261', value: 'H261', caption: 'H261'},
                            {field_id:'media_video_codecs', field_name: 'media.video.codecs[]', field_label: 'H263', value: 'H263', caption: 'H263'},
                            {field_id:'media_video_codecs', field_name: 'media.video.codecs[]', field_label: 'H264', value: 'H264', caption: 'H264'}
                    ],
                    media_fax_codecs: [{value: 'Auto-Detect'}, {value:'Always Force'}, {value:'Disabled'}]
        },

        validation : [
                {name : '#name', regex : /^\w+$/},
                {name : '#mac_address', regex : /^[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}$/},
                {name : '#caller_id_name_internal', regex : /^.*$/},
                {name : '#caller_id_number_internal', regex : /^[\+]?[0-9]*$/},
                {name : '#caller_id_name_external', regex : /^.*$/},
                {name : '#caller_id_number_external', regex : /^[\+]?[0-9]*$/},
                {name : '#sip_realm', regex : /^[0-9A-Za-z\-\.\:]+$/},
                {name : '#sip_username', regex : /^[^\s]+$/},
                {name : '#sip_password', regex : /^[^\s]+$/},
                {name : '#sip_expire_seconds', regex : /^[0-9]+$/}
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "device.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices',
                contentType: 'application/json',
                verb: 'GET'
            },
            "device.get": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices/{device_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "device.create": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "device.update": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices/{device_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "device.delete": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices/{device_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            "user.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/users',
                contentType: 'application/json',
                verb: 'GET'
            }         
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Devices',
            icon: 'device'
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

        saveDevice: function(device_id, form_data) {
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
                if (device_id) {
                    /* EDIT */
                    rest_data.device_id = device_id;
                    winkstart.postJSON('device.update', rest_data, function (json, xhr) {
                        /* Refresh the list and the edit content */
                        THIS.renderList();
                        THIS.editDevice({
                            id: device_id
                        });
                    });
                } else {
                    /* CREATE */

                    /* Actually send the JSON data to the server */
                    winkstart.putJSON('device.create', rest_data, function (json, xhr) {
                        THIS.renderList();
                        THIS.editDevice({
                            id: json.data.id
                        });
                    });
                }
            } else {
                alert('Please correct errors that you have on the form.');
            }
        },

        /*
         * Create/Edit device properties (don't pass an ID field to cause a create instead of an edit)
         */
        editDevice: function(data){
            $('#device-view').empty();
            var THIS = this;
            var form_data = {
                data : {
                    caller_id : {default : {}, emergency : {}},
                    media : {audio : {codecs : []}, video : {codecs : []}, fax: {codecs: []}},
                    sip : {}
                }
            };
            
            form_data.field_data = THIS.config.formData;
            form_data.field_data.users = [];
            winkstart.getJSON('user.list', {crossbar: true, account_id: MASTER_ACCOUNT_ID}, function (json, xhr) {
                    var listUsers = []; 
                    if(json.data.length > 0) {
                        _.each(json.data, function(elem){
                            var title = elem.first_name + ' ' + elem.last_name;
                            listUsers.push({
                                owner_id: elem.id,
                                title: title
                            });
                        });
                        form_data.field_data.users = listUsers;
                }
                if (data && data.id) {
                /* This is an existing device - Grab JSON data from server for device_id */
                winkstart.getJSON('device.get', {
                    crossbar: true,
                    account_id: MASTER_ACCOUNT_ID,
                    device_id: data.id
                }, function(json, xhr) {
                    /* On success, take JSON and merge with default/empty fields */
                    $.extend(true, form_data, json);
                    console.log(form_data);
                    THIS.renderDevice(form_data);
                });
                } else {
                /* This is a new device - pass along empty params */
                //console.log(form_data);
                THIS.renderDevice(form_data);
                }                

            });
            
        },

        deleteDevice: function(device_id) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: MASTER_ACCOUNT_ID,
                device_id: device_id
            };

            /* Actually send the JSON data to the server */
            winkstart.deleteJSON('device.delete', rest_data, function (json, xhr) {
                THIS.renderList();
                $('#device-view').empty();
            });
        },
        cleanFormData: function(form_data) {
            var audioCodecs = [];
            var videoCodecs = [];
            $.each(form_data.media.audio.codecs, function(index, obj) {
                if(obj)
                {
                    audioCodecs.push(obj);
                }
            });
            $.each(form_data.media.video.codecs, function(index, obj) {
                if(obj)
                {
                    videoCodecs.push(obj);
                }
            });
            form_data.media.audio.codecs = audioCodecs;
            form_data.media.video.codecs = videoCodecs;
            return form_data;
        },

        /**
         * Draw device fields/template and populate data, add validation. Works for both create & edit
         */
        renderDevice: function(form_data){
            var THIS = this;
            var device_id = form_data.data.id;

            /* Paint the template with HTML of form fields onto the page */
            THIS.templates.editDevice.tmpl(form_data).appendTo( $('#device-view') );

            winkstart.cleanForm();

            /* Initialize form field validation */
            THIS.validateForm();

            $("ul.settings1").tabs("div.pane > div");
            $("ul.settings2").tabs("div.advanced_pane > div");

            /* Listen for the submit event (i.e. they click "save") */
            $('.device-save').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                /* Grab all the form field data */
                var form_data = form2object('device-form');
                
                form_data = THIS.cleanFormData(form_data); 

                THIS.saveDevice(device_id, form_data);

                return false;
            });

            $('.device-cancel').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                $('#device-view').empty();

                return false;
            });

            $('.device-delete').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                THIS.deleteDevice(device_id);

                return false;
            });
        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        renderList: function(){
            var THIS = this;

            winkstart.getJSON('device.list', {
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
                options.label = 'Device Module';
                options.identifier = 'device-module-listview';
                options.new_entity_label = 'Device';
                options.data = map_crossbar_data(json.data);
                options.publisher = winkstart.publish;
                options.notifyMethod = 'device.list-panel-click';
                options.notifyCreateMethod = 'device.edit-device';  /* Edit with no ID = Create */

                $("#device-listpanel").empty();
                $("#device-listpanel").listpanel(options);

            });
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            this.templates.device.tmpl({}).appendTo( $('#ws-content') );

            winkstart.loadFormHelper('forms');

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Device Management',
                module: this.__module
            });

            $('.edit-device').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var device_id = target.getAttribute('rel');
                    winkstart.publish('device.edit-device', {
                        'device_id' : device_id
                    });
                }
            });

            THIS.renderList();
        }
    }
);
