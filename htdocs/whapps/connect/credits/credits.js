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
            /* Credit Management */
            'credits.add_credits_prompt' : 'add_credits_prompt',
            'credits.post' : 'post',
            'credits.update' : 'update',
            'credits.change_recurring' : 'change_recurring'
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
    }, // End initialization routine



    /* Define the functions for this module */
    {
        update: function(dialogDiv) {
            var THIS = this;

            $('#trunks_rate', dialogDiv).html(THIS.rates.trunks);
            $('#inbound_trunks_rate', dialogDiv).html(THIS.rates.inbound_trunks);
        },

        add_credits_prompt: function() {
            var THIS = this;

            dialogDiv = winkstart.popup(THIS.templates.add_credits.tmpl(), {
                title: 'Add Credits'
            });

            $('.ctr_btn', dialogDiv).click(function() {
                winkstart.publish('post_credit', {
                    credit_amount : 5,
                    creditCard: 73928372930,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });

            });
        },


		post_credits: function(buyCreds) {
		winstart.request('credits.post', 
			{key: key, json: JSON.stringify({add_credits: buyCreds})},
			function(msg){
					if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs);}
			redraw(msg.data);
	      }
	     );
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


        // {parseFloat(account.credits.prepay).toFixed(2)}
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
