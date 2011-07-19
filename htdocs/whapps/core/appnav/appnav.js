winkstart.module('core', 'appnav', {
    /* Config */
        css: {
            appnav: 'appnav.css'
        },

        templates: {
            appnav: 'appnav.html',
            item:   'item.html'
        },
        
        subscribe: {
            'appnav.add'        : 'add',
            'appnav.activate'   : 'activate',
            'appnav.remove'     : 'remove'
        }
        
    },

        /* Init */
    function() {
        var THIS = this;
        
        this.templates.appnav.tmpl({}).appendTo( $('div.header .main_nav') );
        
        // Set up the Module Click handlers
        $('div.header .main_nav ul').delegate('li', 'click', function() {
            $('div.header .main_nav ul a').removeClass('selected');
            $(this).find('a').addClass('selected');
            winkstart.publish('appnav.activate', $(this).attr('module-name'));
            return false;
        });

        winkstart.log('AppNav: Initialized application nav bar.');
    },

        /* Methods */
    {   
        add: function(args) {
            var list_node = $('div.header .main_nav').find('ul'),
                item = this.templates.item.tmpl({ 'name' : args.name, 'module' : winkstart.modules[args.name] }).appendTo(list_node);

            $('.dropdown', item).hide();

            $('.main_nav li').hoverIntent({
                sensitivity: 1,
                interval: 50,
                timeout: 200,
                over: function() {
                    $('.dropdown', $(this)).slideDown(100);
                },
                out: function() {
                    $('.dropdown', $(this)).slideUp(100);
                }
            });

            $('.main_nav li').hover( 
                function() { 
                    $('span', $(this)).addClass('blue');
                }, 
                function() { 
                    if(!($('a', $(this)).is('.selected'))) {
                        $('span', $(this)).removeClass('blue');
                    }
                }
            );
            
            $('.main_nav li').click( function() { 
                $('.main_nav li span').removeClass('blue');
                $('span', $(this)).addClass('blue');
            });

            winkstart.log('AppNav: Adding navigation item ' + args.name);
        },

        activate: function(app_name) {
            // TODO: De-activate current app & unload it

            winkstart.log('AppNav: Click detected - calling ' + app_name + '.activate');
            winkstart.publish ( app_name + '.activate', { });
        },

        remove: function() {
            // TODO: Implement me
        }
    }
);
