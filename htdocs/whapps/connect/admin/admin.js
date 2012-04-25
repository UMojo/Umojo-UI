winkstart.module('connect', 'admin',
    /* Start module resource definitions */
    {
        /* What HTML templates will we be using? */
        templates: {
            switch_user: 'tmpl/switch_user.html',
            add_number_manual: 'tmpl/add_number_manual.html',
            add_user: 'tmpl/add_user.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'admin.activate' : 'activate',
            'sipservice.refresh' : 'refresh',
            'sipservice.new_account' : 'new_account',
            'sipservice.switchUser' : 'switchUser',
            'sipservice.addUser' : 'addUser',
            'sipservice.switchUserForreal' : 'switchUserForreal'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "sipservice.admin.list": {
                url: winkstart.apps['connect'].api_url + '/ts_accounts',
                contentType: 'application/json',
                verb: 'GET'
            },
            "sipservice.admin.get": {
                url: winkstart.apps['connect'].api_url + '/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "sipservice.admin.create": {
                url: winkstart.apps['connect'].api_url + '/ts_accounts',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "sipservice.admin.update": {
                url: winkstart.apps['connect'].api_url + '/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "sipservice.admin.delete": {
                url: winkstart.apps['connect'].api_url + '/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.__whapp, this.config.resources);
    }, // End initialization routine



    /* Define the functions for this module */
    {
        refresh: function() {
            var THIS = this;
            /* Draw our base template into the window */
            THIS.templates.index.tmpl(winkstart.apps['connect'].account).appendTo( $('#my_admin') );
        },

        add_number_manual_prompt: function(args) {
            var THIS = this;


            var dialogDiv = THIS.templates.add_number_manual.tmpl().dialog({
                title: 'Add New Number'
            });

            dialogDiv.find('#add_number_button').click(function() {
                var did = dialogDiv.find('#number').val();
                if(THIS.account.DIDs_Unassigned == undefined) {
                    THIS.account.DIDs_Unassigned = {};
                }
                THIS.account.DIDs_Unassigned[did] = {};
                dialogDiv.dialog('close');
                THIS.update_account();
            });

        },

        listAccounts: function(callback) {
            winkstart.getJSON('sipservice.list', {}, function(data) {
                winkstart.log(data.data);     // Account list, [ { id : 'name', name : 'some text' ... }, ... ]
                callback(data.data);
            });
        },

        switchUser: function() {
            var THIS = this;

            THIS.listAccounts(function(data) {
                var dialogDiv = THIS.templates.switch_user.tmpl({
                    accounts: data
                }).dialog({
                    title: 'Switch Account',
                    position: 'center',
                    height: 300,
                    width: 450
                });

                winkstart.publish('sipservice.input_css');

                dialogDiv.find('.btn_wrapper #switch').click(function() {
                    winkstart.postJSON('sipservice.switchUserForreal', {
                        account_id: dialogDiv.find('#account').val(),
                        success : function(data) {
                            THIS.account = data;
                            THIS.refresh_screen();
                            dialogDiv.dialog('close');
                        }
                    });

                });
                dialogDiv.find('.btn_wrapper #add').click(function() {
                    winkstart.publish('sipservice.addUser');
                    dialogDiv.dialog('close');
                });
            });
        },
        addUser: function() {
            var THIS = this;

            var dialogDiv = THIS.templates.add_user.tmpl({}).dialog({
                title: 'Add User',
                position: 'center',
                height: 300,
                width: 450
            });

            winkstart.publish('sipservice.input_css');

            dialogDiv.find('.submit_btn').click(function() {
                winkstart.publish('sipservice.new_account', {
                    account_id: dialogDiv.find('#name').val(),
                    realm: dialogDiv.find('#realm').val()
                });
                dialogDiv.dialog('close');
            });
        },
        switchUserForreal: function(data) {
            var THIS = this;
            THIS.loadAccount(data.account_id, data.success);
        },

        new_account : function(args) {
            var THIS = this;

            var data = {
                "name": args.account_id,
                "account": {
                    "credits": {
                        "prepay": "0.00"
                    },
                    "auth_realm": args.realm,
                    "trunks": "0",
                    "inbound_trunks" : "0"
                },
                "DIDs_Unassigned": {
                },
                "servers": [
            ]
            };

            winkstart.putJSON('sipservice.create', {
                data : data
            }, function(response) {
                winkstart.log(response);
                THIS.account = response.data;
                THIS.refresh_screen();
            })

        },

        activate: function(data) {
            /*$('.universal_nav .my_account').click(function() {
                winkstart.publish('sipservice.switchUser');
            });*/

        }
    } // End function definitions

    );  // End module
