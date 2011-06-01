winkstart.module('core', 'layout', {
//		requires: {'core' : 'nav'},
		css: [
		      'layout.css',
                      'jquery.jscrollpane.css'
		],
		
		templates: {
			layout: 'layout.html'
		},
		
		subscribe: {
			'layout.updateLoadedModule'    : 'updateModule'
		},
		
		elements: {
			nav: '#ws-nav'
		}
	},
	function(args) {
		this.parent = args.parent || $('body');
		
		this.attach();
		
		// TODO: This is a temp hack
		var THIS = this;
		this.elements = {};
		$.each(this.config.elements, function(k, v) {
			THIS.elements[k] = $( THIS.parent ).find(v);
		});
		// END HACK
		
		// Attach our nav
		//winkstart.module('core', 'appnav').init({ parent: this.elements.nav});
		
		// TODO: This is a hack to hide the PBX nav for the time being
		$('.whistle-apps li').live('click', function() {
			if($(this).hasClass('deploy')) {
				$('body > .wrapper > .header').hide();
				winkstart.publish('deploy.activate');
			}
			else {
				$('body > .wrapper > .header').show();
				$('#ws-content').empty();
			}
		});
	},
	{	
		attach: function() {
			this.templates.layout.tmpl().appendTo( this.parent );
		},
		
		updateModule: function(data){
			$('#bread-crumbs').empty().html(data.label);
		}
	}
);
