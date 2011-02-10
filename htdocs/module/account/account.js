winkstart.module('account', {
		css: [
			'css/style.css'
		],
				
		templates: {
			account: 'account.html'
		},
		
		subscribe: {
			'account.activate' : 'activate'
		}
	},
	function(args) {
		winkstart.publish('nav.add', { 
			module: this.__module, 
			label: 'ACCOUNT', 
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
		activate: function(data) {
			$('#ws-content').empty();	
			var THIS = this;
         	this.templates.account.tmpl({}).appendTo( $('#ws-content') );
         	
         	winkstart.publish('layout.updateLoadedModule', {label: 'Account Management', module: this.__module});
         	
         	$.getJSON('endpoint/account/accounts.json', function (json) {
            	//List Data that would be sent back from server
	            
            	//Overridden Click Handler
	            var test = function(){
	                console.log($.data(this, 'data').title);
	            };
            	
            	var options = {};
	            options.label = 'Account Module';
	            options.new_entity_label = 'Account';
	            options.data = json.accounts;
	            options.click_handler = test;
	
	            //Build us some searchable list panel
	            $(".listpanel").listpanel(options);
            });
         	
		}
	}
);