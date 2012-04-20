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
            helpdeploy: 'tmpl/helpdeploy.html',
            form_firstServer: 'tmpl/form_firstServer.html',
            form_newServer: 'tmpl/form_newServer.html'
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
        server_count: 0,
        serverTypes: ['Own'],
        
        requestServer: function() {
            var THIS = this;
            
            var serverDialog = winkstart.dialog(THIS.templates.newserver.tmpl(), {
                title: 'Register a New Server',
                open: function(){
                    $(this).dialog({
                        width: 200
                    });
 
                    $.each(THIS.serverTypes,function(i, v){
                        $('.serverType', serverDialog).append('<option value="'+i+'">'+v+'</option>');
                    });      
                    
                    $('.serverType', serverDialog).change(function(){
                        $(serverDialog).dialog({
                            width: 550
                        });
                        
                        $(serverDialog).dialog({
                            position: ['center', 'top']
                        });
                        var data = {
                            servers: [],
                            type: $('.serverType option:selected').val()
                        };
                        data.servers.push($('.serverType option:selected').text());
                            
                        $('.content_form', $(serverDialog)).html(THIS.templates.form_newServer.tmpl(data));
                        
                        THIS.tooltip();
                        
                        //CSS fix
                        $('#serverinfo').find('input:checkbox').each(function(i, o){
                            if(i != 0){
                                $(o).css('margin-left', 100);
                            }
                            if(i != 0 && i != 1){
                                $(o).css('margin-top', 5);
                            }
                        });
                            
                        $('.content_form').find('.save_btnServer').click(function(){
                            var data = {
                                servers: []
                            },
                            obj= form2object('serverinfo');
                            obj.roles =  new Array();

                            $('.roles:checked', $('#serverinfo')).each(function(){
                                obj.roles.push($(this).val());
                            });                                   
                            data.servers.push(obj);
                            $(serverDialog).dialog('close');
                            winkstart.publish('deploy_mgr.addServer', data);
                        });
                    });
                }
            });
        },
        
        requestFirstServer: function() {
            var THIS = this,
            firstServerDialog = winkstart.dialog(THIS.templates.firstserver.tmpl(), {
                resizable: false,
                title: 'Types',
                open: function(){       
                    $(this).dialog({
                        width: 200
                    });
                            
                    $('.serverType', firstServerDialog).each(function(){
                        var select = this;
                        $.each(THIS.serverTypes,function(i, v){
                            $(select).append('<option value="'+i+'">'+v+'</option>');
                        });      
                    });
                    
                    $('#selectType').change(function(){
                        $(firstServerDialog).dialog({
                            width: 200
                        });
                        
                        $('.type').each(function(){
                            $(this).hide();
                        });
                        $('#'+$(this).val()).fadeToggle("slow", "linear");
                        $('.content_form', $(firstServerDialog)).html('');
                    });
					
                    $('.type').each(function(){
                        var div = this;
                        $('.serverType', $(div)).change(function(){
                            $(firstServerDialog).dialog({
                                width: 550
                            });
                            
                            $(firstServerDialog).dialog({
                                position: ['center', 'top']
                            });
                            var data = {
                                servers: [],
                                roles: [['winkstart_deploy_opensips', 'winkstart_deploy_whapps'],
                                ['winkstart_deploy_opensips', 'winkstart_deploy_whapps'],
                                ['winkstart_deploy_bigcouch'],
                                ['winkstart_deploy_bigcouch'],
                                ['winkstart_deploy_bigcouch'],
                                ['winkstart_deploy_whistle_fs'],
                                ['winkstart_deploy_whistle_fs']],
                                type: div.id
                            };
  
                            $(div).find('.serverType option:selected').each(function(){
                                data.servers.push($(this).text());
                            });
                            
                            $('.content_form', $(firstServerDialog)).html(THIS.templates.form_firstServer.tmpl(data));
                            THIS.tooltip();
                            
                            $('.content_form').find('.save_btnServer').click(function(){
                                var post = {
                                    servers: []
                                };
                                $('.content_form').find('.servers').each(function(){
                                    var form = this,
                                    obj = form2object(form.id),
                                    tmpServer;
                                    
                                    if(obj.number == 7){
                                        $.each(data.roles, function(){
                                            tmpServer = $.extend(true, {}, obj);
                                            tmpServer.roles = this;
                                            delete(tmpServer.number);
                                            post.servers.push(tmpServer);
                                        });
                                    }else{
                                        obj.roles =  new Array();
                                        $('.roles', $('#'+form.id)).each(function(){
                                            obj.roles.push($(this).val());
                                        });                                   
                                        post.servers.push(obj);
                                    }
                                });
                                $(firstServerDialog).dialog('close');
                                winkstart.publish('deploy_mgr.addServer', post);
                            });
                            
                        });
                    });
                }
            });
        },
        
        addServer: function(data) {
            var THIS = this,
            servers = data.servers;

            $.each(servers, function(i, v){
                var rest_data = {};
                rest_data.crossbar = true;
                rest_data.account_id = winkstart.apps['auth'].account_id;
                rest_data.data = v;
                
                switch(v.type){
                    case 'Own':
                        winkstart.putJSON('deploy_mgr.addserver', rest_data, function (json, xhr) {
                            if(json.status == 'success'){  
                                var data = {};
                                data.server_name = json.data.hostname;
                                data.server_id = json.data.id;
                                data.server_state = 'never_run';
                                data.server_roles = THIS.getRoles(json.data.roles);
                                data.tooltip = 'Type: '+rest_data.data.type+'<br/>Host Name: '+json.data.hostname + '<br/>Ip: ' + json.data.ip;
        
                                THIS.templates.server.tmpl(data).prependTo($('.cluster'));
                                
                                $('.server_progress', '#'+data.server_id).progressbar({
                                    value:25
                                });
                                

                                winkstart.publish('deploy_mgr.updateServer',  json.data.id);

                                THIS.server_count++;
                                winkstart.publish('deploy_mgr.setlink');
        					
                                THIS.tooltip();
        
                                if(json.data.roles == "all_in_one" || jQuery.inArray("winkstart_deploy_whapps", json.data.roles) >= 0){
                                    THIS._changeURL(json.data.ip);
                                }
                            }
                        });
                        break;
                    default:
                        
                        //FAKE FOR NOW !!!!!!!!!!!!
                        rest_data.data.hostname = '2600hz.server'+i+'.com';
                        rest_data.data.ip = '1.1.1.'+i;
                        rest_data.data.password = 'password';
                        rest_data.data.ssh_port = '22';
                        
                        winkstart.putJSON('deploy_mgr.addserver', rest_data, function (json, xhr) {
                            if(json.status == 'success'){  
                                var data = {};
                                data.server_name = json.data.hostname;
                                data.server_id = json.data.id;
                                data.server_state = 'never_run';
                                data.server_roles = THIS.getRoles(json.data.roles);
                                data.tooltip = 'Type: '+rest_data.data.type+'<br/>Host Name: '+json.data.hostname + '<br/>Ip: ' + json.data.ip;
        
                                THIS.templates.server.tmpl(data).prependTo($('.cluster'));
                                winkstart.publish('deploy_mgr.updateServer',  json.data.id);

                                THIS.server_count++;
                                winkstart.publish('deploy_mgr.setlink');
        					
                                THIS.tooltip();
        
                                if(json.data.roles == "all_in_one" || jQuery.inArray("winkstart_deploy_whapps", json.data.roles) >= 0){
                                    THIS._changeURL(json.data.ip);
                                }
                            }
                        });
                        break;
                }
            });    
        },
        
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
                
                $('.main_nav li[module-name=voip] .whapp a').html('VoIP Services');

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

                    if(this.status == "running"){
                        classLog = "logrunning";
                    }
                    else if (this.status == "ok"){
                        classLog = "thumb_up";
                    }
                    else if (this.status == "ko"){
                        classLog = "thumb_down";
                    }
                    else{
                        classLog = "";
                    }

                    logListContent += "<div class='"+this.status+"'>"+this.name+" : <div class='"+classLog+"'></div></div>";
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
                    
                    // HERE'S GONNA BE THE MODIFICATION OF THE SERVER'S CONTENT FOR THE LOGS
                        
                    
                        
                    json.data.log = [
                    {
                        "name": "freeswitch", 
                        "status": "running"
                    },

                    {
                        "name": "freeswitch2", 
                        "status": "ok"
                    },

                    {
                        "name": "freeswitch3", 
                        "status": "ko"
                    }
                    ]
                        
                    THIS.setLoglist(json.data.log, serverId);
                        
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
        
        setPgbar: function(serverId, value){
            $('.server_progress', '#'+serverId).progressbar({
                'value':value
            });
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
                $('#cluster_container', '#ws-content').css('margin-left','5%');
            
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
