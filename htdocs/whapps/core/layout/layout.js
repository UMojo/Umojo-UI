winkstart.module('core', 'layout', {
        //		requires: {'core' : 'nav'},
        css: [
        '../../../config/css/welcome.css',
        'css/layout.css',
        'css/tabs.css',
        'css/icons.css',
        'css/buttons.css',
        'css/jquery.override.css'
        ],

        templates: {
            layout: 'tmpl/layout.html',
            welcome: '../../../config/tmpl/welcome.html'
        },

        subscribe: {
            'layout.updateLoadedModule'    : 'updateModule',
            'notify'    : 'notify'
        },

        elements: {
            nav: '#ws-nav'
        }
    },

    /* Bootstrap */
    function(args) {
        var THIS = this;
        
        THIS.parent = args.parent || $('body');

        THIS.attach();

        // If we find a login cookie, don't display welcome message
        if(!$.cookie('c_winkstart_auth')) {
            THIS.templates.welcome.tmpl().appendTo('#ws-content');
        }

        $('#ws-content .welcomediv').click(function() {
            winkstart.publish('auth.register');
        });

        winkstart.log ('Layout: Initialized layout.');
    },

    /* Module methods */
    {
        attach: function() {
            this.templates.layout.tmpl().appendTo( this.parent );

            // We need to hide this by defualt but keep our display: inline-block in the css
            $('#ws-notification-bar').hide();
            
            $("#loading").ajaxStart(function(){
                $(this).show();
             }).ajaxStop(function(){
                $(this).hide();
             }).ajaxError(function(){
                $(this).hide();
             });
        },

        notify: function(data) {
            if(!data.level && !data.msg) {
                return false;
            }

            switch(data.level) {
                case 'debug':
                    $('#ws-notification-bar')
                    .slideUp(function() {
                        $('#ws-notification-bar .ws-notification-bar-content').html(data.msg);
                    })
                    .delay(200)
                    .slideDown(200)
                    .delay(2000)
                    .slideUp(200);
                    break;
            }

            return true;
        },

        updateModule: function(data){
            $('#bread-crumbs').empty().html(data.label);
        }
    }
);
