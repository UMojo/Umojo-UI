winkstart.module('nav', {
		// There's only a single css file (this maps to nav.css)
		css: [
			'nav.css'
		],
				
		templates: {
			item: 'item.html',
			subItem: 'subItem.html'
		},
		
		subscribe: {
			'nav.add'    : 'add',
			'nav.remove' : 'remove'
		}
	},
	function(args) {
		this.navEl = $('<ul id="topnav"></ul>').appendTo(args.parent);
		var THIS = this;
		this.navEl.delegate('[data-action]', 'click', function() {
			// This is hacking
			var params = { module: $(this).attr('data-module') };
			THIS[$(this).attr('data-action')].call(THIS, params);
			return false;
		});
	},
	{	
		reg: function(){
			
			function megaHoverOver(){
				$(this).find(".sub").stop().fadeTo('fast', 1).show();
					
				//Calculate width of all ul's
				(function($) { 
					jQuery.fn.calcSubWidth = function() {
						rowWidth = 0;
						//Calculate row
						$(this).find("ul").each(function() {					
							rowWidth += $(this).width(); 
						});	
					};
				})(jQuery); 
				
				if ( $(this).find(".row").length > 0 ) { //If row exists...
					var biggestRow = 0;	
					//Calculate each row
					$(this).find(".row").each(function() {							   
						$(this).calcSubWidth();
						//Find biggest row
						if(rowWidth > biggestRow) {
							biggestRow = rowWidth;
						}
					});
					//Set width
					$(this).find(".sub").css({'width' :biggestRow});
					$(this).find(".row:last").css({'margin':'0'});
					
				} else { //If row does not exist...
					
					$(this).calcSubWidth();
					//Set Width
					$(this).find(".sub").css({'width' : rowWidth});
					
				}
			}
			
			function megaHoverOut(){ 
			  $(this).find(".sub").stop().fadeTo('fast', 0, function() {
				  $(this).hide(); 
			  });
			}
		
		
			var config = {    
				 sensitivity: 2, // number = sensitivity threshold (must be 1 or higher)    
				 interval: 100, // number = milliseconds for onMouseOver polling interval    
				 over: megaHoverOver, // function = onMouseOver callback (REQUIRED)    
				 timeout: 500, // number = milliseconds delay before onMouseOut    
				 out: megaHoverOut // function = onMouseOut callback (REQUIRED)    
			};
		
			$("ul#topnav li .sub").css({'opacity':'0'});
			$("ul#topnav li").hoverIntent(config);

		},
		add: function(data) {
			var item = $.extend({ module: '', label: '', sub: []}, data || {});
			
			if(item.sub.length > 0){
				this.templates.subItem.tmpl(item).appendTo(this.navEl);
			} else {
				this.templates.item.tmpl(item).appendTo(this.navEl);
			}
			
			this.reg();
		},
		
		activate: function(data) {
			winkstart.publish( data.module + '.activate', { target: $('#ws-content') });
		}
	}
);
