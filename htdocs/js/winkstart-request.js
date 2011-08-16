(function(winkstart, amplify, undefined) {
	
	winkstart.registerResources = function(app_name, resources){
		var THIS = this;

		for(var key in resources){
			var resource = resources[key];
			
			amplify.request.define( key, "ajax", {
				url: resource.url,
				decoder: function(response){
                    if ( response.xhr.status == "401" ) {
                        if (xhr.responseText) {
                            response.error( JSON.parse( xhr.responseText ), "auth_invalid" );
                        } else {
                            response.error( data, "auth_invalid");
                        }
                        return;
                    }
					response.success( response.data, response.xhr);
				},
                contentType: resource.contentType || 'application/json',
                dataType: 'json',
                type: resource.verb,
                //jQuery is setting this wrong
                //accepts: 'application/json',
                processData: resource.verb == "GET",
                cache: false,
                beforeSend: function(jqXHR, settings){
                    jqXHR.setRequestHeader('X-Auth-Token', THIS.getAuthToken(app_name));
                }
			});
		}
	};
	
        winkstart.request = function(resource_name, params, callback){
		amplify.request( resource_name, params, function( data, xhr ) {
			callback(data, xhr);
		});
        };

	winkstart.getAuthToken = function(app_name){
        return winkstart.apps[app_name]['auth_token'];
	};
	
	winkstart.normalizeRequest = function(params){
		//We were placing this in the params to denote a call to crossbar
		delete params.crossbar;
		//params['auth-token'] = winkstart.getAuthToken();
		return params;
	};

	winkstart.getJSON = function(resource_name, params, callback) {
		amplify.request( resource_name, ('crossbar' in params ? winkstart.normalizeRequest(params) : params ), function( data, xhr) {
			callback(data, xhr);
		});
	};
	
	winkstart.postJSON = function(resource_name, params, callback) {
		
		var norm_params = ('crossbar' in params ? winkstart.normalizeRequest(params) : params );
        norm_params.verb = 'post';
		norm_params.json_string = JSON.stringify(norm_params);
		
		amplify.request( resource_name, norm_params, function( data, xhr ) {
			callback(data, xhr);
		});
	};
	
	winkstart.deleteJSON = function(resource_name, params, callback) {
		
		var norm_params = ('crossbar' in params ? winkstart.normalizeRequest(params) : params );
		norm_params.verb = 'delete';
        norm_params.json_string = "";
		
		amplify.request( resource_name, norm_params, function( data, xhr ) {
			callback(data, xhr);
		});
	};
	
	winkstart.putJSON = function(resource_name, params, callback) {
		var norm_params = ('crossbar' in params ? winkstart.normalizeRequest(params) : params );
		norm_params.verb = 'put';
		norm_params.json_string = JSON.stringify(norm_params);
		
		amplify.request( resource_name, norm_params, function( data, xhr ) {
			callback(data, xhr);
		});
	};

})(	window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {});
