(function(winkstart, amplify, undefined) {
	
	winkstart.registerResources = function(resources){
		var THIS = this;
		
		for(var key in resources){
			var resource = resources[key];
			
			amplify.request.define( key, "ajax", {
				url: resource.url,
				decoder: function(response){
					response.success( response.data, response.xhr);
				},
                contentType: resource.contentType,
                dataType: 'json',
				type: resource.verb,
				accepts: 'application/json',
				beforeSend: function(jqXHR, settings){
					jqXHR.setRequestHeader('X-Auth-Token', THIS.getAuthToken());		
				}
			});
		}
	};
	
	winkstart.getAuthToken = function(){
		return AUTH_TOKEN;
	};
	
	winkstart.normalizeRequest = function(params){
		//We were placing this in the params to denote a call to crossbar
		delete params.crossbar;
		params['auth-token'] = winkstart.getAuthToken();
		return params;
	};
	
	winkstart.getJSON = function(resource_name, params, callback){
		amplify.request( resource_name, (jQuery.inArray(params, 'crossbar') ? winkstart.normalizeRequest(params) : params ), function( data, xhr) {
			callback(data, xhr);
		});
	};
	
	winkstart.postJSON = function(resource_name, params, callback){
		
		var norm_params = (jQuery.inArray(params, 'crossbar') ? winkstart.normalizeRequest(params) : params );
		norm_params.json_string = JSON.stringify(norm_params);
		
		amplify.request( resource_name, norm_params, function( data, xhr ) {
			callback(data, xhr);
		});
	};
	
	winkstart.deleteJSON = function(resource_name, params, callback){
		
		var norm_params = (jQuery.inArray(params, 'crossbar') ? winkstart.normalizeRequest(params) : params );
		norm_params.verb = 'delete';
		
		amplify.request( resource_name, norm_params, function( data, xhr ) {
			callback(data, xhr);
		});
	};
	
	winkstart.putJSON = function(resource_name, params, callback){
		var norm_params = (jQuery.inArray(params, 'crossbar') ? winkstart.normalizeRequest(params) : params );
		norm_params.verb = 'put';
		norm_params.json_string = JSON.stringify(norm_params);
		
		amplify.request( resource_name, norm_params, function( data, xhr ) {
			callback(data, xhr);
		});
	};

})(	window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {});
