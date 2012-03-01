winkstart.module('myaccount', 'personal_info', {
        css: [
            //'css/personal_info.css'
        ],

        templates: {
            info: 'tmpl/personal_info.html'
        },

        subscribe: {
            'personal_info.activate': 'tab_click',
            'myaccount.define_submodules': 'define_submodules'
        },

        resources: {
            'personal_info.user_get': {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'personal_info.user_update': {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            'personal_info.list_account': {
                url: '{api_url}/accounts/{account_id}/children',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        update_acct: function(data, new_data, success, error) {
            winkstart.request('personal_info.user_update', {
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

        tab_click: function(args) {
            var THIS = this,
                target = args.target;

            winkstart.request('personal_info.user_get', {
                    account_id: winkstart.apps['myaccount'].account_id,
                    api_url: winkstart.apps['myaccount'].api_url,
                    user_id: winkstart.apps['myaccount'].user_id
                },
                function(data, status) {
                    winkstart.request('personal_info.list_account', {
                            account_id: winkstart.apps['myaccount'].account_id,
                            api_url: winkstart.apps['myaccount'].api_url
                        },
                        function(_data, status) {
                            data.field_data = data.field_data || {};
                            data.field_data.accounts = _data.data;

                            THIS.render_info(data, target);
                        }
                    );
                }
            );
        },

        render_info: function(data, target) {
            var THIS = this,
                info_html = THIS.templates.info.tmpl(data);

            $('#btnEmail', info_html).click(function() {
                THIS.update_acct(data.data, {
                        email: $('#infos_email', info_html).val()
                    },
                    function() {
                        winkstart.alert('info', 'Email address updated!');
                    }
                );
            });

            $('#btnPwd', info_html).click(function() {
                var pass = $('#infos_pwd1', info_html).val();

                if(pass == $('#infos_pwd2', info_html).val()) {
                    THIS.update_acct(data.data, {
                            password: pass
                        },
                        function() {
                            winkstart.alert('info', 'Password updated!');
                        }
                    );
                }
                else {
                    winkstart.alert('Passwords do not match, please retype the passwords.');
                }
            });

            $('#btnMasquerade', info_html).click(function() {
                var account_id = $('#masquerade_account_select', info_html).val(),
                    account_name = $('#masquerade_account_select option:selected').text();

                $.each(winkstart.apps, function(k, v) {
                    if(k != 'auth') {
                        this.masquerade_account_id = this.masquerade_account_id || this.account_id;
                        this.account_id = account_id;
                    }
                });

                THIS.masquerade_whapps(account_name);

                winkstart.alert('info', 'You are now using ' + account_name + '\'s account');
            });

            (target)
                .empty()
                .append(info_html);
        },

        masquerade_whapps: function(account_name) {
            var THIS = this;

            $('.universal_nav .my_account_wrapper .label .other')
                .html('<br>as<br>' + account_name + '<br><a href="#" class="masquerade">(restore)</a>');

            $('.universal_nav .my_account_wrapper .masquerade').click(function() {
                $.each(winkstart.apps, function(k, v) {
                    if(k != 'auth') {
                        this.account_id = this.masquerade_account_id;

                        $('.universal_nav .my_account_wrapper .label .other').empty();

                        delete this.masquerade_account_id;
                    }
                });
            });
        },

        define_submodules: function(list_submodules) {
            var THIS = this;

            $.extend(list_submodules, {
                'personal_info': {
                    display_name: 'Personal Info'
                }
            });
            list_submodules.list.push('personal_info');
        }
    }
);
