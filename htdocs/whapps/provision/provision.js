// This is the phone provisioning and management module
winkstart.module('provision', 'provision', {
        subscribe: {
            'provision.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'provision' });

    },
    {
        initialized :   false,
        modules :       ['phone'],

        activate: function() {
            $.each(this.modules, function(k, v) {
                winkstart.module.loadModule('provision', v, function() {
                    this.init(function() {
                        winkstart.log('Provision: Initialized ' + v);
                    });
                });
            });

            winkstart.publish('phone.activate', { target : $('#ws-content') });

            THIS.initialized = true;
        }
    }
);
