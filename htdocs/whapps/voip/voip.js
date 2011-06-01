// This is the server module
winkstart.module('voip', 'voip', {
    },
    function() {
        var modules = ['account', 'media', 'auth', 'device', 'autoattendant', 'callflow']

        $.each(modules, function(k, v) {
                winkstart.module.loadPlugin('voip', v, function() {
                    this.init();
                });
        });

        // Loaded - add to nav bar
        winkstart.publish('appnav.add', 'voip');
    }
);
