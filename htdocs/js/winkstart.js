(function(winkstart, amplify, undefined) {
	var modules = {}, loading = {};
	
	winkstart.publish     = amplify.publish;
	winkstart.subscribe   = amplify.subscribe;
	winkstart.unsubscribe = amplify.unsubscribe;
	
	winkstart.module = amplify.module;
	amplify.module.constructor = function(args, callback) {
		var completed = 0, THIS = this;
		if ( this.config.templates ) {
			this.templates = {};
			$.each(this.config.templates, function(name, url) {
				completed++;
				$.get('whapps/' + THIS.__whapp + '/' + THIS.__module + '/' + url, function(template) {
					completed--;
					THIS.templates[name] = $(template);
				}, 'html');
			});
		}
		if ( this.config.requires ) {
			$.each(this.config.requires, function(k, module) {
                                winkstart.log('Loading dependency ' + k + ' ' + module);
				completed++;
				amplify.module.loadPlugin(k, module, function() {
					completed--;
				});
			});
		}
		if ( this.config.css ) {
			$.each(this.config.css, function(k, css) {
				if ( css === true ) {
					THIS.__module + '.css';
				}
				css = 'whapps/' + THIS.__whapp + '/' + THIS.__module + '/' + css;
				//completed++;
				$('<link href="' + css + '" rel="stylesheet" type="text/css">').bind('load', function() {
					//completed--;
				}).appendTo('head');
			});
		}
		if ( this.config.subscribe ) {
			$.each(this.config.subscribe, function(k, v) {
				winkstart.subscribe(k, function() {
					if ( THIS[v] ) {
						THIS[v].apply(THIS, arguments);
					}
				});
			});
		}
		
		setTimeout(function() {
			completed = 0;
		}, 3000);
		
		(function() {
			if ( completed == 0 ) {
				if ( $.isFunction(callback) ) {
					callback();
				}
				return;
			}
			var _c = arguments.callee;
			setTimeout(function() { _c(); }, 10);
		})();
	};
		
	// Bootstrap the app: Start by loading the core module
	winkstart.module.load('core', function() {
		// Currently core doesn't do anything, it will
		
                // First thing we're going to do is go through is load our layout
                winkstart.module.loadPlugin('core', 'layout', function() {
                        this.init({ parent: $('body') }, function() {
                        });
                });

                // Next, we need to make sure the navbar at the top is loaded before anything else is so we can catch events
                winkstart.module.loadPlugin('core', 'appnav', function() {
                        this.init({ parent: $('body') }, function() {
                        });
                });


		// Create an instance of the core module
		this.init(function() {
                    // Load any other modules requested (only after core is initialized)
                    $.each(winkstart.modules, function(k, v) {
                        winkstart.log('Would load ' + k + ' from URL ' + v);
                        winkstart.module.load(k, function() {
                            this.init();
                            console.log('Init running for ' + k);
                        })
                    })


                });
/*			winkstart.module.loadPlugin('core', 'layout', function() {
				this.init({ parent: $('body') }, function() {
					
					//Bootstrap some form data
					$.getJSON('endpoint/form/data.json', function(data){
						amplify.store('form_data', data);
					});
				});
			});
		});*/
	});

})(	window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {});
