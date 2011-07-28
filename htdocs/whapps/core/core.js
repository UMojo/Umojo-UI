// This is the core module. It is responsible for loading all a base layout, a base navigation bar and any registered whApps
winkstart.module('core', 'core', {
         resources: {
            "user.get": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },
    function(args) {
        winkstart.registerResources(this.config.resources);
        // First thing we're going to do is go through is load our layout
        winkstart.module.loadPlugin('core', 'layout', function() {            

            this.init({ parent: $('body') }, function() {

                // Next, we need to make sure the navbar at the top is loaded before anything else is so we can catch events
                winkstart.module.loadPlugin('core', 'appnav', function() {
                    this.init({ parent: $('body') }, function() {
                        // We don't use this sub nav any more
                        //winkstart.module.loadPlugin('core', 'subnav', function() {
                            //this.init({ parent: $('body') }, function() {
                                // Into the My Account utility. Note that we don't care if this utility isn't present or loads slowly
                                winkstart.module.loadPlugin('core', 'myaccount', function() {
                                    this.init();
                                    winkstart.log('Core: Loaded My Account manager');
                                    if(CURRENT_USER_ID != '') {
                                        winkstart.getJSON('user.get', {crossbar: true, account_id: MASTER_ACCOUNT_ID, user_id: CURRENT_USER_ID}, function(json, xhr) {
                                            $('#my_account').html("&nbsp;"+json.data.name);
                                        });
                                    }
                                });

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
                            //});
                        //});
                    });
                });
            });
        });
});
