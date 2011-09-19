winkstart.module('auth', 'myaccount',
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
            apikey: 'tmpl/apikey.html',
            personalinfos: 'tmpl/personalinfos.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'myaccount.display' : 'display',
            'myaccount.updatePwd' : 'updatePwd',
            'myaccount.updateEmail' : 'updateEmail',
            'myaccount.selectApp' : 'selectApp'
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

            });
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
            });
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
            });
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

        updateEmail: function() {
            winkstart.getJSON('myaccount.user_get', {
                crossbar: true,
                account_id: winkstart.apps['auth'].account_id,
                api_url: winkstart.apps['auth'].api_url,
                user_id: winkstart.apps['auth'].user_id
            }, function(data, status) {

                data.data.email = $('#infos_email').val();

                winkstart.postJSON('myaccount.user_update', {
                    crossbar: true,
                    account_id: winkstart.apps['auth'].account_id,
                    api_url: winkstart.apps['auth'].api_url,
                    user_id: winkstart.apps['auth'].user_id,
                    data: data.data
                }, function(data, status) {
                    alert('Email changed successfully !');
                })
            });
        },
        
        updatePwd: function() {
            var THIS = this;
            
            if($('#infos_pwd1').val() == $('#infos_pwd2').val()) {
                winkstart.getJSON('myaccount.user_get', {
                    crossbar: true,
                    account_id: winkstart.apps['auth'].account_id,
                    api_url: winkstart.apps['auth'].api_url,
                    user_id: winkstart.apps['auth'].user_id
                }, function(data, status) {

                    data.data.password = $('#infos_pwd1').val();

                    winkstart.postJSON('myaccount.user_update', {
                        crossbar: true,
                        account_id: winkstart.apps['auth'].account_id,
                        api_url: winkstart.apps['auth'].api_url,
                        user_id: winkstart.apps['auth'].user_id,
                        data: data.data
                    }, function(data, status) {
                        alert('Password changed successfully !');
                    })
                });
            } else {
                alert('Please, confirm your password');
            }
        },
        
        selectApp: function() {
            var THIS = this;
            
            // For all the user's current apps 
            $.each(winkstart.apps, function(index, value) {
                // Creating the item object we want to get
                var $itm = $('#'+index+' a');
                // Applying the right class if in the list
                $('#tabs1 .apps ul').find($itm).addClass('active');
            });
        },

        display: function() {
            var THIS = this;
            
            var tmpl = {
                api:['Linode', 'Rackspace', 'Amazon']
            };
            
            $('#ws-content').empty();
            
            THIS.templates.myaccount.tmpl().appendTo( '#ws-content' );
            
            $("#tabs ul").tabs("#tabs .pane > div");
            
            THIS.templates.apps.tmpl().appendTo('.pane #tabs1');
            THIS.templates.billing.tmpl().appendTo('.pane #tabs2');
            THIS.templates.personalinfos.tmpl().appendTo('.pane #tabs3');
            THIS.templates.apikey.tmpl(tmpl).appendTo('.pane #tabs3');
            
            $('#tabs1 li a').click(function() {
                if($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
            });
            
            winkstart.publish('myaccount.selectApp');
            
            $('#btnEmail').click(function() {
                winkstart.publish('myaccount.updateEmail');
            });
            
            $('#btnPwd').click(function() {
                winkstart.publish('myaccount.updatePwd');
            });
            
//            THIS.templates.myaccount.tmpl().dialog({
//                height: '600',
//                width: '500',
//                title: 'My account',
//                open:function(){
//                    THIS.templates.userlevel.tmpl().appendTo('.myaccount_popup #userlevel');
//                    THIS.templates.apps.tmpl().appendTo('.myaccount_popup #apps');
//                    THIS.templates.apikey.tmpl(tmpl).appendTo('.myaccount_popup #apikey');
//                    THIS.templates.billing.tmpl().appendTo('.myaccount_popup #billing');
//                }
//            });
        }
    });  // End module
