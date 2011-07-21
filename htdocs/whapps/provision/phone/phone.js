winkstart.module('provision', 'phone',
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
            'css/style.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            index: 'tmpl/index.html',        // This is utilized later as THIS.templates.index.tmpl({ data_here})
            yealink: 'tmpl/yealink.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'phone.activate' : 'activate',
            'phone.edit' : 'edit_phone',
            'phone.list-panel-click' : 'edit_phone'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "phone.list": {
                url: 'http://www.mysite.com/get_json.php?somevar={some_value}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'phone'
        });

        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);
    }, // End initialization routine



    /* Define the functions for this module */
    {

        edit_phone : function(args) {
            var THIS = this;
            var model = 'yealink';
            var settings = {
                'model' : 'yealink',
                'settings' : { 'ringer_on' : true, 'ringer_type' : 5 }
            };

            // Clear out the section of the screen named phone-view
            $('#phone-view').empty();

            // Go get data from the server
            /*winkstart.getJSON('phone.data',
                // Arguments to pass to the other server, or config parameters on HOW to pass to the server
                {
                    crossbar: true,
                    account_id: MASTER_ACCOUNT_ID,
                    some_value: "blah"
                },

                // What to do on successfully getting JSON
                function (json, xhr) {*/
                    /* Show the phone configuration tool for this template */
                    $('#phone-view').html(THIS.templates[model].tmpl( settings ));
/*                }
            );*/

        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        render_list: function(){
            var THIS = this;

            // Uncomment the below when we start using a real API URL

            json = {};
            json.data = [{ 'id' : '001298391233', 'name' : '00:12:98:39:12:33', 'model' : 'yealink' }];
            /*winkstart.getJSON('phone.list', {
                crossbar: true,
                account_id: MASTER_ACCOUNT_ID
            }, 
            function (json, xhr) {*/

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
                options.label = 'Phone Module';
                options.identifier = 'phone-module-listview';
                options.new_entity_label = 'phone';
                options.data = map_crossbar_data(json.data);
                options.publisher = winkstart.publish;
                options.notifyMethod = 'phone.list-panel-click';
                options.notifyCreateMethod = 'phone.edit';  /* Edit with no ID = Create */

                $("#phone-listpanel").empty();
                $("#phone-listpanel").listpanel(options);

/*            });*/
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            var THIS = this;
            /* Clear out the center part of the window - get ready to put our own content in there */
            $('#ws-content').empty();

            /* Draw our base template into the window */
            THIS.templates.index.tmpl().appendTo( $('#ws-content') );

            winkstart.publish('layout.updateLoadedModule', {
                label: 'phone',
                module: this.__module
            });

            $('.edit_phone').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var phone_id = target.getAttribute('rel');
                    winkstart.publish('phone.edit', {
                        'phone_id' : phone_id
                    });
                }
            });
            
            THIS.render_list();
        }
    } // End function definitions

);  // End module
