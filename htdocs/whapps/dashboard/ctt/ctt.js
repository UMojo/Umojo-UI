winkstart.module('dashboard', 'ctt',
    {
        css: [
        'css/ctt.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            ctt: 'tmpl/ctt.html'//,
        //detailRegistration: 'tmpl/detailRegistration.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'ctt.activate' : 'activate'
        },

        formData: {
    
        },

        validation : [
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "cdr.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/cdr',
                contentType: 'application/json',
                verb: 'GET'
            },
            "cdr.read": {
                url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/cdr/{cdr_id}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);
        
        winkstart.publish('subnav.add', {
            whapp: 'dashboard',
            module: this.__module,
            label: 'Call Trace Tool',
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

            this.templates.ctt.tmpl({}).appendTo( $('#ws-content') );
            
            var num_rows = 0;
            
            //winkstart.getJSON('registration.list', {crossbar: true, account_id: MASTER_ACCOUNT_ID}, function(reply) {
            winkstart.getJSON('cdr.list', {
                crossbar: true, 
                account_id: '04152ed2b428922e99ac66f3a71b0215'
            }, function(reply) {
                THIS.setup_table();
                $.each(reply.data, function() {
                    var cdr_id = this.id;
                    
                    

                    //winkstart.getJSON('registration.read',{crossbar: true, account_id: MASTER_ACCOUNT_ID, registration_id: registration_id}, function(reply) {
                    winkstart.getJSON('cdr.read',{
                        crossbar: true, 
                        account_id: '04152ed2b428922e99ac66f3a71b0215', 
                        cdr_id: cdr_id
                    }, function(reply) {
                        if(reply.data == undefined) {
                            return false;
                        }

                        //Dumb hack before crossbar reply is normalized (with lower case and _)
                        if(reply.data['app_name'] != undefined) {
                            reply.data.app_name = reply.data['app_name'];
                        }
                        if(reply.data['app_version'] != undefined) {
                            reply.data.app_version = reply.data['app_version'];
                        }
                        if(reply.data['billing_seconds'] != undefined) {
                            reply.data.billing_seconds = reply.data['billing_seconds'];
                        }
                        if(reply.data['call_direction'] != undefined) {
                            reply.data.call_direction = reply.data['call_direction'];
                        }
                        if(reply.data['call_id'] != undefined) {
                            reply.data.call_id = reply.data['call_id'];
                        }
                        if(reply.data['callee_id_name'] != undefined) {
                            reply.data.callee_id_name = reply.data['callee_id_name'];
                        }
                        if(reply.data['callee_id_number'] != undefined) {
                            reply.data.callee_id_number = reply.data['callee_id_number'];
                        }
                        if(reply.data['caller_id_name'] != undefined) {
                            reply.data.caller_id_name = reply.data['caller_id_name'];
                        }
                        if(reply.data['caller_id_number'] != undefined) {
                            reply.data.caller_id_number = reply.data['caller_id_number'];
                        }
                        if(reply.data['digits_dialed'] != undefined) {
                            reply.data.digits_dialed = reply.data['digits_dialed'];
                        }
                        if(reply.data['duration_seconds'] != undefined) {
                            reply.data.duration_seconds = reply.data['digits_dialed'];
                        }
                        if(reply.data['event_category'] != undefined) {
                            reply.data.event_category = reply.data['event_category'];
                        }
                        if(reply.data['event_name'] != undefined) {
                            reply.data.event_name = reply.data['event_name'];
                        }
                        if(reply.data['from_uri'] != undefined) {
                            reply.data.from_uri = reply.data['from_uri'];
                        }
                        if(reply.data['handling_server_name'] != undefined) {
                            reply.data.handling_server_name = reply.data['handling_server_name'];
                        }
                        if(reply.data['hangup_cause'] != undefined) {
                            reply.data.hangup_cause = reply.data['hangup_cause'];
                        }
                        if(reply.data['id'] != undefined) {
                            reply.data.id = reply.data['id'];
                        }
                        if(reply.data['local_sdp'] != undefined) {
                            reply.data.local_sdp = reply.data['local_sdp'];
                        }
                        if(reply.data['remote_sdp'] != undefined) {
                            reply.data.remote_sdp = reply.data['remote_sdp'];
                        }
                        if(reply.data['ringing_seconds'] != undefined) {
                            reply.data.ringing_seconds = reply.data['ringing_seconds'];
                        }
                        if(reply.data['server_id'] != undefined) {
                            reply.data.server_id = reply.data['server_id'];
                        }
                        if(reply.data['timestamp'] != undefined) {
                            reply.data.timestamp = reply.data['timestamp'];
                        }
                        if(reply.data['to_uri'] != undefined) {
                            reply.data.to_uri = reply.data['to_uri'];
                        }
                        if(reply.data['user_agent'] != undefined) {
                            reply.data.user_agent = reply.data['user_agent'];
                        }
                        
                                
                        console.log(reply.data);
     
                        var stringToDisplay = '';
                        
                        function noData(data){
                            if(data == null){
                                return 'No data';
                            }else{
                                return data;
                            }
                        }

                        winkstart.table.ctt.fnAddData([
                            noData(reply.data.id),
                            noData(reply.data.callee_id_number),
                            noData(reply.data.caller_id_number),
                            noData(reply.data.duration_seconds),
                            noData(reply.data.hangup_cause),
                            'Debug',
                            'Details',
                            'blabla'
                            ]);
                            
                        if(reply.data['related_cdrs'] != null && reply.data['related_cdrs'] != undefined){
                            $.each(reply.data['related_cdrs'], function(index, value) {
                                num_rows = num_rows+1;
                                winkstart.table.ctt.fnAddData([
                                    noData(reply.data.id+' jump :'+index),
                                    noData(value.callee_id_number),
                                    noData(value.caller_id_number),
                                    noData(value.duration_seconds),
                                    noData(value.hangup_cause),
                                    'Debug',
                                    'Details',
                                    'blabla'
                                    ]);
                            });
                        }
                        num_rows = num_rows+1;
                        
                        //Hack to hide pagination if number of rows < 10
                        if(num_rows < 10){
                            $('body').find('.dataTables_paginate').hide();
                        }else{
                             $('body').find('.dataTables_paginate').show();
                        }
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
            {
                'sTitle': 'Call id',
                'sWidth': '20%'
            },

            {
                'sTitle': 'Called to'
            },

            {
                'sTitle': 'Called from'
            },

            {
                'sTitle': 'Call duration'
            },

            {
                'sTitle': 'Hangup cause'
            },
            
            {
                'sTitle': 'Debug'
            },
            
            {
                'sTitle': 'Details'
            },
            
            {
                'sTitle': 'Show other leg'
            },

            //            {
            //                'sTitle': 'Details',
            //                'fnRender': function(obj) {
            //                    console.log(obj);
            //                    var reg_details = obj.aData[obj.iDataColumn];
            //                    return '<a href="#" onClick="alert(\''+reg_details+'\');">Details</a>';
            //                }
            //            }
            ];

            winkstart.table.create('ctt', $('#ctt-grid'), columns);
            $('#ctt-grid_filter input[type=text]').first().focus();
			
            $('.cancel-search').click(function(){
                $('#ctt-grid_filter input[type=text]').val('');
            });
            
            
            
        }
    }
    );