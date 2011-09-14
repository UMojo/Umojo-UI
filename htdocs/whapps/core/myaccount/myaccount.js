winkstart.module('core', 'myaccount',
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
        'css/style.css',
        ],

        /* What HTML templates will we be using? */
        templates: {
            myaccount: 'tmpl/myaccount.html',
            billing: 'tmpl/billing.html',
            apps: 'tmpl/apps.html',
            userlevel: 'tmpl/userlevel.html',
            apykey: 'tmpl/apykey.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'myaccount.display' : 'display'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            /* Billing */
            "billing.put": {
                url: 'https://store.2600hz.com/v1/billing',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "billing.get": {
                url: 'https://store.2600hz.com/v1/billing',
                contentType: 'application/json',
                verb: 'GET'
            },
            "billing.delete": {
                url: 'https://store.2600hz.com/v1/billing',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        // Tell winkstart about the APIs you are going to be using (see top of this file, under resources
        winkstart.registerResources(this.__whapp, this.config.resources);

        // This app is slightly invasive - it assumes it should always be bound to an element named my_account anywhere on the page
        $('#my_account').live('click', function() {
            if(winkstart.apps['auth'].auth_token != '') {
                winkstart.publish('myaccount.display');
            }
            else {
                winkstart.publish('auth.activate');
            }
        });
        $('a#my_logout').live('click', function() {
            winkstart.publish('auth.activate');
        });
    }, // End initialization routine



    /* Define the functions for this module */
    {
        add_creditCard: function(frm) {
            winkstart.postJSON('sipservice.billing.put',
            {
                key: key,
                json: JSON.stringify(frm.serializeObject())
            },
            function(msg){
                if (msg && msg.errs && msg.errs[0]) {
                    display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                }

            }
            )
        },

        delCreditCard: function(tid) {
            winkstart.postJSON('sipservice.billing.delete',
            {
                key: key,
                json: JSON.stringify({
                    token: tid
                })
            },
            function(msg){
                if (msg && msg.errs && msg.errs[0]) {
                    display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                }

            }
            );
        },

        addPromoCode: function(pc) {

            winkstart.postJSON('sipservice.billing.put',
            {
                key: key,
                json: JSON.stringify({
                    promo_code: pc
                })
            },
            function(msg){
                if (msg && msg.errs && msg.errs[0]) {
                    display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                }

            }
            );
        },

        edit_billing: function() {
            var THIS = this;

            //var dialogDiv = winkstart.dialog(THIS.templates.add_credits.tmpl(), { title : 'Add Credits' } );
            var dialogDiv = THIS.templates.edit_billing.tmpl({}).dialog({
                title: 'Add Billing Account',
                position: 'center',
                height: 700,
                width: 620
            });

            winkstart.publish('sipservice.input_css');

            $(dialogDiv).find('.submit_btn').click(function() {
                winkstart.publish('sipservice.post_billing', {
                    card_number : 8969756879,
                    car_name: 'John Doe',
                    address: '123, Some Street NoWhereCity Ca',
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });

            });
        },

        post_billing: function(data) {

            winkstart.postJSON('sipservice.billing.put',
            {
                data: {
                    card_number: data.card_number,
                    car_name: data.car_name,
                    address: data.address
                }
            },
            function(json){
                if (json && json.errs && json.errs[0]) {
                    display_errs(json.errs, null, eval(json.errs[0].cb) );
                    redraw(json.data);
                }
            });
        },

        showMyAccountPrompt: function(opts) {
            if (typeof opts != 'object') {
                opts = new Object();
            }
            winkstart.getJSON("sipservice.billing.get",
            {
                key: key,
                json: JSON.stringify({})
            }, function(jdata) {
                jdata.tmplOpts = typeof opts.tmplOpts == 'object' ? opts.tmplOpts : {} ;
                jdata.fa = typeof opts.fa == 'object' ? opts.fa : {} ;
                //winkstart.log(JSON.stringify(jdata));
                winkstart.dialog($('#tmpl_display_acct_info').tmpl(jdata), {
                    title: 'Account Billing Information'
                });
            });
        },



        display: function() {
            var THIS = this;
            
            var tmpl = {
                apy:['Linode', 'Rackspace', 'Amazon']
                };
            
            THIS.templates.myaccount.tmpl().dialog({
                height: '600',
                width: '500',
                title: 'My account',
                open:function(){
                    THIS.templates.userlevel.tmpl().appendTo('.myaccount_popup #userlevel');
                    THIS.templates.apps.tmpl().appendTo('.myaccount_popup #apps');
                    THIS.templates.apykey.tmpl(tmpl).appendTo('.myaccount_popup #apykey');
                    THIS.templates.billing.tmpl().appendTo('.myaccount_popup #billing');
                }
            });
        }
    }
    );  // End module
