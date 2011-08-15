// This is the core module. It is responsible for loading all a base layout, a base navigation bar and any registered whApps
winkstart.module('core', 'core',
    {
    },
    function(args) {
        //winkstart.registerResources(this.__whapp, this.config.resources);
        // First thing we're going to do is go through is load our layout
        winkstart.module.loadModule('core', 'layout', function() {

            this.init({ parent: $('body') }, function() {

                // Next, we need to make sure the navbar at the top is loaded before anything else is so we can catch events
                winkstart.module.loadModule('core', 'appnav', function() {
                    this.init({ parent: $('body') }, function() {
                        // We don't use this sub nav any more
                        //winkstart.module.loadModule('core', 'subnav', function() {
                            //this.init({ parent: $('body') }, function() {
                                // Into the My Account utility. Note that we don't care if this utility isn't present or loads slowly
                                winkstart.module.loadModule('core', 'myaccount', function() {
                                    this.init();
                                    winkstart.log('Core: Loaded My Account manager');
                                });

                                // Now move onto apps
                                winkstart.log('WhApps: Loading WhApps...');

                                // Load any other apps requested (only after core is initialized)
                                $.each(winkstart.apps, function(k, v) {
                                    winkstart.log('WhApps: Would load ' + k + ' from URL ' + v.url);
                                    winkstart.module.loadApp(k, function() {
                                        this.init();
                                        winkstart.log('WhApps: Initializing ' + k);
                                    })
                                });

                                winkstart.log('WhApps: Finished Loading WhApps');
                            //});
                        //});
                    });
                });
            });
        });
});
