winkstart.module('auth', 'auth',
    {
        templates: {
            thankyou: 'tmpl/thankyou.html',
            recover_password: 'tmpl/recover_password.html',
            login: 'tmpl/login.html',
            register: 'tmpl/register.html'
        },

        subscribe: {
            'auth.activate' : 'activate',
            'auth.login' : 'login',
            'auth.recover_password' : 'recover_password',
            'auth.authenticate' : 'authenticate',
            'auth.register' : 'register',
            'auth.save_registration' : 'save_registration'
        },

        resources: {
            "auth.user_auth": {
                url: winkstart.modules['auth']['api_url'] + '/user_auth',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "auth.shared_auth": {
                url: winkstart.modules['auth']['api_url'] + '/shared_auth',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "auth.register": {
                url: winkstart.modules['auth']['api_url'] + '/signup',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "auth.activate": {
                url: winkstart.modules['auth']['api_url'] + '{activation_key}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "auth.get_user": {
                url: winkstart.modules['auth']['api_url'] + '/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },
    function() {
        winkstart.registerResources(this.config.resources);
        winkstart.publish('appnav.add', {'name' : 'auth'});
        
        // Check if we have an auth token. If yes, assume pre-logged in and show the My Account button
        if (winkstart.modules['auth'].auth_token) {
            $('a#my_account').show();
        }
    },

    {
        request_realm : false,
        realm_suffix : '.sip.2600hz.com',

        register: function() {
            var THIS = this;
            
            var dialogRegister = winkstart.dialog(THIS.templates.register.tmpl({}), {
                title: 'Register a New Account',
                resizable : false
            });

            $('button.register', dialogRegister).click(function(event) {
                event.preventDefault(); // Don't run the usual "click" handler

                var realm;
                if (THIS.request_realm) {
                    realm = $('#realm', dialogRegister).val();
                } else {
                    realm = $('#username', dialogRegister).val() + THIS.realm_suffix;
                }

                var form_data = {
                    'account': {
                        'realm': realm,
                        'app_url': window.location.href
                    },
                    'user': {
                        'username':$('#username', dialogRegister).val(),
                        'password' : $('#password', dialogRegister).val(),
                        'first_name': $('#first_name', dialogRegister).val() ,
                        'last_name':$('#last_name', dialogRegister).val(),
                        'email': $('#email', dialogRegister).val()
                    }
                };

                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.data = form_data;
                winkstart.putJSON('auth.register', rest_data, function (json, xhr) {
                    alert('Registered successfully. Please check your e-mail to activate your account!');
                    dialogRegister.dialog('close');
                });
            });
        },

        login: function() {
            var THIS = this;
            
            var dialogDiv = winkstart.dialog(THIS.templates.login.tmpl({}), {
                title : 'Login',
                resizable : false,
                modal: true
            });

            $('button.login', dialogDiv).click(function(event) {
                event.preventDefault(); // Don't run the usual "click" handler

                var hashed_creds = $('#login', dialogDiv).val() + ':' + $('#password', dialogDiv).val();
                hashed_creds = $.md5(hashed_creds);

                //hash MD5 hashed_creds
                var realm;
                if (THIS.request_realm) {
                    realm = $('#realm', dialogDiv).val();
                } else {
                    realm = $('#login', dialogDiv).val() + THIS.realm_suffix;
                }

                var form_data = {'credentials': hashed_creds, 'realm': realm};
                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.data = form_data;

                winkstart.putJSON('auth.user_auth', rest_data, function (json, xhr) {
                    MASTER_ACCOUNT_ID = json.data.account_id;
                    AUTH_TOKEN = json.auth_token;
                    winkstart.modules['auth']['auth_token'] = json.auth_token;
                    CURRENT_USER_ID = json.data.owner_id;

                    form_data = {'shared_token': winkstart.modules['auth']['auth_token'], 'realm': realm};
                    rest_data = {};
                    rest_data.crossbar = true;
                    rest_data.data = form_data;

                    winkstart.putJSON('auth.shared_auth', rest_data, function (json, xhr) {
                        winkstart.modules['auth']['auth_token'] = json.auth_token;
                        CURRENT_USER_ID = json.data.owner_id;
                        CURRENT_WHAPP = 'voip';
                        dialogDiv.dialog('close');

                        winkstart.getJSON('auth.get_user', {crossbar: true, account_id: MASTER_ACCOUNT_ID, user_id: CURRENT_USER_ID}, function(json, xhr) {
                            $('#my_account').show().html("&nbsp;"+json.data.username);
                            $('#my_logout').html("Logout");
                            $('.main_nav').show();
                        });
                    });
                });
            });

            $('a.register', dialogDiv).click(function(event) {
                event.preventDefault(); // Don't run the usual "click" handler

                $(dialogDiv).dialog('close');   // Close the login dialog

                winkstart.publish('auth.register');
            });

            $('a.recover_password', dialogDiv).click(function(event) {
                event.preventDefault(); // Don't run the usual "click" handler

                $(dialogDiv).dialog('close');   // Close the login dialog

                winkstart.publish('auth.recover_password');
            });
        },

        recover_password: function(args) {
            var THIS = this;
            var dialogDiv = winkstart.dialog(THIS.templates.recover_password.tmpl({}), {
                title: 'Recover Password'
            });
        },

        authenticate: function() {
            // A few things need to be done here
            // 1) If we're not authenticated, do so

            var _t = this;
            amplify.request('auth.establish', {
                username: '',
                passwordhash: ''
            }, function(data) {
                _t.session.authenticated = true;
                _t.session.token         = data.auth_token;
                _t.session.expires       = data.expires;
                alert('User authenticated');
            });
        },
        
        init: function() {
            // Check if we already have a session stored in a cookie
            var auth = $.cookie('winkstart');
            if ( auth ) {
                this.session = auth;
            }
        },

        activate: function() {
            var THIS = this;

            if(ACTIVATION_KEY) {
                var rest_data = { activtion_key : ACTIVATION_KEY, data: {} };
                winkstart.postJSON('auth.activate', rest_data, function (json, xhr) {
                    console.log(json);
                    REALM_LOGIN = json.data.account.realm;
                    alert('You are now registered');
                });
                ACTIVATION_KEY = null;
            }
            else if(AUTH_TOKEN == null) {
                winkstart.publish('auth.login');
            } else {
                if(confirm('Are you sure that you want to log out?')) {
                    AUTH_TOKEN = null;
                    MASTER_ACCOUNT_ID = null;
                    CURRENT_USER_ID = null;
                    $('#ws-content').empty();
                    $('a#my_logout').html("Login");
                    $('a#my_account').hide();
                    winkstart.publish('auth.activate');
                }
            }
        }
    }
);

