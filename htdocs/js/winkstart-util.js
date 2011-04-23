(function(winkstart, amplify, $) {
	
	winkstart.log = function(data){
		if(winkstart.debug){
			console.log(data);	
		}
	};
	
	winkstart.cleanForm = function(){
		var max = 0;
	    $("label").each(function(){
	        if ($(this).width() > max)
	            max = $(this).width();   
	    });
	    $("label").width(max);
	};
	
	winkstart.getModuleFormLookupData = function(module_name, action_name){
		var data = amplify.store('form_data');
		var module_data = data.modules[module_name].actions[action_name];
		return (($.isObject(module_data)) ? module_data : {});
	}
	
	winkstart.htmlformhelpers = {
		isChecked: function(test){
			return test;
		}
	};

})(	window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {}, jQuery);