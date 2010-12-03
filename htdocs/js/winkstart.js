(function(winkstart, amplify, undefined) {
	var modules = {}, loading = {};
	
	winkstart.module = {
		getResourcePath: function(module, resource) {
			return '/module/' + module + '/' + resource;
		},
		
		// 
		define: function(module, definition) {
			var m = modules[module] = definition;
			if ( m.onDefine && $.isFunction(m.onDefine) ) {
				// Make onDefine async?
				m.onDefine.call(m);
			}
			
			// Load required module dependencies
			if ( m.requires ) {
				
			}
			
			// Load the required assets
						
			// Define the module requests
			if ( m.exports && $.isFunction(m.exports) ) {
				var exported = m.exports.call(m);
				if ( exported ) {
					$.extend( winkstart[module] = winkstart[module] || {}, exported);
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
				}
			}
		},
		
		load: function(module, callback) {
		
		},

		// Method for 
		error: function(callback) {
		}
	};

})(	window.winkstart = window.winkstart || {},
	window.amplify = window.amplify || {});
