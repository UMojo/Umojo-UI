// This is the server module
winkstart.module('dashboard', 'dashboard', {
        subscribe: {
            'dashboard.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', {
            'name' : 'dashboard'
        });
    },
    {
        activate: function() {
            // TODO: Make this dynamic.
            var modules = ['monitor' ];

            $.each(modules, function(k, v) {
                winkstart.module.loadPlugin('dashboard', v, function() {
                    this.init(function() {
                        winkstart.log('Dashboard: Initialized ' + v);
                    });
                });
            });
        }

    }
);
