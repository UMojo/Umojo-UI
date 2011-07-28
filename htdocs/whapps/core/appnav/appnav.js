winkstart.module('core', 'appnav', {
    /* Config */
        css: {
            appnav: 'appnav.css'
        },

        templates: {
            appnav:  'appnav.html',
            item:    'item.html',
            subitem: 'subitem.html'
        },
        
        subscribe: {
            'appnav.add'        : 'add',
            'appnav.activate'   : 'activate',
            'appnav.remove'     : 'remove',
            'subnav.add'        : 'sub_add'
        }
        
    },

    /* Init */
    function() {
        var THIS = this;
        
        this.templates.appnav.tmpl({}).appendTo( $('div.header .main_nav') );
        
        // Set up the Module Click handlers
        $('div.header .main_nav').delegate('li', 'click', function() {
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

            if(MASTER_ACCOUNT_ID == '') $('.main_nav').hide();
            if(args.name == 'auth') { $(item).hide(); }
            $('.dropdown', item).hide();

            $(item).hoverIntent({
                sensitivity: 1,
                interval: 40,
                timeout: 300,
                over: function() {
                    if($(this).attr('menu') != 'false') {
                        $('.dropdown', $(this)).slideDown(100);
                    }
                },
                out: function() {
                    if($(this).attr('menu') != 'false') {
                        $('.dropdown', $(this)).slideUp(100);
                    }
                }
            });

            $(item).hover( 
                function() { 
                    $('.whapp .icon', $(this)).addClass('blue');
                }, 
                function() { 
                    if(!($('a', $(this)).is('.selected'))) {
                        $('.whapp .icon', $(this)).removeClass('blue');
                    }
                }
            );
            
            $(item).click( function() { 
                $('div.header .main_nav .whapp a').removeClass('selected');
                $('.whapp a', $(this)).addClass('selected');
                $('.main_nav li .whapp .icon').removeClass('blue');
                $('.whapp .icon', $(this)).addClass('blue');
            });

            winkstart.log('AppNav: Adding navigation item ' + args.name);

            // Set up the subnav click handler
            $('.dropdown .content', item).delegate('.module', 'click', function() {
                $('div.header .main_nav .whapp a').removeClass('selected');
                $('.whapp a', $(this).parents('li')).addClass('selected');
                $('.main_nav li .whapp .icon').removeClass('blue');
                $('.whapp .icon', $(this).parents('li')).addClass('blue');
                winkstart.publish($(this).attr('module-name') + '.activate');
                return false;
            });
        },

        activate: function(app_name) {
            // TODO: De-activate current app & unload it

            winkstart.log('AppNav: Click detected - calling ' + app_name + '.activate');
            winkstart.publish ( app_name + '.activate', { });
        },

        remove: function() {
            // TODO: Implement me
        },

        sub_add: function(data) {
            var THIS = this,
                whapp_name = new String(data.whapp),
                whapp = $('.main_nav li[module-name="' + whapp_name + '"]'),
                module_weight = new String(data.weight),
                listModules = $('.module', whapp);

            if(listModules.length == 0) {
                this.templates.subitem.tmpl(data).appendTo($('.dropdown .content', whapp));
                whapp.attr('menu', 'true');
            }
            else {
                $.each(listModules, function(k, v) {
                    if(listModules[k].attributes['module-weight'] != undefined) {
                        var currentModule = new String(listModules[k].attributes['module-weight'].value),
                            compare = ((module_weight == currentModule) ? 0 : ((module_weight > currentModule) ? 1 : -1));

                        if(k == listModules.length - 1 && compare > 0) {
                            THIS.templates.subitem.tmpl(data).appendTo($('.dropdown .content', whapp));
                            winkstart.log(data.module + ' appended');
                            return false;
                        }
                        else if(compare < 0){
                            THIS.templates.subitem.tmpl(data).insertBefore(listModules[k]);
                            winkstart.log(data.module + ' insertBefore');
                            return false;
                        }
                    } else {
                        THIS.templates.subitem.tmpl(data).appendTo($('.dropdown .content', whapp));
                        return false;
                    }
                });
            } 
        }

    }
);
