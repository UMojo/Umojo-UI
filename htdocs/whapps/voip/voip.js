// This is the VoIP Services base application
winkstart.module('voip', 'voip', {
        templates: {
                voip: 'voip.html'
        },
        
        subscribe: {
            'voip.activate' : 'activate'
        }
    },
    function() {
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'voip' });
    },
    {
        initialized :   false,
        modules :       ['account', 'media', 'device', 'autoattendant', 'callflow'],
        
        activate: function() {
            var THIS = this;
            
            if (!this.initialized) {
                // We only initialize once
                this.initialized = true;

                winkstart.module.loadPlugin('voip', 'nav', function() {
                    this.init(function() {
                        winkstart.log('VoIP: Initialized Top Navigation');
                    });
                });

                $.each(this.modules, function(k, v) {
                    winkstart.module.loadPlugin('voip', v, function() {
                        this.init(function() {
                            winkstart.log('VoIP: Initialized ' + v);
                        });
                    });
                });
            }   // End initialization of modules

            // Display the navbar
            $('#ws-content').empty();
            THIS.templates.voip.tmpl({}).appendTo( $('#ws-content') );

            //winkstart.registerResources(this.config.resources);

            //winkstart.publish('layout.updateLoadedModule', {label: 'Device Management', module: this.__module});

        }
    }
);
