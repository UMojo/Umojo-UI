// This is the connectivity management module (VoIP connectivity services like SIP and Google Voice)
winkstart.module('connect', 'connect', {
        subscribe: {
            'connect.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'connect' });

        $.each(this.modules, function(k, v) {
            winkstart.module.loadPlugin('connect', v, function() {
                this.init(function() {
                    winkstart.log('Connect: Initialized ' + v);
                });
            });
        });
    },
    {
        initialized :   false,
        modules :       ['sipservice', 'admin', 'channels', 'credits', 'endpoint', 'fraud', 'monitoring', 'numbers', 'discount'],

        activate: function() {
            winkstart.publish('sipservice.activate');
        }
    }
);
