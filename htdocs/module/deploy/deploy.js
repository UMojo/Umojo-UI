winkstart.module('deploy', {
		css: [
			'css/style.css'
		],
				
		templates: {
			deploy: 'deploy.html'
		},
		
		subscribe: {
			'deploy.activate' : 'activate',
			'deploy.list-panel-click' : 'viewDevices'
		},
		resources: {
			"deploy.list": {url: CROSSBAR_REST_API_ENDPOINT + '/deploy', dataType: 'json', type: 'GET'},        
			"deploy.get": {url: CROSSBAR_REST_API_ENDPOINT + '/deploy/{id}', dataType: 'json', type: 'GET'}        
		}
	},
	function(args) {
		winkstart.publish('nav.add', { 
			module: this.__module, 
			label: 'DEPLOY', 
			sub: []
		});
	},
	{	
		activate: function(data) {
			var THIS = this;
			$('#ws-content').empty();
        			
			this.templates.deploy.tmpl({}).appendTo( $('#ws-content') );
        		winkstart.registerResources(this.config.resources);
         	
			winkstart.publish('layout.updateLoadedModule', {label: 'Deploy', module: this.__module});         	
		}
	}
);
