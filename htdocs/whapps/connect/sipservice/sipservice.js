winkstart.module('connect', 'sipservice', 
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
            'css/sipservice.css',
            'css/style.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            index: 'tmpl/index.html',        // This is utilized later as THIS.templates.index.tmpl({ data_here})
            main: 'tmpl/main.html',
            main_dids : 'tmpl/main_dids.html',
            main_servers : 'tmpl/main_servers.html',
            main_services : 'tmpl/main_services.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'sipservice.activate' : 'activate'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /*winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'SIP Services'
        });*/

        winkstart.publish('sipservice.activate');
    }, // End initialization routine



    /* Define the functions for this module */
    {
        refreshDIDs: function(numbers) {
            var THIS = this;

            THIS.templates.main_dids.tmpl(numbers).appendTo ( $('#my_numbers') );

        },

        refreshServices: function(services) {
            var THIS = this;

            THIS.templates.main_services.tmpl( services ).appendTo ( $('#my_services') );
        },

        refreshServers: function(servers) {
            THIS.templates.main_servers.tmpl( servers  ).appendTo ( $('#my_servers') );
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
            //THIS.templates.index.tmpl().appendTo( $('#ws-content') );

            // Paint the main screen
            THIS.templates.main.tmpl().appendTo( $('#ws-content') );

            var numbers = {
                
            };

            THIS.refreshDIDs(numbers);

            THIS.refreshServices({ account : { credits : {} } });
            
            THIS.refreshServers({});

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'SIP Services',              // <-- THIS UPDATES THE BREADCRUMB TO SHOW WHERE YOU ARE
                module: this.__module
            });
        }
    } // End function definitions

);  // End module
