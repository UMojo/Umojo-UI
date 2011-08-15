// This is the VoIP Services base application
winkstart.module('voip', 'voip', {
        css: {
            voip: 'voip.css'
        },
        templates: {
            voip: 'voip.html'
        },

        subscribe: {
            'voip.activate' : 'activate',
            'voip.initialized' : 'initialized'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : this.__module });
    },
    {
        is_initialized :   false,
        modules :       ['account', 'media', 'device', 'callflow', 'conference', 'user', 'vmbox', 'menu', 'registration', 'resource', 'timeofday'],

        initialized: function() {
            var THIS = this;

            THIS.is_initialized = true;

            winkstart.publish('subnav.show', THIS.__module);

            THIS.setup_page();
        },
        
        activate: function() {
            var THIS = this,
                mod_count;

            if (!THIS.is_initialized) {                                 // Is this app initialized?
                // Load the modules
                mod_count = THIS.modules.length;
                $.each(THIS.modules, function(k, v) {
                    winkstart.module.loadModule('voip', v, function() {
                        this.init(function() {
                            winkstart.log('VoIP: Initialized ' + v);
                            
                            if(!--mod_count) {
                                winkstart.publish('voip.initialized', {});
                            }
                        });
                    });
                });
            } else {
                THIS.setup_page();
            }
        },

        setup_page: function() {
            var THIS = this; 

            $('#ws-content').empty();
            THIS.templates.voip.tmpl({}).appendTo( $('#ws-content') );

            // Link the main buttons
            $('.options #users').click(function() {
                winkstart.publish('user.activate');
            });

            $('.options #devices').click(function() {
                winkstart.publish('device.activate');
            });

            $('.options #users').click(function() {
                winkstart.publish('user.activate');
            });

            $('.options #auto_attendant').click(function() {
                winkstart.publish('menu.activate');
            });

            $('.options #ring_groups').click(function() {
                winkstart.publish('callflow.activate');
            });

            $('.options #conferences').click(function() {
                winkstart.publish('conference.activate');
            });

            $('.options #registrations').click(function() {
                winkstart.publish('registration.activate');
            });

            $('.options #stats').click(function() {
                winkstart.publish('stats.activate');
            });

            $('.options #time_of_day').click(function() {
                winkstart.publish('timeofday.activate');
            });
        }
    }
);
