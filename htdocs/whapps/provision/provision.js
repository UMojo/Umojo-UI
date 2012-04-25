// This is the phone provisioning and management module
winkstart.module('provision', 'provision', {
        subscribe: {
            'provision.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'provision' });

        $.each(this.modules, function(k, v) {
            winkstart.module.loadPlugin('provision', v, function() {
                this.init(function() {
                    winkstart.log('Provision: Initialized ' + v);
                });
            });
        });
    },
    {
        modules :       ['phone'],

        activate: function() {
            winkstart.publish('phone.activate', { target : $('#ws-content') });
        }
    }
);
