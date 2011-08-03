winkstart.module('connect', 'channels',
    /* Start module resource definitions */
    {
        /* What HTML templates will we be using? */
        templates: {
            edit_channels: 'tmpl/edit_channels.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'channels.edit': 'edit'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            /* Circuit Management */
            "channels.get": {
                url: 'https://store.2600hz.com/v1/{account_id}/channels',
                verb: 'GET'
            },
            "channels.post": {
                url: 'https://store.2600hz.com/v1/{account_id}/channels',
                verb: 'POST'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);

        // Tie to DOM events
        $('#ws-content').delegate('.channels.edit', 'click', function() {
            winkstart.publish('channels.edit');
        });

    }, // End initialization routine



    /* Define the functions for this module */
    {
        rates : { trunks : 30.00, inbound_trunks : 4.00 },

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

        edit: function() {
            var THIS = this;
            dialogDiv = winkstart.dialog(THIS.templates.edit_channels.tmpl(winkstart.apps['connect'].account), {
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
                        function(json, xhr) {
                            // Check the response for errors

                            // Close the dialog
                            dialogDiv.dialog('close');

                            winkstart.apps['connect'].account = json.data;
                            winkstart.publish('channels.refresh');
                        }
                    );
                };

                var new_account = {};
                $.extend(new_account, winkstart.apps['connect'].account, form_data);
                
                // If an account change handler (such as a wizard or a billing confirmation callback) is registered, use it
                if (!winkstart.publish('sipservice.change_handler', { 'account' : new_account, 'save' : save })) {
                    // Otherwise commit the change immediately
                    save();
                }
            });
        }/*,

        refresh: function(dialog) {
            // TODO - properly populate account

            $('.channels.twoway', dialog).html(this.channels.twoway_channels);
            $('.channels.inbound', dialog).html(this.channels.inbound_channels);
        }*/

    } // End function definitions

    );  // End module
