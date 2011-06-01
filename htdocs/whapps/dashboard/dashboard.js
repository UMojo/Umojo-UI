// This is the dashboard module, for monitoring services across the system
winkstart.module('dashboard', 'dashboard', {
        subscribe: {
            'dashboard.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'dashboard' });
    },
    {
        initialized :   false,
        modules :       ['monitor' ],
            
        activate: function() {
            if (this.initialized) {
                return;
            }

            // We only initialize once
            this.initialized = true;

            $.each(this.modules, function(k, v) {
                winkstart.module.loadPlugin('dashboard', v, function() {
                    this.init(function() {
                        winkstart.log('Dashboard: Initialized ' + v);
                    });
                });
            });
        }
    }
);
