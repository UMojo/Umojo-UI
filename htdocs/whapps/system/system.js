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
        activate: function() {
            // TODO: Make this dynamic.
            var modules = ['deploy', 'server', 'monitor' ];

            $.each(modules, function(k, v) {
                winkstart.module.loadPlugin('system', v, function() {
                    this.init(function() {
                        winkstart.log('System: Initialized ' + v);
                    });
                });
            });
       }
    }
);
