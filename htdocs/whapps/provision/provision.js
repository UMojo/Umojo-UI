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
        initialized :   false,
        modules :       ['provisioner'],

        activate: function() {
            if (this.initialized) {
                return;
            }

            // We only initialize once
            this.initialized = true;

            $.each(this.modules, function(k, v) {
                winkstart.module.loadPlugin('provision', v, function() {
                    this.init(function() {
                        winkstart.log('Provision: Initialized ' + v);
                    });
                });
            });
        }
    }
);
