winkstart.module('auth', {
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
			login: 'login.html'
		},
		
		subscribe: {
			'auth.activate' : 'activate'
		},
		
		// Called when modules are to initialize
		init: function() {
			// Check if we already have a session stored in a cookie
			
			var auth = $.cookie('winkstart');
			if ( auth ) {
				this.session = auth;
			}
		},
		
		/*
		render: function(parent) {
			this.nodes.parent = $(parent);
			
			this.nodes.parent.append('<a href="#" class="btn-authenticate">Login</a>');
		},
		*/
		
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
		winkstart.publish('nav.add', { 
			module: this.__module, 
			label: 'LOGIN'
		});
	},
	{	activate: function(args) {
			$(args.target).empty();
			
			this.templates.login.appendTo(args.target);
			winkstart.publish('layout.updateLoadedModule', {label: 'User Authentication', module: this.__module});
		}
	});
