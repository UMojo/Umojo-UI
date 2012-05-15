winkstart.module('myaccount', 'billing', {
        css: [
            'css/billing.css'
        ],

        templates: {
            billing: 'tmpl/billing.html'
        },

        subscribe: {
            'myaccount.nav.post_loaded': 'myaccount_loaded',
            'billing.popup': 'popup'
        },

        resources: {
            'billing.user_get': {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'billing.user_update': {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'billing.update': {
                url: '{api_url}/accounts/{account_id}/braintree/customer',
                contentType: 'application/json',
                verb: 'POST'
            },
            'billing.get': {
                url: '{api_url}/accounts/{account_id}/braintree/customer',
                contentType: 'application/json',
                verb: 'GET'
            },
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        update_acct: function(data, new_data, success, error) {
            winkstart.request('billing.user_update', {
                    account_id: winkstart.apps['myaccount'].account_id,
                    api_url: winkstart.apps['myaccount'].api_url,
                    user_id: winkstart.apps['myaccount'].user_id,
                    data: $.extend(true, {}, data, new_data)
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        myaccount_loaded: function() {
            winkstart.publish('nav.add_sublink', {
                link: 'nav',
                sublink: 'billing',
                label: 'Billing',
                weight: '10',
                publish: 'billing.popup'
            });
        },

        update_billing: function(data, new_data, success, error) {
            winkstart.request('billing.update', {
                    account_id: winkstart.apps['myaccount'].account_id,
                    api_url: winkstart.apps['myaccount'].api_url,
                    data: $.extend(true, {}, data, new_data)
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        render_billing: function(data, target) {
            var THIS = this,
                billing_html = THIS.templates.billing.tmpl(data);

            $('#save-billing', billing_html).click(function() {
                var form_data = form2object('billing-form');

                THIS.clean_billing_form_data(form_data);

                THIS.update_billing({}, form_data, function(_data) {
                        THIS.render_billing(_data, target);

                        winkstart.alert('info', 'Credit card updated!');
                    },
                    function(_data, status) {
                        if(status == 400) {
                            winkstart.alert('error', 'The following errors occurred:<br/><br/>' + _data.data.message.replace(/\./g, '<br/>'));
                        }
                        else {
                            winkstart.alert('error', 'There was an unspecified server error, please try again later.');
                        }
                    }
                );
            });
            (target)
                .empty()
                .append(billing_html);
        },

        popup: function(){
            var THIS = this,
                popup_html = $('<div class="inline_popup"><div class="inline_content main_content"/></div>');

             winkstart.request('billing.get', {
                    account_id: winkstart.apps['myaccount'].account_id,
                    api_url: winkstart.apps['myaccount'].api_url
                },
                function(data, status) {
                    var defaults = {
                        data: {
                            credit_cards: [{
                                billing_address: {}
                            }]
                        }
                    }; 

                    THIS.render_billing($.extend(true, defaults, data), $('.inline_content', popup_html));

                    winkstart.dialog(popup_html, {
                        modal: true,
                        title: 'Billing',
                        autoOpen: true
                    });
                }
            );
            
        },

        clean_billing_form_data: function(form_data) {
            if(form_data.credit_card.number.indexOf('*') != -1) {
                delete form_data.credit_card.number;
            }

            if(form_data.credit_card.cvv == '') {
                delete form_data.credit_card.cvv;
            }

            if(form_data.credit_card.billing_address.country_code_three == '') {
                delete form_data.credit_card.billing_address.country_code_three;
            }


            return form_data;
        }
    }
);
