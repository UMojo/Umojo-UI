(function( amplify, $ ) {

amplify.request = function( resourceId, data, callback ) {
	var settings = resourceId;
	
	if ( typeof settings === "string" ) {
		if ( $.isFunction( data ) ) {
			callback = data;
			data = {};
		}
		settings = {
			resourceId: resourceId,
			data: data,
			success: callback
		};
	}
	
	var success = settings.success || $.noop,
		error = settings.error || $.noop;
	settings.success = function() {
		// TODO: pass relevant data
		$( amplify ).trigger( "request:success" );
		$( amplify ).trigger( "request:complete" );
		success.apply( this, arguments );
	};
	settings.error = function() {
		// TODO: pass relevant data
		$( amplify ).trigger( "request:error" );
		$( amplify ).trigger( "request:complete" );
		error.apply( this, arguments );
	};
	
	amplify.request.resources[ settings.resourceId ]( settings );
};

$.extend( amplify.request, {
	types: {},
	
	resources: {},
	
	define: function( resourceId, type, settings ) {
		if ( typeof type === "string" ) {
			if ( !( type in amplify.request.types ) ) {
				throw "amplify.request.define: unknown type: " + type;
			}
			
			amplify.request.resources[ resourceId ] =
				amplify.request.types[ type ]( settings );
		} else {
			// no pre-processor or settings for one-off types (don't invoke)
			amplify.request.resources[ resourceId ] = type;
		}
	}
});





amplify.request.types.ajax = function( resource ) {
	resource = $.extend({
		type: "GET"
	}, resource );
	
	return function( settings ) {
		var url = resource.url,
			data = $.extend( {}, resource.data, settings.data ),
			ajaxSettings;
		
		$.each( data, function( key, value ) {
			url = url.replace( new RegExp( "{" + key + "}", "g"), value );
		});
		
		ajaxSettings = {
			url: url,
			type: resource.type,
			data: data,
			dataType: resource.dataType,
			success: settings.success,
			error: settings.error
		};
		
		var event = $.Event( "request:before.ajax" );
		$( amplify ).trigger( event, {
			resource: resource,
			settings: settings,
			ajaxSettings: ajaxSettings
		});
		
		if ( !event.isDefaultPrevented() ) {
			$.ajax( ajaxSettings );
		}
	};
};




// TODO: why is the cache async? (see example usage)
var cache = {};

$( amplify ).bind( "request:before.ajax", function( event, data ) {
	if ( !data.resource.cache ) {
		return;
	}
	
	var resourceId = data.settings.resourceId;
	
	if ( resourceId in cache ) {
//		data.ajaxSettings.success( cache[ resourceId ] );
		data.ajaxSettings.success( $.extend({
			cached: true
		}, cache[ resourceId ] ) );
		event.preventDefault();
	} else {
		var success = data.ajaxSettings.success;
		data.ajaxSettings.success = function( data ) {
			cache[ resourceId ] = data;
			success.apply( this, arguments );
		};
	}
});



amplify.request.decoders = {
	_default: function( response ) {
		response.success( response.data );
	},
	
	jsend: function( response ) {
		if ( response.status === "success" ) {
			response.success( response.data.data );
		} else if ( response.status === "fail" ) {
			response.error( response.data.data );
		} else if ( response.status === "error" ) {
			response.error( response.data.message );
		}
	}
};

$( amplify ).bind( "request:before.ajax", function( event, data ) {
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
});

}( this.amplify = this.amplify || {}, jQuery ) );
