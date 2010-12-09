// This is the server module
winkstart.module('server', {
		/*
		css: ['server.css'],
		
		plugins: ['validate'],
		
		requests : {
			'server.create' : { url : 'api/v2/server/create' },
			'server.get'    : { url : 'api/v2/server/get' },
			'server.save'   : { url : 'api/v2/server/save' },
			'server.delete' : { url : 'api/v2/server/delete' }
		}
		*/
		templates: {
			server: 'server.html'
		},
		subscribe: {
			'server.activate' : 'activate'
		}
	},
	function() {
		winkstart.publish('nav.add', { module: this.__module, label: 'Servers' });
		
		//amplify.route('server.dashboard', '/server*');
		//amplify.route.watch('server.dashboard', function() {
			
		//});
	},
	{	activate: function(args) {
			$(args.target).empty();
			this.templates.server.appendTo(args.target);
		}
	});
