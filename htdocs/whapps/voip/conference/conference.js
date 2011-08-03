winkstart.module('voip', 'conference', {
    css: [
    'css/style.css'
    ],

    templates: {
        conference: 'tmpl/conference.html',
        editConference: 'tmpl/edit.html',
    },

    subscribe: {
        'conference.activate' : 'activate',
        'conference.list-panel-click' : 'editConference',
        'conference.create-conference' : 'createConference',
        'conference.edit-conference' : 'editConference'
    },

    formData: {
    },
    
    resources: {
        "conference.list": {
            url: winkstart.apps['voip'].api_url + '/accounts/{account_id}/conferences',
            contentType: 'application/json',
            verb: 'GET'
        },
        "conference.get": {
            url: winkstart.apps['voip'].api_url + '/accounts/{account_id}/conferences/{conference_id}',
            contentType: 'application/json',
            verb: 'GET'
        },
        "conference.create": {
            url: winkstart.apps['voip'].api_url + '/accounts/{account_id}/conferences',
            contentType: 'application/json',
            verb: 'PUT'
        },
        "conference.update": {
            url: winkstart.apps['voip'].api_url + '/accounts/{account_id}/conferences/{conference_id}',
            contentType: 'application/json',
            verb: 'POST'
        },
        "conference.delete": {
            url: winkstart.apps['voip'].api_url + '/accounts/{account_id}/conferences/{conference_id}',
            contentType: 'application/json',
            verb: 'DELETE'
        },
        "user.list": {
            url: winkstart.apps['voip'].api_url + '/accounts/{account_id}/users',
            contentType: 'application/json',
            verb: 'GET'
        }
    },
    validation: [
        {name: '#name', regex: /^.*$/},
        {name: '#member_pins', regex: /^[0-9]+$/},
        {name: '#moderator_pins', regex: /^[0-9]+$/}
    ],
},
function(args) {
    /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
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
    saveConference: function(conference_id, form_data) {
            var THIS = this;

            /* Check validation before saving */
            THIS.validateForm('save');

            if(!$('.invalid').size()) {
                /* Construct the JSON we're going to send */
                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.account_id = winkstart.apps['voip'].account_id;
                rest_data.data = form_data;

                /* Is this a create or edit? See if there's a known ID */
                if (conference_id) {
                    /* EDIT */
                    rest_data.conference_id = conference_id;
                    winkstart.postJSON('conference.update', rest_data, function (json, xhr) {
                        /* Refresh the list and the edit content */
                        THIS.renderList();
                        THIS.editConference({
                            id: conference_id
                        });
                    });
                } else {
                    /* CREATE */

                    /* Actually send the JSON data to the server */
                    winkstart.putJSON('conference.create', rest_data, function (json, xhr) {
                        THIS.renderList();
                        THIS.editConference({
                            id: json.data.id
                        });
                    });
                }
            } else {
                alert('Please correct errors that you have on the form.');
            }
        },
        /*
         * Create/Edit conference properties (don't pass an ID field to cause a create instead of an edit)
         */
        editConference: function(data){
            $('#conference-view').empty();
            var THIS = this;
            var form_data = {
                data: { moderator_play_name: "true", member_play_name: "true", member: {pins:[]}, moderator: {pins:[]}, conference_numbers:[]},
            };

            form_data.field_data = THIS.config.formData;
            form_data.field_data.users = [];
            winkstart.getJSON('user.list', {crossbar: true, account_id: winkstart.apps['voip'].account_id}, function (json, xhr) {
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
                /* This is an existing conference - Grab JSON data from server for conference_id */
                winkstart.getJSON('conference.get', {
                    crossbar: true,
                    account_id: winkstart.apps['voip'].account_id,
                    conference_id: data.id
                }, function(json, xhr) {
                    /* On success, take JSON and merge with default/empty fields */
                    $.extend(true, form_data, json);
                    THIS.renderConference(form_data);
                });
                } else {
                /* This is a new conference - pass along empty params */
                THIS.renderConference(form_data);
                }

            });

        },
         deleteConference: function(conference_id) {
            var THIS = this;

            var rest_data = {
                crossbar: true,
                account_id: winkstart.apps['voip'].account_id,
                conference_id: conference_id
            };

            /* Actually send the JSON data to the server */
            winkstart.deleteJSON('conference.delete', rest_data, function (json, xhr) {
                THIS.renderList();
                $('#conference-view').empty();
            });
        },
        renderConference: function(form_data){
            var THIS = this;
            var conference_id = form_data.data.id;

            /* Paint the template with HTML of form fields onto the page */
            THIS.templates.editConference.tmpl(form_data).appendTo( $('#conference-view') );

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
            $('.conference-save').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                /* Grab all the form field data */
                var form_data = form2object('conference-form');

                THIS.saveConference(conference_id, form_data);

                return false;
            });

            $('.conference-cancel').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                $('#conference-view').empty();

                return false;
            });

            $('.conference-delete').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                THIS.deleteConference(conference_id);

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

            winkstart.getJSON('conference.list', {
                crossbar: true,
                account_id: winkstart.apps['voip'].account_id
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
                        var answer;
                        a.title.toLowerCase() < b.title.toLowerCase() ? answer = -1 : answer = 1;
                        return answer;
                    });

                    return new_list;
                }

                var options = {};
                options.label = 'Conference Module';
                options.identifier = 'conference-module-listview';
                options.new_entity_label = 'Conference';
                options.data = map_crossbar_data(json.data);
                options.publisher = winkstart.publish;
                options.notifyMethod = 'conference.list-panel-click';
                options.notifyCreateMethod = 'conference.edit-conference';  /* Edit with no ID = Create */

                $("#conference-listpanel").empty();
                $("#conference-listpanel").listpanel(options);

            });
        },
        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            this.templates.conference.tmpl({}).appendTo( $('#ws-content') );

            winkstart.loadFormHelper('forms');

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Conference Management',
                module: this.__module
            });

            $('.edit-conference').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var conference_id = target.getAttribute('rel');
                    winkstart.publish('conference.edit-conference', {
                        'conference_id' : conference_id
                    });
                }
            });

            THIS.renderList();
        }
    }
);
