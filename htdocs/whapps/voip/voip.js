// This is the VoIP Services base application
winkstart.module('voip', 'voip', {
        subscribe: {
            'voip.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'voip' });
    },
    {
        activate: function() {
            // TODO: Make this dynamic.
            var modules = ['account', 'media', 'device', 'autoattendant', 'callflow'];

            $.each(modules, function(k, v) {
                winkstart.module.loadPlugin('voip', v, function() {
                    this.init(function() {
                        winkstart.log('VoIP: Initialized ' + v);
                    });
                });
            });
       }
    }
);
