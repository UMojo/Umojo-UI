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
            'nav.my_account_click' : 'my_account_click',
            'nav.my_logout_click' : 'my_logout_click',
            'myaccount.app.selectApp' : 'selectApp',
            'myaccount.app.activateApp' : 'activateApp',
            'myaccount.app.deactivateApp' : 'deactivateApp',
            'myaccount.billing.saveBillingForm' : 'saveBillingForm'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            /* Billing */
            "billing.post": {
                url: '{api_url}/accounts/{account_id}/braintree/customer',
                contentType: 'application/json',
                verb: 'POST'
            },
            "billing.get": {
                url: '{api_url}/accounts/{account_id}/braintree/customer',
                contentType: 'application/json',
                verb: 'GET'
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
        
        saveBillingForm: function(form_data) {
            var THIS = this;
            
            if (form_data.credit_card.number.indexOf('*') != -1) {
                delete form_data.credit_card.number;
            }
            
            var rest_data = {};
            rest_data.crossbar = true;
            rest_data.api_url = 'http://apps002-dev-ord.2600hz.com:8000/v1';
            rest_data.account_id = 'c0705d7474ea0160c10a351b2544006b';
            rest_data.data = form_data;
            
            winkstart.postJSON('billing.post', rest_data, function() {
                alert('Billing datas saved successfully.');
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
                    // This is for test only. DON'T FORGET TO PUT THE AUTH_TOKEN when everything is finish
                    billing_rest_data = {};
                    billing_rest_data.api_url = 'http://apps002-dev-ord.2600hz.com:8000/v1';
                    billing_rest_data.account_id = 'c0705d7474ea0160c10a351b2544006b';
                    billing_rest_data.crossbar = true;

                    winkstart.getJSON('billing.get', billing_rest_data, function(data, status) {
                        var tmpl_billing_data = {};
                        var base_billing_data = {};
                        base_billing_data = {
                           "data":{
                              "first_name":"",
                              "last_name":"",
                              "company":"",
                              "website":"",
                              "phone":"",
                              "fax":"",
                              "email":"",
                              "credit_cards": [{
                                 "number":"",
                                 "expiration_date":"",
                                 "cvv":"",
                                 "cardholder_name":"",
                                 "billing_address":{
                                    "first_name":"",
                                    "last_name":"",
                                    "company":"",
                                    "street_address":"",
                                    "extended_address":"",
                                    "locality":"",
                                    "region":"",
                                    "postal_code":"",
                                    "country_code_three":""
                                 }
                              }] 
                           }
                        };
                        
                        tmpl_billing_data = $.extend(true, {}, base_billing_data, data);
                        
                        $("#tabs ul").tabs("#tabs .pane > div");
            
                        THIS.templates.apps.tmpl().appendTo('.pane #tabs1');
                        THIS.templates.billing.tmpl(tmpl_billing_data).appendTo('.pane #tabs2');
                        THIS.templates.personalinfos.tmpl().appendTo('.pane #tabs3');
                        THIS.templates.apikey.tmpl(tmpl).appendTo('.pane #tabs3');

                        // Apps
                        $('#tabs1 .app_holder').click(function() {
                            if($(this).hasClass('active')) {
                                $(this).removeClass('active');
                                winkstart.publish('myaccount.app.deactivateApp', {
                                    whapp: $(this).attr('id')
                                });
                            } else {
                                $(this).addClass('active');
                                winkstart.publish('myaccount.app.activateApp', {
                                    whapp: $(this).attr('id')
                                });
                            }
                        });

                        winkstart.publish('myaccount.app.selectApp');

                        $('#btnEmail').click(function() {
                            winkstart.publish('myaccount.updateEmail');
                        });

                        $('#btnPwd').click(function() {
                            winkstart.publish('myaccount.updatePwd');
                        });
                        
                        $('.myaccount_popup #save-billing').click(function() {
                            var form_data = form2object('billing-form');
                            
                            THIS.saveBillingForm(form_data);
                        });
                    });
                }
            });
            
            dialogDiv.css('overflow', 'hidden');
            dialogDiv.css('overflow-y', 'auto');
        }
    });  // End module
