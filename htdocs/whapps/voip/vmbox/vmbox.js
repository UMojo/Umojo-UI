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

        validation : [
                {name : '#name', regex: /^[a-zA-Z0-9\s_']+$/},
                {name : '#mailbox', regex : /^[0-9]+$/},
                {name : '#pin', regex : /^[0-9]+$/},
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "vmbox.list": {
                url: '{api_url}/accounts/{account_id}/vmboxes',
                contentType: 'application/json',
                verb: 'GET'
            },
            "vmbox.get": {
                url: '{api_url}/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "vmbox.create": {
                url: '{api_url}/accounts/{account_id}/vmboxes',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "vmbox.update": {
                url: '{api_url}/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "vmbox.delete": {
                url: '{api_url}/accounts/{account_id}/vmboxes/{vmbox_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            "user.list": {
                url: '{api_url}/accounts/{account_id}/users',
                contentType: 'application/json',
                verb: 'GET'
            },
            "user.get": {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
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
            label: 'Voicemail Boxes',
            icon: 'vmbox',
            weight: '30'
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
                rest_data.account_id = winkstart.apps['voip'].account_id;
                rest_data.api_url = winkstart.apps['voip'].api_url;
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
                data: { require_pin: true, check_if_owner: true, media: {}},   
                //field_data: THIS.config.formData,
                field_data: {},
                value: {}
            };

            form_data.field_data.users = [];
            form_data.field_data.medias = [];
            winkstart.getJSON('media.list', {crossbar: true, account_id: winkstart.apps['voip'].account_id, api_url: winkstart.apps['voip'].api_url}, function (json, xhr) {
                var listMedias = [];
                listMedias.push({media_id: '', title: '- Not set -'});
                if(json.data.length > 0) {
                    _.each(json.data, function(elem){
                        var title = elem.name;
                        listMedias.push({
                            media_id: elem.id,
                            title: title
                        });
                    });
                }
                form_data.field_data.medias = listMedias;

                winkstart.getJSON('user.list', {crossbar: true, account_id: winkstart.apps['voip'].account_id, api_url: winkstart.apps['voip'].api_url}, function (json, xhr) {
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
                    } else {
                        listUsers.push({owner_id: '!', title: 'none'});
                        form_data.field_data.users = listUsers;
                    }
                     if (data && data.id) {
                        /* This is an existing vmbox - Grab JSON data from server for vmbox_id */
                        winkstart.getJSON('vmbox.get', {
                            crossbar: true,
                            account_id: winkstart.apps['voip'].account_id,
                            api_url: winkstart.apps['voip'].api_url,
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

                    $.each($('body').find('*[tooltip]'), function(){
                        $(this).tooltip({attach:'body'});
                    });
                });
            });
        },

        deleteVmbox: function(vmbox_id) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: winkstart.apps['voip'].account_id,
                api_url: winkstart.apps['voip'].api_url,
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
            var THIS = this,
                vmbox_id = form_data.data.id,
                vmbox_html;
            
            /* Paint the template with HTML of form fields onto the page */
            vmbox_html = THIS.templates.editVmbox.tmpl(form_data).appendTo( $('#vmbox-view') );
            winkstart.timezone.populate_dropdown($('#timezone', vmbox_html), form_data.data.timezone);

            winkstart.cleanForm();

            /* Initialize form field validation */
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

            $('#owner_id', '#vmbox-view').change(function() { 
                winkstart.getJSON('user.get', {
                    crossbar: true,
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url,
                    user_id: $('#owner_id').val()
                }, function(json, xhr) {
                    $('#timezone', '#vmbox-view').val(json.data.timezone);
                });
            });

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

            $.each($('body').find('*[tooltip]'), function(){
                $(this).tooltip({attach:'body'});
            });
        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        renderList: function(){
            var THIS = this;

            winkstart.getJSON('vmbox.list', {
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
                        var answer = 1;
                        if(a.title == undefined) a.title = 'undefined';
                        if(b.title == undefined) b.title = 'undefined';
                        a.title.toLowerCase() < b.title.toLowerCase() ? answer = -1 : answer = 1;
                        return answer;
                    });

                    return new_list;
                }

                var options = {};
                options.label = 'Voicemail Boxes Module';
                options.identifier = 'vmbox-module-listview';
                options.new_entity_label = 'Add Voicemail Box';
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
