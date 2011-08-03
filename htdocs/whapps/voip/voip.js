// This is the VoIP Services base application
winkstart.module('voip', 'voip', {
        css: {
                voip: 'voip.css'
        },
        templates: {
                voip: 'voip.html'
        },

        subscribe: {
            'voip.activate' : 'activate'
        }
    },
    function() {
        var THIS = this;

        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'voip' });
    },
    {
        initialized :   false,
        modules :       ['account', 'media', 'device', 'callflow', 'conference', 'user', 'vmbox', 'menu', 'registration', 'resource', 'timeofday'],
        
        activate: function() {
            var THIS = this;

            if (!winkstart.apps[this.__module].auth_token) {                    // Is this app authenticated?
                winkstart.publish('auth.shared_auth', { app_name : this.__module });
            } else if (!THIS.initialized) {                                 // Is this app initialized?
                winkstart.registerResources(this.__whapp, this.config.resources);

                // Load the modules
                $.each(THIS.modules, function(k, v) {
                    winkstart.module.loadModule('voip', v, function() {
                        this.init(function() {
                            winkstart.log('VoIP: Initialized ' + v);
                        });
                    });
                });

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

                THIS.initialized = true;
            } else {
                // Already initialized - just show main page

                $('#ws-content').empty();
                THIS.templates.voip.tmpl({}).appendTo( $('#ws-content') );
            }
        }
    }
);
