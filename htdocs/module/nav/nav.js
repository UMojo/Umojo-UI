winkstart.module('nav', {
		// There's only a single css file (this maps to nav.css)
		css: true,
				
		templates: {
			item: 'item.html'
		},
		
		subscribe: {
			'nav.add'    : 'add',
			'nav.remove' : 'remove'
		}
	},
	function(args) {
		this.el = $('<ul></ul>').appendTo(args.parent);
		var THIS = this;
		this.el.delegate('[data-action]', 'click', function() {
			// This is hacking
			var params = { module: $(this).attr('data-module') };
			THIS[$(this).attr('data-action')].call(THIS, params);
			return false;
		});
	},
	{	add: function(data) {
			var item = $.extend({ module: '', label: '' }, data || {});
			this.templates.item.tmpl( item ).appendTo(this.el);
		},
		
		activate: function(data) {
			winkstart.publish( data.module + '.activate', { target: $('#ws-content') });
		}
	});