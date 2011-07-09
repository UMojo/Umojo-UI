winkstart.module('voip', 'registration',
    {
        css: [
            'css/registration.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            registration: 'tmpl/registration.html'//,
            //detailRegistration: 'tmpl/detailRegistration.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'registration.activate' : 'activate'
        },

        formData: {
    
        },

        validation : [
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "registration.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/registrations',
                contentType: 'application/json',
                verb: 'GET'
            },
            "registration.read": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/registrations/{registration_id}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Registrations',
            icon: 'registration'
        });
    },

    {
         /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            
            winkstart.loadFormHelper('forms');

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);
        
            this.templates.registration.tmpl({}).appendTo( $('#ws-content') );
            
            //winkstart.getJSON('registration.list', {crossbar: true, account_id: MASTER_ACCOUNT_ID}, function(reply) {
            winkstart.getJSON('registration.list', {crossbar: true, account_id: '04152ed2b428922e99ac66f3a71b0215'}, function(reply) {
                THIS.setup_table();
                $.each(reply.data, function() {
                    var registration_id = this.id;

                    //winkstart.getJSON('registration.read',{crossbar: true, account_id: MASTER_ACCOUNT_ID, registration_id: registration_id}, function(reply) {
                    winkstart.getJSON('registration.read',{crossbar: true, account_id: '04152ed2b428922e99ac66f3a71b0215', registration_id: registration_id}, function(reply) {
                        if(reply.data == undefined) {
                            return false;
                        }

                        //Dumb hack before crossbar reply is normalized (with lower case and _)
                        if(reply.data['App-Name'] != undefined) {
                            reply.data.app_name = reply.data['App-Name'];
                        }
                        if(reply.data['App-Version'] != undefined) {
                            reply.data.app_version = reply.data['App-Version'];
                        }
                        if(reply.data['Call-ID'] != undefined) {
                            reply.data.call_id = reply.data['Call-ID'];
                        }
                        if(reply.data['Contact'] != undefined) {
                            reply.data.contact = reply.data['Contact'];
                        }
                        if(reply.data['Event-Category'] != undefined) {
                            reply.data.event_category = reply.data['Event-Category'];
                        }
                        if(reply.data['Event-Name'] != undefined) {
                            reply.data.event_name = reply.data['Event-Name'];
                        }
                        if(reply.data['Event-Timestamp'] != undefined) {
                            reply.data.event_timestamp = reply.data['Event-Timestamp'];
                        }
                        if(reply.data['Expires'] != undefined) {
                            reply.data.expires = reply.data['Expires'];
                        }
                        if(reply.data['FreeSWITCH-Hostname'] != undefined) {
                            reply.data.freeswitch_hostname = reply.data['FreeSWITCH-Hostname'];
                        }
                        if(reply.data['From-Host'] != undefined) {
                            reply.data.from_host = reply.data['From-Host'];
                        }
                        if(reply.data['From-User'] != undefined) {
                            reply.data.from_user = reply.data['From-User'];
                        }
                        if(reply.data['Network-IP'] != undefined) {
                            reply.data.network_ip = reply.data['Network-IP'];
                        }
                        if(reply.data['Network-Port'] != undefined) {
                            reply.data.network_port = reply.data['Network-Port'];
                        }
                        if(reply.data['Presence-Hosts'] != undefined) {
                            reply.data.presence_hosts = reply.data['Presence-Hosts'];
                        }
                        if(reply.data['Profile-Name'] != undefined) {
                            reply.data.profile_name = reply.data['Profile-Name'];
                        }
                        if(reply.data['RPid'] != undefined) {
                            reply.data.rpid = reply.data['RPid'];
                        }
                        if(reply.data['Realm'] != undefined) {
                            reply.data.realm = reply.data['Realm'];
                        }
                        if(reply.data['Server-ID'] != undefined) {
                            reply.data.server_id = reply.data['Server-ID'];
                        }
                        if(reply.data['Status'] != undefined) {
                            reply.data.status = reply.data['Status'];
                        }
                        if(reply.data['To-Host'] != undefined) {
                            reply.data.to_host = reply.data['To-Host'];
                        }
                        if(reply.data['To-User'] != undefined) {
                            reply.data.to_user = reply.data['To-User'];
                        }
                        if(reply.data['User-Agent'] != undefined) {
                            reply.data.user_agent = reply.data['User-Agent'];
                        }
                        if(reply.data['Username'] != undefined) {
                            reply.data.username = reply.data['Username'];
                        }                       

                        var friendlyDate = new Date((reply.data.event_timestamp - 62167219200)*1000);
                        var humanDate = friendlyDate.toLocaleDateString();
                        var humanTime = friendlyDate.toLocaleTimeString(); 
                                
                        console.log(reply.data);
     
                        var stringToDisplay = 'Details of Registration\\n';
                        stringToDisplay += '\\nid: ' + reply.data.id; 
                        stringToDisplay += '\\nApp-Name: ' + reply.data.app_name;
                        stringToDisplay += '\\nApp-Version: ' + reply.data.app_version;
                        stringToDisplay += '\\nCall-ID: ' + reply.data.call_id;
                        //stringToDisplay += '\\nContact: ' + reply.data.contact;
                        stringToDisplay += '\\nEvent-Category: ' + reply.data.event_category;
                        stringToDisplay += '\\nEvent-Name: ' + reply.data.event_name;
                        stringToDisplay += '\\nExpires: ' + reply.data.expires;
                        stringToDisplay += '\\nFreeSWITCH-Hostname: ' + reply.data.freeswitch_hostname;
                        stringToDisplay += '\\nFrom-Host: ' + reply.data.from_host;
                        stringToDisplay += '\\nFrom-User: ' + reply.data.from_user;
                        stringToDisplay += '\\nNetwork-IP: ' + reply.data.network_ip;
                        stringToDisplay += '\\nNetwork-Port: ' + reply.data.network_port;
                        stringToDisplay += '\\nPresence-Hosts: ' + reply.data.presence_hosts;
                        stringToDisplay += '\\nProfile-Name: ' + reply.data.profile_name;
                        stringToDisplay += '\\nRPid: ' + reply.data.rpid;
                        stringToDisplay += '\\nRealm: ' + reply.data.realm;
                        stringToDisplay += '\\nServer-ID: ' + reply.data.server_id;
                        stringToDisplay += '\\nStatus: ' + reply.data.status;
                        stringToDisplay += '\\nTo-Host: ' + reply.data.to_host;
                        stringToDisplay += '\\nTo-User: ' + reply.data.to_user;
                        stringToDisplay += '\\nUser-Agent: ' + reply.data.user_agent;
                        stringToDisplay += '\\nUsername: ' + reply.data.username;
                        stringToDisplay += '\\nDate: ' + humanDate;
                        stringToDisplay += '\\nTime: ' + humanTime;

                        winkstart.table.registration.fnAddData([reply.data.username, reply.data.network_ip, reply.data.network_port, humanDate, humanTime, stringToDisplay]);
                    });
                });
            });

            winkstart.publish('layout.updateLoadedModule', {
                label: 'Voicemail Boxes Management',
                module: this.__module
            });

        },
        setup_table: function() {
        var THIS = this;
        var columns = [
            { 'sTitle': 'Username' },
            { 'sTitle': 'IP' },
            { 'sTitle': 'Port' },
            { 'sTitle': 'Date' },
            { 'sTitle': 'Time' },
            { 'sTitle': 'Details',
                  'fnRender': function(obj) {
                  console.log(obj);
                  var reg_details = obj.aData[obj.iDataColumn];
                  return '<a href="#" onClick="alert(\''+reg_details+'\');">Details</a>';
              }}
        ];
        
        winkstart.table.create('registration', $('#registration-grid'), columns);
    },
    }
);
