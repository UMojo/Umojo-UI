// This is the server module
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
        activate: function() {
            // TODO: Make this dynamic.
            var modules = ['sipservice', 'gtalk' ];

            $.each(modules, function(k, v) {
                winkstart.module.loadPlugin('connect', v, function() {
                    this.init(function() {
                        winkstart.log('Connect: Initialized ' + v);
                    });
                });
            });
       }
    }
);
