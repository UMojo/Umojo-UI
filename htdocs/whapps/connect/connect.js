// This is the connectivity management module (VoIP connectivity services like SIP and Google Voice)
winkstart.module('connect', 'connect', {
        subscribe: {
            'connect.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : this.__module });
    },
    {
        initialized :   false,
        modules :       ['sipservice', 'admin', 'channels', 'credits', 'endpoint', 'fraud', 'monitoring', 'numbers', 'discount'],

        activate: function() {
            var THIS = this;

            if (!winkstart.apps[this.__module].auth_token) {                    // Is this app authenticated?
                winkstart.publish('auth.shared_auth', { app_name : this.__module });
            } else if (!THIS.initialized) {                                 // Is this app initialized?
                $.each(this.modules, function(k, v) {
                    winkstart.module.loadModule('connect', v, function() {
                        this.init(function() {
                            winkstart.log('Connect: Initialized ' + v);
                        });
                    });
                });

                THIS.initialized = true;
            } else {
                winkstart.publish('sipservice.activate');
            }
        }
    }
);
