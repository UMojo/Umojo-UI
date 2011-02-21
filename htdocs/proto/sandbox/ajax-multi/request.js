(function( amplify, $ ) {

// try to implement each feature (decoder, cache) via a hash like $.attrFn
// we need an easy way for extensions to be built

amplify.request = function( resource, data, callback ) {
	var resource = amplify.request.resources[ resource ],
		decoder = $.isFunction( resource.decoder )
			? resource.decoder
			: resource.decoder in amplify.request.decoders
				? amplify.request.decoders[ resource.decoder ]
				: amplify.request.decoders._default;
	
	$.ajax({
		url: resource.url,
		type: resource.type,
		data: $.extend( {}, resource.data, data ),
		dataType: resource.dataType,
		success: function( data, status, xhr ) {
			decoder({
				data: data,
				status: status,
				xhr: xhr,
				success: callback,
				error: $.noop
			});
		}
	});
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

}( this.amplify = this.amplify || {}, jQuery ) );
