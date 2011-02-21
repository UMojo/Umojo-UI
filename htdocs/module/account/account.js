winkstart.module('account', {
		css: [
			'css/style.css'
		],
				
		templates: {
			account: 'account.html',
			viewAccount: 'view.html'
		},
		
		subscribe: {
			'account.activate' : 'activate',
			'account.list-panel-click' : 'viewAccount'
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
		viewAccount: function(account_data){
			$('#account-view').empty();
			this.templates.viewAccount.tmpl(account_data).appendTo( $('#account-view') );
			$("ul.account_tabs").tabs("div.pane > div");
			$("ul.advanced_tabs").tabs("div.advanced_pane > div");
		},
		
		activate: function(data) {
			$('#ws-content').empty();	
			var THIS = this;
         	this.templates.account.tmpl({}).appendTo( $('#ws-content') );
         	
         	winkstart.publish('layout.updateLoadedModule', {label: 'Account Management', module: this.__module});
         	
         	$.getJSON('endpoint/account/accounts.json', function (json) {
            	//List Data that would be sent back from server
	            
				var options = {};
	            options.label = 'Account Module';
	            options.identifier = 'account-module-listview';
	            options.new_entity_label = 'Account';
	            options.data = json.accounts;
	            options.publisher = winkstart.publish;
	            options.notifyMethod = 'account.list-panel-click';
	
	            //Build us some searchable list panel
	            $(".listpanel").listpanel(options);
            });
         	
		}
	}
);