// This is the server module
winkstart.module('cluster', 'cluster', {
        subscribe: {
            'cluster.activate' : 'activate',
            'cluster.initialized' : 'initialized'
        }
    },
    function() {
        var THIS = this;

        winkstart.publish ('auth.shared_auth', { 
            app_name: THIS.__module,
            callback: function() {
                winkstart.publish('appnav.add', { 'name' : THIS.__module });
            }
        });
    },
    {
        is_initialized :   false,
        modules :       ['deploy_mgr'],

        initialized: function() {
            var THIS = this;

            THIS.is_initialized = true;

            //No subnav to show in this whapp 
            //winkstart.publish('subnav.show', THIS.__module);

            winkstart.publish('deploy_mgr.activate', {});
        },
        
        activate: function() {
            var THIS = this,
                mod_count;

            if (!THIS.is_initialized) {                                 // Is this app initialized?
                // Load the modules
                mod_count = THIS.modules.length;
                $.each(THIS.modules, function(k, v) {
                    winkstart.module.loadModule('cluster', v, function() {
                        this.init(function() {
                            winkstart.log('Cluster: Initialized ' + v);
                            
                            if(!--mod_count) {
                                winkstart.publish('cluster.initialized', {});
                            }
                        });
                    });
                });   
            } else {
                winkstart.publish('deploy_mgr.activate', {});
            }
        }
    }
);
