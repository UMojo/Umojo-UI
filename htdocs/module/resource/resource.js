winkstart.module('resource', {
		css: [
			'css/style.css'
		],
				
		templates: {
			resource: 'tmpl/resource.html',
			viewResource: 'tmpl/view.html',
			editResource: 'tmpl/edit.html',
			createResource: 'tmpl/create.html'
		},
		
		subscribe: {
			'resource.activate' : 'activate',
			'resource.list-panel-click' : 'viewResource',
			'resource.create-resource' : 'createResource',
			'resource.edit-resource' : 'editResource'
		},
		resources: {
			"resource.list": {url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/resources', dataType: 'json', httpMethod: 'GET'},
			"resource.get": {url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/resources/{resource_id}', dataType: 'json', httpMethod: 'GET'},
			"resource.create": {url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/resources', dataType: 'json', httpMethod: 'POST'},        
			"resource.update": {url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/resources/{resource_id}', dataType: 'json', httpMethod: 'POST'}
		}
	},
	function(args) {
		winkstart.publish('nav.add', { module: this.__module, label: 'Resource Manager', nav_category: 'category-1'});
	},
	{	
		viewDevice: function(resource_data){
			$('#resource-view').empty();
			var THIS = this;
			winkstart.getJSON('resource.get', {crossbar: true, account_id: MASTER_ACCOUNT_ID, resource_id: resource_data.id}, function (json, xhr) {				
				THIS.templates.viewResource.tmpl(json).appendTo( $('#resource-view') );
			});
		},
		
		createResource: function(){
			$('#resource-view').empty();
			
			this.templates.createResource.tmpl({}).appendTo( $('#resource-view') );
			winkstart.cleanForm();
			
			$('#resource-form').submit(function() {
				var formData = form2object('resource-form');
				
				//Handle Checkboxes
				/*if(!jQuery.inArray(formData.media, 'codecs')){
					formData.media.codecs = [];
				}*/
				
				var put_data = {};
				put_data.crossbar = true;
				put_data.account_id = MASTER_ACCOUNT_ID;
				put_data.data = formData;
				
				winkstart.putJSON('resource.create', put_data, function (json, xhr) {
					winkstart.log(json);	
				});
				
				return false;
			});
		},
		
		editDevice: function(resource_id){
			$('#resource-view').empty();
			var THIS = this;
			winkstart.getJSON('resource.get', {crossbar: true, account_id: MASTER_ACCOUNT_ID, resource_id: resource_id}, function (json, xhr) {				
				THIS.templates.editResource.tmpl(json).appendTo( $('#resource-view') );
				winkstart.cleanForm();
			
				$('#device-form').submit(function() {
					var formData = form2object('device-form');
					
					//Handle Checkboxes
					if(!jQuery.inArray(formData.media, 'codecs')){
						formData.media.codecs = [];
					}
					
					var post_data = {};
					post_data.crossbar = true;
					post_data.account_id = MASTER_ACCOUNT_ID;
					post_data.data = formData;
					post_data.resource_id = resource_id;
					
					winkstart.postJSON('resource.update', post_data, function (json, xhr) {
						THIS.viewResource({id: resource_id});	
					});
					
					return false;
				});
			});
		},
		
		activate: function(data) {
			$('#ws-content').empty();	
			var THIS = this;
         	this.templates.resource.tmpl({}).appendTo( $('#ws-content') );
         	
         	winkstart.registerResources(this.config.resources);
         	
         	winkstart.publish('layout.updateLoadedModule', {label: 'Resource Management', module: this.__module});
         	
         	winkstart.getJSON('resource.list', {crossbar: true, id: MASTER_ACCOUNT_ID}, function (json, xhr) {

         		//List Data that would be sent back from server
            	function map_crossbar_data(crossbar_data){
            		var new_list = [];
            		_.each(crossbar_data, function(elem){
            			new_list.push({id: elem.id, title: elem.name});
            		});
            		return new_list;
            	};
            	            	
				var options = {};
	            options.label = 'Resource Module';
	            options.identifier = 'resource-module-listview';
	            options.new_entity_label = 'Resource';
	            options.data = map_crossbar_data(json.data);
	            options.publisher = winkstart.publish;
	            options.notifyMethod = 'resource.list-panel-click';
	
	            //Build us some searchable list panel
	            $(".listpanel").listpanel(options);
            });
		}
	}
);