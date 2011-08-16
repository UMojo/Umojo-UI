// This is the VoIP Services base application
winkstart.module('skel', 'skel', {
        subscribe: {
            'skel.activate' : 'activate',
            'skel.initialized' : 'initialized'
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
        /* A modules object is required for the loading routine.
         * The format is as follows:
         * <module name>: <initialization status> 
         */
        modules: {
            //skel: false
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
        /* END COPY AND PASTE CODE
         * (Really need to figure out a better way...)
         */

        /* A setup_page function is required for the copy and paste code.
         * This code is run when the whapp is successfully initialized,
         * or when it is activated (and is already initialized).
         */
        setup_page: function() {
            var THIS = this; 

            // Do something here
        }
    }
);
