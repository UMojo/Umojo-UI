winkstart.module('dashboard', {
		templates: {
			dashboard: 'dashboard.html'
		},
		
		subscribe: {
			'dashboard.activate' : 'activate'
		}
	},
	function(args) {
		winkstart.publish('nav.add', { 
			module: this.__module, 
			label: 'DASHBOARD', 
			sub: [
				{
					title: 'Sub Nav 1',
					links: [
						{ module: this.__module, label: 'Devices'},
						{ module: this.__module, label: 'Ring Group'},
						{ module: this.__module, label: 'Call Flow'},
						{ module: this.__module, label: 'Conferences'},
						{ module: this.__module, label: 'Feature Codes'}
					]
				},
				{
					title: 'Sub Nav 1',
					links: [
						{ module: this.__module, label: 'Devices'},
						{ module: this.__module, label: 'Ring Group'},
						{ module: this.__module, label: 'Call Flow'},
						{ module: this.__module, label: 'Conferences'},
						{ module: this.__module, label: 'Feature Codes'}
					]
				}
			]
		});
	},
	{	
		activate: function(args) {
			$(args.target).empty();
			
			var THIS = this, dashboard = this.templates.dashboard;
			dashboard.delegate('[data-action]', 'click', function() {
				THIS[$(this).attr('data-action')].call(THIS);
				$(this).after('Server module loaded').remove();
				return false;
			});
			dashboard.appendTo( args.target );
			winkstart.publish('layout.updateLoadedModule', {label: 'User Dashboard', module: this.__module});
		},
		loadservers: function() {
			winkstart.module.load('server', function() {
				this.init();
			});
		}
	}
);