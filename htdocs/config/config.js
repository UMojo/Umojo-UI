( function(winkstart, amplify, $) {

    winkstart.config =  {
        //was winkstart.debug
        debug: false,

        //was winkstart.realm_suffix
        realm_suffix: '.sip.2600hz.com'
    };

    winkstart.apps = {
        'auth' : {   // This is our global/failback auth mechanism
            'api_url': 'http://apps.2600hz.com:8000/v1',
            'label' : 'Login',
            'icon' : 'user',
            'realm' : null,
            'account_id' : null,
            'auth_token' : null,
            'user_id' : null
        }
    };

    amplify.cache = false;
    
    document.title = "2600hz Winkstart";

})(window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {}, jQuery);
