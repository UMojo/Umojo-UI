winkstart.module('voip', 'timeofday',
    {
        css: [
            'css/timeofday.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            timeofday: 'tmpl/timeofday.html',
            editTimeofday: 'tmpl/edit.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'timeofday.activate' : 'activate',
            'timeofday.list-panel-click' : 'editTimeofday',
            'timeofday.edit-timeofday' : 'editTimeofday'
        },

        formData: {
            wdays: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            day: [
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
                "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
            ],
            cycle: [{
                id: 'weekly',
                value: 'Weekly'
            }, {
                id: 'monthly',
                value:'Monthly'
            }, {
                id: 'yearly',
                value:'Yearly'
            }/*, {
                id: 'date',
                value: 'Date'
            }*/
            ],
            ordinals: [
                {id: 'first', value: 'First'},
                {id: 'second', value: 'Second'},
                {id: 'third', value: 'Third'},
                {id: 'fourth', value: 'Fourth'},
                {id: 'last', value: 'Last'}
            ],
            months: [
                {id: 1, value: 'January'},
                {id: 2, value: 'February'},
                {id: 3, value: 'March'},
                {id: 4, value: 'April'},
                {id: 5, value: 'May'},
                {id: 6, value: 'June'},
                {id: 7, value: 'July'},
                {id: 8, value: 'August'},
                {id: 9, value: 'September'},
                {id: 10, value: 'October'},
                {id: 11, value: 'November'},
                {id: 12, value: 'December'}
            ]
        },

        validation : [
            {name: '#name', regex: /^[a-zA-Z0-9\s_]+$/} 
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "timeofday.list": {
                url: '{api_url}/accounts/{account_id}/temporal_rules',
                contentType: 'application/json',
                verb: 'GET'
            },
            "timeofday.get": {
                url: '{api_url}/accounts/{account_id}/temporal_rules/{timeofday_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "timeofday.create": {
                url: '{api_url}/accounts/{account_id}/temporal_rules',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "timeofday.update": {
                url: '{api_url}/accounts/{account_id}/temporal_rules/{timeofday_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "timeofday.delete": {
                url: '{api_url}/accounts/{account_id}/temporal_rules/{timeofday_id}',
                contentType: 'application/json',
                verb: 'DELETE'
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
            label: 'Time Of Day',
            icon: 'timeofday',
            weight: '25'
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

        saveTimeofday: function(timeofday_id, form_data) {
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
                if (timeofday_id) {
                    /* EDIT */
                    rest_data.timeofday_id = timeofday_id;
                    winkstart.postJSON('timeofday.update', rest_data, function (json, xhr) {
                        /* Refresh the list and the edit content */
                        THIS.renderList();
                        THIS.editTimeofday({
                            id: timeofday_id
                        });
                    });
                } else {
                    /* CREATE */

                    /* Actually send the JSON data to the server */
                    winkstart.putJSON('timeofday.create', rest_data, function (json, xhr) {
                        THIS.renderList();
                        THIS.editTimeofday({
                            id: json.data.id
                        });
                    });
                }
            } else {
                alert('Please correct errors that you have on the form.');
            }
        },
        /*
         * Create/Edit timeofday properties (don't pass an ID field to cause a create instead of an edit)
         */
        editTimeofday: function(data){
            $('#timeofday-view').empty();
            var THIS = this;

            var form_data = {
                data : {
                    time_window_start: 0,
                    time_window_stop: 0,
                    //cycle: 'weekly',
                    wdays: [],
                    days: []
                },
                field_data: THIS.config.formData
            };

            if (data && data.id) {
            /* This is an existing timeofday - Grab JSON data from server for timeofday_id */
                winkstart.getJSON('timeofday.get', {
                    crossbar: true,
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url,
                    timeofday_id: data.id
                    }, function(json, xhr) {
                        $.extend(true, form_data, json);
                        THIS.renderTimeofday(form_data);
                });
            } else {
                /* This is a new timeofday - pass along empty params */
                THIS.renderTimeofday(form_data);
            }
        },

        deleteTimeofday: function(timeofday_id) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: winkstart.apps['voip'].account_id,
                api_url: winkstart.apps['voip'].api_url,
                timeofday_id: timeofday_id
            };

            /* Actually send the JSON data to the server */
            winkstart.deleteJSON('timeofday.delete', rest_data, function (json, xhr) {
                THIS.renderList();
                $('#timeofday-view').empty();
            });
        },
        cleanFormData: function(form_data) {
            var wdays = [],
                times = form_data.time.split(';');

            $.each(form_data.wdays, function(i, val) {
                if(val) {
                    // Check for spelling ;)
                    if(val == 'wednesday') {
                        val = 'wensday';
                    }
                    wdays.push(val);
                }
            });
    
            if($('#checkbox_date_type').attr('checked') == 'checked') {
                form_data.days = form_data.day;
                delete form_data.wdays;
                delete form_data.ordinal;
            } else {
                form_data.wdays = wdays;
                delete form_data.days;
            }

            delete form_data.day;
            delete form_data.type_day;
            delete form_data.time;
            form_data.time_window_start = times[0];
            form_data.time_window_stop = times[1];

            if($('#cycle').val() != 'weekly') {
                delete form_data.time_window_start;
                delete form_data.time_window_stop;
            }
            
            return form_data;
        },

        /**
         * Draw timeofday fields/template and populate data, add validation. Works for both create & edit
         */
        renderTimeofday: function(form_data){
            var THIS = this,
                timeofday_id = form_data.data.id,
                wday;

            // Check for spelling ;)
            if((wday = $.inArray('wensday', form_data.data.wdays)) > -1) {
                form_data.data.wdays[wday] = 'wednesday';
            }

            /* Paint the template with HTML of form fields onto the page */
            var form = THIS.templates.editTimeofday.tmpl(form_data).appendTo( $('#timeofday-view') );

            winkstart.cleanForm();

            /* Initialize form field validation */
            THIS.validateForm();

            $("ul.settings1").tabs("div.pane > div");
            $("ul.settings2").tabs("div.advanced_pane > div");
            $("#name").focus();

            $(".advanced_pane").hide();
            $(".advanced_tabs_wrapper").hide();

            $('#hours_slider').hide();
            $('#days_checkbox').hide();
            $('#ordinal_day').hide();
            $('#month_picker').hide();
            $('#date_picker').hide();
            $('#day_fixed').hide();
            $('#type_date').hide();
           
            $('#checkbox_date_type').click(function() {
                if($(this).attr('checked')) {
                    $('#days_checkbox').hide();
                    $('#ordinal_day').hide();
                    $('#day_fixed').show();
                } else {
                    $('#day_fixed').hide();
                    $('#days_checkbox').show();
                    $('#ordinal_day').show();
                }
            });
            
            if(timeofday_id == undefined) {
                $('#days_checkbox').show();
                $('#hours_slider').show();
            } else {
                if(form_data.data.cycle == "monthly") {
                    $('#days_checkbox').show();
                    $('#ordinal_day').show();
                } else if(form_data.data.cycle == "yearly") {
                    $('#month_picker').show();
                    $('#type_date').show();
                    if(form_data.data.days != undefined && form_data.data.days[0] != undefined) {
                        $('#day_fixed').show();
                        $('#checkbox_date_type').attr('checked', 'true');
                    } else {
                        $('#days_checkbox').show();
                        $('#ordinal_day').show();
                    }
                } else if(form_data.data.cycle == "date") {
                    $('#date_picker').show();
                } else if(form_data.data.cycle = "weekly") {
                    $('#hours_slider').show();
                    $('#days_checkbox').show();
                }
            }

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

            $("#time", form).slider({
                from: 0,
                to: 86400,
                step: 900,
                dimension: '',
                scale: ['12:00am', '1:00am', '2:00am', '3:00am', '4:00am', '5:00am', 
                        '6:00am', '7:00am', '8:00am',  '9:00am', '10:00am', '11:00am', 
                        '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm',
                        '6:00pm', '7:00pm', '8:00pm', '9:00pm', '10:00pm', '11:00pm', '12:00am'],
                limits: false,
                calculate: function(val) {
                    var hours = Math.floor(val / 3600 ),
                        mins = (val - hours * 3600) / 60,
                        meridiem = (hours < 12) ? 'am' : 'pm';

                    hours = hours % 12;                    

                    if (hours == 0)
                        hours = 12;

                    return hours + ":" + (mins ? mins : '0' + mins)  + meridiem;
                },
                onstatechange: function () {}
            });
            
            $('#cycle').change(function(event) {
                    $('#date_picker', '#timeofday-form').hide();
                    $('#ordinal_day', '#timeofday-form').hide();
                    $('#month_picker', '#timeofday-form').hide();
                    $('#type_date', '#timeofday-form').hide();
                    $('#day_fixed', '#timeofday-form').hide();
                    $('#hours_slider', '#timeofday-form').hide();
                    $('#days_checkbox', '#timeofday-form').hide();
                if($(this).val() == 'weekly') {
                    $('#hours_slider', '#timeofday-form').show();
                    $('#days_checkbox', '#timeofday-form').show();
                } else if($(this).val() == 'yearly') {
                    $('#type_date', '#timeofday-form').show();
                    $('#month_picker', '#timeofday-form').show();
                    if($('#checkbox_date_type').attr('checked') == 'checked') {
                        $('#day_fixed').show();
                    } else {
                        $('#days_checkbox').show();
                        $('#ordinal_day').show();
                    }
                } else if($(this).val() == 'monthly') {
                    $('#days_checkbox').show();
                    $('#ordinal_day').show();
                } else if($(this).val() == 'date') {
                    $('#date_picker').show();
                }
            });

            /* Listen for the submit event (i.e. they click "save") */
            $('.timeofday-save').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                /* Grab all the form field data */
                var form_data = form2object('timeofday-form');
                form_data = THIS.cleanFormData(form_data); 

                THIS.saveTimeofday(timeofday_id, form_data);

                return false;
            });

            $('.timeofday-cancel').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                $('#timeofday-view').empty();

                return false;
            });

            $('.timeofday-delete').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                THIS.deleteTimeofday(timeofday_id);

                return false;
            });

            //$('#day').datepicker();

            $.each($('body').find('*[tooltip]'), function(){
                $(this).tooltip({attach:'body'});
            });
        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        renderList: function(){
            var THIS = this;

            winkstart.getJSON('timeofday.list', {
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
                        var answer;
                        a.title.toLowerCase() < b.title.toLowerCase() ? answer = -1 : answer = 1;
                        return answer;
                    });

                    return new_list;
                }

                var options = {};
                options.label = 'Time of Day Module';
                options.identifier = 'timeofday-module-listview';
                options.new_entity_label = 'Time of Day';
                options.data = map_crossbar_data(json.data);
                options.publisher = winkstart.publish;
                options.notifyMethod = 'timeofday.list-panel-click';
                options.notifyCreateMethod = 'timeofday.edit-timeofday';  /* Edit with no ID = Create */

                $("#timeofday-listpanel").empty();
                $("#timeofday-listpanel").listpanel(options);

            });
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            this.templates.timeofday.tmpl({}).appendTo( $('#ws-content') );

            winkstart.loadFormHelper('forms');

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Time of Day Route Management',
                module: this.__module
            });

            $('.edit-timeofday').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var timeofday_id = target.getAttribute('rel');
                    winkstart.publish('timeofday.edit-timeofday', {
                        'timeofday_id' : timeofday_id
                    });
                }
            });

            THIS.renderList();
        }
    }
);
