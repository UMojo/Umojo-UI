winkstart.module('connect', 'discount',
    /* Start module resource definitions */
    {
        /* What HTML templates will we be using? */
        templates: {
            edit_discount: 'tmpl/edit_discount.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            /* Discount Management */
            'discount.edit' : 'edit',
            'discount.update' : 'update'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            'credits.post': {
                url: 'https://store.2600hz.com/v1/{account_id}/promo',
                contentType: 'application/json',
                verb: 'POST'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function() {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.__whapp, this.config.resources);

        // Tie to DOM events
        $('#ws-content').delegate('.discount.edit', 'click', function() {
            winkstart.publish('discount.edit');
        });
    }, // End initialization routine



    /* Define the functions for this module */
    {
        edit: function() {
            var dialogDiv = winkstart.dialog(this.templates.edit_discount.tmpl(winkstart.apps['connect'].account), {
                title: 'Edit Discount'
            });

            $('.submit_btn', dialogDiv).click(function() {
                var data = $.extend({}, args, form2object('discount'));     // Grab data from failover form

                // TODO: Validate data here

                // Request an update & provide a callback for success or failure
                winkstart.publish('discount.update', {
                    data : data,
                    success : function() {
                        // On success, close the dialog.
                        dialogDiv.dialog('close');

                        if (args.success) {
                            args.success(args);
                        }
                    },
                    error : function() {
                        alert('Failed to save.');
                    }
                })
            });
        },

        update: function(args) {
            winkstart.postJSON('discount.update',
                {
                    data: args.data,
                    account_id : winkstart.apps['connect'].account_id
                },
                function(json) {
                    if (json.errs && json.errs[0] && json.errs[0].type == 'info') {
                        winkstart.apps['connect'].account = json.data;
                        winkstart.publish('discount.refresh');
                        if (args.success)
                            args.success();
                    } else if (json.errs && json.errs[0] && json.errs[0].type == 'error') {
                        alert(json.errs[0].msg);
                    } else {
                        // TODO: Better process XHR here
                        alert('We had trouble talking to the server. Are you sure you\'re online?');
                    }
                }
            );
        },


    } // End function definitions

);  // End module
