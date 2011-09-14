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

    winkstart.dialog = function(content, options) {
        var newDiv = $(document.createElement('div')).html(content);

        defaults = {
            width : 'auto',
            show : { effect : 'fade', duration : 200 },
            hide : { effect : 'fade', duration : 200 },
            modal : true,

            // By default, don't long-live dialogs - kill them after they're closed. Normal jquery default is just to hide them.
            close : function() {
                $(newDiv).dialog('destroy');    // Destroy the dialog utilizing the div and associated events
                $(newDiv).remove(); // Remove the div
            }
        };

        // Overwrite any defaults with settings passed in
        $.extend(options, defaults);

        $(newDiv).dialog(options);

        return $(newDiv);       // Return the new div as an object, so that the caller can destroy it when they're ready.'
    };

})(window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {}, jQuery);
