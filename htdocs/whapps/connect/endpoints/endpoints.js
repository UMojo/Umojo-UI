winkstart.module('connect', 'endpoints', 
    /* Start module resource definitions */
    {
        /* What HTML templates will we be using? */
        templates: {
            edit_auth: 'tmpl/edit_auth.html',
            edit_server: 'tmpl/edit_server.html',
            service_limits: 'tmpl/service_limits.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'servers.activate' : 'activate',
            'sipservice.refresh' : 'refresh',
            'servers.getServers' : 'getServers',         // Get server list
            'servers.add_server' : 'add_server',           // Add a server
            'servers.add_server_prompt' : 'add_server_prompt',
            'servers.delete_server' : 'delete_server',     // Delete a server
            'servers.update_server' : 'update_server',     // Update defaults/general server settings
            'servers.edit_failover' : 'edit_failover',
            'servers.post_failover' : 'post_failover',
            'servers.edit_auth' : 'edit_auth'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            /* Endpoint Management */
            "endpoints.put": {
                url: 'https://store.2600hz.com/v1/{account_id}/endpoints',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "endpoints.get": {
                url: 'https://store.2600hz.com/v1/endpoints',
                contentType: 'application/json',
                verb: 'GET'
            },
            "endpoints.post": {
                url: 'https://store.2600hz.com/v1/endpoints',
                contentType: 'application/json',
                verb: 'POST'
            },
            "endpoints.delete": {
                url: 'https://store.2600hz.com/v1/endpoints',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            "endpoints.add": {
                url: 'https://store.2600hz.com/v1/add_server',
                contentType: 'application/json',
                verb: 'POST'
            },

            "endpoints.delete": {
                url: 'https://store.2600hz.com/v1/delServer',
                contentType: 'application/json',
                verb: 'POST'
            },


            "endpoints.setDefaults": {
                url: 'https://store.2600hz.com/v1/setServerDefaults',
                contentType: 'application/json',
                verb: 'POST'
            },

            "endpoints.auth.removeIP": {
                url: 'https://store.2600hz.com/v1/removeSIPAuthIP',
                contentType: 'application/json',
                verb: 'POST'
            },

            "endpoints.auth.set": {
                url: 'https://store.2600hz.com/v1/setSIPAuth',
                contentType: 'application/json',
                verb: 'POST'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);
    }, // End initialization routine



    /* Define the functions for this module */
    {
        delServerPrompt: function(sinfo) {
            popup($('#tmpl_del_server').tmpl(sinfo), {
                title: 'Remove Server - ' + acct.servers[sinfo.serverid].server_name
            });
        },

        edit_auth: function() {
            var THIS = this;

            var dialogDiv = THIS.templates.edit_auth.tmpl({}).dialog({
                title: 'Edit Auth',
                width: 500,
                height: 500,
                position: 'center'
            });

            winkstart.publish('sipservice.input_css');

            $(dialogDiv).find('.ctr_btn').click(function() {
                winkstart.publish('sipservice.postAuth', {
                    password : 'p@ssw0rd',
                    authInfos: 'frifri',
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });

            });
        },

        /*********************
     * Server Management *
     *********************/

        add_server_prompt: function() {
            var THIS = this;

            var dialogDiv = THIS.templates.edit_server.tmpl({}).dialog({
                title: 'Add Server',
                position: 'center',
                height: 312,
                width: 546
            });

            winkstart.publish('sipservice.input_css');

            dialogDiv.find('.submit_btn').click(function() {
                var $THIS = dialogDiv,
                data = {
                    server_name: $THIS.find('#name').val(),
                    server_usr: $THIS.find('#username').val(),
                    server_pwd: $THIS.find('#password').val(),
                    success: function() {
                        $THIS.dialog('close');
                    }
                }
                winkstart.publish('sipservice.add_server', data);
            });

        },

        add_server: function(srv) {
            var THIS = this;

            winkstart.log(THIS.account);

            THIS.account.servers.push({
                auth: {
                    auth_password: srv.server_pwd,
                    auth_user: srv.server_usr,
                    auth_method: 'password'
                },
                options: {
                    inbound_format: 'e.164',
                    enabled: true
                },
                DIDs: {},
                server_name: srv.server_name
            });

            srv.success();
            THIS.update_account();
            winkstart.log(THIS.account);
        /* For now...
            $.ajax({
                url: "/api/add_server",
                global: true,
                type: "POST",
                data: ({
                    key: srv.key,
                    json: JSON.stringify({
                        server_name: srv.server_name,
                        server_usr: srv.server_usr,
                        server_pwd: srv.server_pwd,
                        server_ip: srv.server_ip,
                        server_add: srv.server_add
                    })
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    // check for errs
                    // trigger custom event 'serverAdded'
                    //TODO: redraw servers

                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }
                    redraw(msg.data);

                }
            }
            );*/
        },

        delServer: function(srvid) {
            winkstart.deleteJSON("sipservice.endpoints.delete",
            {
                key: key,
                json: JSON.stringify({
                    serverid: srvid
                })
            },
            function(msg){
                if (msg && msg.errs && msg.errs[0]) {
                    display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                }
                redraw(msg.data);
            }
            );
        },



        setServerDefaults: function(nsd) {
            winkstart.postJSON("sipservice.server.setDefaults",

            {
                    key: key,
                    json: JSON.stringify(nsd)
                },
                function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }
                    redraw(msg.data);
                }
                );
        },

        removeSIPAuthIP: function(aip) {
            winkstart.deleteJSON(	"sipservice.server.auth.removeIP",
            {
                key: key,
                json: JSON.stringify(aip)
            },
            function(msg){
                if (msg && msg.errs && msg.errs[0]) {
                    display_errs(msg.errs);
                }
                redraw(msg.data);
            }
            );
        },

        refresh_servers: function(account) {
            var THIS = this;

            winkstart.log('Refreshing Servers...');
            $('#my_servers').empty();
            THIS.templates.main_servers.tmpl( account  ).appendTo ( $('#my_servers') );

            // Define areas where numbers can be dropped and what to do when they are dropped
            $("#ws-content .drop_area").droppable({
                drop: function(event, ui) {
                    tmp_ui=ui;
                    tmp_md_this=this;
                    THIS.moveDID($(tmp_ui.draggable).dataset(), $(tmp_md_this).dataset());
                    setTimeout("winkstart.publish('sipservice.update_account')", 1);
                },
                accept: '.number' ,
                activeClass: 'ui-state-highlight',
                activate: function(event, ui) {
                ;
                },
                scope: 'moveDID'
            });
        },

        refresh: function() {
            var THIS = this;
            /* Draw our base template into the window */
            THIS.templates.index.tmpl(winkstart.modules['connect'].account).appendTo( $('#my_servers') );
        },

        activate: function(data) {
            // Wire the "Add Server" button
            $('#add_server').click(function() {
                winkstart.publish('sipservice.add_server_prompt');
            });

            // Wire up the numbers box
            $("#server_area").delegate(".unassign", "click", function(){
                moveDID($(this).dataset(), null);$(this).hide();
            });

            $("#my_servers").delegate(".failover", "click", function(){
                winkstart.publish('sipservice.edit_failover', $(this).dataset());
            });

            $("#server_area").delegate(".cid", "click", function(){
                cidPrompt($(this).dataset(), null);
            });

            $("#server_area").delegate(".e911", "click", function(){
                e911Prompt($(this).dataset(), null);
            });

            $("#server_area").delegate(".misc", "click", function(){
                miscPrompt($(this).dataset(), null);
            });

            $("#server_area").delegate(".modifyServerDefaults", "click", function(){
                modifySRVDefaultsPrompt($(this).dataset(), null);
            });

        }
    } // End function definitions

    );  // End module
