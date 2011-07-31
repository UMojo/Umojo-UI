winkstart.module('auth', 'auth', {
		
    templates: {
        thankyou: 'tmpl/thankyou.html',
        recover_password: 'tmpl/recover_password.html',
        login: 'tmpl/login.html',
        register: 'tmpl/register.html'
    },
		
    subscribe: {
        'auth.activate' : 'activate'
    },
        
    css: {
        auth: 'css/auth.css'
    },
        
    resources: {
        "user_auth": {
            url: winkstart.modules['auth']['api_url'] + '/user_auth',
            contentType: 'application/json',
            verb: 'PUT'
        },
        "shared_auth_pbx": {
            url: winkstart.modules['voip']['api_url'] + '/shared_auth',
            contentType: 'application/json',
            verb: 'PUT'
        },
        "register": {
            url: winkstart.modules['auth']['api_url'] + '/signup',
            contentType: 'application/json',
            verb: 'PUT'
        },
        "register.activate": {
            url: winkstart.modules['auth']['api_url']+REGISTRATION_KEY,
            contentType: 'application/json',
            verb: 'POST'
        },
        "user.get": {
            url: winkstart.modules['voip']['api_url'] + '/accounts/{account_id}/users/{user_id}',
            contentType: 'application/json',
            verb: 'GET'
        }
    }
},
function() {
	var THIS = this;
        winkstart.registerResources(this.config.resources);
        winkstart.publish('appnav.add', { 'name' : 'auth' });
    },
    {	
        activate: function() {
            var THIS = this;
            $('#ws-content').empty();
            $('.ui-dialog').remove();
            if(REGISTRATION_KEY != '' ) {
                var rest_data = { data: {}};
                winkstart.postJSON('register.activate', rest_data, function (json, xhr) {
                    console.log(json);
                    REALM_LOGIN = json.data.account.realm;
                    alert('youre now registered'); 
                });
                REGISTRATION_KEY = ''; 
            }
            else if(AUTH_TOKEN == '') {
                $.fx.speeds._default = 800;

                var dialogDiv = winkstart.popup(THIS.templates.login.tmpl({}), { title : 'Login' });
                
/*                .dialog({
                    title: 'Login',
                    width: 456,
                    height: 310,
                    position: 'center',
                    resizable: false,
                    draggable: false,
                    modal: true,
                    show: 'fade',
                    hide: 'fade',
                    open: function() {
                        $('#cross').live('click', function(){
                            $(dialogDiv).dialog('close');
                        });
                    }
                });*/

                //all of the hiding are a temporary dirty ugly unefficient hack
                $('.main_nav').hide();
                $('.submit_btn', dialogDiv).click(function() {
                    var hashed_creds = $('#login', dialogDiv).val() + ':' + $('#password', dialogDiv).val();
                    hashed_creds = $.md5(hashed_creds);
                    //hash MD5 hashed_creds
                    var form_data = { 'credentials': hashed_creds, 'realm': $('#realm', dialogDiv).val() };
                    var rest_data = {};
                    rest_data.crossbar = true;
                    rest_data.data = form_data;
                    winkstart.putJSON('user_auth', rest_data, function (json, xhr) {
                        MASTER_ACCOUNT_ID = json.data.account_id;
                        AUTH_TOKEN = json.auth_token;
                        REALM_LOGIN = $('#realm', dialogDiv).val();
                        winkstart.modules['auth']['auth_token'] = json.auth_token;
                        CURRENT_USER_ID = json.data.owner_id;

                        form_data = { 'shared_token': winkstart.modules['auth']['auth_token'], 'realm': REALM_LOGIN };
                        rest_data = {};
                        rest_data.crossbar = true;
                        rest_data.data = form_data;
                        winkstart.putJSON('shared_auth_pbx', rest_data, function (json, xhr) {
                            winkstart.modules['voip']['auth_token'] = json.auth_token;
                            CURRENT_USER_ID = json.data.owner_id;
                            CURRENT_WHAPP = 'voip';
                            dialogDiv.dialog('close');
                            $('.main_nav').show();
                            winkstart.getJSON('user.get', {crossbar: true, account_id: MASTER_ACCOUNT_ID, user_id: CURRENT_USER_ID}, function(json, xhr) {
                                $('#my_account').html("&nbsp;"+json.data.username);
                                $('#my_logout').html("Logout");
                                $('.main_nav').show();
                            });
                        });
                    });
                });
                $('#register', dialogDiv).click(function() {
                    $.fx.speeds._default = 800;

                    var dialogRegister = THIS.templates.register.tmpl({}).dialog({
                        title: 'Register a new account',
                        width: 456,
                        height: 410,
                        show: 'fade',
                        hide: 'fade',
                    });

                    $('#register_link', dialogRegister).click(function() {
                        var form_data = { 'account': { 'realm': $('#realm', dialogRegister).val() },
                                          'user': {'first_name': $('#first_name', dialogRegister).val() , 'last_name':$('#last_name', dialogRegister).val(),
                                                   'email': $('#email', dialogRegister).val(), 'username':$('#email', dialogRegister).val(), 
                                                   'password' : $('#password', dialogRegister).val()},
                                          'app_url': window.location.href };
                        var rest_data = {};
                        rest_data.crossbar = true;
                        rest_data.data = form_data;
                        winkstart.putJSON('register', rest_data, function (json, xhr) {
                            alert('Registered successfully, please check your e-mail !');
                            dialogRegister.dialog('close');
                        });
                    });

                    $(dialogDiv).dialog('close');
                });
            } else {
                if(confirm('Are you sure that you want to log out?')) {
                    AUTH_TOKEN = '';
                    MASTER_ACCOUNT_ID = '';
                    CURRENT_USER_ID = '';
                    $('#ws-content').empty();
                    $('a#my_logout').html("Login");            
                    $('a#my_account').html("Not connected");            
                    winkstart.publish('auth.activate');
                }
            }
        },

    init: function() {
        // Check if we already have a session stored in a cookie
        var auth = $.cookie('winkstart');
        if ( auth ) {
            this.session = auth;
        }
    },
        
    login: function(args) {
        var THIS = this;
        var dialogDiv = winkstart.popup(THIS.templates.login.tmpl({}), { title : 'Login'} );
        winkstart.publish('sipservice.input_css');
    },

    recover_password: function(args) {
        var THIS = this;
        var dialogDiv = THIS.templates.recover_password.tmpl({}).dialog({
            title: 'Recover Password',
            width: 535,
            height: 200,
            position: 'center'
        });
        winkstart.publish('sipservice.input_css');
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
    }
}
);

