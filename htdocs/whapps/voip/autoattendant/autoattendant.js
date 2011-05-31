winkstart.module('autoattendant', {
		css: [
			'css/style.css'
		],
				
		templates: {
			device: 'autoattendant.html',
			viewAttendant: 'view.html'
		},
		
		subscribe: {
			'autoattendant.activate' : 'activate',
			'autoattendant.list-panel-click' : 'viewDevice'
		},
		resources: {
			"autoattendant.list": {url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{id}/autoattendants', dataType: 'json', httpMethod: 'GET'}        
		}
	},
	function(args) {
		winkstart.publish('nav.add', { module: this.__module, label: 'Auto Attendant', nav_category: 'category-4'});
	},
	{	
		viewDevice: function(device_data){
			$('#attendant-view').empty();
			this.templates.viewAttendant.tmpl({title: 'Test'}).appendTo( $('#attendant-view') );
		},
		
		activate: function(data) {
			$('#ws-content').empty();	
			var THIS = this;
         	this.templates.viewAttendant.tmpl({}).appendTo( $('#ws-content') );
         	
         	winkstart.registerResources(this.config.resources);
         	
         	winkstart.publish('layout.updateLoadedModule', {label: 'Auto Attendant', module: this.__module});
         	
         	winkstart.getJSON('autoattendant.list', {crossbar: true, id: MASTER_ACCOUNT_ID}, function (json, xhr) {

         		//List Data that would be sent back from server
            	function map_crossbar_data(crossbar_data){
            		var new_list = [];
            		_.each(crossbar_data, function(elem){
            			new_list.push({id: elem.id, title: elem.name});
            		});
            		return new_list;
            	};
            	            	
				var options = {};
	            options.label = 'Auto Attendant Module';
	            options.identifier = 'autoattendant-module-listview';
	            options.new_entity_label = 'Auto Attendant';
	            options.data = map_crossbar_data(json.data);
	            options.publisher = winkstart.publish;
	            options.notifyMethod = 'autoattendant.list-panel-click';
	
	            //Build us some searchable list panel
	            $(".listpanel").listpanel(options);
            });
		}
	}
);