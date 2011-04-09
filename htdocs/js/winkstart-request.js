(function(winkstart, amplify, undefined) {
	
	winkstart.registerResources = function(resources){
		for(var key in resources){
			var resource = resources[key];
			amplify.request.define( key, "ajax", {
				url: resource.url + "?jsonp=?",
				dataType: resource.dataType,
				type: resource.httpMethod,
				accepts: "application/json"
			});
		}
	};
	
	winkstart.getAuthToken = function(){
		return '1234';
	};
	
	winkstart.normalizeRequest = function(params){
		var base_params = {};
		base_params['auth-token'] = winkstart.getAuthToken();
		base_params.base = params;
		return base_params;
	};
	
	winkstart.getJSON = function(resource_name, params, callback){
		amplify.request( resource_name, winkstart.normalizeRequest(params), function( data ) {
			callback(data);
		});
	};
	
	winkstart.postJSON = function(resource_name, params, callback){
		amplify.request( resource_name, winkstart.normalizeRequest(params), function( data ) {
			callback(data);
		});
	};
	
	winkstart.deleteJSON = function(resource_name, params, callback){
		amplify.request( resource_name, winkstart.normalizeRequest(params), function( data ) {
			callback(data);
		});
	};
	
	winkstart.putJSON = function(resource_name, params, callback){
		amplify.request( resource_name, winkstart.normalizeRequest(params), function( data ) {
			callback(data);
		});
	};

})(	window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {});
