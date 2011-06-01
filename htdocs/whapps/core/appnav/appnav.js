winkstart.module('core', 'appnav', {
		// There's only a single css file (this maps to appnav.css)
/*		css: [
			'appnav.css'
		],*/
				
		templates: {
			appnav: 'appnav.html',
                        item:   'item.html'
		},
		
		subscribe: {
			'appnav.add'    : 'add',
			'appnav.remove' : 'remove'
		}
		
	},
	function() {
		this.templates.appnav.tmpl({}).appendTo( $('div.header .main_nav') );
		
		var THIS = this;
		
		// Set up the Module Click handlers
		$('div.header .main_nav ul').delegate('li', 'click', function() {
                        winkstart.log('AppNav: Click detected - calling ' + $(this).attr('module-name') + '.activate');
                        winkstart.publish ( $(this).attr('module-name') + '.activate', { });
			//var params = { module: $(this).attr('data-module') };
			//THIS[$(this).attr('data-action')].call(THIS, params);
			return false;
		});
                winkstart.log('AppNav: Initialized application nav bar.');

	},
	{	
		add: function(args) {
                        winkstart.log('AppNav: Adding navigation item ' + args.name);

			var list_node = $('div.header .main_nav').find('ul');
			this.templates.item.tmpl({ 'name' : args.name, 'module' : winkstart.modules[args.name] }).appendTo(list_node);
		},

                remove: function() {
                    // TODO: Implement me
                }/*,
		
		activate: function(data) {
			winkstart.publish( data.module + '.activate', { target: $('#ws-content') });
			//this.templates.account.tmpl({}).appendTo( $('#ws-content') );
		}*/
	}
);
