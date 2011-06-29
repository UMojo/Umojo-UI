winkstart.module('core', 'subnav', {
        css: [
            'css/subnav.css'
        ],
                
        templates: {
            nav: 'tmpl/subnav.html',
            item: 'tmpl/item.html',
            subItem: 'tmpl/subItem.html'
        },
        
        subscribe: {
            'subnav.add'    : 'add',
            'subnav.clear' : 'clear'
        }
    },

    function() {
        this.templates.nav.tmpl({}).appendTo($('.sub_nav_container'));
        
        // Set up the Module Click handlers
        $('.sub_nav ul').delegate('li', 'click', function() {
            if($('.sub_nav .selected').size()) {
                var module_name = $('.sub_nav .selected').attr('module-name');
                winkstart.log('Click on subnav: Calling ', module_name + '.deactivate');
                winkstart.publish(module_name + '.deactivate', {});
            }

            winkstart.log('Click on subnav: Calling ', $(this).attr('module-name') + '.activate');

            winkstart.publish($(this).attr('module-name') + '.activate', {});

            $('.sub_nav li').removeClass('selected');
            return false;
        });
    },

    {   
        add: function(data) {
            // Deal with silly centering which fails randomly
            var navbar = $('.sub_nav');
            var navbar_list = $('ul', navbar);
            this.templates.item.tmpl(data).appendTo(navbar_list);

            /*// Increase size of navbar
            var element_width = $('li', navbar_list).width() + 45;
            winkstart.log('VoIP Nav: ' + navbar.width(), 'Element: ' + element_width);
            navbar.width(navbar.width() + element_width);*/
        },

        clear: function(data) {
            $('.sub_nav ul').empty();
            //$('.sub_nav').width(0);
        }
});
