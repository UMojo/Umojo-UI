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
            'deploy_mgr.requestFirstServer': 'requestFirstServer'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {

            //            'deploy_mgr.addserver' : { url : winkstart.apps['cluster'].api_url, httpMethod : 'POST', dataType : 'json' }

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
        server_count : 0,
        
        requestServer: function() {
            var THIS = this;
            
            $('#server_dialog').empty();
            THIS.templates.newserver.tmpl().appendTo('#server_dialog');
            
            $('#server_dialog').dialog({
                open:function(){
                    $('#serverinfo a.save_btn').live('click', function() {
                        var data = form2object('serverinfo');
                        data.roles = new Array();
                        $('input[name="roles"]:checked', '#serverinfo').each(function(){
                            data.roles.push($(this).val());
                        });
                        
                        $('#server_dialog').dialog('close');
                        winkstart.publish('deploy_mgr.addServer', data);
                    })
                }
            });
          
            
            $('#server_dialog').dialog('open');
            
        },
        
        requestFirstServer: function() {
            var THIS = this;
            
            $('#server_dialog').empty();
            THIS.templates.firstserver.tmpl().appendTo('#server_dialog');
            $("#tabs ul").tabs("#tabs .pane > div");
            
            $(".pane").css('width', '380')
            $('#server_dialog').dialog({
                height: 600, 
                width: 480
            });
            $('#server_dialog').dialog('open');
        },
        
        
        
        addServer: function(serverData) {
            var THIS = this;
            
            var rest_data = {};
            rest_data.crossbar = true;
            rest_data.account_id = '04152ed2b428922e99ac66f3a71b0215';
            rest_data.data = serverData;
            
            winkstart.putJSON('deploy_mgr.addserver', rest_data, function (json, xhr) {
                console.log(json);
                if(json.status == 'success'){  
                    var data = {};
                    data.server_name = json.data.hostname;
                    data.server_id = json.data.id;
                    data.server_state = 'never_run';
                    data.server_roles = json.data.roles;
                    
                    THIS.templates.server.tmpl(data).prependTo($('.cluster'));
                    winkstart.publish('deploy_mgr.updateServer',  json.data.id);
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

        listServer: function() {
            var THIS = this;
            winkstart.getJSON('deploy_mgr.list', {
                crossbar: true, 
                //account_id: MASTER_ACCOUNT_ID
                account_id: '04152ed2b428922e99ac66f3a71b0215'
            }, function(reply) {
                $.each(reply.data, function(){
                    console.log(this);
                    THIS.server_count++;
                    
                    var data = {
                        server_name : this.hostname,
                        server_id : this.id,
                        server_state : this.deploy_status,
                        server_roles : this.roles
                    };
                    THIS.templates.server.tmpl(data).prependTo($('.cluster'));
                   
                });

                if(THIS.server_count == 0){
                    $('.cluster_pane a.add_server').click(function() {
                        winkstart.publish('deploy_mgr.requestFirstServer');
                    });
                }else if(THIS.server_count == 1){
                    $('.cluster_pane a.add_server').remove();
                }else{
                    $('.cluster_pane a.add_server').click(function() {
                        winkstart.publish('deploy_mgr.requestServer');
                    });
                }
                
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