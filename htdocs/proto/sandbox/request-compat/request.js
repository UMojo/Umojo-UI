(function( amplify, $ ) {

amplify.request = function( topic, data, callback ) {
	var settings = topic;
	
	if ( typeof settings === "string" ) {
		if ( $.isFunction( data ) ) {
			callback = data;
			data = {};
		}
		settings = {
			topic: topic,
			data: data,
			success: callback
		};
	}
	
	function complete( success, data ) {
		var status = success ? "success" : "error";
		$( amplify ).trigger( "requeset:" + status );
		$( amplify ).trigger( "request:complete" );
		if ( settings[ status ] ) {
			settings[ status ]( data );
		}
	}
	
	amplify.request.resources[ settings.topic ]( settings, complete );
};

$.extend( amplify.request, {
	types: {},
	
	resources: {},
	
	define: function( topic, type, settings ) {
		if ( typeof type === "string" ) {
			if ( !( type in amplify.request.types ) ) {
				throw "amplify.request.define: unknown type: " + type;
			}
			
			amplify.request.resources[ topic ] =
				amplify.request.types[ type ]( settings );
		} else {
			// no pre-processor or settings for one-off types (don't invoke)
			amplify.request.resources[ topic ] = type;
		}
	}
});





amplify.request.types.ajax = function( defnSettings ) {
	defnSettings = $.extend({
		type: "GET"
	}, defnSettings );
	
	return function( settings, callback ) {
		var url = defnSettings.url,
			data = $.extend( {}, defnSettings.data, settings.data ),
			ajaxSettings;
		
		$.each( data, function( key, value ) {
			url = url.replace( new RegExp( "{" + key + "}", "g"), value );
		});
		
		ajaxSettings = {
			url: url,
			type: defnSettings.type,
			data: data,
			dataType: defnSettings.dataType,
			success: settings.success,
			error: settings.error
		};
		
		$( amplify ).trigger( "request:before.ajax", {
			resource: defnSettings,
			settings: settings,
			ajaxSettings: ajaxSettings
		});
		
		$.ajax( ajaxSettings );
	};
};

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
