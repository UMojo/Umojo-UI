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
        var THIS = this;
        // Loaded - add to nav bar
        winkstart.publish('appnav.add', { 'name' : 'indesign' });

        $.each(THIS.modules, function(k, v) {
            winkstart.module.loadModule('indesign', v, function() {
                this.init(function() {
                    winkstart.log('In-Design: Initialized ' + v);
                });
            });
        });
    },
    {
        initialized :   false,
        modules :       ['ring_group', 'media_mgr', 'popups', 'user_mgmt'],     // <-- ADD YOUR IN-PROGRESS MODULES HERE!!!
        
        activate: function() {
            var THIS = this;
            
            if (!THIS.initialized) {
                // We only initialize once
                THIS.initialized = true;

                winkstart.log('In-Design: Initialized Top Navigation');
                
                // Display the navbar
                $('#ws-content').empty();
//                THIS.templates.indesign.tmpl({}).appendTo( $('#ws-content') );

            }   // End initialization of modules

            //winkstart.registerResources(this.__whapp, this.config.resources);

            //winkstart.publish('layout.updateLoadedModule', {label: 'Device Management', module: this.__module});

        }
    }
);
