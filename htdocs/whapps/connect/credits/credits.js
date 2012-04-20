winkstart.module('connect', 'credits', {
        css: [
            'css/credits.css'
        ],

        templates: {
            credits: 'tmpl/credits.html',
            credits_dialog: 'tmpl/credits_dialog.html'
        },

        subscribe: {
            'credits.render': 'render_credits',
            'trunkstore.rendered': 'after_trunkstore_render'
        },

        resources: {
            'credits.update': {
                url: '{api_url}/ts_accounts/{account_id}/{billing_system}/credits',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'credits.get': {
                url: '{api_url}/ts_accounts/{account_id}/{billing_system}/credits',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },

    function() {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        add_credits: function(credits, success, error) {
            var THIS = this;

            winkstart.request(true, 'credits.update', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    billing_system: winkstart.apps['connect'].billing_system,
                    data: {
                        'amount': credits
                    }
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

        get_credits: function(success, error) {
            var THIS = this;

            winkstart.request(true, 'credits.get', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    billing_system: winkstart.apps['connect'].billing_system
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

        /* Condition is a function that specifies when the polling should stop (true = continue, false = stop) */
        poll_credits: function(condition, success, error) {
            var THIS = this,
                polling_interval = 30,
                err = 0,
                poll = function(data) {
                    var ret = condition();
                    console.log(ret);
                    if(!ret) {
                        return false;
                    }

                    THIS.get_credits(function(data, status) {
                            if(typeof success == 'function') {
                                success(data, status);
                            }

                            setTimeout(poll, polling_interval * 1000);
                        },
                        function(data, status) {
                            if(err++ < 3) {
                                setTimeout(poll, polling_interval * 1000);
                            }
                            else {
                                if(typeof error == 'function') {
                                    error(data, status);
                                }
                            }
                        }
                    );
                };

            poll();
        },

        render_credits_dialog: function(data, callback) {
            var THIS = this,
                popup_html = THIS.templates.credits_dialog.tmpl(data),
                popup;

            $('.credits.add', popup_html).click(function(ev) {
                ev.preventDefault();

                THIS.add_credits($('input[type="radio"]:checked', popup_html).val(), function(_data) {
                    popup.dialog('close');

                    if(typeof callback == 'function') {
                        callback(_data);
                    }
                });
            });

            popup = winkstart.dialog(popup_html, { title: 'Add Credits' });
        },

        render_credits: function(data, parent) {
            var THIS = this,
                target = $('#credits', parent),
                credits_html = THIS.templates.credits.tmpl(data);

            $('#add_prepay_button', credits_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_credits_dialog(data, function() {
                    THIS.get_credits(function(_data) {
                        $.extend(true, data, {
                            account: {
                                credits: {
                                    prepay: _data.data.amount
                                }
                            }
                        });

                        THIS.render_credits(data, parent);
                    });
                });
            });

            (target)
                .empty()
                .append(credits_html);
        },

        after_trunkstore_render: function(data, parent) {
            var THIS = this,
                target = $('#credits', parent);

            THIS.poll_credits(function() {
                    return (target.parents('body').size() != 0);
                },
                function(_data) {
                    $.extend(true, data, {
                        account: {
                            credits: {
                                prepay: _data.data.amount
                            }
                        }
                    });

                    THIS.render_credits(data, parent);
                }
            );
        }
    }
);
