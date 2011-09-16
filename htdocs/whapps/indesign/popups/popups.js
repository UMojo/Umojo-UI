winkstart.module('indesign', 'popups', 
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
            'css/popups.css', 'css/jquery-ui.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            index: 'tmpl/login.html', 
            thankyou: 'tmpl/thankyou.html',
            service_loc: 'tmpl/service_loc.html',
            service_limits: 'tmpl/service_limits.html',
            register: 'tmpl/register.html',
            port_number: 'tmpl/port_number.html',
            order_his: 'tmpl/order_his.html',
            monitoring: 'tmpl/monitoring.html',
            fraud: 'tmpl/fraud.html',
            failover: 'tmpl/failover.html',
            caller_id: 'tmpl/caller_id.html',
            authentication: 'tmpl/authentication.html',
            add_trunks: 'tmpl/add_trunks.html',
            add_server: 'tmpl/add_server.html',
            add_numbers: 'tmpl/add_numbers.html',
            add_credits: 'tmpl/add_credits.html',
            add_billing: 'tmpl/add_billing.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'popups.activate' : 'activate'
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
            label: 'Pop Up Form'               // <--- THIS IS WHAT WILL SHOW ON THE TOP NAV BAR
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
            THIS.templates.add_numbers.tmpl().appendTo( $('#ws-content') );

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.__whapp, this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Login',              // <-- THIS UPDATES THE BREADCRUMB TO SHOW WHERE YOU ARE
                module: this.__module
            });
            
            $(function(){
                    $('.resize')
                            .draggable()
                            .resizable();
            });
            $(document).ready(function() {
                $('input[type="text"]').addClass("idleField");
                    $('input[type="text"]').focus(function() {
                            $(this).removeClass("idleField").addClass("focusField");
                    if (this.value == this.defaultValue){
                            this.value = '';
                    }
                    if(this.value != this.defaultValue){
                            this.select();
                    }
                });
                $('input[type="text"]').blur(function() {
                    $(this).removeClass("focusField").addClass("idleField");
                    if ($.trim(this.value) == ''){
                            this.value = (this.defaultValue ? this.defaultValue : '');
                    }
                });
            });
            
        }
    } // End function definitions

);  // End module
