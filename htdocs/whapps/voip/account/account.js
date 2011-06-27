winkstart.module('voip', 'account', {
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
		},
		
		resources: {
			"accounts.list": {url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{id}/children', dataType: 'json', httpMethod: 'GET'}        
		}
	},
	function(args) {
		winkstart.publish('subnav.add', { module: this.__module, label: 'Account Manager', nav_category: 'category-1'});
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
         	winkstart.registerResources(this.config.resources);
         	
         	winkstart.publish('layout.updateLoadedModule', {label: 'Account Management', module: this.__module});
         	
         	winkstart.getJSON('accounts.list', {crossbar: true, id: MASTER_ACCOUNT_ID}, function (json, xhr) {
            	//List Data that would be sent back from server
	            
            	var headers = xhr.getAllResponseHeaders();
            	
            	function map_crossbar_data(crossbar_data){
            		var new_list = [];
            		_.each(crossbar_data, function(elem){
            			new_list.push({id: elem.id, title: elem.name});
            		});
            		return new_list;
            	};
            	            	
				var options = {};
	            options.label = 'Account Module';
	            options.identifier = 'account-module-listview';
	            options.new_entity_label = 'Account';
	            options.data = map_crossbar_data(json.data);
	            options.publisher = winkstart.publish;
	            options.notifyMethod = 'account.list-panel-click';
	
	            //Build us some searchable list panel
	            $(".listpanel").listpanel(options);
            });
		}
	}
);
