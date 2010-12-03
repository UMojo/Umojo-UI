// This is the server module
winkstart.module.define('example2', {
	// Method for execution when this module is first loaded
	onDefine: function() {
		alert('Module example2 has had onDefine called!');
	},
	
	// Called when modules are to initialize
	init: function() {
		alert('Module example2 has been initialized');
	},
	
	exports: function() {
		return {
			hello: 'world'
		};
	}
});
