// This is the server module
winkstart.module('core', 'core', {
    
    },
    function(args) {
        // First thing we're going to do is go through is load our layout
        winkstart.module.loadPlugin('core', 'layout', function() {
                this.init({ parent: $('body') }, function() {
                });
        });

        // Next, we need to make sure the navbar at the top is loaded before anything else is so we can catch events
        winkstart.module.loadPlugin('core', 'appnav', function() {
                this.init({ parent: $('body') }, function() {
                });
        });

        // Loaded - add to nav bar
        winkstart.publish('appnav.add', 'voip');
    }
);
