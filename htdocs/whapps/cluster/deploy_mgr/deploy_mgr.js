winkstart.module('cluster', 'deploy_mgr',
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
            'css/style.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            index: 'tmpl/index.html',
            serverinfo: 'tmpl/serverinfo.html',
            newserver: 'tmpl/newserver.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'deploy_mgr.activate' : 'activate',
            'deploy_mgr.requestServer' : 'requestServer',
            'deploy_mgr.addServer' : 'addServer',
            'deploy_mgr.deleteServer' : 'deleteServer',
            'deploy_mgr.updateServer' : 'updateServer',
            'deploy_mgr.statusServer' : 'statusServer',
            'deploy_mgr.refresh' : 'refresh',
            'deploy_mgr.toggleServer' : 'toggleServer'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            'deploy_mgr.addserver' : { url : winkstart.apps['cluster'].api_url, httpMethod : 'POST', dataType : 'json' }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /*winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Server Manager'
        });*/

        winkstart.publish('deploy_mgr.activate');
    }, // End initialization routine


    /* Define the functions for this module */
    {
        server_count : 0,
        
        requestServer: function() {
            var THIS = this;
            
            $('#server_dialog').empty();
            THIS.templates.serverinfo.tmpl().appendTo('#server_dialog');
            $('#server_dialog').dialog('open');
            $('#serverinfo a.save_btn').click(function() {
                $('#server_dialog').dialog('close');
                data = form2object('serverinfo');
                console.log(data);
                winkstart.publish('deploy_mgr.addServer', data);
            });
            
        },
        
        addServer: function(serverData) {
            var THIS = this;
            
            // Do API request via POST
/*            winkstart.postJSON('deploy_mgr.addserver', serverData, function() {
                // If successful, draw new server on screen
  */              
                THIS.server_count++;
                serverData.server_id = THIS.server_count;
                THIS.templates.newserver.tmpl(serverData).appendTo('.cluster_pane');
/*            });*/
            
        },

        deleteServer: function(serverData) {
            var THIS = this;
            $('div.server[server_id='+serverData+']').remove();
            console.log('delete');
        },
        
        updateServer: function(serverData) {
            var THIS = this;
        },
        
        statusServer: function(serverData) {
            var THIS = this;            
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
            winkstart.registerResources(this.config.resources);

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Server Manager',
                module: this.__module
            });

            $('.cluster_pane a.add_server').click(function() {
                winkstart.publish('deploy_mgr.requestServer');
            });
            
            $('.cluster_pane a.cancel_btn').live('click', function() {
                console.log('event');
                winkstart.publish('deploy_mgr.deleteServer', $(this).parents('div.server').attr('server_id'));
            });

            $('#server_dialog').dialog( { autoOpen : false } );
        }
    } // End function definitions
);  // End module
