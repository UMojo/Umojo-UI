winkstart.module('cluster', 'deploy_mgr',
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
        'css/style.css',
        'css/server.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            index: 'tmpl/index.html',
            newserver: 'tmpl/newserver.html',
            server: 'tmpl/server.html',
            firstserver: 'tmpl/firstServer.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'deploy_mgr.activate' : 'activate',
            'deploy_mgr.requestServer' : 'requestServer',
            'deploy_mgr.addServer' : 'addServer',
            'deploy_mgr.deleteServer' : 'deleteServer',
            'deploy_mgr.updateServer' : 'updateServer',
            'deploy_mgr.statusServer' : 'statusServer',
            'deploy_mgr.listServer' : 'listServer',
            'deploy_mgr.requestFirstServer': 'requestFirstServer',
            'deploy_mgr.setlink': 'setLink'
        },
        
        validationTab1 : [
            {name : '#hostname_1_1', regex : /^.+$/},
            {name : '#ip_1_1', regex : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/},
            {name : '#ssh_port_1_1', regex : /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/},
            {name : '#root_password_1_1', regex : /^.+$/}
        ],
        
        validationTab2 : [
            {name : '#hostname_7_1', regex : /^.+$/},
            {name : '#ip_7_1', regex : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/},
            {name : '#ssh_port_7_1', regex : /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/},
            {name : '#root_password_7_1', regex : /^.+$/},
            {name : '#hostname_7_2', regex : /^.+$/},
            {name : '#ip_7_2', regex : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/},
            {name : '#ssh_port_7_2', regex : /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/},
            {name : '#root_password_7_2', regex : /^.+$/},
            {name : '#hostname_7_3', regex : /^.+$/},
            {name : '#ip_7_3', regex : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/},
            {name : '#ssh_port_7_3', regex : /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/},
            {name : '#root_password_7_3', regex : /^.+$/},
            {name : '#hostname_7_4', regex : /^.+$/},
            {name : '#ip_7_4', regex : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/},
            {name : '#ssh_port_7_4', regex : /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/},
            {name : '#root_password_7_4', regex : /^.+$/},
            {name : '#hostname_7_5', regex : /^.+$/},
            {name : '#ip_7_5', regex : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/},
            {name : '#ssh_port_7_5', regex : /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/},
            {name : '#root_password_7_5', regex : /^.+$/},
            {name : '#hostname_7_6', regex : /^.+$/},
            {name : '#ip_7_6', regex : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/},
            {name : '#ssh_port_7_6', regex : /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/},
            {name : '#root_password_7_6', regex : /^.+$/},
            {name : '#hostname_7_7', regex : /^.+$/},
            {name : '#ip_7_7', regex : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/},
            {name : '#ssh_port_7_7', regex : /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/},
            {name : '#root_password_7_7', regex : /^.+$/}
        ],
        
        validationTab3 : [
            {name : '#hostnameNewServer', regex : /^.+$/},
            {name : '#ipNewServer', regex : /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/},
            {name : '#sshNewServer', regex : /^(6553[0-5]|655[0-2]\d|65[0-4]\d\d|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}|0)$/},
            {name : '#passwordNewServer', regex : /^.+$/}
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            'deploy_mgr.addserver' : {
                url: winkstart.apps['cluster'].api_url + '/accounts/{account_id}/servers',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "deploy_mgr.list": {
                url: winkstart.apps['cluster'].api_url + '/accounts/{account_id}/servers',
                contentType: 'application/json',
                verb: 'GET'
            },
            "deploy_mgr.deleteserver": {
                url: winkstart.apps['cluster'].api_url + '/accounts/{account_id}/servers/{server_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            
            "deploy_mgr.getdeploystatus":{
                url: winkstart.apps['cluster'].api_url + '/accounts/{account_id}/servers/{server_id}/deployment',
                contentType: 'application/json',
                verb: 'GET'
            },
            
            "deploy_mgr.deploy":{
                url: winkstart.apps['cluster'].api_url + '/accounts/{account_id}/servers/{server_id}/deployment',
                contentType: 'application/json',
                verb: 'PUT'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        winkstart.publish('deploy_mgr.activate');
    }, // End initialization routine


    /* Define the functions for this module */
    {   
        validateForm: function(state, tab) {
            var THIS = this;
            
            if (state == 'save') {
                if(tab != '2' && tab != '3') {
                    $(THIS.config.validationTab1).each(function(k, v) {
                        winkstart.validate.save($(v.name), v.regex);
                    });
                } else if (tab == '2') {
                    $(THIS.config.validationTab2).each(function(k, v) {
                        winkstart.validate.save($(v.name), v.regex);
                    });
                } else if (tab == '3') {
                    $(THIS.config.validationTab3).each(function(k, v) {
                        winkstart.validate.save($(v.name), v.regex);
                    });
                }
            } else if(state == undefined) {
                $(THIS.config.validationTab1).each(function(k, v) {
                    winkstart.validate.add($(v.name), v.regex);
                });
                $(THIS.config.validationTab2).each(function(k, v) {
                    winkstart.validate.add($(v.name), v.regex);
                });
                $(THIS.config.validationTab3).each(function(k, v) {
                    winkstart.validate.add($(v.name), v.regex);
                });
            }
        },
        
        server_count : 0,
        
        requestServer: function() {
            var THIS = this;
            
            $('#server_dialog').empty();
            $('#server_dialog').dialog('destroy');
            THIS.templates.newserver.tmpl().appendTo('#server_dialog');
            
            $('#server_dialog').dialog({
                height: '320',
                width: '310',
                open:function(){
                    THIS.validateForm();
                    $('#serverinfo a.save_btnServer').live('click', function() {
                        var data = form2object('serverinfo');
                        data.roles = new Array();                    
                        $('input[name="roles"]:checked', '#serverinfo').each(function(){
                            data.roles.push($(this).val());
                        });
                        
                        THIS.validateForm('save', '3');
                        
                        if(!$('.invalid').size() && $('.checkboxRoleServer:checked').size() != 0) {
                            $('#server_dialog').dialog('close');
                            winkstart.publish('deploy_mgr.addServer', data);
                        } else {
                            alert ('Please correct errors that you have on the form and make sure that you choose AT LEAST one role.');
                        }
                    })
                }
            });
            $('#server_dialog').dialog('open');
        },
        
        requestFirstServer: function() {
            var THIS = this;
            
            $('#server_dialog').empty();
            $('#server_dialog').dialog('destroy');
            
            THIS.templates.firstserver.tmpl().appendTo('#server_dialog');
            
            $("#tabs ul").tabs("#tabs .pane > div");
            $(".pane").css('width', '380')
            
            $('#server_dialog').dialog({
                height: 600, 
                width: 480,
                open: function(){
                    THIS.validateForm();
                    $('#serverinfo_dev a.save_btnServer').live('click', function() {
                        var data = form2object('serverinfo_dev');
                        data.roles = new Array('all_in_one');
                        
                        // Validation in the dev case
                        THIS.validateForm('save', '1');
                        
                        if(!$('.invalid').size()) {
                            winkstart.publish('deploy_mgr.addServer', data);
                            $('#server_dialog').dialog('close');
                        } else {
                            alert ('Please correct errors that you have on the form.');
                        }
                    });
                    $('#serverinfo_prod a.save_btnServer').live('click', function() {
                        var data = form2object('serverinfo_prod');
                        
                        // Validation in the prod case
                        THIS.validateForm('save', '2');
                        
                        if(!$('.invalid').size()) {
                            $.each(data, function(){
                                var server = {
                                    hostname: this[0],
                                    ip: this[1],
                                    ssh_port: this[2],
                                    password: this[3],
                                    os: this[4]
                                };
                                server.roles = new Array();
                                server.roles.push(this[5]);
                                if(this[6]){
                                    server.roles.push(this[6]);
                                }


                                winkstart.publish('deploy_mgr.addServer', server, true);
                            });
                            $('#server_dialog').dialog('close');

                            //Hack to deploy server after adding them all
                            setTimeout(function(){
                                $('.cluster').find('.server').each(function(){
                                    var serverId = $(this).attr('server_id');
                                    winkstart.publish('deploy_mgr.updateServer',  serverId);
                                }); 
                            },5000);
                        }
                    });
                }
            });
            $('#server_dialog').dialog('open');
        },
        
        
        
        addServer: function(serverData, noUpdate) {
            var THIS = this;
            
            var rest_data = {};
            rest_data.crossbar = true;
            rest_data.account_id = '04152ed2b428922e99ac66f3a71b0215';
            rest_data.data = serverData;

            winkstart.putJSON('deploy_mgr.addserver', rest_data, function (json, xhr) {
                if(json.status == 'success'){  
                    var data = {};
                    data.server_name = json.data.hostname;
                    data.server_id = json.data.id;
                    data.server_state = 'never_run';
                    data.server_roles = json.data.roles;

                    THIS.templates.server.tmpl(data).prependTo($('.cluster'));
                    if(noUpdate != true){
                        winkstart.publish('deploy_mgr.updateServer',  json.data.id);
                    }

                    THIS.server_count++;
                    winkstart.publish('deploy_mgr.setlink');
                }
            });
            
        },

        deleteServer: function(serverId) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: '04152ed2b428922e99ac66f3a71b0215',
                server_id: serverId
            };
            winkstart.deleteJSON('deploy_mgr.deleteserver', rest_data, function (json, xhr) {
                if(json.status == "success"){
                    $('#'+serverId).remove();
                    THIS.server_count--;
                    winkstart.publish('deploy_mgr.setlink');
                }
            });  
        },
        
        updateServer: function(serverId) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: '04152ed2b428922e99ac66f3a71b0215',
                server_id: serverId
            };

            winkstart.getJSON('deploy_mgr.deploy', rest_data, function (json, xhr) {
                winkstart.getJSON('deploy_mgr.getdeploystatus', rest_data, function (json, xhr) {
                    $('#'+serverId+' a.update_status').html(json.data.status);
                    $('#'+serverId+' div.server_footer').removeClass('idle running never_run').addClass(json.data.status);
                });
            });
        },
        
        statusServer: function() {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: '04152ed2b428922e99ac66f3a71b0215'
            };
            setInterval(function(){ 
                $('.cluster').find('.server').each(function(){
                    var serverId = $(this).attr('server_id');
                    
                    rest_data.server_id = serverId;
                    winkstart.getJSON('deploy_mgr.getdeploystatus', rest_data, function (json, xhr) {
                        $('#'+serverId+' a.update_status').html(json.data.status);
                        $('#'+serverId+' div.server_footer').removeClass('idle running never_run').addClass(json.data.status);
                    });
                }); 
            }, 15000);
        },
        
        setLink: function(){
            var THIS = this;
            //hack double click
            $('.cluster_pane a.add_server').unbind();
            $('.cluster_pane a.add_server').die();
            
            switch(THIS.server_count){
                case 0:
                    $('.cluster_pane a.add_server').show();
                    $('.cluster_pane a.add_server').click(function() {
                        winkstart.publish('deploy_mgr.requestFirstServer');
                    });
                    break;
                case 1:
                    $('.cluster_pane a.add_server').hide();
                    break;
                default:
                    $('.cluster_pane a.add_server').show();
                    $('.cluster_pane a.add_server').click(function() {
                        winkstart.publish('deploy_mgr.requestServer');
                    });
            }
        },

        listServer: function() {
            var THIS = this;
            
            winkstart.getJSON('deploy_mgr.list', {
                crossbar: true, 
                account_id: '04152ed2b428922e99ac66f3a71b0215'
            }, function(reply) {
                $.each(reply.data, function(){
                    THIS.server_count++;
                    
                    var data = {
                        server_name : this.hostname,
                        server_id : this.id,
                        server_state : this.deploy_status,
                        server_roles : this.roles
                    };
                    THIS.templates.server.tmpl(data).prependTo($('.cluster'));
                });
                winkstart.publish('deploy_mgr.setlink');
                
                $('.server a.cancel_btn').live('click', function() {
                    if(confirm('Do you want to delete this server ?')){
                        winkstart.publish('deploy_mgr.deleteServer',  $(this).parent().parent().attr('id'));
                    }
                });

                $('.server_footer a.update_status').live('click', function() {
                    if(confirm('Do you want to deploy this server ?')){
                        var data = $(this).parent().parent().attr('id');
                        
                        winkstart.publish('deploy_mgr.updateServer',  data);
                    }  
                });
                winkstart.publish('deploy_mgr.statusServer');
            });
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
 * if appropriate. You should also attach to any default click items you want to respond to when people click
 * on them. Also register resources.
 */
        activate: function(data) {
            var THIS = this;

            /* Clear out the center part of the window - get ready to put our own content in there */
            $('#ws-content').empty();

            /* Draw our base template into the window */
            THIS.templates.index.tmpl().appendTo( $('#ws-content') );

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.__whapp, this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Server Manager',
                module: this.__module
            });
            winkstart.publish('deploy_mgr.listServer');

            $('#server_dialog').dialog( {
                autoOpen : false
            });
        }
    });  // End module