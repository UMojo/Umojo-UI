winkstart.module('core', 'layout', {
        //		requires: {'core' : 'nav'},
        css: [
        'css/layout.css',
        'css/tabs.css',
        'css/icons.css',
        'css/buttons.css',
        'css/jquery.override.css'
        ],

        templates: {
            layout: 'tmpl/layout.html',
            welcome: 'tmpl/welcome.html'
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
        this.parent = args.parent || $('body');

        this.attach();

        // TODO: This is a temp hack
        /*var THIS = this;
                    this.elements = {};
                    $.each(this.config.elements, function(k, v) {
                            THIS.elements[k] = $( THIS.parent ).find(v);
                    });*/
        // END HACK

        // Attach our nav
        //winkstart.module('core', 'appnav').init({ parent: this.elements.nav});

        // TODO: This is a hack to hide the PBX nav for the time being
        /*$('.whistle-apps li').live('click', function() {
                            if($(this).hasClass('deploy')) {
                                    $('body > .wrapper > .header').hide();
                                    winkstart.publish('deploy.activate');
                            }
                            else {
                                    $('body > .wrapper > .header').show();
                                    $('#ws-content').empty();
                            }
                    });*/
        
        // Adding the welcome template
        this.templates.welcome.tmpl().appendTo( '#ws-content' );

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
