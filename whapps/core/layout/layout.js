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
            welcome: '../../../config/tmpl/welcome.html',
            business: 'tmpl/business.html',
            developer: 'tmpl/developer.html',
            manufacturer: 'tmpl/manufacturer.html',
            minutes_only: 'tmpl/minutes_only.html',
            var_itsp: 'tmpl/var_itsp.html',
            no_role: 'tmpl/no_role.html'
        },

        subscribe: {
            'layout.updateLoadedModule'    : 'updateModule',
            'notify'    : 'notify',
            'layout.load_role' : 'load_role'
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
            $('#ws-content').empty();
            THIS.templates.welcome.tmpl().appendTo('#ws-content');
        }

        $('#ws-content .welcomediv').click(function() {
            winkstart.publish('nav.my_logout_click');
        });

        $('#my_account', '.universal_nav').click(function() {
            winkstart.publish('nav.my_account_click');
        });

        $('#my_help', '.universal_nav').click(function() {
            winkstart.publish('nav.my_help_click');
        });

        $('#my_logout', '.universal_nav').click(function() {
            winkstart.publish('nav.my_logout_click');
        });

        if('nav' in winkstart.config) {
            if('my_account' in winkstart.config.nav) {
                $('#my_account', '.universal_nav').unbind('click')
                                                  .attr('href', winkstart.config.nav.my_account);
            }

            if('my_help' in winkstart.config.nav) {
                $('#my_help', '.universal_nav').unbind('click')
                                               .attr('href', winkstart.config.nav.my_help);
            }

            if('my_logout' in winkstart.config.nav) {
                $('#my_logout', '.universal_nav').unbind('click')
                                                 .attr('href', winkstart.config.nav.my_logout);
            }

        }

        winkstart.log ('Layout: Initialized layout.');
    },

    /* Module methods */
    {
        load_role: function(role) {
            var target = $('#ws-content'),
                container = $('.content_container'),
                role = URL_DATA['role'] || (role ? role.role : '');
                THIS = this;

            $(target, container).empty();

            switch(role) {
                case 'business':
                    $(target, container).append(THIS.templates.business.tmpl());
                    break;

                case 'developer':
                    $(target, container).append(THIS.templates.developer.tmpl());
                    break;

                case 'manufacturer':
                    $(target, container).append(THIS.templates.manufacturer.tmpl());
                    break;

                case 'minutes_only':
                    $(target, container).append(THIS.templates.minutes_only.tmpl());
                    break;

                case 'var_itsp':
                    $(target, container).append(THIS.templates.var_itsp.tmpl());
                    break;

                default:
                    $(target, container).append(THIS.templates.no_role.tmpl())
                    break;
            }
       },

        attach: function() {
            var THIS = this;
            var layout_html = THIS.templates.layout.tmpl().appendTo( this.parent );

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
