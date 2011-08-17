// This is the connectivity management module (VoIP connectivity services like SIP and Google Voice)
winkstart.module('connect', 'connect', {
        subscribe: {
            'connect.activate' : 'activate',
            'connect.initialized' : 'initialized'
        }
    },
    /* The code in this initialization function is required for
     * loading routine.
     */
    function() {
        var THIS = this;

        winkstart.publish ('auth.shared_auth', {
            app_name: THIS.__module,
            callback: function() {
                winkstart.publish('appnav.add', { 'name' : THIS.__module });
            }
        });

        THIS.uninitialized_count = THIS._count(THIS.modules);
    },
    {
        modules :       {
            'sipservice' : false,
            'admin' : false,
            'channels' : false,
            'credits' : false,
            'endpoint' : false,
            'fraud' : false,
            'monitoring' : false,
            'numbers' : false,
            'discount' : false
        },

        /* The following code is generic and should be abstracted.
         * For the time being, you can just copy and paste this
         * into other whapps.
         *
         * BEGIN COPY AND PASTE CODE
         */
        is_initialized: false,

        uninitialized_count: 1337,

        initialized: function() {
            var THIS = this;

            THIS.is_initialized = true;

            winkstart.publish('subnav.show', THIS.__module);

            THIS.setup_page();
        },

        activate: function() {
            var THIS = this;

            if (!THIS.is_initialized) {
                // Load the modules
                $.each(THIS.modules, function(k, v) {
                    if(!v) {
                        THIS.modules[k] = true;
                        winkstart.module.loadModule(THIS.__module, k, function() {
                            this.init(function() {
                                winkstart.log(THIS.__module + ': Initialized ' + k);

                                if(!--THIS.uninitialzed_count) {
                                    winkstart.publish(THIS.__module + '.initialized', {});
                                }
                            });
                        });
                    }
                });
            } else {
                THIS.setup_page();
            }
        },

        _count: function(obj) {
            var count = 0;

            $.each(obj, function() {
                count++;
            });

            return count;
        },

        setup_page: function() {
        }
    }
);
