winkstart.module('indesign', 'ring_group', 
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
            'css/ring_group.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            index: 'tmpl/ring_group.html'        // This is utilized later as THIS.templates.index.tmpl({ data_here})
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'ring_group.activate' : 'activate'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            whapp: 'indesign',
            module: this.__module,
            label: 'Ring Group'               // <--- THIS IS WHAT WILL SHOW ON THE TOP NAV BAR
        });
    }, // End initialization routine



    /* Define the functions for this module */
    {

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            var THIS = this;
            /* Clear out the center part of the window - get ready to put our own content in there */
            $('#ws-content').empty();

            /* Draw our base template into the window */
            THIS.templates.index.tmpl().appendTo( $('#ws-content') );

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.__whapp, this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Ring Group',              // <-- THIS UPDATES THE BREADCRUMB TO SHOW WHERE YOU ARE
                module: this.__module
            });
            
            
            $('.group_list').jScrollPane();
            $('.list_container').jScrollPane();
            $("ul.advanced_tabs").tabs("div.advanced_pane > div");

            $(".list_container li").click(function(){
                $clicked = $(this);
                $clicked.css("background-color","#0097bb");
                // reset the other buttons to default style
                $clicked.siblings(".list_container li").css("background-color","#808080");         	
            });			
			
        }
    } // End function definitions

);  // End module
