// This is the VoIP Services base application
winkstart.module('indesign', 'indesign', {
/*        templates: {
                indesign: 'empty.html'
        },*/
        
        subscribe: {
            'indesign.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'indesign' });
    },
    {
        initialized :   false,
        modules :       ['deploy_mgr', 'monitor'],     // <-- ADD YOUR IN-PROGRESS MODULES HERE!!!
        
        activate: function() {
            var THIS = this;
            
            if (!THIS.initialized) {
                // We only initialize once
                THIS.initialized = true;

                winkstart.module.loadPlugin('voip', 'nav', function() {
                    this.init(function() {
                        winkstart.log('In-Design: Initialized Top Navigation');
                        $.each(THIS.modules, function(k, v) {
                            winkstart.module.loadPlugin('indesign', v, function() {
                                this.init(function() {
                                    winkstart.log('In-Design: Initialized ' + v);
                                });
                            });
                        });
                    });
                });

                // Display the navbar
                $('#ws-content').empty();
//                THIS.templates.indesign.tmpl({}).appendTo( $('#ws-content') );

            }   // End initialization of modules

            //winkstart.registerResources(this.config.resources);

            //winkstart.publish('layout.updateLoadedModule', {label: 'Device Management', module: this.__module});

        }
    }
);
