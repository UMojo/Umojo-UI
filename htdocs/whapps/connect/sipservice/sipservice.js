winkstart.module('connect', 'sipservice', {
        css: [
            'css/sipservice.css',
            'css/style.css',
            'css/popups.css'
        ],

        templates: {
            signup: 'tmpl/signup.html',
            main: 'tmpl/main.html',
            main_services : 'tmpl/main_services.html'
        },

        subscribe: {
            'trunkstore.refresh': 'render_trunkstore',
            'sipservice.activate' : 'activate'
        },

        resources: {
            'trunkstore.create': {
                url: '{api_url}/ts_accounts',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'trunkstore.get': {
                url: '{api_url}/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'trunkstore.update': {
                url: '{api_url}/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        create_account: function(success, error) {
            var THIS = this,
                account_data = {
                    "account": {
                        "credits": {
                            "prepay": "0.00"
                        },
                        "auth_realm": winkstart.apps['auth'].realm,
                        "trunks": "0",
                        "inbound_trunks" : "0"
                    },
                    "billing_account_id": winkstart.apps['connect'].account_id,
                    "DIDs_Unassigned": {},
                    "servers": []
                };

            winkstart.request(true, 'trunkstore.create', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    data: account_data
                },
                function(data, status) {
                    if(typeof success == 'function') {
                        success(data, status);
                    }
                },
                function(data, status) {
                    if(typeof error == 'function') {
                        error(data, status);
                    }
                }
            );
        },

        get_account: function(success, error) {
            var THIS = this;

            winkstart.request(true, 'trunkstore.get', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url
                },
                function(data, status) {
                    if(typeof success == 'function') {
                        success(data, status);
                    }
                },
                function(data, status) {
                    if(typeof error == 'function') {
                        error(data, status);
                    }
                }
            );
        },

        render_trunkstore: function(data, _parent) {
            var THIS = this,
                parent = _parent || $('#ws-content'),
                trunkstore_html = THIS.templates.main.tmpl();

            THIS.templates.main_services.tmpl().appendTo($('#my_services', trunkstore_html));

            winkstart.publish('credits.render', data, trunkstore_html);
            winkstart.publish('channels.render', data, trunkstore_html);
            winkstart.publish('endpoints.render', data, trunkstore_html);
            winkstart.publish('numbers.render', data, trunkstore_html);

            (parent)
                .empty()
                .append(trunkstore_html);

            winkstart.publish('trunkstore.rendered', data, trunkstore_html);
        },

        render_signup: function(_parent) {
            var THIS = this,
                parent = _parent || $('#ws-content'),
                signup_html = THIS.templates.signup.tmpl();

            $('#signup_button', signup_html).click(function(ev) {
                ev.preventDefault();

                THIS.create_account(function(_data) {
                        THIS.render_trunkstore(_data.data, parent);
                    },
                    function(_data, status) {
                        if(status == 400 && _data.message.match(/credit\ card/)) {
                            alert('Whoops! It appears you have no credit card on file. ' +
                                  'You must have a credit card on file before signing up.\n\n' +
                                  'To enter a credit card:\n' +
                                  '1) Click on your account name in the upper lefthand corner of Winkstart.\n' +
                                  '2) Click on the Billing Account tab.\n' +
                                  '3) Fill out your credit card information, then press save.');
                        }
                        else {
                            alert('An error occurred during the signup process,' +
                                  ' please try again later! (Error: ' + status + ')');
                        }
                    }
                );
            });

            (parent)
                .empty()
                .append(signup_html);
        },

        activate: function(parent) {
            var THIS = this;

            THIS.get_account(function(data, status) {
                    /* Hack on first load to get loading... to show up */
                    if(typeof data.data.account == 'object' && 'credits' in data.data.account) {
                        delete data.data.account.credits;
                    }

                    THIS.render_trunkstore(data.data, parent);
                },
                function(data, status) {
                    if(status == 404) {
                        THIS.render_signup(parent);
                    }
                }
            );
        }
    }
);
