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
            'auth.load_account' : 'load_account',
            'auth.recover_password' : 'recover_password',
            'auth.authenticate' : 'authenticate',
            'auth.shared_auth' : 'shared_auth',
            'auth.register' : 'register',
            'auth.save_registration' : 'save_registration'
        },

        resources: {
            "auth.user_auth": {
                url: winkstart.apps['auth']['api_url'] + '/user_auth',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "auth.shared_auth": {
                url: '{api_url}/shared_auth',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "auth.register": {
                url: winkstart.apps['auth']['api_url'] + '/signup',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "auth.activate": {
                url: winkstart.apps['auth']['api_url'] + '{activation_key}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "auth.get_user": {
                url: winkstart.apps['auth']['api_url'] + '/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },
    function() {
        winkstart.registerResources(this.__whapp, this.config.resources);
        winkstart.publish('appnav.add', {'name' : 'auth'});
        
        // Check if we have an auth token. If yes, assume pre-logged in and show the My Account button
        if (winkstart.apps['auth'].auth_token) {
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

                var rest_data = {
                    crossbar : true,
                    data : {
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
                    }
                };
                winkstart.putJSON('auth.register', rest_data, function (json, xhr) {
                    alert('Registered successfully. Please check your e-mail to activate your account!');
                    dialogRegister.dialog('close');
                });
            });
        },

        login: function() {
            console.log('GOT HERE');
            var THIS = this;
            
            var dialogDiv = winkstart.dialog(THIS.templates.login.tmpl({}), {
                title : 'Login',
                resizable : false,
                modal: true
            });

            $('button.login', dialogDiv).click(function(event) {
                console.log('OR HERE');
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

                var rest_data = {
                    crossbar : true,
                    data : {
                        'credentials': hashed_creds, 
                        'realm': realm 
                    }
                };

                winkstart.putJSON('auth.user_auth', rest_data, function (json, xhr) {
                    winkstart.apps['auth'].account_id = json.data.account_id;
                    winkstart.apps['auth'].auth_token = json.auth_token;
                    winkstart.apps['auth'].user_id = json.data.owner_id;
                    winkstart.apps['auth'].realm = realm;

                    $(dialogDiv).dialog('close');

                    winkstart.publish('auth.load_account');
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

        load_account: function(args) {
            console.log('Loading your apps!');
            rest_data = {
                crossbar : true,
                account_id : winkstart.apps['auth'].account_id,
                user_id : winkstart.apps['auth'].user_id
            }

            winkstart.getJSON('auth.get_user', rest_data, function (json, xhr) {
                $('a#my_logout').html("Logout");
                $('a#my_account').html(json.data.first_name + ' ' + json.data.last_name).show();

                $.each(json.data.apps, function(k, v) {
                    winkstart.log('WhApps: Loading ' + k + ' from URL ' + v.api_url);
                    winkstart.apps[k] = v;
                    
                    // TODO: This is a hack. This should not be done - instead, a failback routine should go into the core
                    /*winkstart.apps[k].account_id = winkstart.apps['auth'].account_id;
                    winkstart.apps[k].user_id = winkstart.apps['auth'].user_id;
                    winkstart.apps[k].auth_token = winkstart.apps['auth'].auth_token;*/

                    winkstart.module.loadApp(k, function() {
                        this.init();
                        winkstart.log('WhApps: Initializing ' + k);
                    })
                });
            });

        },

        // Use this to attempt a shared auth token login if the requested app doesn't have it's own auth token.
        // TODO: If this fails, pop-up a login box for this particular app
        shared_auth: function(args) {
            var THIS = this;
            var app_name = args.app_name;

            rest_data = {
                crossbar : true,
                api_url : winkstart.apps[app_name].api_url,
                data: {
                    realm : winkstart.apps['auth'].realm,                     // Treat auth as global
                    shared_token : winkstart.apps['auth'].auth_token          // Treat auth as global
                }
            };

            winkstart.putJSON('auth.shared_auth', rest_data, function (json, xhr) {
                // If this is successful, we'll get a server-specific auth token back
                winkstart.apps[app_name]['auth_token'] = json.auth_token;

                winkstart.getJSON('auth.get_user', {crossbar: true, account_id: winkstart.apps['auth'].account_id, user_id: winkstart.apps['auth'].user_id}, function(json, xhr) {
                    $('#my_account').show().html("&nbsp;"+json.data.username);
                    $('#my_logout').html("Logout");
                    $('.main_nav').show();
                });
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
/*            if(ACTIVATION_KEY) {
                var rest_data = { activtion_key : ACTIVATION_KEY, data: {} };
                winkstart.postJSON('auth.activate', rest_data, function (json, xhr) {
                    console.log(json);
                    REALM_LOGIN = json.data.account.realm;
                    alert('You are now registered');
                });
                ACTIVATION_KEY = null;
            }
            else */
            if(winkstart.apps['auth'].auth_token == null) {
                winkstart.publish('auth.login');
            } else {
                if(confirm('Are you sure that you want to log out?')) {
                    // Remove any individual keys
                    $.each(winkstart.apps, function(k, v) {
                        // TODO: ADD APP UNLOADING CODE HERE. Remove CSS and scripts. This should inherently delete apps.

                        winkstart.apps[k].realm = null;
                        winkstart.apps[k].auth_token = null;
                        winkstart.apps[k].user_id = null;
                        winkstart.apps[k].account_id = null;
                    });
                    
                    $('#ws-content').empty();
                    $('a#my_logout').html("Login");
                    $('a#my_account').hide();

                    // Temporary hack until module unloading works properly
                    window.location.reload();

                    //winkstart.publish('auth.activate');
                }
            }
        }
    }
);

