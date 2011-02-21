(function(winkstart, amplify, undefined) {
	
	winkstart.registerResources = function(resources){
		for(var key in resources){
			var resource = resources[key];
			amplify.request.define( key, "ajax", {
				url: resource.url,
				dataType: resource.dataType
			});
		}
	};
	
	winkstart.getJSON = function(resource_name, params, callback){
		amplify.request( resource_name, params, function( data ) {
			callback(data);
		});
	};
	
	winkstart.postJSON = function(resource_name, params, callback){
		amplify.request( resource_name, params, function( data ) {
			callback(data);
		});
	};
	
	winkstart.deleteJSON = function(resource_name, params, callback){
		amplify.request( resource_name, params, function( data ) {
			callback(data);
		});
	};
	
	winkstart.putJSON = function(resource_name, params, callback){
		amplify.request( resource_name, params, function( data ) {
			callback(data);
		});
	};

})(	window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {});
