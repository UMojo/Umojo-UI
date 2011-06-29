// This is the server module
winkstart.module('cluster', 'cluster', {
        subscribe: {
            'cluster.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'cluster' });
    },
    {
        initialized :   false,
        modules :       ['deploy', 'server', 'deploy_mgr' ],
        
        activate: function() {
            if (this.initialized) {
                return;
            }

            // We only initialize once
            this.initialized = true;

            $.each(this.modules, function(k, v) {
                winkstart.module.loadPlugin('cluster', v, function() {
                    this.init(function() {
                        winkstart.log('Cluster: Initialized ' + v);
                    });
                });
            });
        }
    }
);
