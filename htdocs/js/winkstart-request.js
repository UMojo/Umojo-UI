(function(winkstart, amplify, undefined) {
	
	winkstart.registerResources = function(app_name, resources){
		var THIS = this;

		for(var key in resources){
			var resource = resources[key];
			
			amplify.request.define( key, "ajax", {
				url: resource.url,
				decoder: function(data, status, ampXHR, success, error){
                    if(status == 'success') {
					    success(data, ampXHR.status);
                    }
                    else {
                        if(data == null && 'responseText' in ampXHR) {
                            var _data = null;

                            try {
                                _data = eval('(' + ampXHR.responseText + ')');
                            }
                            catch(err) {}

                            _data = (typeof _data == 'object') ? _data : null;
                        }

					    error(data || _data || {}, ampXHR.status);
                    }
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

                    // Without returning true, our decoder will not run.
                    return true;
                }
			});
		}
	};
	
    winkstart.request = function(resource_name, params, success, error){
        amplify.request({
            resourceId: resource_name,
            data: params,
            success: function(data, status) {
                if(typeof success == 'function') {
                    success(data, status);
                }
            },
            error: function(data, status) {
                if(typeof error == 'function') {
                    error(data, status);
                }
            }
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

	winkstart.getJSON = function(resource_name, params, success, error) {
		var norm_params = ('crossbar' in params ? winkstart.normalizeRequest(params) : params);

		winkstart.request(resource_name, norm_params, success, error);
	};
	
	winkstart.postJSON = function(resource_name, params, success, error) {
		
		var norm_params = ('crossbar' in params ? winkstart.normalizeRequest(params) : params);
        norm_params.verb = 'post';
		norm_params.json_string = JSON.stringify(norm_params);
		
		winkstart.request(resource_name, norm_params, success, error);
	};
	
	winkstart.deleteJSON = function(resource_name, params, success, error) {
		
		var norm_params = ('crossbar' in params ? winkstart.normalizeRequest(params) : params);
		norm_params.verb = 'delete';
        norm_params.json_string = "";
		
		winkstart.request(resource_name, norm_params, success, error);
	};
	
	winkstart.putJSON = function(resource_name, params, success, error) {
		var norm_params = ('crossbar' in params ? winkstart.normalizeRequest(params) : params);
		norm_params.verb = 'put';
		norm_params.json_string = JSON.stringify(norm_params);
		
		winkstart.request(resource_name, norm_params, success, error);
	};

})(	window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {});
