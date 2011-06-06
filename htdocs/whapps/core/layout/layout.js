winkstart.module('core', 'layout', {
//		requires: {'core' : 'nav'},
		css: [
		      'css/layout.css',
                      'css/jquery.jscrollpane.css',
                      'css/tabs.css',
                      'css/icons.css'
		],
		
		templates: {
			layout: 'tmpl/layout.html'
		},
		
		subscribe: {
			'layout.updateLoadedModule'    : 'updateModule',
			'notify'    : 'notify'
		},
		
		elements: {
			nav: '#ws-nav'
		}
	},
	function(args) {
		this.parent = args.parent || $('body');
		
		this.attach();
		
		// TODO: This is a temp hack
		/*var THIS = this;
		this.elements = {};
		$.each(this.config.elements, function(k, v) {
			THIS.elements[k] = $( THIS.parent ).find(v);
		});*/
		// END HACK
		
		// Attach our nav
		//winkstart.module('core', 'appnav').init({ parent: this.elements.nav});
		
		// TODO: This is a hack to hide the PBX nav for the time being
		/*$('.whistle-apps li').live('click', function() {
			if($(this).hasClass('deploy')) {
				$('body > .wrapper > .header').hide();
				winkstart.publish('deploy.activate');
			}
			else {
				$('body > .wrapper > .header').show();
				$('#ws-content').empty();
			}
		});*/

                winkstart.log ('Layout: Initialized layout.');
	},
	{	
		attach: function() {
			this.templates.layout.tmpl().appendTo( this.parent );
            
            // We need to hide this by defualt but keep our display: inline-block in the css
            $('#ws-notification-bar').hide();
		},

        notify: function(data) {
            if(!data.level && !data.msg) {
                return false;
            }
            
            switch(data.level) {
                case 'debug':
                    $('#ws-notification-bar')
                        .slideUp(function() {
                            $('#ws-notification-bar .ws-notification-bar-content').html(data.msg);
                        })
                        .delay(200)
                        .slideDown(200)
                        .delay(1500)
                        .slideUp(200);
                    break;
            }
        },

		updateModule: function(data){
			$('#bread-crumbs').empty().html(data.label);
		}
	}
);
