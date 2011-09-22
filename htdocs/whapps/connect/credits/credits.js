winkstart.module('connect', 'credits',
    /* Start module resource definitions */
    {
        css: [
            'css/credits.css'
        ],
        
        /* What HTML templates will we be using? */
        templates: {
            manage_credits: 'tmpl/manage_credits.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'credits.activate' : 'activate',
            /* Credit Management */
            'credits.manage' : 'manage',
            'credits.update' : 'update'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            'credits.post': {
                url: 'https://store.2600hz.com/v1/{account_id}/credits',
                contentType: 'application/json',
                verb: 'POST'
            },

            'credits.get': {
                url: 'https://store.2600hz.com/v1/{account_id}/credits',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function() {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.__whapp, this.config.resources);

        // Tie to DOM events
        $('#ws-content').delegate('.credits.manage', 'click', function() {
            winkstart.publish('credits.manage');
        });
    }, // End initialization routine



    /* Define the functions for this module */
    {
        manage: function(args) {
            var THIS = this;
            dialogDiv = winkstart.dialog(THIS.templates.manage_credits.tmpl(winkstart.apps['connect'].account), {
                title: 'Add credits to your account',
                resizable: false
            });
            
            dialogDiv.css('overflow', 'hidden');

            $('.credits.add', dialogDiv).click(function() {
                add_credits = $('input[name=add_credits]:checked', '#credit_form').val();
                // Grab data from form
                //var form_data = form2object('credit_form');

                // Build the save function here, for use with or without a billing confirmation screen (coming up)
                var save = function() {
                    winkstart.postJSON('credits.post', {
                            data : { 'add_credits' : add_credits },
                            account_id : winkstart.apps['connect'].account_id
                        },
                        function(json, xhr) {
                            // Check the response for errors

                            // Close the dialog
                            dialogDiv.dialog('close');

                            winkstart.apps['connect'].account = json.data;
                            winkstart.publish('credits.refresh');
                        }
                    );
                };

                // If a billing confirmation callback was passed in, utilize it and give it the callback to finish things up
                if (args && args.confirm_billing) {
                    $.extend(new_account, winkstart.apps['connect'].account, form_data);
                    args.confirm_billing(new_account, save);
                } else {
                    // Otherwise commit the change immediately
                    save();
                }
            });
        },

        refresh: function(dialog) {
            // TODO - properly populate account

            $('.channels.twoway', dialog).html(this.channels.twoway_channels);
            $('.channels.inbound', dialog).html(this.channels.inbound_channels);
        }

    } // End function definitions

);  // End module
