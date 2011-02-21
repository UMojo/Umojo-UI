(function( amplify, $ ) {

amplify.request = function( resourceId, data, callback ) {
	// default to an empty hash just so we can handle a missing resourceId
	// in one place
	var settings = resourceId || {};

	if ( typeof settings === "string" ) {
		if ( $.isFunction( data ) ) {
			callback = data;
			data = {};
		}
		settings = {
			resourceId: resourceId,
			data: data || {},
			success: callback
		};
	}

	var resource = amplify.request.resources[ settings.resourceId ],
		success = settings.success || $.noop,
		error = settings.error || $.noop;
	settings.success = function( data, extra ) {
		amplify.publish( "request.success", settings, data, extra );
		amplify.publish( "request.complete", settings, data, extra );
		success.apply( this, arguments );
	};
	settings.error = function( data, extra ) {
		amplify.publish( "request.error", settings, data, extra );
		amplify.publish( "request.complete", settings, data, extra );
		error.apply( this, arguments );
	};

	if ( !resource ) {
		if ( !settings.resourceId ) {
			throw "amplify.request: no resourceId provided";
		}
		throw "amplify.request: unknown resourceId: " + settings.resourceId;
	}

	if ( amplify.publish( "request.before", settings ) ) {
		amplify.request.resources[ settings.resourceId ]( settings );
	}
};

$.extend( amplify.request, {
	types: {},

	resources: {},

	define: function( resourceId, type, settings ) {
		if ( typeof type === "string" ) {
			if ( !( type in amplify.request.types ) ) {
				throw "amplify.request.define: unknown type: " + type;
			}

			settings.resourceId = resourceId;
			amplify.request.resources[ resourceId ] =
				amplify.request.types[ type ]( settings );
		} else {
			// no pre-processor or settings for one-off types (don't invoke)
			amplify.request.resources[ resourceId ] = type;
		}
	}
});





amplify.request.types.ajax = function( defnSettings ) {
	defnSettings = $.extend({
		type: "GET"
	}, defnSettings );

	return function( settings ) {
		var url = defnSettings.url,
			data = $.extend( true, {}, defnSettings.data, settings.data ),
			ajaxSettings,
			regex;

		$.each( data, function( key, value ) {
			regex = new RegExp( "{" + key + "}", "g");
			if ( regex.test( url ) ) {
				url = url.replace( regex, value );
				delete data[ key ];
			}
		});

		ajaxSettings = {
			url: url,
			type: defnSettings.type,
			data: data,
			dataType: defnSettings.dataType,
			success: settings.success,
			error: settings.error
		};

		if ( amplify.publish( "request.before.ajax", {
			resource: defnSettings,
			settings: settings,
			ajaxSettings: ajaxSettings
		} ) ) {
			$.ajax( ajaxSettings );
		}
	};
};


//TODO: why is the cache async? (see example usage)
var cache = amplify.request.cache = {
	_default: (function() {
		var memoryStore = {};
		return function( data ) {
			var resourceId = data.settings.resourceId,
				duration = data.resource.cache;

			if ( resourceId in memoryStore ) {
				// TODO: uncomment
//				data.ajaxSettings.success( cache[ resourceId ] );
				data.ajaxSettings.success( $.extend({
					cached: true
				}, memoryStore[ resourceId ] ) );
				return false;
			}
			var success = data.ajaxSettings.success;
			data.ajaxSettings.success = function( data ) {
				memoryStore[ resourceId ] = data;
				if ( typeof duration === "number" ) {
					setTimeout(function() {
						delete memoryStore[ resourceId ];
					}, duration );
				}
				success.apply( this, arguments );
			};
		};
	}())
};

amplify.subscribe( "request.before.ajax", function( data ) {
	var cacheType = data.resource.cache;
	if ( cacheType ) {
		return cache[ cacheType in cache ? cacheType : "_default" ]( data );
	}
});



amplify.request.decoders = {
	_default: function( response ) {
		response[ response.status === "success" ? "success" : "error" ](
			response.data );
	},

	jsend: function( response ) {
		if ( response.status === "success" ) {
			if ( response.data.status === "success" ) {
				response.success( response.data.data );
			} else if ( response.data.status === "fail" ) {
				response.error( response.data.data );
			} else if ( response.data.status === "error" ) {
				response.error( response.data.message );
			}
		} else {
			response.error();
		}
	}
};

amplify.subscribe( "request.before.ajax", function( data ) {
	var success = data.ajaxSettings.success,
		error = data.ajaxSettings.error,
		decoder = $.isFunction( data.resource.decoder )
			? data.resource.decoder
			: data.resource.decoder in amplify.request.decoders
				? amplify.request.decoders[ data.resource.decoder ]
				: amplify.request.decoders._default;

	data.ajaxSettings.success = function( data, status, xhr ) {
		decoder({
			data: data,
			status: status,
			xhr: xhr,
			success: success,
			error: error
		});
	};

	data.ajaxSettings.error = function( xhr, status ) {
		decoder({
			data: null,
			status: status,
			xhr: xhr,
			success: success,
			error: error
		});
	};
});

}( amplify, jQuery ) );
