winkstart.module('media', {
		css: [
			'css/style.css'
		],
				
		templates: {
			media: 'media.html'
		},
		
		subscribe: {
			'media.activate' : 'activate'
		}
	},
	function(args) {
		winkstart.publish('nav.add', { 
			module: this.__module, 
			label: 'MEDIA', 
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
			var THIS = this;
			$('#ws-content').empty();
         	this.templates.media.tmpl({}).appendTo( $('#ws-content') );
         	
			winkstart.publish('layout.updateLoadedModule', {label: 'Media Management', module: this.__module});         	
         	
            $.getJSON('endpoint/media/media_assets.json', function (json) {
            	//List Data that would be sent back from server
	            
            	//Overridden Click Handler
	            var test = function(){
	                console.log($.data(this, 'data').title);
	            };
            	
            	var options = {};
	            options.label = 'Media Module';
	            options.new_entity_label = 'Media';
	            options.data = json.media_assets;
	            options.click_handler = test;
	
	            //Build us some searchable list panel
	            $(".listpanel").listpanel(options);
            });
		}
	}
);