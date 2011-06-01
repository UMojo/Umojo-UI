// This is the phone provisioning and management module
winkstart.module('provision', 'provision', {
        subscribe: {
            'dashboard.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'provision' });
    },
    {
        activate: function() {
            // TODO: Make this dynamic.
            var modules = ['provisioner' ];

            $.each(modules, function(k, v) {
                winkstart.module.loadPlugin('provision', v, function() {
                    this.init(function() {
                        winkstart.log('Provision: Initialized ' + v);
                    });
                });
            });
        }
    }
);
