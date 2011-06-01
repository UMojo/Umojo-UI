// This is the server module
winkstart.module('system', 'system', {
        subscribe: {
            'system.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'system' });
    },
    {
        initialized :   false,
        modules :       ['deploy', 'server', 'monitor' ],
        
        activate: function() {
            if (this.initialized) {
                return;
            }

            // We only initialize once
            this.initialized = true;

            $.each(this.modules, function(k, v) {
                winkstart.module.loadPlugin('system', v, function() {
                    this.init(function() {
                        winkstart.log('System: Initialized ' + v);
                    });
                });
            });
        }
    }
);
