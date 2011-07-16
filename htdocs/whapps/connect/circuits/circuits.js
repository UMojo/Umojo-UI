winkstart.module('connect', 'circuits',
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
        'css/style.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            edit_trunks: 'tmpl/edit_trunks.html',
            edit_circuits: 'tmpl/edit_trunks.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'circuits.activate' : 'activate',
            'sipservice.refresh' : 'refresh',
            'sipservice.edit_trunks': 'edit_trunks',
            'sipservice.edit_circuits': 'edit_circuits'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            /* Circuit Management */
            "circuits.get": {
                url: 'https://store.2600hz.com/v1/circuits',
                contentType: 'application/json',
                verb: 'GET'
            },
            "circuits.post": {
                url: 'https://store.2600hz.com/v1/circuits',
                contentType: 'application/json',
                verb: 'POST'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);
    }, // End initialization routine



    /* Define the functions for this module */
    {
        /**********************
     * Recurring Services *
     **********************/
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

            THIS.templates.edit_trunks.tmpl({}).dialog({
                title: 'Edit Trunks'
            });
        },

        edit_circuits: function(args) {
            var THIS = this;
            winkstart.popup(THIS.templates.edit_circuits.tmpl(THIS), {
                title: 'Edit Trunks / Circuits'
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
                winkstart.postJSON("sipservice.circuits.post",
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

        delTrunk: function(trunks) {
            console.log('no longer used?');
            return;
            if (acct.account.trunks < trunks) {
                msgAlert('Not enough trunks to remove!');
                return false;
            }
            $.ajax({
                url: "/api/delTrunk",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify({
                        delTrunks: trunks
                    })
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    acct=msg;
                    //TODO: redraw trunks
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);

                }

            }
            );
        },


        refresh: function() {
            var THIS = this;
            /* Draw our base template into the window */
            THIS.templates.index.tmpl(winkstart.modules['connect'].account).appendTo( $('#my_circuits') );
        },

        activate: function(data) {
        }
    } // End function definitions

    );  // End module
