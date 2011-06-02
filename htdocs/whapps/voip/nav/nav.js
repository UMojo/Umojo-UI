winkstart.module('voip', 'nav', {
		// There's only a single css file (this maps to nav.css)
		css: [
			'nav.css'
		],
				
		templates: {
			nav: 'nav.html',
			item: 'item.html',
			subItem: 'subItem.html'
		},
		
		subscribe: {
			'nav.add'    : 'add',
			'nav.remove' : 'remove'
		}
		
	},
	function() {
		this.templates.nav.tmpl({}).appendTo( $('.sub_nav_container') );
		
/*		var show = function() {
			var menu = $('.subnav');
			menu.find(".actions").slideDown();
		}
		  
		var hide = function () { 
			var menu = $('.subnav');
			menu.find(".actions").slideUp();
		}
		 
		$('.subnav').hoverIntent({
			sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
			interval: 50,   // number = milliseconds for onMouseOver polling interval
			over: show,     // function = onMouseOver callback (required)
			timeout: 300,   // number = milliseconds delay before onMouseOut
			out: hide       // function = onMouseOut callback (required)
		});

		var THIS = this;*/
		
		// Set up the Module Click handlers
		$('.sub_nav ul').delegate('li', 'click', function() {
                        winkstart.log('Click on subnav: Calling ', $(this).attr('module-name') + '.activate');
                        winkstart.publish ( $(this).attr('module-name') + '.activate', { });
/*			var params = {module: $(this).attr('data-module')};
			THIS[$(this).attr('data-action')].call(THIS, params);
			hide();*/
			return false;
		});
	},
	{	
		add: function(data) {
			
			//var item = $.extend({category: 'general', module: '', label: ''}, data || {});
			
			//var list_node = $('.'+item.category).find('ul');

                        // Deal with silly centering which fails randomly
                        var navbar = $('.sub_nav');
                        var navbar_list = $('ul', navbar);
			this.templates.item.tmpl(data).appendTo(navbar_list);

                        // Increase size of navbar
                        var element_width = $('li', navbar_list).width() + 30;
                        winkstart.log('VoIP Nav: ' + navbar.width(), 'Element: ' + element_width);
                        navbar.width(navbar.width() + element_width);
		},

                clear: function(data) {
                    $('.sub_nav').empty();
                },
		
		activate: function(data) {
			//winkstart.publish( data.module + '.activate', { target: $('#ws-content') });
			//this.templates.nav.tmpl({}).appendTo( $('.subnav') );
		}
	}
);
