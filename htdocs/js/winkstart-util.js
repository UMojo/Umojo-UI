( function(winkstart, amplify, $) {

	winkstart.log = function(data) {
		if (winkstart.debug) {
			console.log(data);
		}
	};

	winkstart.cleanForm = function() {
		var max = 0;
		$("label").each( function() {
			if ($(this).width() > max)
				max = $(this).width();
		});
		$("label").width(max);
	};

	winkstart.loadFormHelper = function(name) {
		var url = 'js/tmpl_snippets/'  + name + '.html';
		$.get(url, function(data) {
			$('body').append(data);
		});
	};

})(window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {}, jQuery);