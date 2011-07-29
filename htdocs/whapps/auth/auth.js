winkstart.module('auth', 'auth', {
		
    templates: {
        thankyou: 'tmpl/thankyou.html',
        edit_billing: 'tmpl/edit_billing.html',
        recover_password: 'tmpl/recover_password.html',
        login: 'tmpl/login.html'
    },
		
    subscribe: {
        'auth.activate' : 'activate'
    },
        
    css: {
        auth: 'css/auth.css'
    },
        
    resources: {
        "user_auth": {
            url: CROSSBAR_REST_API_ENDPOINT + '/user_auth',
            contentType: 'application/json',
            verb: 'PUT'
        },
        "user.get": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/users/{user_id}',
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
                        $('#cross').click(function(){
                            $(dialogDiv).dialog('close');
                        });
            if(AUTH_TOKEN == '') {
                $.fx.speeds._default = 800;

                var dialogDiv = THIS.templates.login.tmpl({}).dialog({
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
                        $('.ui-dialog-titlebar').remove();
                        $('.ui-dialog').css('border', 'none');
                        $('.ui-dialog').css('background-image', 'url("whapps/core/layout/images/popup_bg.png")');
                        $('.ui-dialog').css('background-repeat', 'no-repeat');
                        $('.ui-dialog').css('background-color', 'transparent');

                        $('.ui-widget-overlay').css('background', 'black');
                        $('.ui-widget-overlay').css('opacity', '0.8');
                        $('#cross').live('click', function(){
                            $(dialogDiv).dialog('close');
                        });
                    }
                });

                //all of the hiding are a temporary dirty ugly unefficient hack
                $('.main_nav').hide();
                $(dialogDiv).find('.submit_btn').click(function() { 
                    var hashed_creds = $('#login', dialogDiv).val() + ':' + $('#password', dialogDiv).val();
                    hashed_creds = $.md5(hashed_creds);
                    //hash MD5 hashed_creds
                    var form_data = { 'credentials': hashed_creds, 'realm': $('#realm', dialogDiv).val() };
                    var rest_data = {};
                    rest_data.crossbar = true;
                    rest_data.data = form_data;
                    winkstart.putJSON('user_auth', rest_data, function (json, xhr) {
                        $('.main_nav').show();
                        MASTER_ACCOUNT_ID = json.data.account_id;
                        AUTH_TOKEN = json.auth_token;
                        CURRENT_USER_ID = json.data.owner_id;
                        dialogDiv.dialog('close');
                        winkstart.getJSON('user.get', {crossbar: true, account_id: MASTER_ACCOUNT_ID, user_id: CURRENT_USER_ID}, function(json, xhr) {
                            $('#my_account').html("&nbsp;"+json.data.username);
                            $('#my_logout').html("Logout");          
                            $('.main_nav').show(); 
                        });
                    });
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
        var dialogDiv = THIS.templates.login.tmpl({}).dialog({
            title: 'Login',
            width: 540,
            height: 320,
            position: 'center'
        });
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

