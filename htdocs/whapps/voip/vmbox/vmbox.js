winkstart.module('voip', 'vmbox',
    {
        css: [
            'css/vmbox.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            vmbox: 'tmpl/vmbox.html',
            editVmbox: 'tmpl/edit.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'vmbox.activate' : 'activate',
            'vmbox.list-panel-click' : 'editVmbox',
            'vmbox.edit-vmbox' : 'editVmbox'
        },

        formData: {
                    timezones: [{text: 'GMT', value: 'Africa/Ouagadougou'}, {text:'GMT+1 (ECT)', value: 'Europe/Brussels'}, {text: 'GMT+2 (EET)', value: 'Europe/Minsk'},
                                {text: 'GMT+3 (EAT)', value: 'Asia/Bahrain'},{text: 'GMT+3:30 (MET)', value: 'Asia/Tehran'},{text: 'GMT+4 (NET)', value: 'Indian/Mauritius'},{text: 'GMT+5 (PLT)', value: 'Asia/Aqtobe'}, 
                                {text: 'GMT+5:30 (IST)', value: 'Asia/Kolkata'},{text: 'GMT+6 (BST)', value: 'Indian/Chagos'},{text: 'GMT+7 (VST)', value: 'Asia/Jakarta'},{text: 'GMT+8 (CTT)', value: 'Asia/Brunei'}, 
                                {text: 'GMT+9 (JST)', value: 'Asia/Tokyo'},{text: 'GMT+9:30 (ACT)', value: 'Australia/Adelaide'},{text: 'GMT+10 (AET)', value: 'Asia/Yakutsk'},{text: 'GMT+11 (SST)', value: 'Pacific/Ponape'}, 
                                {text: 'GMT+12 (NST)', value: 'Pacific/Fiji'},{text: 'GMT-11 (MIT)', value: 'Pacific/Midway'},{text: 'GMT-10 (HST)', value: 'Pacific/Rarotonga'},{text: 'GMT-9 (AST)', value: 'Pacific/Gambier'}, 
                                {text: 'GMT-8 (PST)', value: 'America/Whitehorse'},{text: 'GMT-7 (MST)', value: 'America/Edmonton'},{text: 'GMT-6 (CST)', value: 'America/Swift_Current'},{text: 'GMT-5 (EST)', value: 'America/Thunder_Bay'}, 
                                {text: 'GMT-4 (PRT)', value: 'America/La_Paz'},{text: 'GMT-3:30 (CNT)', value: 'America/St_Johns'},{text: 'GMT-3 (AGT)', value: 'America/Sao_Paulo'},{text: 'GMT-2', value: 'America/Noronha'},{text: 'GMT-1 (CAT)', value: 'Atlantic/Cape_Verde'}
                               ],
        },

        validation : [
                {name : '#mailbox', regex : /^[0-9]+$/},
                {name : '#pin', regex : /^[0-9]+$/},
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "vmbox.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/vmboxes',
                contentType: 'application/json',
                verb: 'GET'
            },
            "vmbox.get": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "vmbox.create": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/vmboxes',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "vmbox.update": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "vmbox.delete": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Voicemail Boxes',
            icon: 'vmbox'
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

        saveVmbox: function(vmbox_id, form_data) {
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
                if (vmbox_id) {
                    /* EDIT */
                    rest_data.vmbox_id = vmbox_id;
                    winkstart.postJSON('vmbox.update', rest_data, function (json, xhr) {
                        /* Refresh the list and the edit content */
                        THIS.renderList();
                        THIS.editVmbox({
                            id: vmbox_id
                        });
                    });
                } else {
                    /* CREATE */

                    /* Actually send the JSON data to the server */
                    winkstart.putJSON('vmbox.create', rest_data, function (json, xhr) {
                        THIS.renderList();
                        THIS.editVmbox({
                            id: json.data.id
                        });
                    });
                }
            } else {
                alert('Please correct errors that you have on the form.');
            }
        },

        /*
         * Create/Edit vmbox properties (don't pass an ID field to cause a create instead of an edit)
         */
        editVmbox: function(data){
            $('#vmbox-view').empty();
            var THIS = this;
            var form_data = {
                data: {},   
                field_data: THIS.config.formData,
                value: {}
            };

            if (data && data.id) {
                /* This is an existing vmbox - Grab JSON data from server for vmbox_id */
                winkstart.getJSON('vmbox.get', {
                    crossbar: true,
                    account_id: MASTER_ACCOUNT_ID,
                    vmbox_id: data.id
                }, function(json, xhr) {
                    /* On success, take JSON and merge with default/empty fields */
                    $.extend(true, form_data, json);

                    THIS.renderVmbox(form_data);
                });
            } else {
                /* This is a new vmbox - pass along empty params */
                THIS.renderVmbox(form_data);
            }
            
        },

        deleteVmbox: function(vmbox_id) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: MASTER_ACCOUNT_ID,
                vmbox_id: vmbox_id
            };

            /* Actually send the JSON data to the server */
            winkstart.deleteJSON('vmbox.delete', rest_data, function (json, xhr) {
                THIS.renderList();
                $('#vmbox-view').empty();
            });
        },

        /**
         * Draw vmbox fields/template and populate data, add validation. Works for both create & edit
         */
        renderVmbox: function(form_data){
            var THIS = this;
            var vmbox_id = form_data.data.id;
            
            /* Paint the template with HTML of form fields onto the page */
            THIS.templates.editVmbox.tmpl(form_data).appendTo( $('#vmbox-view') );

            winkstart.cleanForm();

            /* Initialize form field validation */
            THIS.validateForm();

            $("ul.settings1").tabs("div.pane > div");
            $("ul.settings2").tabs("div.advanced_pane > div");
            $("#name").focus();

            /* Listen for the submit event (i.e. they click "save") */
            $('.vmbox-save').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                /* Grab all the form field data */
                var form_data = form2object('vmbox-form');
                THIS.saveVmbox(vmbox_id, form_data);

                return false;
            });

            $('.vmbox-cancel').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                $('#vmbox-view').empty();

                return false;
            });

            $('.vmbox-delete').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                THIS.deleteVmbox(vmbox_id);

                return false;
            });
        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        renderList: function(){
            var THIS = this;

            winkstart.getJSON('vmbox.list', {
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
                options.label = 'Voicemail Boxes Module';
                options.identifier = 'vmbox-module-listview';
                options.new_entity_label = 'Voicemail Box';
                options.data = map_crossbar_data(json.data);
                options.publisher = winkstart.publish;
                options.notifyMethod = 'vmbox.list-panel-click';
                options.notifyCreateMethod = 'vmbox.edit-vmbox';  /* Edit with no ID = Create */

                $("#vmbox-listpanel").empty();
                $("#vmbox-listpanel").listpanel(options);

            });
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            this.templates.vmbox.tmpl({}).appendTo( $('#ws-content') );

            winkstart.loadFormHelper('forms');

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Voicemail Boxes Management',
                module: this.__module
            });

            $('.edit-vmbox').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var vmbox_id = target.getAttribute('rel');
                    winkstart.publish('vmbox.edit-vmbox', {
                        'vmbox_id' : vmbox_id
                    });
                }
            });

            THIS.renderList();
        }
    }
);
