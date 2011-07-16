winkstart.module('connect', 'channels',
    /* Start module resource definitions */
    {
        /* What HTML templates will we be using? */
        templates: {
            edit_channels: 'tmpl/edit_channels.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'channels.refresh' : 'refresh',
            'channels.edit': 'edit'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            /* Circuit Management */
            "channels.get": {
                url: 'https://store.2600hz.com/v1/channels',
                contentType: 'application/json',
                verb: 'GET'
            },
            "channels.post": {
                url: 'https://store.2600hz.com/v1/channels',
                contentType: 'application/json',
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
        channels: {
            twoway_channels : 3,
            inbound_channels : 5
        },

        not_used_anymore_addTrunk: function() {
            if ( 'not from prepay' || checkCredits(25) ) {

                $.ajax({
                    url: "/api/addTrunk",
                    global: true,
                    type: "POST",
                    data: ({
                        key: key,
                        json: JSON.stringify({
                            addTrunks: 1
                        })
                    }),
                    dataType: "json",
                    async:true,
                    success: function(msg){

                        if (msg && msg.errs && msg.errs[0]) {
                            display_errs(msg.errs);
                        }
                        redraw(msg.data);
                    // trigger custom event 'trunkAdded'
                    //TODO: redraw servers and allDIDs
                    //TOD: update credits
                    }
                }
                );
            } else {
                msgAlert('Not enough credits to add a trunk');
                return false;
            }
        },


        not_used_anymore_editTrunks: function(args) {
            var THIS = this;

            THIS.templates.edit_channels.tmpl({}).dialog({
                title: 'Edit Trunks'
            });
        },

        edit: function(args) {
            var THIS = this;
            winkstart.popup(THIS.templates.edit_channels.tmpl(this.channels), {
                title: 'Edit Trunks / Channels'
            });

            $('#update_trunks_button', dialogDiv).click(function() {
                // Grab data from form
                var form_data = form2object('trunks');

                // Show a billing confirmation screen. If they approve it, update the trunks
                winkstart.publish('billing.confirm', { })


                // Update trunk counts on the server
                THIS.account.account.trunks = dialogDiv.find('#trunks').val();
                THIS.account.account.inbound_trunks = dialogDiv.find('#inbound_trunks').val();
                dialogDiv.dialog('close');
                THIS.update_account();
            });

        },

        setTrunks: function(trunks) {
            if ( 'not from prepay' || checkCredits(25) ) {
                winkstart.postJSON("sipservice.channels.post",
                {
                    key: key,
                    json: JSON.stringify({
                        setTrunks: trunks
                    })
                },
                function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);
                // trigger custom event 'trunkAdded'
                //TODO: redraw servers and allDIDs
                //TOD: update credits
                }
                );
            } else {
                msgAlert('Not able to set trunks: credits could not be applied');
                return false;
            }
        },


        refresh: function(dialog) {
            // TODO - properly populate account

            $('.channels.twoway', dialog).html(this.channels.twoway_channels);
            $('.channels.inbound', dialog).html(this.channels.inbound_channels);
        }

    } // End function definitions

    );  // End module
