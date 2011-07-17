winkstart.module('core', 'appnav', {
    /* Config */
		templates: {
			appnav: 'appnav.html',
                        item:   'item.html'
		},
		
		subscribe: {
			'appnav.add'        : 'add',
                        'appnav.activate'   : 'activate',
			'appnav.remove'     : 'remove'
		}
		
	},

        /* Init */
	function() {
		this.templates.appnav.tmpl({}).appendTo( $('div.header .main_nav') );
		
		var THIS = this;
		
		// Set up the Module Click handlers
		$('div.header .main_nav ul').delegate('li', 'click', function() {
                    winkstart.publish('appnav.activate', $(this).attr('module-name'));
                    return false;
		});
                winkstart.log('AppNav: Initialized application nav bar.');

	},

        /* Methods */
	{	
		add: function(args) {
                        winkstart.log('AppNav: Adding navigation item ' + args.name);

			var list_node = $('div.header .main_nav').find('ul');
			this.templates.item.tmpl({ 'name' : args.name, 'module' : winkstart.modules[args.name] }).appendTo(list_node);
		},

                activate: function(app_name) {
                    // TODO: De-activate current app & unload it

                    winkstart.log('AppNav: Click detected - calling ' + app_name + '.activate');
                    winkstart.publish ( app_name + '.activate', { });
                },

                remove: function() {
                    // TODO: Implement me
                }
	}
);
