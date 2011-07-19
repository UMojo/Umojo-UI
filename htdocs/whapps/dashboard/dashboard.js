winkstart.module('dashboard', 'dashboard', {
    subscribe: {
        'dashboard.activate' : 'activate'
    }
},
function() {
    var THIS = this;

    // Loaded - add to nav bar
    winkstart.publish('appnav.add', {
        'name' : 'dashboard'
    });

    // Load the modules
    $.each(THIS.modules, function(k, v) {
        winkstart.module.loadPlugin('dashboard', v, function() {
            this.init(function() {
                winkstart.log('Dashboard: Initialized ' + v);
            });
        });
    });
},
{
    initialized :   false,
    modules :       ['ctt', 'monitor'],
        
    activate: function() {
        var THIS = this;
            
        if (!THIS.initialized) {

            // Display the navbar
            $('#ws-content').empty();

            // Link the main buttons
            $('.options #monitor').click(function() {
                winkstart.publish('monitor.activate');
            });

            $('.options #ctt').click(function() {
                winkstart.publish('ctt.activate');
            });
        } 
    }
}
);
