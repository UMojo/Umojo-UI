winkstart.module('connect', 'sipservice', {
        css: [
            'css/style.css',
            'css/popups.css'
        ],

        templates: {
            index: 'tmpl/index.html',
            main: 'tmpl/main.html',

            legal : 'tmpl/legal.html',
            rates : 'tmpl/rates.html',
            howto : 'tmpl/howto.html',
            support : 'tmpl/support.html',
            apis : 'tmpl/apis.html',

            main_dids : 'tmpl/main_dids.html',
            main_servers : 'tmpl/main_servers.html',
            main_services : 'tmpl/main_services.html',

            order_history: 'tmpl/order_history.html',

            edit_server: 'tmpl/edit_server.html'
        },

        subscribe: {
            'sipservice.activate' : 'activate',
            'sipservice.confirm_billing' : 'confirm_billing',
            'sipservice.load_account' : 'load_account',

/*
            'sipservice.legal.activate' : 'legal',
            'sipservice.support.activate' : 'support',
            'sipservice.rates.activate' : 'rates',
            'sipservice.howto.activate' : 'howto',
            'sipservice.apis.activate' : 'apis',
*/

            'sipservice.index' : 'index',
            'sipservice.main_menu' : 'main_menu',
            'sipservice.refresh' : 'refresh',

            'credits.refresh' : 'refresh',
            'channels.refresh' : 'refresh',
            'endpoint.refresh' : 'refresh',
            'fraud.refresh' : 'refresh',
            'monitoring.refresh' : 'refresh',
            'numbers.refresh' : 'refresh',
            'promo.refresh' : 'refresh'
        },

        resources: {
            "sipservice.get": {
                //url: winkstart.apps['connect'].api_url + '/ts_accounts/{account_id}',
                url: 'https://store.2600hz.com/v1/{account_id}/get_idoc',
                verb: 'GET'
            },

            "sipservice.createTicket": {
                url: 'https://store.2600hz.com/v1/createTicket',
                verb: 'PUT'
            }
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
/*
        winkstart.publish('subnav.add', {
            whapp: 'connect',
            module: 'sipservice.apis',
            label: 'APIs',
            icon: 'puzzle'
        });

        winkstart.publish('subnav.add', {
            whapp: 'connect',
            module: 'sipservice.legal',
            label: 'Legal',
            icon: 'legal'
        });

        winkstart.publish('subnav.add', {
            whapp: 'connect',
            module: 'sipservice.support',
            label: 'Support',
            icon: 'support'
        });

        winkstart.publish('subnav.add', {
            whapp: 'connect',
            module: 'sipservice.rates',
            label: 'Rates',
            icon: 'price_tag'
        });

        winkstart.publish('subnav.add', {
            whapp: 'connect',
            module: 'sipservice.howto',
            label: 'How to Use',
            icon: 'book'
        });

        winkstart.publish('subnav.add', {
            whapp: 'connect',
            module: this.__module,
            label: 'SIP Services',
            icon: 'active_phone'
        });
*/
    },

    {
/*
        apis: function() {
            $('#ws-content').html(this.templates.apis.tmpl());
        },

        legal: function() {
            $('#ws-content').html(this.templates.legal.tmpl());
        },

        support: function() {
            $('#ws-content').html(this.templates.support.tmpl());
        },

        rates: function() {
            $('#ws-content').html(this.templates.rates.tmpl());
        },

        howto: function() {
            $('#ws-content').html(this.templates.howto.tmpl());
        },
*/

        refresh: function() {
            var THIS = this;

            var account = winkstart.apps['connect'].account;

            winkstart.log('Redrawing...');

            $('#my_services').html(this.templates.main_services.tmpl(account));

            $('#my_servers').html(this.templates.main_servers.tmpl(account));

            var tmp = account;

            tmp.unassigned = 0;
            tmp.totalDIDs = 0;
            if (tmp.DIDs_Unassigned) {
                $.each(tmp.DIDs_Unassigned, function() {
                    tmp.unassigned++;
                    tmp.totalDIDs++;
                });
            };

            $.each(tmp.servers, function(k, v) {
                if (v.DIDs) {
                    $.each(v.DIDs, function(i, j) {
                        tmp.totalDIDs++;
                    });
                }
            });

            $('#my_numbers').html(this.templates.main_dids.tmpl(tmp));

            $('#auth_realm').html(account.account.auth_realm);

            // Reformat any phone number that's US and e.164
            // TODO: Move this elsewhere, via events?
            $('.number').each(function(k,v) {
                did = $(v).text();
                did = did.replace(/\+1([2-9]\d{2})(\d{3})(\d{4})/, "($1) $2-$3");
                $(v).text(did);
            });

            // TODO: Fix this. It doesn't belong here. Move to endpoint.js and figure out dynamics
            $("#ws-content .drop_area:not(.ui-droppable").droppable({
                drop: function(event, ui) {
                    winkstart.publish('numbers.map_number', {
                        did : $(ui.draggable).dataset(),
                        new_server : $(this).dataset()
                    });
                },
                accept: '.number' ,
                activeClass: 'ui-state-highlight',
                activate: function(event, ui) {},
                scope: 'moveDID'
            });

            $('.modifyServerDefaults').click(function(){
                var data = {
                    account: account,
                    server: account.servers[$(this).attr('data-serverid')]
                };

                var defaultDialog = winkstart.dialog(THIS.templates.edit_server.tmpl(data), {
                    open: function(){
                        $('a.submit_btn', '#edit_server').click(function(){
                            $(defaultDialog).dialog('close');
                            alert('Do nothing for now !');
                        });
                    }
                });
            });

            $('.deleteServer').click(function(){
                if(confirm('Delete this server ?')){
                    alert('coming soon...');
                }
            });

        },

        load_account : function(){
            var THIS = this;
            var account_id = winkstart.apps['connect'].account_id;

            winkstart.log('Loading account ' + account_id);

            winkstart.getJSON('sipservice.get', {
                account_id : account_id
            }, function(data, xhr) {
                winkstart.apps['connect'].account = data.data;
                THIS.refresh();
            });
        },

        main_menu: function() {
            $('#ws-content').empty();
            this.templates.main.tmpl().appendTo( $('#ws-content') );
        },

        confirm_billing: function(args) {
            alert('Confirming billing...');

        },


        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function() {
            var THIS = this;
            $('#ws-content').empty();

            if (winkstart.apps['connect'].auth_token) {
                THIS.main_menu();

                THIS.load_account();
            } else {
                THIS.templates.index.tmpl().appendTo( $('#ws-content') );

                $('#ws-content a#signup_button').click(function() {
                    THIS.create_account();

                    THIS.main_menu();
                });

            }
        }
    }
);
