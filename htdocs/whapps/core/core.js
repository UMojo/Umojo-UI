// This is the core module. It is responsible for loading all a base layout, a base navigation bar and any registered whApps
winkstart.module('core', 'core', {
    },
    function(args) {
        // First thing we're going to do is go through is load our layout
        winkstart.module.loadPlugin('core', 'layout', function() {
            this.init({ parent: $('body') }, function() {

                // Next, we need to make sure the navbar at the top is loaded before anything else is so we can catch events
                winkstart.module.loadPlugin('core', 'appnav', function() {
                    this.init({ parent: $('body') }, function() {
                        winkstart.module.loadPlugin('core', 'subnav', function() {
                            this.init({ parent: $('body') }, function() {
                                // Now move onto apps
                                winkstart.log('WhApps: Loading WhApps...');

                                // Load any other apps requested (only after core is initialized)
                                $.each(winkstart.modules, function(k, v) {
                                    winkstart.log('WhApps: Would load ' + k + ' from URL ' + v.url);
                                    winkstart.module.load(k, function() {
                                        this.init();
                                        winkstart.log('WhApps: Initializing ' + k);
                                    })
                                });

                                winkstart.log('WhApps: Finished Loading WhApps');
                            });
                        });
                    });
                });
            });
        });
    }
);
