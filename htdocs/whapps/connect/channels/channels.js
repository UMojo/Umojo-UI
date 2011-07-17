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

        updateCosts: function(dialogDiv) {
            var THIS = this;

            $('#trunks_rate', dialogDiv).html(THIS.rates.trunks);
            $('#inbound_trunks_rate', dialogDiv).html(THIS.rates.inbound_trunks);

            $('#trunks_total', dialogDiv).html(THIS.rates.trunks * $('#trunks', dialogDiv).val());
            $('#inbound_trunks_total', dialogDiv).html(THIS.rates.inbound_trunks * $('#inbound_trunks', dialogDiv).val());
        },

        edit: function(args) {
            var THIS = this;
            dialogDiv = winkstart.popup(THIS.templates.edit_channels.tmpl(winkstart.modules['connect'].account), {
                title: 'Edit Flat-Rate Channels'
            });

            THIS.updateCosts(dialogDiv);

            $('#trunks, #inbound_trunks', dialogDiv).bind('keyup change', function() {
                THIS.updateCosts(dialogDiv);
            });

            $('.update_channels_button', dialogDiv).click(function() {
                // Grab data from form
                var form_data = form2object('channels');

                winkstart.postJSON('channels.post', {
                        data : form_data,
                        account_id : '2600hz'
                    },
                    function(data, xhr) {
                        console.log(data);
                    }
                );
                return true;

                // Show a billing confirmation screen. If they approve it, update the trunks
                winkstart.publish('billing.confirm', { });

                // Update trunk counts on the server
                THIS.account.account.trunks = dialogDiv.find('#trunks').val();
                THIS.account.account.inbound_trunks = dialogDiv.find('#inbound_trunks').val();
                dialogDiv.dialog('close');
                THIS.update_account();
            });

        },

        refresh: function(dialog) {
            // TODO - properly populate account

            $('.channels.twoway', dialog).html(this.channels.twoway_channels);
            $('.channels.inbound', dialog).html(this.channels.inbound_channels);
        }

    } // End function definitions

    );  // End module
