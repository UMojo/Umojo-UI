winkstart.module('deploy', {
		css: [
			'css/style.css'
		],
				
		templates: {
			deploy: 'deploy.html',
			form: 'tmpl/form.html',
			advform: 'tmpl/advform.html',
			server: 'tmpl/server.html'
		},
		
		subscribe: {
			'deploy.activate' : 'activate',
		},
		resources: {
			"deploy.list": {url: CROSSBAR_REST_API_ENDPOINT + '/servers', dataType: 'json', type: 'GET'},        
			"deploy.get": {url: CROSSBAR_REST_API_ENDPOINT + '/servers/{id}', dataType: 'json', type: 'GET'}        
		}
	},
	function(args) {
	},
	{	
		activate: function(data) {
			var THIS = this;
			$('#ws-content').empty();
        			
			THIS.templates.deploy.tmpl({}).appendTo( $('#ws-content') );
			THIS.templates.form.tmpl({}).appendTo( $('#deploy-form') );
			THIS.templates.advform.tmpl({}).appendTo( $('#deploy-form .advanced .menu') );
        		winkstart.registerResources(THIS.config.resources);
         	
			winkstart.publish('layout.updateLoadedModule', {label: 'Deployment Tool - v0.02', module: THIS.__module});         	

			$('#deploy-form .submit .button').click( function(){ THIS.deploy(); } );
			$('#deploy-form .advanced .action').click( function(){ THIS.toggle_advanced_menu(); } );
			$('#deploy-servers .server .action').live('click', function(){ 
				if($(this).attr('name') == 'Delete') {
					THIS.delete_server($(this).parents('.server'));
				}
			});
		},

		deploy: function() {
			var THIS = this;

			THIS.add_server();
		},

		add_server: function(clear_form) {
			var THIS = this,
			    new_server = {
			    			server: {
								id: 1,
								name: $('#deploy-form .name .data').val(),
								ip: $('#deploy-form .ip .data').val(),
					   	     		distro: $('#deploy-form .distro .data').val(),
					   	     		roles: 'Vermilion',
					   	     		actions: ['Edit', 'Delete'] 
							} 
					 };
			
			if(!clear_form) {
				$('#deploy-form .field .data').val('');
			}

			THIS.templates.server.tmpl(new_server).appendTo( $('#deploy-servers .servers') );
		},

		delete_server: function($server) {
			var THIS = this;

			$server.remove();
		},

		toggle_advanced_menu: function() {
			var THIS = this;

			$('#deploy-form .advanced .menu').slideToggle();
		}
	}
);
