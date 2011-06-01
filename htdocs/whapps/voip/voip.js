// This is the VoIP Services base application
winkstart.module('voip', 'voip', {
    },
    function() {
        var modules = ['account', 'media', 'device', 'autoattendant', 'callflow'];

        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'voip' });

        $.each(modules, function(k, v) {
                winkstart.module.loadPlugin('voip', v, function() {
                    this.init(function() {
                        winkstart.log('Initialized ' + v);
                    });
                });
        });

    }
);
