winkstart.module('auth', 'myaccount',
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
        'css/style.css',
        'css/popups.css'
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
            'myaccount.selectApp' : 'selectApp',
            'nav.my_account_click' : 'my_account_click',
            'nav.my_logout_click' : 'my_logout_click',
            'myaccount.activateApp' : 'activateApp',
            'myaccount.deactivateApp' : 'deactivateApp'
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
            },
            "myaccount.user.get": {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "myaccount.user.update": {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'POST'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        // Tell winkstart about the APIs you are going to be using (see top of this file, under resources
        winkstart.registerResources(this.__whapp, this.config.resources);
    }, // End initialization routine
    

    /* Define the functions for this module */
    {

        my_account_click: function() {
            if(winkstart.apps['auth'].auth_token != '') {
                winkstart.publish('myaccount.display');
            }
            else {
                winkstart.publish('auth.activate');
            }
        },
        
        my_logout_click: function() {
            winkstart.publish('auth.activate');
        },

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
                var $itm = $('#'+index);
                // Applying the right class if in the list
                $('#tabs1 .apps').find($itm).addClass('active');
            });
        },
        
        activateApp: function(data) {
            winkstart.getJSON('myaccount.user.get', {
                crossbar: true,
                account_id: winkstart.apps['auth'].account_id,
                api_url: winkstart.apps['auth'].api_url,
                user_id: winkstart.apps['auth'].user_id
            }, function(json, xhr) {
                
                newapp = {};
                
                
                
                if(data.whapp == "voip") {
                    newapp = { "apps": {"voip": {
                        "label": "VoIP Services",
                        "icon": "phone",
                        "api_url": "http://apps001-demo-ord.2600hz.com:8000/v1"
                    }}};
                } else if (data.whapp == "cluster") {
                    newapp = { "apps": {"cluster": {
                        "label": "Cluster Manager",
                        "icon": "cluster_manager",
                        "api_url": "http://apps.2600hz.com:8000/v1"
                    }}};
                } else if (data.whapp == "userportal") {
                    newapp = { "apps": {"userportal": {
                        "label": "User Portal",
                        "icon": "user_portal",
                        "api_url": "http://apps001-demo-ord.2600hz.com:8000/v1"
                    }}};
                } else if (data.whapp == "connect") {
                    newapp = { "apps": {"connect": {
                        "label": "Connect Tool",
                        "icon": "connectivity",
                        "api_url": "http://store.2600hz.com/v1"
                    }}};
                }
                
                final_data = $.extend(true, {}, json.data, newapp);

                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.account_id = winkstart.apps['auth'].account_id,
                rest_data.api_url = winkstart.apps['auth'].api_url,
                rest_data.user_id = winkstart.apps['auth'].user_id;
                rest_data.auth_token = winkstart.apps['auth'].auth_token;
                rest_data.data = final_data;
                
                winkstart.postJSON('myaccount.user.update', rest_data, function (json, xhr) {});
                
                alert('Please REFRESH the page in order to apply the changes');
            });
        },
        
        deactivateApp: function(data) {
            winkstart.getJSON('myaccount.user.get', {
                crossbar: true,
                account_id: winkstart.apps['auth'].account_id,
                api_url: winkstart.apps['auth'].api_url,
                user_id: winkstart.apps['auth'].user_id
            }, function(json, xhr) {

                if(data.whapp == "voip") {
                    delete json.data.apps.voip;
                } else if (data.whapp == "cluster") {
                    delete json.data.apps.cluster;
                } else if (data.whapp == "userportal") {
                    delete json.data.apps.userportal;
                } else if (data.whapp == "connect") {
                    delete json.data.apps.connect;
                }

                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.account_id = winkstart.apps['auth'].account_id,
                rest_data.api_url = winkstart.apps['auth'].api_url,
                rest_data.user_id = winkstart.apps['auth'].user_id;
                rest_data.auth_token = winkstart.apps['auth'].auth_token;
                rest_data.data = json.data;
                
                winkstart.postJSON('myaccount.user.update', rest_data, function (json, xhr) {});
                
                alert('Please REFRESH the page in order to apply the changes');
            });
        },

        display: function() {
            var THIS = this;
            
            var tmpl = {
                api:['Linode', 'Rackspace', 'Amazon']
            };
            
            dialogDiv = winkstart.dialog(THIS.templates.myaccount.tmpl(), {
                height: '640',
                width: '570',
                title: 'My account',
                open:function(){
                    $("#tabs ul").tabs("#tabs .pane > div");
            
                    THIS.templates.apps.tmpl().appendTo('.pane #tabs1');
                    THIS.templates.billing.tmpl().appendTo('.pane #tabs2');
                    THIS.templates.personalinfos.tmpl().appendTo('.pane #tabs3');
                    THIS.templates.apikey.tmpl(tmpl).appendTo('.pane #tabs3');

                    $('#tabs1 .app_holder').click(function() {
                        if($(this).hasClass('active')) {
                            $(this).removeClass('active');
                            winkstart.publish('myaccount.deactivateApp', {
                                whapp: $(this).attr('id')
                            });
                        } else {
                            $(this).addClass('active');
                            winkstart.publish('myaccount.activateApp', {
                                whapp: $(this).attr('id')
                            });
                        }
                    });

                    winkstart.publish('myaccount.selectApp');

                    $('#btnEmail').click(function() {
                        winkstart.publish('myaccount.updateEmail');
                    });

                    $('#btnPwd').click(function() {
                        winkstart.publish('myaccount.updatePwd');
                    });
                }
            });
            
            dialogDiv.css('overflow', 'hidden');
            dialogDiv.css('overflow-y', 'auto');
            
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
