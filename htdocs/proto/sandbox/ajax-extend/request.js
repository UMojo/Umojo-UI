(function( amplify, $ ) {

amplify.request = function( resource, data, callback ) {
	var resource = amplify.request.resources[ resource ],
		settings = {
			url: resource.url,
			type: resource.type,
			data: $.extend( {}, resource.data, data ),
			dataType: resource.dataType,
			success: callback
		};
	
	$( amplify ).trigger( "request:before.ajax", {
		resource: resource,
		settings: settings
	});
	
	$.ajax( settings );
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
	var callback = data.settings.success,
		decoder = $.isFunction( data.resource.decoder )
			? data.resource.decoder
			: data.resource.decoder in amplify.request.decoders
				? amplify.request.decoders[ data.resource.decoder ]
				: amplify.request.decoders._default;
	
	data.settings.success = function( data, status, xhr ) {
		decoder({
			data: data,
			status: status,
			xhr: xhr,
			success: callback,
			error: $.noop
		});
	};
});

}( this.amplify = this.amplify || {}, jQuery ) );
