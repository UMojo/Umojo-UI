winkstart.module('core', 'appnav', {
		// There's only a single css file (this maps to appnav.css)
		css: [
			'appnav.css'
		],
				
		templates: {
			appnav: 'appnav.html',
			item: 'item.html'
//			subItem: 'subItem.html'
		},
		
		subscribe: {
			'appnav.add'    : 'add',
			'appnav.remove' : 'remove'
		}
		
	},
	function(args) {

		this.templates.appnav.tmpl({ "modules" : winkstart.modules }).appendTo( $('div.header .main_nav') );
		
/*		var show = function() {
			var menu = $('div.header .main_nav');
			menu.find(".actions").slideDown();
		}
		  
		var hide = function () { 
			var menu = $('div.header .main_nav');
			menu.find(".actions").slideUp();
		}
		 
		$('div.header .main_nav').hoverIntent({
			sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
			interval: 50,   // number = milliseconds for onMouseOver polling interval
			over: show,     // function = onMouseOver callback (required)
			timeout: 300,   // number = milliseconds delay before onMouseOut
			out: hide       // function = onMouseOut callback (required)
		});

		var THIS = this;
		
		// Set up the Module Click handlers
		$('.subnav-row div div ul').delegate('[data-action]', 'click', function() {
			var params = { module: $(this).attr('data-module') };
			THIS[$(this).attr('data-action')].call(THIS, params);
			hide();
			return false;
		});*/
	},
	{	
		add: function(data) {
			
			//var item = $.extend({nav_category: 'category-1', module: '', label: ''}, data || {});
			
			//var list_node = $('#'+item.nav_category).find('ul');
			//this.templates.item.tmpl(item).appendTo(list_node);
		},
		
		activate: function(data) {
			winkstart.publish( data.module + '.activate', { target: $('#ws-content') });
			//this.templates.account.tmpl({}).appendTo( $('#ws-content') );
		}
	}
);
