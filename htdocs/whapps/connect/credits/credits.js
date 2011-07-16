winkstart.module('connect', 'credits',
    /* Start module resource definitions */
    {
        /* What HTML templates will we be using? */
        templates: {
            add_credits: 'tmpl/add_credits.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'credits.activate' : 'activate',
            'sipservice.refresh' : 'refresh',
            /* Credit Management */
            'credits.add_credits' : 'add_credits',
            'credits.post_credit' : 'post_credit',
            'credits.change_recurring' : 'change_recurring',
            'credits.edit_billing' : 'edit_billing',
            'credits.post_billing' : 'post_billing'
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
        add_credits: function() {
            var THIS = this;

            dialogDiv = winkstart.popup(THIS.templates.add_credits.tmpl(), {
                title: 'Add Credits'
            });

            $('.ctr_btn', dialogDiv).click(function() {
                winkstart.publish('sipservice.post_credit', {
                    credit_amount : 5,
                    creditCard: 73928372930,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });

            });
        },

        // credit mgmt
        updatePreAuth: function(){
            var newItems = $('.inCart');
            rCost=0;
            oCost=0;
            $.each(newItems, function(index, elm) {

                if ( isNaN( parseInt( $(elm).dataset('qty') ) ) ) {
                    rCost+=$(elm).dataset('recurringCost') *1;
                    oCost+=$(elm).dataset('oneTimeCost') * 1;
                } else {
                    rCost+=$(elm).dataset('recurringCost') * $(elm).dataset('qty');
                    oCost+=$(elm).dataset('oneTimeCost') * $(elm).dataset('qty');
                }
            });

            return {
                rCost: rCost,
                oCost: oCost
            };
        },

        checkCredits: function(bill) {
            return true; // not doing pre-paid
            if(acct.account.credits.prepay > bill) {
                return acct.account.credits.prepay - bill;
            } else {
                return false;
            }
        },


    refresh_services: function(account) {
        var THIS = this;

        winkstart.log('Refreshing Services...');
        $('#my_services').empty();
        THIS.templates.main_services.tmpl( account ).appendTo ( $('#my_services') );
    },

        refresh: function() {
            var THIS = this;
            /* Draw our base template into the window */
            THIS.templates.index.tmpl(winkstart.modules['connect'].account).appendTo( $('#my_credits') );
        },

        activate: function(data) {
            // This is where we define our click listeners (NOT INLINE IN THE HTML)
            $('#my_services').delegate('#add_prepay_button', 'click', function() {
                winkstart.publish('sipservice.add_credits');
            });
        }
    } // End function definitions

    );  // End module
