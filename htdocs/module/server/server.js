// This is the server module
winkstart.module.define('server', {
	modules: ['voicemail'],
	requests : {
		'server.create' : { url : 'api/v2/server/create' },
		'server.get'    : { url : 'api/v2/server/get' },
		'server.save'   : { url : 'api/v2/server/save' },
		'server.delete' : { url : 'api/v2/server/delete' }
	},

	init: function() {
	}
});
