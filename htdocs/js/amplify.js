/*!
 * Amplify
 *
 * Version: @VERSION
 * Released: @DATE
 * Source: http://amplifyjs.com
 * 
 * Copyright 2010 appendTo LLC. (http://appendto.com/team)
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 */
(function( $, undefined ) {

var slice = [].slice,
	subscriptions = {};

this.amplify = {
	publish: function( topic ) {
		var args = slice.call( arguments, 1 ),
			ret;

		if ( !subscriptions[ topic ] ) {
			return;
		}

		$.each( subscriptions[ topic ], function( i, subscription ) {
			return ( ret = subscription.callback.apply( subscription.context, args ) );
		});
		return ret !== false;
	},

	subscribe: function( topic, context, callback, priority ) {
		if ( arguments.length === 3 && typeof callback === "number" ) {
			priority = callback;
			callback = context;
			context = null;
		}
		if ( arguments.length === 2 ) {
			callback = context;
			context = null;
		}
		priority = priority || 10;

		var subscriptionInfo = {
			callback: callback,
			context: context,
			priority: priority
		};

		if ( !subscriptions[ topic ] ) {
			subscriptions[ topic ] = [];
		}

		for ( var i = subscriptions[ topic ].length - 1; i >= 0; i-- ) {
			if ( subscriptions[ topic ][ i ].priority <= priority ) {
				subscriptions[ topic ].splice( i + 1, 0, subscriptionInfo );
				return callback;
			}
		}

		subscriptions[ topic ].unshift( subscriptionInfo );
		return callback;
	},

	unsubscribe: function( topic, callback ) {
		if ( !subscriptions[ topic ] ) {
			return;
		}

		$.each( subscriptions[ topic ], function( i, subscription ) {
			if ( subscription.callback === callback ) {
				subscriptions[ topic ].splice( i, 1 );
				return false;
			}
		});
	}
};

})( jQuery );


/*!
 * Amplify Request Manager
 *
 * Version: @VERSION
 * Released: @DATE
 * Source: http://amplifyjs.com/request
 * 
 * Copyright 2010 appendTo LLC. (http://appendto.com/team)
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 */ 
(function( amplify, $, undefined ) {

var _handlers = {},
	_requestTypes = {};

amplify.request = function( topic, params, callback ) {
	var errorCallback = function() {};
	if ( $.isPlainObject(topic) ) {
		errorCallback = topic.error;
		callback = topic.success;
		params = topic.params;
		topic = topic.topic;
	}

	var topics = permute( topic );
	if ( $.isFunction( params ) ) {
		callback = params;
		params = {};
	}
	
	for ( var i = 0, l = topics.length; i < l; i++ ) {
		if ( _handlers[ topics[i] ] ) {
			_handlers[ topics[i] ].handler.call( {}, params, callback, errorCallback );
			return true;
		}
	}
	return false;
};

$.extend( amplify.request, {
	_reset: function() {
		_handlers = {};
	},
	
	addType: function( type, preparer ) {
		_requestTypes[ type ] = preparer;
	},
	
	define: function( topic, type, args ) {
		var handler;
		topic = sanitize( topic );
		args = args || {};
		
		if ( typeof type === "string" ) {
			if ( !type in _requestTypes ) {
				throw "amplify.request.define: unknown type: " + type;
			}
			handler = _requestTypes[ type ]( args );
		} else {
			handler = type;
		}
		
		_handlers[ topic ] = {
			topic: topic,
			args: args,
			handler: handler
		};
		return true;
	}
});

amplify.request.addType( "ajax", function( args ) {
	return function( params, callback, errorCallback ) {
		if ( $.isFunction( params ) ) {
			errorCallback = callback;
			callback = params;
			params = {};
		};
		callback = callback || function() {};
		errorCallback = errorCallback || function () {};
		var url = args.url,
			data = $.extend( {}, args.data, params );
		
		$.each( data, function( key, value ) {
			url = url.replace( new RegExp( "{" + key + "}", "g"), value );
		});
		
		$.ajax({
			url: url,
			type: (args.method || "GET").toUpperCase(),
			dataType: args.responseType || "json",
			data: data,
			success: function( json, status, request ) {
				if ( args.envelope ) {
					var env = $.extend({
							statusName: "status",
							statusIndicator: "success",
							dataName: "data",
						},
						args.envelope);
					return callback( json[env.dataName], json[env.statusName] == env.statusIndicator );
				} else {
					return callback( json, true );
				}
			},
			error: function( request, status, err ) {
				errorCallback( err);
			}
		});
	};
});

function permute( topic ) {
	var topics = [ topic ],
		parts = topic.split( "." ),
		length = parts.length,
		head = parts[ 0 ],
		tail = parts[ length - 1 ],
		wildcards = [];
	
	if ( length > 1 ) {
		topics.push( parts.slice(0,  -1 ).join( "." ) + ".*" );
		topics.push( "*." + parts.slice( 1 ).join( "." ) );
	} else {
		topics.push( "*" );
	}
	
	for ( var i = 1, x = length - 1; i < length; i++ ) {
		wildcards.push( "**." + tail );
		wildcards.push( head + ".**" );
		head += "." + parts[ i ];
		tail = parts[ x - i ] + "." + tail;
	}
	
	topics = topics.concat( wildcards.reverse() );
	topics.push( "**" );
	
	return topics;
}

function sanitize( topic ) {
	return topic.toLowerCase().replace( /[^a-z0-9\.\*]/g, "" );
}

})( this.amplify = this.amplify || {}, jQuery );

/*!
 * Amplify Store - Client-side Storage
 *
 * Version: @VERSION
 * Released: @DATE
 * Source: http://amplifyjs.com/store
 * 
 * Copyright 2010 appendTo LLC. (http://appendto.com/team)
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 */
(function( amplify, $, undefined ) {

amplify.store = function( key, value, options ) {
	var type = amplify.store.type;
	if ( options && options.type && options.type in amplify.store.types ) {
		type = options.type;
	}
	return amplify.store.types[ type ]( key, value );
};

$.extend( amplify.store, {
	types: {},
	
	type: null,
	
	addType: function( type, store ) {
		if ( !this.type ) {
			this.type = type;
		}
		
		this.types[ type ] = store;
		amplify.store[ type ] = function( key, value, options ) {
			return amplify.store( key, value,
				$.extend( { type: type }, options ) );
		};
	}
});

function createSimpleStorage( storageType, storage ) {
	amplify.store.addType( storageType, function( key, value ) {
		var ret = value;
		
		if ( !key ) {
			ret = {};
			for ( key in storage ) {
				ret[ key.replace( /^__amplify__/, "" ) ] =
					JSON.parse( storage[ key ] );
			}
			return ret;
		}
		
		// protect against overwriting built-in properties
		if ( key in storage && typeof storage[ key ] !== "string" ) {
			key = "__amplify__" + key;
		}
		
		if ( value === undefined ) {
			return storage[ key ] && JSON.parse( storage[ key ] );
		} else {
			if ( value === null ) {
				delete storage[ key ];
			} else {
				storage[ key ] = JSON.stringify( value );
			}
		}
		
		return ret;
	});
}

$.each( [ "localStorage", "sessionStorage" ], function( i, storageType ) {
	try {
		if ( storageType in window && window[ storageType ] !== null ) {
			createSimpleStorage( storageType, window[ storageType ] );
		}
	} catch( e ) {}
});

(function() {
	// append to html instead of body so we can do this from the head
	var div = $( "<div>" ).hide().appendTo( "html" ),
		attrKey = "amplify",
		attrs;
	
	if ( div[ 0 ].addBehavior ) {
		div[ 0 ].addBehavior( "#default#userdata" );
		div[ 0 ].load( attrKey );
		attrs = div.attr( attrKey ) ? JSON.parse( div.attr( attrKey ) ) : {};
		
		amplify.store.addType( "userData", function( key, value ) {
			var ret = value;
			
			if ( !key ) {
				ret = {};
				for ( key in attrs ) {
					ret[ key ] = JSON.parse( div.attr( key ) );
				}
				return ret;
			}
			
			if ( value === undefined ) {
				return key in attrs ? JSON.parse( div.attr( key ) ) : undefined;
			} else {
				if ( value === null ) {
					div.remoteAttr( key );
					delete attrs[ key ];
				} else {
					div.attr( key, JSON.stringify( value ) );
					attrs[ key ] = true;
				}
			}
			
			div.attr( attrKey, JSON.stringify( attrs ) );
			div[ 0 ].save( "amplify" );
			return ret;
		});
	}
})();

createSimpleStorage( "memory", {} );

if ( $.cookie && $.support.cookie ) {
	amplify.store.addType( "cookie", function( key, value ) {
		return $.cookie( key, value, {
			expires: 31e9, // about a year
			path: "/"
		});
	});
}

})( this.amplify = this.amplify || {}, jQuery );

/*!
 * Amplify Route Manager
 *
 * Version: @VERSION
 * Released: @DATE
 * Source: http://amplifyjs.com/route
 * 
 * Copyright 2010 appendTo LLC. (http://appendto.com/team)
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 */
(function( amplify, $, undefined ) {

var rParam = /\{(.+?)\}/g,
	// .*+?|()[]\ - omit curlies. we're taking care of those manually.
	rSpecial = /[.*+?|()\\[\\]\\\\]/g,
	routes = {},
	watches = [],
	lastRoute = null,
	googleHash = "";

function sanitize( what ) {
	return what
		// double slash
		.replace( /\/\//g, "/" )
		// leading slash
		.replace( /^\/\s*/, "" )
		// trailing slash
		.replace( /\s*\/$/, "" );
}

function parseValues( route ) {
	var path = amplify.route.path(),
		matches = route._regex.exec( path );
	
	for ( var i = 0; i < route.params.length; i++ ) {
		var value = matches[ i + 1 ];
		route.values[ route.params[ i ] ] = sanitize( value );
	}
}

// hashchange
var interval = null,
	lastHash = "",
	docMode = document.documentMode, // from http://benalman.com/projects/jquery-hashchange-plugin/
	hashSupported = "onhashchange" in window && ( docMode === undefined || docMode > 7 ),
	pushSupported = history.pushState ? true : false,
	activeRoute = {},
	iframe;

function onhashchange( event ) {
	lastHash = amplify.route.path();
	var route = amplify.route.active();
	
	for ( var i = 0; i < watches.length; i++ ) {
		var watch = watches[ i ],
			wildcard = false;
		
		if ( watch.routeName !== route.name ) {
			if ( watch.routeName.indexOf( "*" ) >= 0 ) {
				var regex = new RegExp(
					sanitize( watch.routeName ).replace( "*", "(.*?)" ) );
				
				if ( !regex.test( lastHash ) ) {
					continue;
				}
				
				wildcard = true;
			} else {
				continue;
			}
		}
		
		var execute = watch.params ? false : true;
		
		for ( label in watch.params ) {
			var paramName = watch.params[ label ];
			if ( !lastRoute || route.values[ label ] !== lastRoute.values[ label ] ) {
				execute = true;
				break;
			}
		}
		
		if ( execute || wildcard ) {
			watch.callback( route );
		}
	}
	
	lastRoute = amplify.route.active();
};

function initHashChange() {
	if ( interval ) {
		return;
	}
	
	if ( pushSupported || hashSupported ) {
		var event = pushSupported ? "popstate" : "hashchange";
		
		if ( window.addEventListener ) {
			window.addEventListener( event, onhashchange, false );
		} else {
			window.attachEvent( "on" + event, onhashchange );
		}
		interval = 1;
	// startup our hashchange replacement, still need to work in an iframe for IE6/7
	} else {
		interval = setInterval(function() {
			var path = amplify.route.path();
			
			if ( lastHash !== path ) {
				lastHash = path;
				onhashchange();
			}
		}, 50 );
	}
	
	if ( docMode && docMode <= 7 && !hashSupported ) {
		initIframe();
	}
};

//from http://benalman.com/projects/jquery-hashchange-plugin/
function initIframe(){
	iframe = amplify.route.iframe = document.createElement( "iframe" );
	iframe.style.display = "none";
	iframe.src = "javascript:0";
	iframe.go = function( hash ) {
		var doc = iframe.contentDocument;
		doc.open();
		doc.close();
		doc.location.hash = hash;
	};
	
	document.body.parentNode.insertBefore( iframe, document.body.nextSibling );
}

amplify.route = function( name, path, options ) {
	var name = arguments[ 0 ],
		path = arguments[ arguments.length > 1 ? 1 : 0 ],
		options = arguments[ name == path ? 1 : 2 ] || {},
		segments = sanitize( path ).split( "/" ),
		rRoute,
		params = [];
	
	if ( routes[ name ] ) {
		return routes[ name ];
	}
	
	options.constraints = options.constraints || {};
	options.defaults = options.defaults || {};
	
	for ( var i = 0; i < segments.length; i++ ) {
		var segment = segments[ i ].replace( rSpecial, "\\$&" );
		
		while ( match = rParam.exec( segment ) ) {
			segment = segment.replace( match[ 0 ], "(.+)?" );
			params.push( match[ 1 ] );
		}
		
		segments[ i ] = segment;
	};
	
	// if we dont have a hash to compare to, we're using the full url.
	// we'll need to test the url to see if it ends with our pattern.
	
	var route = {
		name: name,
		path: path,
		params: params,
		_regex: new RegExp( segments.join( "\/" ) + ( pushSupported ? "$" : "" ) ),
		values: {},
		_constraints: options.constraints,
		_defaults: options.defaults
	};
	
	routes[ name ] = route;
	
	// dont start watching the hash until we have a route
	initHashChange();
	
	return route;
};

amplify.route.pushSupported = pushSupported;

amplify.route.active = function() {
	var hash = sanitize( amplify.route.path() );

	for (label in routes ) {
		var route = routes[ label ];
		route._regex.lastIndex = 0;
		
		if ( route._regex.test( hash ) ) {
			activeRoute = route;
			parseValues( route );
			break;
		}
	}
	
	return activeRoute;
};

amplify.route.go = function() {
	var where = arguments[ 0 ],
		title = arguments[ 1 ];
	
	if ( arguments.length >= 2 && typeof arguments[ 1 ] === "object" ) {
		var routeName = arguments[ 0 ],
			params = arguments[ 1 ];
		
		title = arguments.length > 2 ? arguments[ 2 ] : undefined;
		
		where = amplify.route.path( routeName, params );
	}
	
	if ( typeof where === "number" ) {
		window.history.go( where );
		iframe && iframe.go( amplify.route.path() );
		return;
	}
	
	if ( title ) {
		document.title = title;
	}
	
	if ( pushSupported ) {
		if ( !where || !where.length ) {
			return;
		}
		
		history.pushState( null, title, where );
		onhashchange();
		return;
	}
	
	window.location.hash = ( where && where.length ? googleHash + where : "" );
	if ( iframe ) {
		iframe.go( amplify.route.path() );
	}
};

amplify.route.path = function() {
	if ( !arguments.length ) {
		return pushSupported ? 
			window.location.href :
			window.location.hash.substring( googleHash ? 2 : 1 );
	}
	
	var routeName = arguments[ 0 ],
		params = arguments[ 1 ];
	
	route = routes[ routeName ];
	var path = route.path;
	
	while ( match = rParam.exec( route.path ) ) {
		var param = match[ 0 ], paramName = match[ 1 ];
		path = path.replace( param, params[ paramName ] );
	}
	
	return path;
};

amplify.route.supportGoogle = function( que ) {
	googleHash = que ? "!" : "";
};

amplify.route.watch = function() {
	if ( arguments.length < 2 || !$.isFunction( arguments[ 1 ] ) ) {
		return;
	}
	
	var options = arguments.length > 2 ? arguments[ 2 ] : null,
		watch = {
			routeName: arguments[ 0 ],
			callback: arguments[ 1 ],
			params: options && options.params ? options.params : null
		};
	
	if ( watch.params && typeof watch.params === "string" ) {
		watch.params = [ watch.params ];
	}
	
	watches.push( watch );
};

})( this.amplify = this.amplify || {}, jQuery );

/*!
 * Amplify Module
 *
 * Version: @VERSION
 * Released: @DATE
 * Source: http://amplifyjs.com/module
 * 
 * Copyright 2010 appendTo LLC. (http://appendto.com/team)
 * Dual licensed under the MIT or GPL licenses.
 * http://appendto.com/open-source-licenses
 */
(function( amplify, $, undefined ) {
var modules = {};
amplify.module = function(module, config, construct, methods) {
	var m = module.toLowerCase();

	// The module is being defined
	if ( arguments.length > 1 ) {
		if ( !modules[m] ) {
			modules[m] = {
				module:    module,
				config:    config,
				construct: construct,
				methods:   methods
			};
		}
	}
	
	return {
		init: function(args, callback) {
			if ( modules[m] ) { 
				var module = modules[m];
				
				if ( $.isFunction(args) && !callback ) {
					callback = args;
					args = {};
				}
				
				// Clone the config
				var base = { __module: module.module, config: {} };
				$.extend(base.config, module.config);
				$.extend(base, module.methods);
				if ( amplify.module.constructor ) {
					amplify.module.constructor.call(base, args, function() {
						console.log('Calling module construct: ' + m);
						module.construct.call(base, args);
						if ( $.isFunction(callback) ) {
							callback();
						}
					});
				}
				return base;
			} else {
				var _c = arguments.callee, _t = this, _a = arguments;
				console.log('Loading module: ' + m);
				amplify.module.load(m, function() {
					console.log('Module ' + m + ' loaded...');
					if ( !modules[m] ) {
						console.log('Module ' + m + ' failed to load');
					} else {
						_c.apply(_t, _a);
					}
				});
			}
			return null;
		}
	};
};

amplify.module.load = function(module, callback) {
	$LAB.script('module/' + module + '/' + module + '.js?_=' + (new Date()))
		.wait(function() {
			callback.call( amplify.module(module) );
		});
};

// This is the method that may be overloaded to change the way in which the module is 
// loaded and instanciated
amplify.module.constructor = function(args, callback) { callback(); };

amplify.module.using = amplify.module.load;

})( this.amplify = this.amplify || {}, jQuery );

