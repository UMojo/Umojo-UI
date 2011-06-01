// This is the server module
winkstart.module('connect', 'connect', {
    
    },
    function(args) {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'connect' });
    }
);
