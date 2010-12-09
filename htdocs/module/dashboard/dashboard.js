winkstart.module('dashboard', {
		templates: {
			dashboard: 'dashboard.html'
		},
		
		subscribe: {
			'dashboard.activate' : 'activate'
		}
	},
	function(args) {
		winkstart.publish('nav.add', { module: this.__module, label: 'Dashboard' });
	},
	{	activate: function(args) {
			$(args.target).empty();
			
			var THIS = this, dashboard = this.templates.dashboard;
			dashboard.delegate('[data-action]', 'click', function() {
				THIS[$(this).attr('data-action')].call(THIS);
				$(this).after('Server module loaded').remove();
				return false;
			});
			dashboard.appendTo( args.target );
		},
		loadservers: function() {
			winkstart.module.load('server', function() {
				this.init();
			});
		}
	});