winkstart.module('voip', 'registration',
	{
		css: [
		'css/registration.css'
		],

		/* What HTML templates will we be using? */
		templates: {
			registration: 'tmpl/registration.html'//,
		//detailRegistration: 'tmpl/detailRegistration.html'
		},

		/* What events do we listen for, in the browser? */
		subscribe: {
			'registration.activate' : 'activate'
		},

		formData: {
    
		},

		validation : [
		],

		/* What API URLs are we going to be calling? Variables are in { }s */
		resources: {
			"registration.list": {
				url: '{api_url}/accounts/{account_id}/registrations',
				contentType: 'application/json',
				verb: 'GET'
			}
		}
	},

	/* Bootstrap routine - run when the module is first loaded */
	function(args) {
		/* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
		winkstart.registerResources(this.__whapp, this.config.resources);
        
		winkstart.publish('subnav.add', {
			whapp: 'voip',
			module: this.__module,
			label: 'Registrations',
			icon: 'registration',
			weight: '15'
		});
	},

	{
		/* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
		activate: function(data) {
			$('#ws-content').empty();
			var THIS = this;
            
			winkstart.loadFormHelper('forms');

			this.templates.registration.tmpl({}).appendTo( $('#ws-content') );
            
			var num_rows = 0;

		    winkstart.getJSON('registration.list', {
					  crossbar: true, 
					  account_id: winkstart.apps['voip'].account_id,
					  api_url: winkstart.apps['voip'].api_url
				      }, function(reply) {
					  THIS.setup_table();
					  $.each(reply.data, function() {
						     num_rows = num_rows+1;

						     //Dumb hack before crossbar reply is normalized (with lower case and _)
						     if(this['App-Name'] != undefined) {
							 this.app_name = this['App-Name'];
						     }
						     if(this['App-Version'] != undefined) {
							 this.app_version = this['App-Version'];
						     }
						     if(this['Call-ID'] != undefined) {
							 this.call_id = this['Call-ID'];
						     }
						     if(this['Contact'] != undefined) {
							 this.contact = this['Contact'];
						     }
						     if(this['Event-Category'] != undefined) {
							 this.event_category = this['Event-Category'];
						     }
						     if(this['Event-Name'] != undefined) {
							 this.event_name = this['Event-Name'];
						     }
						     if(this['Event-Timestamp'] != undefined) {
							 this.event_timestamp = this['Event-Timestamp'];
						     }
						     if(this['Expires'] != undefined) {
							 this.expires = this['Expires'];
						     }
						     if(this['FreeSWITCH-Hostname'] != undefined) {
							 this.freeswitch_hostname = this['FreeSWITCH-Hostname'];
						     }
						     if(this['From-Host'] != undefined) {
							 this.from_host = this['From-Host'];
						     }
						     if(this['From-User'] != undefined) {
							 this.from_user = this['From-User'];
						     }
						     if(this['Network-IP'] != undefined) {
							 this.network_ip = this['Network-IP'];
						     }
						     if(this['Network-Port'] != undefined) {
							 this.network_port = this['Network-Port'];
						     }
						     if(this['Presence-Hosts'] != undefined) {
							 this.presence_hosts = this['Presence-Hosts'];
						     }
						     if(this['Profile-Name'] != undefined) {
							 this.profile_name = this['Profile-Name'];
						     }
						     if(this['RPid'] != undefined) {
							 this.rpid = this['RPid'];
						     }
						     if(this['Realm'] != undefined) {
							 this.realm = this['Realm'];
						     }
						     if(this['Server-ID'] != undefined) {
							 this.server_id = this['Server-ID'];
						     }
						     if(this['Status'] != undefined) {
							 this.status = this['Status'];
						     }
						     if(this['To-Host'] != undefined) {
							 this.to_host = this['To-Host'];
						     }
						     if(this['To-User'] != undefined) {
							 this.to_user = this['To-User'];
						     }
						     if(this['User-Agent'] != undefined) {
							 this.user_agent = this['User-Agent'];
						     }
						     if(this['Username'] != undefined) {
							 this.username = this['Username'];
						     }

						     var friendlyDate = new Date((this.event_timestamp - 62167219200)*1000);
						     var humanDate = friendlyDate.toLocaleDateString();
						     var humanTime = friendlyDate.toLocaleTimeString(); 

						     this.contact = this.contact.replace(/"/g,"");
						     this.contact = this.contact.replace(/'/g,"\\'");
						     var stringToDisplay = 'Details of Registration\\n';
						     stringToDisplay += '\\nApp-Name: ' + this.app_name;
						     stringToDisplay += '\\nApp-Version: ' + this.app_version;
						     stringToDisplay += '\\nCall-ID: ' + this.call_id;
						     stringToDisplay += '\\nContact: ' + this.contact;
						     stringToDisplay += '\\nEvent-Category: ' + this.event_category;
						     stringToDisplay += '\\nEvent-Name: ' + this.event_name;
						     stringToDisplay += '\\nExpires: ' + this.expires;
						     stringToDisplay += '\\nFreeSWITCH-Hostname: ' + this.freeswitch_hostname;
						     stringToDisplay += '\\nFrom-Host: ' + this.from_host;
						     stringToDisplay += '\\nFrom-User: ' + this.from_user;
						     stringToDisplay += '\\nNetwork-IP: ' + this.network_ip;
						     stringToDisplay += '\\nNetwork-Port: ' + this.network_port;
						     stringToDisplay += '\\nPresence-Hosts: ' + this.presence_hosts;
						     stringToDisplay += '\\nProfile-Name: ' + this.profile_name;
						     stringToDisplay += '\\nRPid: ' + this.rpid;
						     stringToDisplay += '\\nRealm: ' + this.realm;
						     stringToDisplay += '\\nServer-ID: ' + this.server_id;
						     stringToDisplay += '\\nStatus: ' + this.status;
						     stringToDisplay += '\\nTo-Host: ' + this.to_host;
						     stringToDisplay += '\\nTo-User: ' + this.to_user;
						     stringToDisplay += '\\nUser-Agent: ' + this.user_agent;
						     stringToDisplay += '\\nUsername: ' + this.username;
						     stringToDisplay += '\\nDate: ' + humanDate;
						     stringToDisplay += '\\nTime: ' + humanTime;

						     winkstart.table.registration.fnAddData([this.username, this.network_ip, this.network_port, humanDate, humanTime, stringToDisplay]);
						 });
                
					  //Hack to hide pagination if number of rows < 10
					  if(reply.data.length < 10){
					      $('body').find('.dataTables_paginate').hide();
					  }
				      });

		    winkstart.publish('layout.updateLoadedModule', {
					  label: 'Voicemail Boxes Management',
					  module: this.__module
				      });
		},
		setup_table: function() {
			var THIS = this;
			var columns = [
			{
				'sTitle': 'Username'
			},

			{
				'sTitle': 'IP'
			},

			{
				'sTitle': 'Port'
			},

			{
				'sTitle': 'Date'
			},

			{
				'sTitle': 'Time'
			},

			{
				'sTitle': 'Details',
				'fnRender': function(obj) {
					winkstart.log(obj);
					var reg_details = obj.aData[obj.iDataColumn];
					return '<a href="#" onClick="alert(\''+reg_details+'\');">Details</a>';
				}
			}
			];

			winkstart.table.create('registration', $('#registration-grid'), columns);
			$('#registration-grid_filter input[type=text]').first().focus();
			
			$('.cancel-search').click(function(){
				$('#registration-grid_filter input[type=text]').val('');
				winkstart.table.registration.fnFilter('');
			});
            
            
            
		}
	}
	);
