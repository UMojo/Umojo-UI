winkstart.module('voip', 'account',
    {
        css: [
            'css/account.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            account: 'tmpl/account.html',
            editAccount: 'tmpl/edit.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'account.activate' : 'activate',
            'account.list-panel-click' : 'editAccount',
            'account.edit-account' : 'editAccount'
        },

        formData: {
        },

        validation : [
                {name : '#name', regex : /^.+$/},
                {name : '#realm', regex : /^[0-9a-zA-Z\.]+$/},
                {name : '#caller_id_name_external', regex : /^.*$/},
                {name : '#caller_id_number_external', regex : /^[\+]?[0-9]*$/},
                {name : '#caller_id_name_internal', regex : /^.*$/},
                {name : '#caller_id_number_internal', regex : /^[\+]?[0-9]*$/},
                {name : '#vm_to_email_support_number', regex : /^[0-9]*$/},
                {name : '#vm_to_email_support_email', regex : /^(([a-zA-Z0-9_\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4}))*$/},
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "account.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/',
                contentType: 'application/json',
                verb: 'GET'
            },
            "account.get": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "account.create": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "account.update": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "account.delete": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Accounts',
            icon: 'account'
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

        saveAccount: function(account_id, form_data) {
            var THIS = this;

            /* Check validation before saving */
            THIS.validateForm('save');

            if(!$('.invalid').size()) {
                /* Construct the JSON we're going to send */
                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.data = form_data;

                /* Is this a create or edit? See if there's a known ID */
                if (account_id) {
                    /* EDIT */
                    rest_data.account_id = account_id;
                    winkstart.postJSON('account.update', rest_data, function (json, xhr) {
                        /* Refresh the list and the edit content */
                        THIS.renderList();
                        THIS.editAccount({
                            id: account_id
                        });
                    });
                } else {
                    /* CREATE */

                    /* Actually send the JSON data to the server */
                    winkstart.putJSON('account.create', rest_data, function (json, xhr) {
                        THIS.renderList();
                        THIS.editAccount({
                            id: json.data.id
                        });
                    });
                }
            } else {
                alert('Please correct errors that you have on the form.');
            }
        },

        /*
         * Create/Edit account properties (don't pass an ID field to cause a create instead of an edit)
         */
        editAccount: function(data){
            $('#account-view').empty();
            var THIS = this;
            var form_data = {
                data: { caller_id: { internal: { }, external: {} }, vm_to_email: {}},   
                field_data: THIS.config.formData,
                value: {}
            };

            if (data && data.id) {
                /* This is an existing account - Grab JSON data from server for account_id */
                winkstart.getJSON('account.get', {
                    crossbar: true,
                    account_id: data.id,
                }, function(json, xhr) {
                    /* On success, take JSON and merge with default/empty fields */
                    $.extend(true, form_data, json);

                    THIS.renderAccount(form_data);
                });
            } else {
                /* This is a new account - pass along empty params */
                THIS.renderAccount(form_data);
            }
            
        },

        deleteAccount: function(account_id) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: account_id
            };

            /* Actually send the JSON data to the server */
            winkstart.deleteJSON('account.delete', rest_data, function (json, xhr) {
                THIS.renderList();
                $('#account-view').empty();
            });
        },

        /**
         * Draw account fields/template and populate data, add validation. Works for both create & edit
         */
        renderAccount: function(form_data){
            var THIS = this;
            var account_id = form_data.data.id;
            
            /* Paint the template with HTML of form fields onto the page */
            THIS.templates.editAccount.tmpl(form_data).appendTo( $('#account-view') );
            winkstart.cleanForm();

            /* Initialize form field validation */
            THIS.validateForm();

            $("ul.settings1").tabs("div.pane > div");
            $("ul.settings2").tabs("div.advanced_pane > div");
            $('#name').focus();
            
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

            /* Listen for the submit event (i.e. they click "save") */
            $('.account-save').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                /* Grab all the form field data */
                var form_data = form2object('account-form');
                THIS.saveAccount(account_id, form_data);

                return false;
            });

            $('.account-cancel').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                $('#account-view').empty();

                return false;
            });
            
            $('.account-switch').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                if(confirm('Do you really want to use : '+form_data.data.name+'\'s account?')) {
                    MASTER_ACCOUNT_ID = form_data.data.id;
                    alert('You\'re now using '+form_data.data.name+'\'s account');
                }
                else {
                    alert('Ok you were just clicking on this button because you have nothing more interesting to do, gotcha');
                } 
 
                return false;
            });

            $('.account-delete').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();
                
                THIS.deleteAccount(account_id);

                return false;
            });
        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        renderList: function(){
            var THIS = this;

            winkstart.getJSON('account.list', {
                crossbar: true
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
                options.label = 'Accounts Module';
                options.identifier = 'account-module-listview';
                options.new_entity_label = 'Account';
                options.data = map_crossbar_data(json.data);
                options.publisher = winkstart.publish;
                options.notifyMethod = 'account.list-panel-click';
                options.notifyCreateMethod = 'account.edit-account';  /* Edit with no ID = Create */

                $("#account-listpanel").empty();
                $("#account-listpanel").listpanel(options);

            });
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            this.templates.account.tmpl({}).appendTo( $('#ws-content') );

            winkstart.loadFormHelper('forms');

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Accounts Management',
                module: this.__module
            });

            $('.edit-account').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var account_id = target.getAttribute('rel');
                    winkstart.publish('account.edit-account', {
                        'account_id' : account_id
                    });
                }
            });

            THIS.renderList();
        }
    }
);
