// This is the server module
winkstart.module.define('example', {
	requires: ['example2'],
	
	// Method for execution when this module is first loaded
	onDefine: function() {
		alert('Module example has had onDefine called!');
	},
	
	// Called when modules are to initialize
	init: function() {
		alert('Module has been initialized');
	},
	
	exports: function() {
		return {
			hello: 'world'
		};
	}
});
