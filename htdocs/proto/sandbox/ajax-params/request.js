(function( amplify, $ ) {

amplify.request = function( resource, data, callback ) {
	var settings = resource,
		ajaxSettings,
		url;
	
	if ( typeof settings === "string" ) {
		if ( $.isFunction( data ) ) {
			callback = data;
			data = {};
		}
		settings = {
			resource: resource,
			data: data,
			callback: callback
		};
	}
	
	resource = amplify.request.resources[ settings.resource ];
	url = resource.url;
	data = $.extend( {}, resource.data, data );
	
	$.each( data, function( key, value ) {
		url = url.replace( new RegExp( "{" + key + "}", "g"), value );
	});
	
	ajaxSettings = {
		url: url,
		type: resource.type,
		data: data,
		dataType: resource.dataType,
		success: settings.callback || $.noop,
		error: settings.error || $.noop
	};
	
	$( amplify ).trigger( "request:before.ajax", {
		resource: resource,
		settings: settings,
		ajaxSettings: ajaxSettings
	});
	
	$.ajax( ajaxSettings );
};

$.extend( amplify.request, {
	resources: {},
	
	decoders: {
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
	},
	
	define: function( resource, type, settings ) {
		amplify.request.resources[ resource ] = $.extend({
			type: "GET"
		}, settings );
	}
});





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
