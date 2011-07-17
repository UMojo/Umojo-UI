// This is the connectivity management module (VoIP connectivity services like SIP and Google Voice)
winkstart.module('connect', 'connect', {
        subscribe: {
            'connect.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'connect' });
    },
    {
        initialized :   false,
        modules :       ['sipservice', 'admin', 'channels', 'credits', 'endpoints', 'fraud', 'monitoring', 'numbers'],

        activate: function() {
            if (this.initialized) {
                return;
            }

            // We only initialize once
            this.initialized = true;

            $.each(this.modules, function(k, v) {
                winkstart.module.loadPlugin('connect', v, function() {
                    this.init(function() {
                        winkstart.log('Connect: Initialized ' + v);
                    });
                });
            });
        }
    }
);
