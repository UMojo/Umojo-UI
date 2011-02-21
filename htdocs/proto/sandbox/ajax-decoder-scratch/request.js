(function( $ ) {

// try to implement each feature (decoder, cache) via a hash like $.attrFn
// we need an easy way for extensions to be built

var amplify = window.amplify = {};

amplify.request = function( resource, data, callback ) {
	var resource = amplify.request.resources[ resource ];
	$.ajax({
		url: resource.url,
		data: data,
		dataType: resource.dataType,
		success: function( data, status, xhr ) {
			resource.decoder({
				data: data,
				status: status,
				xhr: xhr,
				success: callback,
				error: $.noop
			});
		}
	} );
};

amplify.request.resources = {};

var decoders = {
	jsend: function( response ) {
		if ( response.status === "success" ) {
			response.success( response.data.data );
		} else if ( response.status === "fail" ) {
			response.error( response.data.data );
		} else if ( response.status === "error" ) {
			response.error( response.data.message );
		}
	},
	
	xml2json: function( response ) {
		response.success({
			xml: "json",
			hello: $( response.data ).find( "hello" ).text()
		});
	}
};

amplify.request.define = function( resource, type, settings ) {
	// do this at run time
	// create decoder._default (and expose)
	if ( typeof settings.decoder === "string" ) {
		settings.decoder = decoders[ settings.decoder ];
	}
	
	amplify.request.resources[ resource ] = $.extend({
		type: "GET",
		decoder: function( response ) {
			response.success( response.data );
		}
	}, settings );
};

}( jQuery ));
