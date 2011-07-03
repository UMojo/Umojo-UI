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

    winkstart.popup = function(content, options) {
        var newDiv = $(document.createElement('div'));
        $(newDiv).html(content);

        if (!options.close) {
            // By default, don't long-live dialogs - kill them after they're closed. Normal default is just to hide them.
            options.close = function() {
                $(newDiv).dialog('destroy');    // Destroy the dialog utilizing the div and associated events
                $(newDiv).remove(); // Remove the div
            }
        }

        $(newDiv).dialog(options);

        return $(newDiv);       // Return the new div as an object, so that the caller can destroy it when they're ready.'
    };

})(window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {}, jQuery);