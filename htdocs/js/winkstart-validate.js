(function(winkstart, amplify, undefined) {

    winkstart.validate = {
        // Just text input for now
        add: function($element, regex) {
            $element.wrap('<span class="validated" />');
            $element.keyup(function() {
                if($element.val().match(regex) == null) {
                    $element.parents('.validated')
                                .removeClass('valid')
                                .addClass('invalid');
                }
                else {
                    $element.parents('.validated')
                                .removeClass('invalid')
                                .addClass('valid');
                }
            });
        }
    }

})( window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {});
