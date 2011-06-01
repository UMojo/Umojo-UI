// This is the VoIP Services base application
winkstart.module('voip', 'voip', {
    },
    function() {
        var modules = [/*'account', 'media', 'device', 'autoattendant', 'callflow'*/]

        $.each(modules, function(k, v) {
                winkstart.module.loadPlugin('voip', v, function() {
                    this.init();
                });
        });

        // Loaded - add to nav bar
        winkstart.publish('appnav.add', 'voip');
    }
);
