winkstart.module('indesign', 'monitor',
    /* Start module resource definitions */
    {
        css: [
            'css/monitor.css'
        ],

        templates: {
            index: 'tmpl/index.html',
            arrows: 'tmpl/arrows.html',
            dns: 'tmpl/dns.html',
            call_director: 'tmpl/call_director.html',
            media_server: 'tmpl/media_server.html',
            call_manager: 'tmpl/call_manager.html',
            messaging_bus: 'tmpl/messaging_bus.html',
            whapps: 'tmpl/whapps.html',
            database: 'tmpl/database.html'
        },

        subscribe: {
            'monitor.activate' : 'activate'
        },

        resources: {
        }
    }, // End module config definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Cluster Monitor'
        });
    }, // End initialization routine



    /* Define the functions for this module */
    {

        /*
         * Display DNS servers
         */
        refreshDNS: function() {
            var THIS = this;

            THIS.templates.dns.tmpl().appendTo( $('#dns') );
        },

        refreshCallDirector: function() {
            var THIS = this;

            servers = [
                {
                    hostname : 'opensips001.clusterA.2600hz.com',
                    provider : 'Amazon EC2',
                    location : 'Dallas',
                    state : 'active'
                }
            ];

            THIS.templates.call_director.tmpl( servers ).appendTo( $('#call_director') );
            THIS.templates.arrows.tmpl( { more_items : true } ).appendTo( $('#call_director_arrows') );
            THIS.templates.arrows.tmpl( { more_items : true } ).appendTo( $('#call_director_arrows') );
            THIS.templates.arrows.tmpl( { more_items : true } ).appendTo( $('#call_director_arrows') );
        },

        refreshMediaServer: function() {
            var THIS = this;

            THIS.templates.media_server.tmpl().appendTo( $('#media_server') );
            THIS.templates.arrows.tmpl().appendTo( $('#media_server_arrows') );
        },

        refreshCallManager: function() {
            var THIS = this;

            THIS.templates.call_manager.tmpl().appendTo( $('#call_manager') );
        },

        refreshMessagingBus: function() {
            var THIS = this;

            THIS.templates.messaging_bus.tmpl().appendTo( $('#messaging_bus') );
        },

        refreshWhApps: function() {
            var THIS = this;

            THIS.templates.whapps.tmpl().appendTo( $('#whapps') );
        },

        refreshDatabase: function() {
            var THIS = this;

            THIS.templates.database.tmpl().appendTo( $('#database') );
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

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Cluster Monitor',
                module: this.__module
            });

            THIS.refreshDNS();
            THIS.refreshCallDirector();
            THIS.refreshMediaServer();
            THIS.refreshCallManager();
            THIS.refreshMessagingBus();
            THIS.refreshWhApps();
            THIS.refreshDatabase();

        }
    } // End function definitions

);  // End module
