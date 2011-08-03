winkstart.module('connect', 'fraud',
    /* Start module resource definitions */
    {
        /* What HTML templates will we be using? */
        templates: {
            edit_fraud: 'tmpl/edit_fraud.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'fraud.activate' : 'activate',
            'sipservice.refresh' : 'refresh'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);
    }, // End initialization routine



    /* Define the functions for this module */
    {
        refresh: function() {
            var THIS = this;
            /* Draw our base template into the window */
            THIS.templates.index.tmpl(winkstart.apps['connect'].account).appendTo( $('#my_fraud') );
        },

        activate: function(data) {
        }
    } // End function definitions

);  // End module
