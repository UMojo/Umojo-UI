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
            firstserver: 'tmpl/firstServer.html',
            addcluster: 'tmpl/addCluster.html',
            noserver: 'tmpl/noServer.html',
            helpdeploy: 'tmpl/helpdeploy.html'
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
            'deploy_mgr.setlink': 'setLink',
            'deploy_mgr.getroles': 'getRoles'
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
            },
            "deploy_mgr.user.get": {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
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
            
            var serverDialog = winkstart.dialog(THIS.templates.newserver.tmpl(), {
                title: 'Register a New Server',
                open: function(){
                    THIS.validateForm();
                    $('#serverinfo a.save_btnServer', $(this)).click(function() {
                        var data = form2object('serverinfo');
                        data.roles = new Array();                    
                        $('input[name="roles"]:checked', '#serverinfo').each(function(){
                            data.roles.push($(this).val());
                        });
                        
                        THIS.validateForm('save', '3');
                        
                        if(!$('.invalid').size() && $('.checkboxRoleServer:checked').size() != 0) {
                            winkstart.publish('deploy_mgr.addServer', data);
                            $(serverDialog).dialog('close');
                            THIS.templates.helpdeploy.tmpl().dialog({
                                resizable: 'false'
                            });
                        } else {
                            alert ('Please correct errors that you have on the form and make sure that you choose AT LEAST one role.');
                        }
                    })
                }
            });
            
            $(serverDialog).dialog('open');
        },
        
        requestFirstServer: function() {
            var THIS = this;
            
            var firstServerDialog = winkstart.dialog(THIS.templates.firstserver.tmpl(), {
                resizable: false,
                open: function(){
                    $("#tabs ul").tabs("#tabs .pane > div");
                    
                    //Fix CSS
                    $("ul.settings_tabs", "#tabs").css('margin', '0');
                    $(".pane", "#tabs").css('margin', '0');
                    $(".pane", "#tabs").css('width', '380');
                    
                    THIS.validateForm();
                    
                    $('#serverinfo_dev a.save_btnServer', $(this)).click(function() {
                        var data = form2object('serverinfo_dev');
                        data.roles = new Array('all_in_one');
                        
                        // Validation in the dev case
                        THIS.validateForm('save', '1');
                        
                        if(!$('.invalid').size()) {
                            winkstart.publish('deploy_mgr.addServer', data);
                            $(firstServerDialog).dialog('close');
                            THIS.templates.helpdeploy.tmpl().dialog({
                                resizable: 'false'
                            });
                        } else {
                            alert ('Please correct errors that you have on the form.');
                        }
                    });
                    $('.serverinfo_prod a.save_btnServer', $(this)).click(function() {
                        // Validation in the prod case
                        THIS.validateForm('save', '2');
                        
                        if(!$('.invalid').size()) {
                            $('.serverinfo_prod').each(function(){
								var data = form2object($(this).attr('id'));
								data.roles = new Array();                    
								$('input[name="roles"]', '#'+$(this).attr('id')).each(function(){
									data.roles.push($(this).val());
								});
								winkstart.publish('deploy_mgr.addServer', data, true);
                            });
                            $(firstServerDialog).dialog('close');
                            THIS.templates.helpdeploy.tmpl().dialog({
                                resizable: 'false'
                            });

                            //Hack to deploy server after adding them all
                            setTimeout(function(){
                                $('.cluster').find('.server').each(function(){
                                    var serverId = $(this).attr('server_id');
                                    winkstart.publish('deploy_mgr.updateServer',  serverId);
                                }); 
                            },5000);
                        }
                    });
                    
                    $.each($('body').find('*[tooltip]'), function(){
                        $(this).tooltip({
                            attach:'body'
                        });
                    });
                }
            });
            $(firstServerDialog).dialog('open');
        },

        addServer: function(serverData, noUpdate) {
            var THIS = this;
            
            var rest_data = {};
            rest_data.crossbar = true;
            rest_data.account_id = winkstart.apps['auth'].account_id;
            rest_data.data = serverData;

            winkstart.putJSON('deploy_mgr.addserver', rest_data, function (json, xhr) {
                if(json.status == 'success'){  
                    var data = {};
                    data.server_name = json.data.hostname;
                    data.server_id = json.data.id;
                    data.server_state = 'never_run';
                    data.server_roles = THIS.getRoles(json.data.roles);
                    data.tooltip = 'Host Name: '+json.data.hostname + '<br/>Ip: ' + json.data.ip;

                    THIS.templates.server.tmpl(data).prependTo($('.cluster'));
                    if(noUpdate != true){
                        winkstart.publish('deploy_mgr.updateServer',  json.data.id);
                    }

                    THIS.server_count++;
                    winkstart.publish('deploy_mgr.setlink');
					
                    THIS.tooltip();

                    if(json.data.roles == "all_in_one" || jQuery.inArray("winkstart_deploy_whapps", json.data.roles) >= 0){
                        THIS._changeURL(json.data.ip);
                    }
                }
            });
        },
        
        //        _setupWhappServersUrl: function() {
        //            var THIS = this;
        //           
        //            winkstart.getJSON('cluster.listservers', {
        //                crossbar: true, 
        //                account_id: winkstart.apps['auth'].account_id 
        //            }, function(reply) {

        //                
        //                var url = "";
        //                
        //                $.each(reply.data, function(k, server) {

        //                    roles = server.roles;

        //                    $.each(roles, function(k, role){
        //                        if(role == 'winkstart_deploy_whapps' || role == 'all_in_one') {
        //                            url = server.hostname;
        //                        }
        //                    });
        //                });
        //                
        //                if (url != "")
        //                    THIS._changeURL(url);
        ////                $.each(reply.data, function () {
        ////                });
        //            });
        //            
        //            $('#cur_api_url').append('You are currently using the API on: <b>'+ winkstart.apps['voip'].api_url +'</b>');
        //        },
        
        _changeURL: function(url) {
            winkstart.getJSON('auth.get_user', {
                crossbar: true,
                api_url: winkstart.apps['auth'].api_url,
                account_id: winkstart.apps['auth'].account_id,
                user_id: winkstart.apps['auth'].user_id
            }, function(json, xhr) {
                
                var inUrl = 'http://'+url+':8000/v1';
                json.data.apps.voip.api_url = inUrl;
                
                var inLabel = "VoIP Services";
                json.data.apps.voip.label = inLabel;
                
                $('.main_nav li[module-name=voip] a').html('VoIP Services');

                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.api_url = winkstart.apps['auth'].api_url;
                rest_data.account_id = winkstart.apps['auth'].account_id;
                rest_data.user_id = winkstart.apps['auth'].user_id;
                rest_data.data = json.data;

                winkstart.postJSON('auth.user.update', rest_data, function (json, xhr) {
                    winkstart.apps['voip'].auth_token = "";
                    winkstart.apps['voip'].api_url = inUrl;
                });
            });
            
        },

        deleteServer: function(serverId) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: winkstart.apps['auth'].account_id, 
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
                account_id: winkstart.apps['auth'].account_id,
                server_id: serverId,
                data: {}
            };

            winkstart.putJSON('deploy_mgr.deploy', rest_data, function (json, xhr) {
                winkstart.getJSON('deploy_mgr.getdeploystatus', rest_data, function (json, xhr) {
                    var status = THIS.setStatus(json.data.status);
 
                    $('#'+serverId+' a.update_status').html(status);
                    $('#'+serverId+' div.server_footer').removeClass('Update Running Deploy').addClass(status);
                });
            });
        },
        
        setLoglist: function(logs, serverId) {
            var logListContent = "";
            
            if (logs != {}) {
                $.each(logs, function() {
                    var classLog = "";

                    if(this.status == "running")
                        classLog = "logrunning";
                    else if (this.status == "ok")
                        classLog = "thumb_up";
                    else if (this.status == "ko")
                        classLog = "thumb_down";
                    else
                        classLog = "";

                    logListContent += "<tr>";
                    logListContent += "<td id='log"+ this.name +"'>"+ this.name +"</td>";
                    logListContent += "<td id='logstatus"+ this.name +"' class='"+ classLog +"'></td>";
                    logListContent += "</tr>";
                });
            }

            $('#'+serverId+' #loglist').html(logListContent);
        },
        
        statusServer: function() {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: winkstart.apps['auth'].account_id
            };
            
            THIS.getStatus(rest_data);
            setInterval(function(){ 
                THIS.getStatus(rest_data);
            }, 60000);
        },
        
        getStatus: function(rest_data) {
            var THIS = this;
            
            $('.cluster').find('.server').each(function(){
                    var serverId = $(this).attr('server_id');
                    
                    rest_data.server_id = serverId;
                    winkstart.getJSON('deploy_mgr.getdeploystatus', rest_data, function (json, xhr) {
                        var status = THIS.setStatus(json.data.status);
                        
                        //THIS.setLoglist(json.data.log, serverId);
                        
                        $('#'+serverId+' a.update_status').html(status);
                        $('#'+serverId+' div.server_footer').removeClass('Update Running Deploy').addClass(status);
                    });
                }); 
        },
        
        setStatus: function(oldStatus){
            var newStatus = '';
            
            switch (oldStatus) {
                case 'never_run':
                    newStatus = 'Deploy';
                    break;
                case 'running':
                    newStatus = 'Running';
                    break;
                case 'idle':
                    newStatus = 'Update';
                    break;
            }

            return newStatus;
        },
        
        setLink: function(){
            var THIS = this;
            
            //No server Dialog
            var noServerDialog = winkstart.dialog(THIS.templates.noserver.tmpl(), {
                autoOpen : false
            });
            
            //Hack DBClick
            $('.cluster_pane a.add_server').die();
            $('.cluster_pane a.add_server').unbind();
 
            switch(THIS.server_count){
                case 0:
                    $('.cluster_pane a.add_server').show();
                    $('.cluster_pane a.add_server').click(function() {
                        winkstart.publish('deploy_mgr.requestFirstServer');
                    });
                    $(noServerDialog).dialog('open');

                    $('.close', noServerDialog).click(function() { 
                        $(noServerDialog.dialog('close'))
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
        
        getRoles: function(roles) {
	
            var newRoles = [];
    
            var basicRoles = {
                winkstart_deploy_opensips: 'Call Director - OpenSIPs',
                winkstart_deploy_whapps: 'App Server - Whapps Controller', 
                winkstart_deploy_bigcouch: 'Database Server - CouchDB',   
                winkstart_deploy_whistle_fs: 'Media Server - FreeSWITCH', 
                all_in_one: ['Call Director - OpenSIPs',
                'App Server - Whapps Controller',
                'Database Server - CouchDB',
                'Media Server - FreeSWITCH']
            };
	
            $.each(basicRoles, function(i, v){
                $.each(roles, function(i1, v1){
                    if(v1 == i){
                        newRoles.push(v);
                    }
                });
            });
            return newRoles;
        },

        listServer: function() {
            var THIS = this;
            
            winkstart.getJSON('deploy_mgr.list', {
                crossbar: true, 
                account_id: winkstart.apps['auth'].account_id 
            }, function(reply) {
                /* Clear out the center part of the window - get ready to put our own content in there */
                $('#ws-content').empty();

                /* Draw our base template into the window */
                THIS.templates.index.tmpl().appendTo( $('#ws-content') );
            
                $('a.plus').click(function(){
                    var addCluster = winkstart.dialog(THIS.templates.addcluster.tmpl(), {
                        title: 'Add a new cluster',
                        resizable: false,
                        autoOpen : false
                    });
                    $(addCluster).dialog('open');
                    $('.close', $(addCluster)).click(function() {
                        $(addCluster).dialog('close');
                    });
                });

                THIS.server_count = 0;
                
                $.each(reply.data, function(){
                    THIS.server_count++;
                    
                    var data = {
                        server_name : this.hostname,
                        server_id : this.id,
                        server_state : THIS.setStatus(this.deploy_status),
                        server_roles : THIS.getRoles(this.roles),
                        tooltip: 'Host Name: '+this.hostname + ' <br/>IP: ' + this.ip
                    };
                    
                    THIS.templates.server.tmpl(data).prependTo($('.cluster'));
                });
				
                THIS.tooltip();
				
                winkstart.publish('deploy_mgr.setlink');
                
                $('.server a.cancel_btn').live('click', function() {
                    if(confirm('Do you want to delete this server ?')){
                        winkstart.publish('deploy_mgr.deleteServer',  $(this).parent().parent().attr('id'));
                    }
                });

                $('.server_footer a.update_status').live('click', function() {                    
                    var data = $(this).parent().parent().attr('id');
                    
                    switch ($(this).html()) {
                        case 'Update':
                            if(confirm('Do you want to update this server to the latest software version?')){
                                winkstart.publish('deploy_mgr.updateServer',  data);
                            }
                            break;
                        case 'Running':
                            alert('Sever already running !');
                            break;
                        case 'Deploy':
                            if(confirm('Do you want to deploy this server ?')){
                                winkstart.publish('deploy_mgr.updateServer',  data);
                            }
                            break;
                    }  
                });
            
                winkstart.publish('deploy_mgr.statusServer');
            });
            
             
        },
		
        tooltip: function(){
            $.each($('body').find('*[tooltip]'), function(){
                $(this).tooltip({
                    attach: 'body'
                });
            });
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
 * if appropriate. You should also attach to any default click items you want to respond to when people click
 * on them. Also register resources.
 */
        activate: function(data) {
            var THIS = this;

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Server Manager',
                module: this.__module
            });
            winkstart.publish('deploy_mgr.listServer');

            $('#server_dialog').dialog({
                autoOpen : false
            });        
        }
    });  // End module
