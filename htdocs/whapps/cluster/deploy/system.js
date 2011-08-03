winkstart.module('deploy', 'deploy', {
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
			'deploy.activate' : 'activate'
		},
		resources: {
			"deploy.list": {url: winkstart.apps['cluster'].api_url + '/servers', contentType: 'application/json', verb: 'GET'},
			"deploy.get": {url: winkstart.apps['cluster'].api_url + '/servers/{id}', contentType: 'application/json', verb: 'GET'}
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

			THIS.winkstart_refresh_servers();

			$('#deploy-form .submit .button').click(function(){ 
				THIS.hide_advanced_menu();
				THIS.winkstart_submit_action(false); 
			});

			$('#deploy-form .advanced .action').click(function(){ 
				THIS.toggle_advanced_menu(); 
			});

			$('#deploy-form .trashcan').droppable({
								tolerance: 'touch',
								drop: function(event, ui){
									ui.helper.remove();
									THIS.winkstart_delete_action(ui.draggable.attr('id'));
								}
							      });
		},

		cb_acct_id: function() {
			return 'c8a73437b8f67efc0b0518446c343a4d';
		},

		cb_url: function() {
			var THIS = this;

			return 'http://apps001-dev-ord.2600hz.com:8000/v1/accounts/' + THIS.cb_acct_id();
		},

		cb_auth_token: function() {
			return 'c8a73437b8f67efc0b0518446c344d08';
		},

		cb_envelope: function(verb, data) {
			var THIS = this,
			    stuff = {auth_token: THIS.cb_auth_token(),
			    	     verb: verb,
			    	     data: data };

			return stuff;
		},

		cb_request: function(data, uri, on_success, on_error) {
			var THIS = this;

			switch(data.verb) {
				case 'GET':
					$.ajax({
						url: THIS.cb_url() + '/' + uri + '?auth_token=' + data.auth_token,
						type: 'GET',
						dataType: 'json',
						success: function(reply) {
							if(typeof on_success == 'function') {
								on_success(reply);
							}
						},
						error: function(reply) {
							if(typeof on_error == 'function') {
								on_error(reply);
							}
						}
					       });
					break;

				default:
					$.ajax({
						url: THIS.cb_url() + '/' + uri,
						type: 'POST',
						processData: false,
						data: JSON.stringify(data),
						dataType: 'json',
						contentType: 'application/json',
						success: function(reply) {
							if(typeof on_success == 'function') {
								on_success(reply);
							}
						},
						error: function(reply) {
							if(typeof on_error == 'function') {
								on_error(reply);
							}
						}
					       });
					break;

			}
		},

		cb_create_new_server: function(server, on_success, on_error) {
			var THIS = this,
			    stuff = THIS.cb_envelope('PUT', server);

			THIS.cb_request(stuff, 'servers', on_success, on_error);
		},

		cb_list_servers: function(on_success, on_error) {
			var THIS = this,
			    stuff = THIS.cb_envelope('GET', {});

			THIS.cb_request(stuff, 'servers', on_success, on_error);
		},

		cb_get_server: function(id, on_success, on_error) {
			var THIS = this,
			    stuff = THIS.cb_envelope('GET', {});

			THIS.cb_request(stuff, 'servers/' + id, on_success, on_error);
		},

		cb_delete_server: function(id, on_success, on_error) {
			var THIS = this,
			    stuff = THIS.cb_envelope('DELETE', {});

			THIS.cb_request(stuff, 'servers/' + id, on_success, on_error);
		},
		
		cb_deploy_server: function(server, on_success, on_error) {
			var THIS = this,
			    stuff = THIS.cb_envelope('PUT', server);

			THIS.cb_request(stuff, 'servers/' + server.id + '/deployment', on_success, on_error);
		},

		winkstart_submit_action: function(clear_form) {
			var THIS = this,
			    password = THIS.get_input('password'),
			    server = {	hostname: THIS.get_input('hostname'),
					ip: THIS.get_input('ip'),
					operating_system: THIS.get_input('operating_system'),
					roles: /*THIS.get_input('roles')*/['role[allinone]'] };

			if(clear_form) {
				$('#deploy-form .field .data').val('');
			}

			THIS.cb_create_new_server(server, function(reply) {
							server.id = reply.data.id; 
							server.status = 'Deploying...';
							server.password = password;
							server.node_name = server.hostname;

							THIS.cb_deploy_server(server, function(reply) {
								THIS.winkstart_add_server(server);
							});
						  });
		},

		winkstart_delete_action: function(id) {
			var THIS = this;

			THIS.cb_delete_server(id, function(reply) {
						THIS.winkstart_remove_server(id);
					      });
		},

		winkstart_refresh_servers: function() {
			var THIS = this;

			THIS.cb_list_servers(function(reply) {
				$.each(reply.data, function(index, server) {
					THIS.cb_get_server(server.id, function(reply) {
						reply.data.status = server.deploy_status;
						THIS.winkstart_add_server(reply.data);
					});
				});
			});	
		},

		winkstart_remove_server: function(id) {
			var THIS = this;

			$('#deploy-servers .servers').find('.server[id=' + id + ']').remove();
		},

		winkstart_add_server: function(server) {
			var THIS = this;
			
			THIS.templates.server.tmpl(server).appendTo($('#deploy-servers .servers')).draggable({helper:'clone',cursorAt:{top:0,left:0}});
		},

		get_input: function(field) {
			var THIS = this,
			    temo = '';

			switch(field) {
				case 'hostname':
					temp = $('#deploy-form .hostname .data').val();

					return temp;
					break;

				case 'password':
					temp = $('#deploy-form .password .data').val();

					return temp;
					break;

				case 'ip':
					temp = $('#deploy-form .ip .data').val();

					return temp;
					break;

				case 'operating_system':
					temp = $('#deploy-form .operating-system .data').val();

					return temp;
					break;
					
				case 'roles':
					temp = '[';

					$('#deploy-form .advanced .roles input:checked').each(function() {
						temp += '"' + $(this).attr('data') + '",';
					});

					temp = temp.replace(/,$/, '');
					temp += '];'

					return eval(temp);
					break;

				default:
					return 'Invalid Input';
					break;
			}
		},

		delete_server: function($server) {
			var THIS = this;

			$server.remove();
		},

		toggle_advanced_menu: function() {
			var THIS = this;

			$('#deploy-form .advanced .menu').slideToggle();
		},

		hide_advanced_menu: function() {
			var THIS = this;

			$('#deploy-form .advanced .menu').slideUp();
		}
	}
);
