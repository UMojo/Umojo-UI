    winkstart.module('userportal', 'userportal', {
        css: {
            voip: 'css/userportal.css'
        },

        templates: {
            userportal: 'tmpl/userportal.html'
        },

        subscribe: {
            'userportal.activate' : 'activate',
            'userportal.initialized' : 'initialized',
            'userportal.module_activate': 'module_activate'
        }
    },
    /* The code in this initialization function is required for
     * loading routine.
     */
    function() {
        var THIS = this;

        winkstart.publish ('auth.shared_auth', {
            app_name: THIS.__module,
            callback: function() {
                winkstart.publish('appnav.add', { 'name' : THIS.__module });
            }
        });

        THIS.uninitialized_count = THIS._count(THIS.modules);
    },
    {
        modules: {
            'voicemail': false,
            'settings': false,
            'cdr': false
        },

        is_initialized: false,

        uninitialized_count: 1337,

        initialized: function() {
            var THIS = this;

            THIS.is_initialized = true;

            winkstart.publish('subnav.show', THIS.__module);

            THIS.setup_page();
        },

        activate: function() {
            var THIS = this;

            THIS.whapp_auth(function() {
                THIS.initialization_check();
            });
        },

        initialization_check: function() {
            var THIS = this;

            if (!THIS.is_initialized) {
                // Load the modules
                $.each(THIS.modules, function(k, v) {
                    if(!v) {
                        THIS.modules[k] = true;
                        winkstart.module.loadModule(THIS.__module, k, function() {
                            this.init(function() {
                                winkstart.log(THIS.__module + ': Initialized ' + k);

                                if(!--THIS.uninitialzed_count) {
                                    winkstart.publish(THIS.__module + '.initialized', {});
                                }
                            });
                        });
                    }
                });
            } else {
                THIS.setup_page();
            }

        },

        module_activate: function(args) {
            var THIS = this;

            THIS.whapp_auth(function() {
                winkstart.publish(args.name + '.activate');
            });
        },

        whapp_auth: function(callback) {
            var THIS = this;

            if('auth_token' in winkstart.apps[THIS.__module] && !winkstart.apps[THIS.__module].auth_token) {
                winkstart.publish('auth.shared_auth', {
                    app_name: THIS.__module,
                    callback: (typeof callback == 'function') ? callback : undefined
                });
            }
            else {
                callback();
            }
        },

        _count: function(obj) {
            var count = 0;

            $.each(obj, function() {
                count++;
            });

            return count;
        },

        setup_page: function() {
            var THIS = this;

            $('#ws-content').empty();
            THIS.templates.userportal.tmpl({}).appendTo( $('#ws-content') );

            // Link the main buttons
            $('.options #cdr').click(function() {
                winkstart.publish('cdr.activate');
            });

            $('.options #settings').click(function() {
                winkstart.publish('settings.activate');
            });

            $('.options #voicemail').click(function() {
                winkstart.publish('voicemail.activate');
            });
            /*if(v == 'voicemail') {
                $('.sub_nav li').each( function() {
                    if($(this).attr('module-name') == "voicemail") {
                        $(this).addClass('selected');
                    }
                });

                winkstart.publish('voicemail.activate', {});
            }*/
        }
    }
);
