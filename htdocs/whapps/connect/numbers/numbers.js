winkstart.module('connect', 'numbers',
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
        'css/style.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            port_number: 'tmpl/port_number.html',
            failover: 'tmpl/edit_failover.html',
            edit_cnam: 'tmpl/edit_cnam.html',
            service_loc: 'tmpl/service_loc.html',
            add_numbers: 'tmpl/add_numbers.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'numbers.activate' : 'activate',
            'sipservice.refresh' : 'refresh',
            'numbers.get_numbers' : 'get_numbers',         // Get a list of DIDs for this account
            'numbers.find_number' : 'find_number',         // Find new numbers
            'numbers.add_number' : 'add_number_prompt',           // Buy/add a number to this account
            'numbers.post_number': 'post_number',
            'numbers.cancel_number' : 'cancel_number',     // Cancel a number from the account
            'numbers.map_number' : 'map_number',           // Map a number to a whApp or PBX/Server (or unmap/map to nothing)
            'numbers.update_number' : 'update_number',     // Update features / settings for a number
            'numbers.request_port' : 'request_port',       // Request to port a number
            'numbers.port_number' : 'port_number',         // Submit a port request
            'numbers.post_port_number' : 'post_port_number',
            'numbers.toggle_fax' : 'toggle_fax',           // Toggle Fax / T.38 support
            'numbers.configure_cnam' : 'configure_cnam',    // Configure CNAM
            'numbers.post_cnam' : 'post_cnam',
            'numbers.unassign_did' : 'unassign_did'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            /* Search DIDs */
            "sipservice.searchNPANXX": {
                url: 'https://store.2600hz.com/v1/searchNPANXX',
                contentType: 'application/json',
                verb: 'POST'
            },

            "sipservice.searchNPA": {
                url: 'https://store.2600hz.com/v1/searchNPA',
                contentType: 'application/json',
                verb: 'POST'
            },


            "sipservice.searchAvailDIDs": {
                url: 'https://store.2600hz.com/v1/searchAvailDIDs',
                contentType: 'application/json',
                verb: 'POST'
            },


            "sipservice.request_portDID": {
                url: 'https://store.2600hz.com/v1/request_portDID',
                contentType: 'application/json',
                verb: 'POST'
            },



            "sipservice.getLNPData": {
                url: 'https://store.2600hz.com/v1/getLNPData',
                contentType: 'application/json',
                verb: 'POST'
            },



            /* DID Management */
            "sipservice.numbers.addDID": {
                url: 'https://store.2600hz.com/v1/addDID',
                contentType: 'application/json',
                verb: 'POST'
            },

            "sipservice.numbers.addDIDs": {
                url: 'https://store.2600hz.com/v1/addDIDs',
                contentType: 'application/json',
                verb: 'POST'
            },

            "sipservice.numbers.moveDID": {
                url: 'https://store.2600hz.com/v1/moveDID',
                contentType: 'application/json',
                verb: 'POST'
            },

            "sipservice.numbers.delDID": {
                url: 'https://store.2600hz.com/v1/delDID',
                contentType: 'application/json',
                verb: 'POST'
            },

            "sipservice.numbers.setE911": {
                url: 'https://store.2600hz.com/v1/setE911',
                contentType: 'application/json',
                verb: 'POST'
            },

            "sipservice.numbers.setFailOver": {
                url: 'https://store.2600hz.com/v1/setFailOver',
                contentType: 'application/json',
                verb: 'POST'
            },

            "sipservice.numbers.setCID": {
                url: 'https://store.2600hz.com/v1/setCID',
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
        edit_failover: function(number) {
            var THIS = this;

            var dialogDiv = THIS.templates.failover.tmpl({
                failover: number.failover
            }).dialog({
                title: 'Edit Failover',
                position: 'center',
                height: 360,
                width: 520
            });

            winkstart.publish('sipservice.input_css');

            dialogDiv.find('.submit_btn').click(function() {
                console.log(dialogDiv);
                winkstart.postJSON('sipservice.post_failover', {
                    number : dialogDiv.find('#failover_number').val(),
                    parent: number,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });

            });
        },

        post_failover: function(data) {
            var THIS = this;
            console.log(data);
            if(data.number == '') {
                delete  THIS.account.servers[data.parent.serverid].DIDs[data.parent.did].failover;
            } else {
                THIS.account.servers[data.parent.serverid].DIDs[data.parent.did].failover = {
                    e164: data.number
                };
            }

            data.success();
            THIS.update_account();
        /*$.ajax({
                url: "#",
                global: true,
                type: "POST",
                data: ({
                    key: data.key,
                    json: JSON.stringify({
                        number: data.number
                    })
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);
                }
            }
            );*/
        },

        //prompts

        // '<pre>' + JSON.stringify(did) + '</pre>' +
        failoverPrompt: function(did) {
            popup($('#tmpl_fo_prompt').tmpl( did ) , {
                title: 'Set Failover'
            }	);
            $('#fo_button').click(function() {
                setFailOver({
                    did: $('#fo_uri').dataset(),
                    uri: $('#fo_uri').val()
                } );
            });
            $('#fo_uri').blur();
        },

        cidPrompt: function(did) {
            popup($('#tmpl_cid_prompt').tmpl( did ) , {
                title: 'Set CallerID'
            }	);
            $('#cid_prompt_form').submit(function() {
                setCID({
                    did: $('#cid_name').dataset('did'),
                    serverid: $('#cid_name').dataset('serverid'),
                    cid_name: $('#cid_name').val()
                } );
                return false;
            });
        },

        e911Prompt: function(e911) {

            popup($('#tmpl_e911_prompt').tmpl( {
                did: e911.did,
                serverid:e911.serverid,
                e911_info: e911.e911_info || acct.servers[e911.serverid].DIDs[e911.did]['e911_info'] || {}
            }), {
                title: 'Set E911'
            }	);
            $('#e911_update_form').submit(function() {
                setE911({
                    'e911_info': $('#e911_update_form').serializeObject(),
                    'did': $('#e911_button').dataset('did'),
                    'serverid': $('#e911_button').dataset('serverid')
                });
                return false;
            });
        },

        miscPrompt: function() {

        },

        modifySRVDefaultsPrompt: function(info) {
            //	winkstart.log(JSON.stringify({s: info.serverid, theinfo: acct.servers[info.serverid], 'tst': info}));
            popup($('#tmpl_modSRVDefs_prompt').tmpl( {
                s: info.serverid,
                srv: acct.servers[info.serverid],
                'fa':info.fa || {}
            }) , {
                title: 'Modify Server Defaults for '  + acct.servers[info.serverid].server_name
            }	);

            $('#modSRV_button').click(function() {
                setServerDefaults($('#srvDefs_update_form').serializeObject());
            });
        },


        searchDIDsPrompt: function() {
            THIS=this;
            winkstart.popup(THIS.templates.tmpl_searchDIDs_prompt.tmpl(), {
                'title' : 'blah'
            });
        //TODO:  display "Add Credits" if it goes negative
        },

        LNPPrompt: function(args) {
            if (typeof args != 'object') {
                args= new Object();
            }
            popup($('#tmpl_LNP_prompt').tmpl(args));
            $('#lnpRDate').datepicker({
                autoSize: true ,
                dateFormat: 'yy-mm-dd',
                defaultDate: '+7',
                maxDate: '+3m +1w',
                minDate: '+1w'
            });
        },

        LNPPrompt_s2: function(lnp_f) {

            var lnp_did = lnp_f.serializeObject();
            winkstart.getJSON("sipservice.getLNPData",
            {
                key: key,
                json: JSON.stringify(lnp_did)
            },
            function(msg){
                if (typeof msg == 'object' && msg.data) {
                    var trackData=msg.data;
                    if (typeof trackData == "object" && typeof trackData.lnp == "object" ) {
                        popup($('#tmpl_LNP_prompt_s2').tmpl(trackData));
                        createUploader($('#lnp_s2_uploader')[0], '/v1/uploadLNP', {
                            key: key,
                            did:trackData.lnp.did,
                            tracking:trackData.lnp.tracking
                        }, function(a,b,c,d) {
                            display_errs([{
                                msg: "Upload successful.  You'll be notified with updates on the porting status.",
                                type: 'info'
                            }]);
                        });
                    } else {
                        display_errs([{
                            msg: "Could not confirm porting information.  Try again.",
                            type: 'error'
                        }], "Bad Port Tracking Data");
                    }
                }
            }
            );
        },

        updateDIDQtyCosts: function(did, qty) {
            if ( ! isNaN( parseInt( qty ) ) && $('#fd_' + did) ) {
                $('#fd_' + did).dataset('qty',  parseInt( qty ));
                return parseInt( qty );
            }
            return -1;
        },




        refresh: function() {
            var THIS = this;
            /* Draw our base template into the window */
            THIS.templates.index.tmpl(winkstart.modules['connect'].account).appendTo( $('#my_numbers') );
        },

        add_number_prompt: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.add_numbers.tmpl({}).dialog({
                title: 'Add/Search Numbers',
            });

            winkstart.publish('sipservice.input_css');
            $(dialogDiv).find('#sdid_npa').keyup(function() {
                if($('#sdid_npa').val().match('^8(:?00|88|77|66)$')) {
                    $('#sdid_nxx').hide('slow');
                } else {
                    $('#sdid_nxx').show('slow');
                }
            });

            $(dialogDiv).find('.ctr_btn').click(function() {
                winkstart.publish('sipservice.post_number', {
                    callback : args.callback,
                    number : 4159086655,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });

            });
        },


        post_number: function(data) {
            $.ajax({
                url: "#",
                global: true,
                type: "POST",
                data: ({
                    key: data.key,
                    json: JSON.stringify({
                        number: data.number
                    })
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);
                }
            }
            );
        },

        port_number: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.port_number.tmpl({}).dialog({
                title: 'Edit Port Number',
                width: 650,
                height: 750,
                position: 'center'
            });

            $(".datepicker").datepicker();
            winkstart.publish('sipservice.input_css');

            $(dialogDiv).find('.submit_btn').click(function() {
                winkstart.publish('sipservice.post_port_number', {
                    number : 4159086655,
                    address: 'Here or there',
                    someOtherData: 'dazdaz',
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });

            });
        },

        post_port_number: function(data) {
            $.ajax({
                url: "#",
                global: true,
                type: "POST",
                data: ({
                    key: data.key,
                    json: JSON.stringify({
                        number: data.number,
                        address: data.address,
                        someOtherData: data.someOtherData
                    })
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);
                }
            }
            );
        },


        configure_cnam: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.edit_cnam.tmpl({}).dialog({
                title: 'Edit Caller Id',
                width: 580,
                height: 250,
                position: 'center'
            });

            winkstart.publish('sipservice.input_css');

            $(dialogDiv).find('.submit_btn').click(function() {
                winkstart.publish('sipservice.post_cnam', {
                    caller_id : 500,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });

            });

        },

        post_cnam: function(data) {
            winkstart.postJSON('CREATE_CNAM_ONLY...', {
                key: data.key,
                json: JSON.stringify({
                    caller_id: data.caller_id
                }, function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);
                }),
            });
        },

        /******************
         * DID Management *
         ******************/
        moveDID: function(did, srv) {
            var THIS = this;
            srv = srv.serverid;
            did = did.did;

            winkstart.log('DID ', did, ' srv', srv);

            // Is this an unassigned DID?
            if (THIS.account.DIDs_Unassigned && THIS.account.DIDs_Unassigned[did]) {
                // Yes! Assign it
                THIS.account.servers[srv].DIDs[did] = THIS.account.DIDs_Unassigned[did];

                // Remove old DID
                delete(THIS.account.DIDs_Unassigned[did]);
            } else {
                // Nope, already mapped. Need to move it
                var did_data = {};

                // Look for this DID on any other server. If it's there, remove it
                $.each(THIS.account.servers, function(k, v) {
                    if (THIS.account.servers[k].DIDs[did]) {
                        did_data = THIS.account.servers[k].DIDs[did];

                        // Remove from the old server
                        delete(THIS.account.servers[k].DIDs[did]);
                    }
                });

                // Add whatever we found to the new server
                THIS.account.servers[srv].DIDs[did] = did_data;
            }
        },
        unassign_did: function(data) {
            var THIS = this;
            var did = data.did;
            var serverid = data.serverid;
            delete(THIS.account.servers[serverid].DIDs[did]);
            if(THIS.account.DIDs_Unassigned == undefined) {
                THIS.account.DIDs_Unassigned = {};
            }
            THIS.account.DIDs_Unassigned[did] = {};
            THIS.update_account();
        },

        delDID: function(did) {
            var THIS = this;

            delete(THIS.account.DIDs_Unassigned[did.did]);
        },

        addDID: function(dids) {


            winkstart.postJSON('sipservice.numbers.addDID',
            {
                key: key,
                json: JSON.stringify({
                    DID:did
                })
            },
            function(msg){
                if (msg && msg.errs && msg.errs[0]) {
                    display_errs(msg.errs, "Error");
                } else {
                    msgAlert('Not enough credits to add ' + did);
                    return false;
                }
                redraw(msg.data);
            }
            );
        },


        addDIDs: function(dids) {
            var addedDIDs;
            winkstart.postJSON('sipservice.numbers.addDIDs',
            {
                key: key,
                json: JSON.stringify({
                    DIDs:dids
                })
            },
            function(msg){
                addedDIDs=msg; // I do not know why... (2011-07-15)
                if (typeof msg =="object") {
                    $("body").trigger('addDIDs', msg.data);
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }

                    if (typeof msg.data == 'object' && typeof msg.data.acct == 'object') {
                        redraw(msg.data.acct); // note more than just acct is returned
                    }
                }
            }
            );


            return addedDIDs;
        },

        searchAvailDIDs: function(NPA, NXX) {
            // must use toString()
            if (NPA.toString().match('^[2-9][0-8][0-9]$')) {
                if (NPA.toString().match('^8(:?00|88|77|66|55)$')) {
                    $('#sad_LoadingTime').slideDown();
                    winkstart.postJSON('sipservice.searchNPA',
                    {
                        key: key,
                        json: JSON.stringify({
                            NPA: NPA
                        })
                    }, function(jdata) {
                        $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(jdata));
                        $('#sad_LoadingTime').hide();
                    });

                } else if (NXX && NXX.toString().match('^[2-9][0-9][0-9]$')) {
                    winkstart.postJSON('sipservice.searchNPANXX',
                    {
                        key: key,
                        json: JSON.stringify({
                            NPA: NPA,
                            NXX: NXX
                        })
                    }, function(jdata) {
                        $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(jdata));
                    });

                } else 	if (NPA.toString().match('^[2-9][0-8][0-9]$')) {
                    $('#sad_LoadingTime').slideDown();
                    winkstart.postJSON('sipservice.searchNPA',
                    {
                        key: key,
                        json: JSON.stringify({
                            NPA: NPA
                        })
                    }, function(jdata) {
                        $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(jdata));
                        $('#sad_LoadingTime').hide();
                    });

                } else {
                    return false;
                }

            }
            else {
                return false;
            }
        },


        purchaseDIDs: function(DIDs) {
            var rCost= 0;
            var oCost= 0;
            var buyThese = new Array();
            $.each(DIDs, function(index, elm) {
                rCost+=$(elm).dataset('recurringCost') *1;
                oCost+=$(elm).dataset('oneTimeCost') * 1;
                buyThese.push( $(elm).dataset());
            //			winkstart.log($(elm).dataset('did'));
            });


            var enoughCredits=checkCredits( oCost );
            var purchasedDIDs=new Array();
            if (enoughCredits) {
                purchasedDIDs=addDIDs(buyThese);

            } else {
                msgAlert('Not enough credits to add these DIDs');
                return false;
            }

            return purchasedDIDs;
        },

        setE911: function(e911) {
            winkstart.postJSON("sipservice.numbers.setE911",
            {
                key: key,
                json: JSON.stringify({
                    "e911_info": e911.e911_info,
                    "did":e911.did,
                    "serverid":e911.serverid
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

        setFailOver: function(info) {
            winkstart.postJSON("sipservice.numbers.setFailOver",
            {
                key: key,
                json: JSON.stringify({
                    did:info.did.did,
                    serverid:info.did.serverid,
                    failover: info.uri
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

        setCID: function(info){
            winkstart.postJSON("sipservice.numbers.setCID",
            {
                key: key,
                json: JSON.stringify(info)
            },
            function(msg){
                if (msg && msg.errs && msg.errs[0]) {
                    display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                }
                redraw(msg.data);
            }
            );
        },

        LNP_s1: function(frm) {
            winkstart.putJSON("sipservice.request_portDID",
            {
                key: key,
                json: JSON.stringify(frm.serializeObject())
            },
            function(msg){
                if (msg && msg.errs && msg.errs[0]) {
                    display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                }
                else {
                    LNPPrompt_s2(msg.data);
                }
            }
            );

        },


        portDID: function() {

        },


        not_used_anymore_searchNPA: function(nbr, cb) {
            //			$.getJSON('/api/searchNPA', function(data) {
            //				$('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(data));			});
            winkstart.getJSON("sipservice.searchNPA",
            {
                key: key,
                json: JSON.stringify(nbr)
            },
            function(msg){
                redraw(msg.data);
            }
            );
        },


        not_used_anymore_searchNPANXX: function(nbr, cb) {
            $.getJSON('/api/searchNPANXX', function(data) {
                $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(data));
            });
            $.ajax({
                url: "/api/searchNPANXX",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify(nbr)
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    redraw(msg.data);

                }
            }
            );

        },

        search_numbers_list: function (elm, list) {

            var filter = $(elm).val();
            if(filter) {
                // this finds all links in a list that contain the input,
                // and hide the ones not containing the input while showing the ones that do
                $(list).find("span.number:not(:Contains(" + filter + "))").parent().slideUp();
                $(list).find("span.number:Contains(" + filter + ")").parent().slideDown();
            } else {
                $(list).find("div").slideDown();
            }
            return false;
        },

        listDIDs: function(servers) {
            var THIS = this;

            // Combine all DIDs from all servers
            var DIDs = {};

            $(servers.servers).each(function(k, v) {
                winkstart.log(v);
                $.extend(DIDs, v.DIDs);
                winkstart.log(DIDs);
            });

            winkstart.log(DIDs);

            return DIDs;
        },

        refresh_dids: function(account) {
            var THIS = this;
            var tmp = account;

            tmp.unassigned = 0;
            tmp.totalDIDs = 0;
            if (tmp.DIDs_Unassigned) {
                $.each(tmp.DIDs_Unassigned, function() {
                    tmp.unassigned++;
                    tmp.totalDIDs++;
                });
            };

            $.each(tmp.servers, function(k, v) {
                if (v.DIDs) {
                    $.each(v.DIDs, function(i, j) {
                        tmp.totalDIDs++;
                    });
                }
            });

            winkstart.log('Refreshing DIDs...');
            $('#my_numbers').empty();
            THIS.templates.main_dids.tmpl(tmp).appendTo ( $('#my_numbers') );

            // Make numbers draggable
            $("#ws-content .number").draggable(
            {
                cursor: 'pointer',
                opacity: 0.35 ,
                revert: true,
                scope: 'moveDID',
                appendTo: 'body',
                helper: 'clone',
                revert : 'invalid'

            }
            );

            $("#ws-content #control_area").delegate(".cancelDID", "click", function(){
                THIS.delDID($(this).dataset(), null);
                setTimeout("winkstart.publish('sipservice.update_account')", 1);
            });
        },

        activate: function(data) {
        }
    } // End function definitions

    );  // End module
