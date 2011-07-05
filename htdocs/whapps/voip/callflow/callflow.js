winkstart.module('voip', 'callflow',
    {
        css: [
            'css/callflow.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            callflow: 'tmpl/callflow.html',
            editCallflow: 'tmpl/edit.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'callflow.activate' : 'activate',
            'callflow.list-panel-click' : 'editCallflow',
            'callflow.edit-callflow' : 'editCallflow'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "callflow.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'GET'
            },
            "callflow.get": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "callflow.create": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/callflows',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "callflow.update": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "callflow.delete": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/callflows/{callflow_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Callflows'
        });
    },

    {
        saveCallflow: function(callflow_id, form_data) {
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
                if (callflow_id) {
                    /* EDIT */
                    rest_data.callflow_id = callflow_id;
                    winkstart.postJSON('callflow.update', rest_data, function (json, xhr) {
                        /* Refresh the list and the edit content */
                        THIS.renderList();
                        THIS.editCallflow({
                            id: callflow_id
                        });
                    });
                } else {
                    /* CREATE */

                    /* Actually send the JSON data to the server */
                    winkstart.putJSON('callflow.create', rest_data, function (json, xhr) {
                        THIS.renderList();
                        THIS.editCallflow({
                            id: json.data.id
                        });
                    });
                }
            } else {
                alert('Please correct errors that you have on the form.');
            }
        },

        /*
         * Create/Edit callflow properties (don't pass an ID field to cause a create instead of an edit)
         */
        editCallflow: function(data){
            $('#callflow-view').empty();
            var THIS = this;
            var form_data = {
                data : {
                    'caller-id' : {external : {}, internal : {}},
                    media : {audio : {codecs : []}, video : {codecs : []}},
                    sip : {}
                }
            };
            
            form_data.field_data = THIS.config.formData;


            if (data && data.id) {
                /* This is an existing callflow - Grab JSON data from server for callflow_id */
                winkstart.getJSON('callflow.get', {
                    crossbar: true,
                    account_id: MASTER_ACCOUNT_ID,
                    callflow_id: data.id
                }, function(json, xhr) {
                    /* On success, take JSON and merge with default/empty fields */
                    $.extend(true, form_data, json);

                    THIS.renderCallflow(form_data);
                });
            } else {
                /* This is a new callflow - pass along empty params */
                THIS.renderCallflow(form_data);
            }
            
        },

        deleteCallflow: function(callflow_id) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: MASTER_ACCOUNT_ID,
                callflow_id: callflow_id
            };

            /* Actually send the JSON data to the server */
            winkstart.deleteJSON('callflow.delete', rest_data, function (json, xhr) {
                THIS.renderList();
                $('#callflow-view').empty();
            });
        },

        /**
         * Draw callflow fields/template and populate data, add validation. Works for both create & edit
         */
        renderCallflow: function(form_data){
            var THIS = this;
            var callflow_id = form_data.data.id;

            /* Paint the template with HTML of form fields onto the page */
            THIS.templates.editCallflow.tmpl(form_data).appendTo( $('#callflow-view') );

            winkstart.cleanForm();

            /* Initialize form field validation */
            THIS.validateForm();

            $("ul.settings1").tabs("div.pane > div");
            $("ul.settings2").tabs("div.advanced_pane > div");

            /* Listen for the submit event (i.e. they click "save") */
            $('.callflow-save').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                /* Grab all the form field data */
                var form_data = form2object('callflow-form');

                THIS.saveCallflow(callflow_id, form_data);

                return false;
            });

            $('.callflow-cancel').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                $('#callflow-view').empty();

                return false;
            });

            $('.callflow-delete').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                THIS.deleteCallflow(callflow_id);

                return false;
            });
        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        renderList: function(){
            var THIS = this;

            winkstart.getJSON('callflow.list', {
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
                                title: elem.id
                            });
                        });
                    }
                    return new_list;
                }

                var options = {};
                options.label = 'Callflow Module';
                options.identifier = 'callflow-module-listview';
                options.new_entity_label = 'Callflow';
                options.data = map_crossbar_data(json.data);
                options.publisher = winkstart.publish;
                options.notifyMethod = 'callflow.list-panel-click';
                options.notifyCreateMethod = 'callflow.edit-callflow';  /* Edit with no ID = Create */

                $("#callflow-listpanel").empty();
                $("#callflow-listpanel").listpanel(options);

            });
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            this.templates.callflow.tmpl({}).appendTo( $('#ws-content') );

            winkstart.loadFormHelper('forms');

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Callflow Management',
                module: this.__module
            });

            $('.edit-callflow').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var callflow_id = target.getAttribute('rel');
                    winkstart.publish('callflow.edit-callflow', {
                        'callflow_id' : callflow_id
                    });
                }
            });

            THIS.renderList();
        }
    }
);
