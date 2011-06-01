// This is the server module
winkstart.module('core', 'core', {
	},
	function(args) {
            // First thing we're going to do is go through is load our layout
            winkstart.module.loadPlugin('core', 'layout', function() {
                    this.init({ parent: $('body') }, function() {
                    });
            });
	}
    );
