// This is the server module
winkstart.module('system', 'system', {
    
    },
    function(args) {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'system' });
    }
);
