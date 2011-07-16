winkstart.module('connect', 'sipservice', 
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
        'css/style.css',
        'css/popups.css'
        ],

        /* What HTML templates will we be using? */
        templates: {

            /* Main Page */
            index: 'tmpl/index.html',
            main: 'tmpl/main.html',

            legal : 'tmpl/legal.html',
            rates : 'tmpl/rates.html',
            howto : 'tmpl/howto.html',
            support : 'tmpl/support.html',
            apis : 'tmpl/apis.html',

            main_dids : 'tmpl/main_dids.html',
            main_servers : 'tmpl/main_servers.html',
            main_services : 'tmpl/main_services.html',

            /* Number Management */
            order_history: 'tmpl/order_history.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'sipservice.activate' : 'activate',

            /* Sub nav HTML pages */
            'sipservice.legal.activate' : 'legal',
            'sipservice.support.activate' : 'support',
            'sipservice.rates.activate' : 'rates',
            'sipservice.howto.activate' : 'howto',
            'sipservice.apis.activate' : 'apis',

            'sipservice.index' : 'index',               // Splash screen
            'sipservice.main_menu' : 'main_menu',       // Main menu, once logged in
            'sipservice.refresh' : 'refresh'           // Refresh entire screen (should never be used theoretically)
            
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "sipservice.get_idoc": {
                url: 'https://store.2600hz.com/v1/get_idoc',
                contentType: 'application/json',
                verb: 'POST'
            },


            /* Create Ticket */
            "sipservice.createTicket": {
                url: 'https://store.2600hz.com/v1/createTicket',
                contentType: 'application/json',
                verb: 'PUT'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /* Paint the subnav */
        winkstart.publish('subnav.add', {
            module: 'sipservice.apis',
            label: 'APIs',
            icon: 'puzzle'
        });

        winkstart.publish('subnav.add', {
            module: 'sipservice.legal',
            label: 'Legal',
            icon: 'legal'
        });

        winkstart.publish('subnav.add', {
            module: 'sipservice.support',
            label: 'Support',
            icon: 'support'
        });

        winkstart.publish('subnav.add', {
            module: 'sipservice.rates',
            label: 'Rates',
            icon: 'price_tag'
        });

        winkstart.publish('subnav.add', {
            module: 'sipservice.howto',
            label: 'How to Use',
            icon: 'book'
        });

        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'SIP Services',
            icon: 'active_phone'
        });

        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);

        // Only one option for now - go ahead and open it up!
        winkstart.publish('subnav.activate', 'sipservice');

    }, // End initialization routine



    /* Define the functions for this module */
    {
        refresh: function() {
            // Update the trunk count
            winkstart.publish('channels.refresh', $('#my_services'));

            // Update the credit amount
            winkstart.publish('credits.refresh', $('#my_services'));

            // Update the endpoint list
            winkstart.publish('endpoints.refresh', $('#my_services'));

            // Update any fraud settings & notices
            winkstart.publish('fraud.refresh', $('#my_services'));

            // Update any monitoring settings & notices
            winkstart.publish('monitoring.refresh', $('#my_services'));

            // Update the list of numbers/DIDs
            winkstart.publish('numbers.refresh', $('#my_services'));

            // Update any admin pages/settings/etc.
            winkstart.publish('admin.refresh', $('#my_services'));
        },

        legal: function() {
            $('#ws-content').html(this.templates.legal.tmpl());
        },

        support: function() {
            $('#ws-content').html(this.templates.support.tmpl());
        },

        rates: function() {
            $('#ws-content').html(this.templates.rates.tmpl());
        },

        apis: function() {
            $('#ws-content').html(this.templates.apis.tmpl());
        },

        howto: function() {
            $('#ws-content').html(this.templates.howto.tmpl());
        },


        main_menu: function() {
            // Paint the main screen
            $('#ws-content').empty();
            this.templates.main.tmpl().appendTo( $('#ws-content') );

            $('#my_services').html(this.templates.main_services.tmpl());
        },


        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function() {
            var THIS = this;
            /* Clear out the center part of the window - get ready to put our own content in there */
            $('#ws-content').empty();

            // If user is already logged in, go ahead and show their trunks & stuff
            if (winkstart.modules['connect'].auth_token) {
                // Paint various sections on the page. Each individual section is responsible for loading it's own data and
                // populating it's own area.
                THIS.main_menu();
            
                THIS.refresh();
            } else {
                // Show landing page
                
                /* Draw our base template into the window */
                THIS.templates.index.tmpl().appendTo( $('#ws-content') );

                $('#ws-content a#signup_button').click(function() {
                    THIS.main_menu();
                });
            }
        }
    } // End function definitions

);  // End module