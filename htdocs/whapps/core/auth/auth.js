winkstart.module('core', 'auth', {
    session: {
        authenticated: false,
        username: '',
        token: '',
        expires: -1
    },
		
    requests: {
        'auth.establish' : 'api/v2/authentication/establish',
        'auth.destroy'   : 'api/v2/authentication/destroy'
    },
		
    events: {
        'a.btn-authenticate' : 'authenticate'
    },
		
    templates: {
        login: 'login.html',
        thankyou: 'tmpl/thankyou.html',
        edit_billing: 'tmpl/edit_billing.html',
        recover_password: 'tmpl/recover_password.html',
        login: 'tmpl/login.html'
    },
		
    subscribe: {
        'auth.activate' : 'activate'
    },

    resources: {
        /* User Management */
        "sipservice.addUser": {
            url: 'https://store.2600hz.com/v1/addUser',
            contentType: 'application/json',
            verb: 'POST'
        },

        "sipservice.editUser": {
            url: 'https://store.2600hz.com/v1/editUser',
            contentType: 'application/json',
            verb: 'POST'
        },

        "sipservice.getUser": {
            url: 'https://store.2600hz.com/v1/getUser',
            contentType: 'application/json',
            verb: 'POST'
        },

        "sipservice.checkIfExists": {
            url: 'https://store.2600hz.com/v1/checkIfExists',
            contentType: 'application/json',
            verb: 'GET'
        },

        "sipservice.getUserAuth": {
            url: 'https://store.2600hz.com/v1/getUserAuth',
            contentType: 'application/json',
            verb: 'POST'
        }
    },
		
    // Called when modules are to initialize
    init: function() {
        // Check if we already have a session stored in a cookie
			
        var auth = $.cookie('winkstart');
        if ( auth ) {
            this.session = auth;
        }
    },
		
    render: function(parent) {
            this.nodes.parent = $(parent);

            this.nodes.parent.append('<a href="#" class="btn-authenticate">Login</a>');
    },
		
    login: function(args) {
        var THIS = this;

        var dialogDiv = THIS.templates.login.tmpl({}).dialog({
            title: 'Login',
            width: 540,
            height: 320,
            position: 'center'
        });
    },

    recover_password: function(args) {
        var THIS = this;

        var dialogDiv = THIS.templates.recover_password.tmpl({}).dialog({
            title: 'Recover Password',
            width: 535,
            height: 200,
            position: 'center'
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
    }
},
function(args) {
    winkstart.publish('subnav.add', {
        module: this.__module,
        label: 'Login',
        nav_category: 'category-1'
    });
},
{
    activate: function(args) {
        $(args.target).empty();
			
        this.templates.login.appendTo(args.target);
        winkstart.publish('layout.updateLoadedModule', {
            label: 'User Authentication',
            module: this.__module
            });
    }
});
