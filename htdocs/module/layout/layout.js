winkstart.module('layout', {
		requires: ['nav'],
		css: ['layout.css'],
		
		templates: {
			layout: 'layout.html'
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
		winkstart.module('nav').init({ parent: this.elements.nav });
	},
	{	attach: function() {
			this.templates.layout.tmpl().appendTo( this.parent );
		}
	});