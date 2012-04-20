winkstart.module('dashboard', 'monitor',
    /* Start module resource definitions */
    {
        css: [
            'css/monitor.css'
        ],

        templates: {
            index: 'tmpl/index.html',
            server: 'tmpl/server.html',
            arrows: 'tmpl/arrows.html',
            dns: 'tmpl/dns.html',
            whapps: 'tmpl/whapps.html'
        },

        subscribe: {
            'monitor.activate' : 'activate'
        },

        resources: {
        }
    }, // End module config definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
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
                    hostname : 'opensips001.clusterA.',
                    provider : 'Racksapce',
                    location : 'Dallas',
                    state : 'error'
                },
                {
                    hostname : 'opensips002.clusterA.',
                    provider : 'Rackspace',
                    location : 'Dallas',
                    state : 'warning'
                },
                {
                    hostname : 'opensips001.clusterB.',
                    provider : 'EC2 East',
                    location : 'N. Virgina',
                    state : 'active'
                },
                {
                    hostname : 'opensips002.clusterB.',
                    provider : 'EC2 East',
                    location : 'N. Virgina',
                    state : 'active'
                }
            ];

            $(servers).each(function(k, v) {
                THIS.templates.server.tmpl( { type : 'call_director', server : v } ).appendTo( $('#call_director') );
                THIS.templates.arrows.tmpl( { more_items : !(k == servers.length - 1) } ).appendTo( $('#call_director_arrows') );
            });
        },

        refreshMediaServer: function() {
            var THIS = this;


            servers = [
                {
                    hostname : 'fs001.clusterA.',
                    provider : 'Racksapce',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'fs002.clusterA.',
                    provider : 'Rackspace',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'fs003.clusterA.',
                    provider : 'Rackspace',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'fs004.clusterA.',
                    provider : 'Rackspace',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'fs001.clusterB.',
                    provider : 'Rackspace',
                    location : 'Chicago',
                    state : 'active'
                },
                {
                    hostname : 'fs002.clusterB.',
                    provider : 'Rackspace',
                    location : 'Chicago',
                    state : 'active'
                },
                {
                    hostname : 'fs003.clusterB.',
                    provider : 'Rackspace',
                    location : 'Chicago',
                    state : 'active'
                },
                {
                    hostname : 'fs004.clusterB.',
                    provider : 'Rackspace',
                    location : 'Chicago',
                    state : 'active'
                }
            ];

            $(servers).each(function(k, v) {
                THIS.templates.server.tmpl( { type : 'media_server', server : v } ).appendTo( $('#media_server') );
                THIS.templates.arrows.tmpl( { more_items : !(k == servers.length - 1) } ).appendTo( $('#media_server_arrows') );
            });
        },

        refreshCallManager: function() {
            var THIS = this;

            servers = [
                {
                    hostname : 'whistle001.clusterA.',
                    provider : 'Racksapce',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'whistle002.clusterA.',
                    provider : 'Rackspace',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'whistle001.clusterB.',
                    provider : 'EC2 East',
                    location : 'N. Virgina',
                    state : 'active'
                },
                {
                    hostname : 'whistle002.clusterB.',
                    provider : 'EC2 East',
                    location : 'N. Virgina',
                    state : 'active'
                }
            ];

            $(servers).each(function(k, v) {
                THIS.templates.server.tmpl( { type : 'call_manager', server : v } ).appendTo( $('#call_manager') );
                THIS.templates.arrows.tmpl( { more_items : !(k == servers.length - 1) } ).appendTo( $('#call_manager_arrows') );
            });
        },

        refreshMessagingBus: function() {
            var THIS = this;

            servers = [
                {
                    hostname : 'whistle001.clusterA.',
                    provider : 'Racksapce',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'whistle002.clusterA.',
                    provider : 'Rackspace',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'whistle001.clusterB.',
                    provider : 'EC2 East',
                    location : 'N. Virgina',
                    state : 'active'
                },
                {
                    hostname : 'whistle002.clusterB.',
                    provider : 'EC2 East',
                    location : 'N. Virgina',
                    state : 'active'
                }
            ];

            $(servers).each(function(k, v) {
                THIS.templates.server.tmpl( { type : 'messaging_bus', server : v } ).appendTo( $('#messaging_bus') );
            });
        },

        refreshWhApps: function() {
            var THIS = this;

            THIS.templates.whapps.tmpl().appendTo( $('#whapps') );
        },

        refreshDatabase: function() {
            var THIS = this;

            servers = [
                {
                    hostname : 'db001.clusterA.',
                    provider : 'Racksapce',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'db002.clusterA.',
                    provider : 'Rackspace',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'db003.clusterA.',
                    provider : 'Rackspace',
                    location : 'Dallas',
                    state : 'active'
                },
                {
                    hostname : 'db001.clusterB.',
                    provider : 'EC2 East',
                    location : 'N. Virgina',
                    state : 'active'
                },
                {
                    hostname : 'db002.clusterB.',
                    provider : 'EC2 East',
                    location : 'N. Virgina',
                    state : 'active'
                },
                {
                    hostname : 'db003.clusterB.',
                    provider : 'EC2 East',
                    location : 'N. Virgina',
                    state : 'active'
                }
            ];

            $(servers).each(function(k, v) {
                THIS.templates.server.tmpl( { type : 'database', server : v } ).appendTo( $('#database') );
            });
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
            winkstart.registerResources(this.__whapp, this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Cluster Monitor',
                module: this.__module
            });

            // JSON request to get current status
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
