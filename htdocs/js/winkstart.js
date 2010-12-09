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
				$.get('/module/' + THIS.__module + '/' + url, function(template) {
					console.log('Loaded template ' + name + ' at ' + url);
					completed--;
					THIS.templates[name] = $(template);
				}, 'html');
			});
		}
		if ( this.config.requires ) {
			$.each(this.config.requires, function(k, module) {
				completed++;
				amplify.module.load(module, function() {
					console.log('Loaded module: ' + module);
					completed--;
				});
			});
		}
		if ( this.config.css ) {
			$.each(this.config.css, function(k, css) {
				if ( css === true ) {
					THIS.__module + '.css';
				}
				css = '/module/' + THIS.__module + '/' + css;
				//completed++;
				console.log('Loading css: ' + css);
				$('<link href="' + css + '" rel="stylesheet" type="text/css">').bind('load', function() {
					console.log('CSS Loaded');
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
			console.log('completed: ' + completed);
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
	
	/*
	winkstart.module = {
		getResourcePath: function(module, resource) {
			return '/module/' + module + '/' + resource;
		},
		
		// 
		define: function(module, definition) {
			// Check if we need to execute the method to generate it
			if ( $.isFunction(definition) ) {
				definition = definition.call({});
			}
			
			var m = modules[module] = definition;
			if ( m.onDefine && $.isFunction(m.onDefine) ) {
				// Make onDefine async?
				m.onDefine.call(m);
			}
			
			// Load required module dependencies
			if ( m.requires ) {
				var modulesToLoad = $.makeArray(m.requires);
				(function queuedLoad() {
					var next = modulesToLoad.shift();
					winkstart.module.using(next, 
						function() {
							if ( toLoad.length > 0 ) {
								queuedLoad();
							} else {
								continueDefine();
							}
						},
						function() {
							alert('An error occurred');
						});
				})();
			} else {
				
			}
			
			function continueDefine() {
				// Load the required assets
				
				
				// Define any request types
				if ( m.requests ) {
					$.each(m.requests, function(k, v) {
						var type = 'ajax', args = { method: 'POST' };
						if ( $.isPlainObject(v) ) {
							args = v;
							if ( v.type ) {
								type = v.type;
							}
						} else {
							args.url = v;
						}
						amplify.request.define(k, type, args);
					});
				}
				
				
				// Define exported interfaces from the module
				if ( m.exports && $.isFunction(m.exports) ) {
					var exported = m.exports.call(m);
					if ( exported ) {
						$.extend( winkstart[module] = winkstart[module] || {}, exported);
					}
				}
			}
		},

		// This will load the required module and then execute the callback
		using: function(module, callback, errorCallback) {
			// Make sure the module is loading code
			
			var m = $.makeArray(module);
			for ( var i = 0; i < m.length; i++ ) {
				module = m[i];
				if ( !modules[module] ) {
					// We need to go out and load the module
					if ( loading[module] ) {
						loading[module].callbacks.push(callback);
						
						if ( $.isFunction(errorCallback) ) {
							loading[module].errorCallbacks.push(errorCallback);
						}
						
					} else {
						loading[module] = {
							loading: true,
							callbacks: [callback],
							errorCallbacks: []
						};
						
						if ( $.isFunction(errorCallback) ) {
							loading[module].errorCallbacks.push(errorCallback);
						}
						
						// Determine the module URL
						var url = this.getResourcePath(module, module + '.js');
						$.getScript(url, function() {
							// The module has supposably been loaded (there should now be a definition in modules
							if ( !modules[module] ) {
								var cbs = loading[module].errorCallbacks;
							} else {
								// The module is now loaded, go through and execute each callback that is queued
								var cbs = loading[module].callbacks;
								try {
									loading[module] = null;
									delete loading[module];
								} catch (e) {}
							}
							
							for ( var f in cbs ) {
								cbs[f].call(window);
							}
						});
					}
				} else {
					// TODO: Error loading module
				}
			}
		},
		
		load: function(module, callback) {
		
		},

		// Method for 
		error: function(callback) {
			alert('An error has occurred');
		}
	};
	
	winkstart.plugins = {
		register: function() {
		}
	};
	*/
	
	// Bootstrap the app: Start by loading the core module
	winkstart.module.load('core', function() {
		// Currently core doesn't do anything, it will
		
		// Create an instance of the core module
		this.init(function() {
			console.log('Core loaded, loading layout');
			
			// First thing we're going to do is go through is load our layout
			winkstart.module.load('layout', function() {
				this.init({ parent: $('body') }, function() {
					console.log('Layout initialized');
					
					winkstart.module.load('auth', function() {
						this.init();
					});
					winkstart.module.load('dashboard', function() {
						this.init(function() {
							// Activate the dashboard by default (target selector is a hack)
							winkstart.publish('dashboard.activate', { target: $('#ws-content') });
						});
					});
				});
			});
		});
	});

})(	window.winkstart = window.winkstart || {},
	window.amplify = window.amplify || {});
