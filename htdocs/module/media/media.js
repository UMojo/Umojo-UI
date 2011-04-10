winkstart.module('media', {
		css: [
			'css/style.css'
		],
				
		templates: {
			media: 'media.html'
		},
		
		subscribe: {
			'media.activate' : 'activate',
			'media.list-panel-click' : 'viewMedia'
		},
		resources: {
			"media.list": {url: CROSSBAR_REST_API_ENDPOINT + '/media', dataType: 'json', type: 'GET'},        
			"media.get": {url: CROSSBAR_REST_API_ENDPOINT + '/media/{id}', dataType: 'json', type: 'GET'},        
		}
	},
	function(args) {
		winkstart.publish('nav.add', { module: this.__module, label: 'Media Manager', nav_category: 'category-3'});
	},
	{	
		viewMedia: function(media_data){
			console.log(media_data);
		},
		
		activate: function(data) {
			var THIS = this;
			$('#ws-content').empty();
         	this.templates.media.tmpl({}).appendTo( $('#ws-content') );
         	winkstart.registerResources(this.config.resources);
         	
			$(".media_tabs").tabs("div.media_pane > div");
			$("ul.advanced_tabs").tabs("div.advanced_pane > div");
			
		    $("div.buttons").click(function(){
        		$clicked = $(this);
        		$clicked.animate({top:"40px"}, 300 );
        		// reset the other buttons to default style
        		$clicked.siblings(".buttons").animate({top:"0"}, 300 );
			});
         	
			winkstart.publish('layout.updateLoadedModule', {label: 'Media Management', module: this.__module});         	
         	
            winkstart.getJSON('media.list', {}, function (json) {
            	//List Data that would be sent back from server
            	
            	var options = {};
	            options.label = 'Media Module';
	            options.new_entity_label = 'Media';
	            options.data = json.media_assets;
				options.publisher = winkstart.publish;
	            options.notifyMethod = 'media.list-panel-click';
	
	            //Build us some searchable list panel
	            $(".listpanel").listpanel(options);
            });
		}
	}
);