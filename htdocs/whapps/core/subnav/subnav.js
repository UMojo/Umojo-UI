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
            $(this).addClass('selected');
            return false;
        });
    },

    {   
        add: function(data) {
            // Deal with silly centering which fails randomly
            var THIS = this;
            var navbar = $('.sub_nav');
            var navbar_list = $('ul', navbar);
            var module_name = new String(data.module);
            var listModules = navbar_list.find('li');
            
            if(listModules.length == 0) {
                this.templates.item.tmpl(data).appendTo(navbar_list);
            }
            else {
                $.each(listModules, function(k, v) {
                    var currentModule = new String(listModules[k].attributes['module-name'].value);
                    var compare = ((module_name == currentModule) ? 0 : ((module_name > currentModule) ? 1 : -1));
                    if(k == listModules.length - 1 && compare > 0) {
                        THIS.templates.item.tmpl(data).appendTo(navbar_list);
                        console.log(data.module + 'appended');
                        return false;
                    } 
                    else if(compare < 0){
                        THIS.templates.item.tmpl(data).insertBefore(listModules[k]);
                        console.log(data.module + 'insertBefore');
                        return false;
                    }
                });
            }
        },

        clear: function(data) {
            $('.sub_nav ul').empty();
            //$('.sub_nav').width(0);
        }
});
