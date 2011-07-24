winkstart.module('connect', 'endpoint', 
    /* Start module resource definitions */
    {
        /* What HTML templates will we be using? */
        templates: {
/*            edit_auth: 'tmpl/edit_auth.html',
            service_limits: 'tmpl/service_limits.html',*/
            edit_endpoint: 'tmpl/edit_endpoint.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'endpoint.activate' : 'activate',
            'endpoint.list' : 'list',                    // Get endpoint list
            'endpoint.add' : 'add',                      // Add an endpoint
            'endpoint.edit' : 'edit',                    // Edit existing endpoint
            'endpoint.delete' : 'del',                   // Delete an endpoint
            'endpoint.update' : 'save'                   // Update defaults/general endpoint settings
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            /* Endpoint Management */
            "endpoint.get": {
                url: 'https://store.2600hz.com/v1/endpoints',
                contentType: 'application/json',
                verb: 'GET'
            },
            "endpoint.put": {  // Create
                url: 'https://store.2600hz.com/v1/{account_id}/endpoints',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "endpoint.post": { // Update
                url: 'https://store.2600hz.com/v1/{account_id}/endpoints',
                contentType: 'application/json',
                verb: 'POST'
            },
            "endpoint.delete": {
                url: 'https://store.2600hz.com/v1/endpoints',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function() {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);

        // Tie to DOM events
        $('#ws-content').delegate('.endpoint.add', 'click', function() {
            winkstart.publish('endpoint.add');
        });

        // Tie to DOM events
        $('#ws-content').delegate('.endpoint.delete', 'click', function(event, target) {
            console.log(event, target);
            winkstart.publish('endpoint.delete');
        });

        $("#ws-content").delegate(".modifyEndpointDefaults", "click", function(){
            modifySRVDefaultsPrompt($(this).dataset(), null);
        });

        // Define areas where numbers can be dropped and what to do when they are dropped
/*        $("#ws-content .drop_area:not(.ui-droppable").live('mousemove', function() {
        }); // End live()*/
    }, // End initialization routine



    /* Define the functions for this module */
    {
        edit_auth: function() {
            var THIS = this;

            var dialogDiv = THIS.templates.edit_auth.tmpl(winkstart.modules['connect'].account).dialog({
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

        add: function() {
            var THIS = this;
            dialogDiv = winkstart.popup(THIS.templates.edit_endpoint.tmpl(winkstart.modules['connect'].account), {
                title: 'Add Endpoint'
            });

            $('.endpoint.edit', dialogDiv).click(function() {
                // Grab data from form
                var form_data = form2object('endpoint');

                $.extend(form_data, {
                    DIDs : {},
                    options : {
                        inbound_format: 'e.164',
                        enabled: true
                    }
                });

                // Build the save function here, for use with or without a billing confirmation screen (coming up)
                winkstart.postJSON('endpoint.put', {
                        data : form_data,
                        account_id : winkstart.modules['connect'].account_id
                    },
                    function(json, xhr) {
                        // Check the response for errors

                        // Close the dialog
                        dialogDiv.dialog('close');

                        winkstart.modules['connect'].account = json.data;
                        winkstart.publish('endpoint.refresh');
                    }
                );

            });
        },

        del: function(srvid) {
            winkstart.deleteJSON("endpoint.delete",
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



        set_endpoint_defaults: function(nsd) {
            winkstart.postJSON("endpoint.setDefaults",

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
        },

        refresh: function() {
            var THIS = this;
            /* Draw our base template into the window */
            THIS.templates.index.tmpl(winkstart.modules['connect'].account).appendTo( $('#my_servers') );
        }
        
    } // End function definitions

    );  // End module
