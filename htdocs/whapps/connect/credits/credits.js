winkstart.module('connect', 'credits',
    /* Start module resource definitions */
    {
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
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);

        // Tie to DOM events
        $('#ws-content').delegate('.credits.manage', 'click', function() {
            winkstart.publish('credits.manage');
        });
    }, // End initialization routine



    /* Define the functions for this module */
    {
        show_estimate: function(dialogDiv) {
            var THIS = this;

            $('#trunks_rate', dialogDiv).html(THIS.rates.trunks);
            $('#inbound_trunks_rate', dialogDiv).html(THIS.rates.inbound_trunks);

            $('#trunks_total', dialogDiv).html(THIS.rates.trunks * $('#trunks', dialogDiv).val());
            $('#inbound_trunks_total', dialogDiv).html(THIS.rates.inbound_trunks * $('#inbound_trunks', dialogDiv).val());
        },

        promo: function(promoCode) {
            // Lookup a promotion & display it, add it to the order if they submit

        },

        manage: function(args) {
            var THIS = this;
            dialogDiv = winkstart.popup(THIS.templates.manage_credits.tmpl(winkstart.modules['connect'].account), {
                title: 'Edit Flat-Rate Channels'
            });

            THIS.show_estimate(dialogDiv);

            $('#trunks, #inbound_trunks', dialogDiv).bind('keyup change', function() {
                THIS.show_estimate(dialogDiv);
            });

            $('.update_channels_button', dialogDiv).click(function() {
                // Grab data from form
                var form_data = form2object('channels');

                // Build the save function here, for use with or without a billing confirmation screen (coming up)
                var save = function() {
                    winkstart.postJSON('channels.post', {
                            data : form_data,
                            account_id : '2600hz'
                        },
                        function(data, xhr) {
                            // Check the response for errors

                            // Close the dialog
                            dialogDiv.dialog('close');
                        }
                    );
                };

                // If a billing confirmation callback was passed in, utilize it and give it the callback to finish things up
                if (args && args.confirm_billing) {
                    $.extend(new_account, winkstart.modules['connect'].account, form_data);
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
