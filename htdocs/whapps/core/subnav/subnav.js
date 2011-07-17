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
            'subnav.add'        : 'add',
            'subnav.activate'   : 'activate',
            'subnav.clear'      : 'clear'
        }
    },

    function() {
        this.templates.nav.tmpl({}).appendTo($('.sub_nav_container'));
        
        // Set up the Module Click handlers
        $('.sub_nav ul').delegate('li', 'click', function() {
            winkstart.publish('subnav.activate', $(this).attr('module-name'));
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
                        winkstart.log(data.module + ' appended');
                        return false;
                    } 
                    else if(compare < 0){
                        THIS.templates.item.tmpl(data).insertBefore(listModules[k]);
                        winkstart.log(data.module + ' insertBefore');
                        return false;
                    }
                });
            }
        },

        activate: function(module_name) {
            if($('.sub_nav .selected').size()) {
                var current_module = $('.sub_nav .selected').attr('module-name');
                winkstart.log('Click on subnav: Calling ' + current_module + '.deactivate');
                winkstart.publish(current_module + '.deactivate', {});
            }
            winkstart.log('Click on subnav: Calling ' + module_name + '.activate');

            $('.sub_nav li').removeClass('selected');
            $('.sub_nav li[module-name="' + module_name + '"]').addClass('selected');

            winkstart.publish(module_name + '.activate', {});
        },

        clear: function(data) {
            $('.sub_nav ul').empty();
            //$('.sub_nav').width(0);
        }
});
