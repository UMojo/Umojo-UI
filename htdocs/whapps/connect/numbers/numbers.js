/**
 * This module is for managing DIDs assigned to an account. Once loaded, the following DOM areas will be managed:
 *
 * Content Areas:
 *   #numbers.assigned_numbers - A list of all numbers currently assigned numbers for this account (mapped & non-mapped)
 *   #numbers.assigned_numbers_count - A count of how many numbers are assigned to this account total (mapped & non-mapped)
 *   #numbers.active_numbers - A list of all numbers currently mapped/routed on this account
 *   #numbers.active_numbers_count - A count of how many numbers are assigned to this account but not mapped/routed
 *   #numbers.unused_numbers - A list of all numbers currently unused/available for mapping
 *   #numbers.unused_numbers_count - A count of how many numbers are currently unused/available for mapping
 *
 * 
 */

winkstart.module('connect', 'numbers',
    /* Start module resource definitions */
    {
        /* What HTML templates will we be using? */
        templates: {
            port_number: 'tmpl/port_number.html',
            cancel_number: 'tmpl/cancel_number.html',
            edit_failover: 'tmpl/edit_failover.html',
            edit_cnam: 'tmpl/edit_cnam.html',
            edit_e911: 'tmpl/edit_e911.html',
            add_numbers: 'tmpl/add_numbers.html',
            search_dids_results: 'tmpl/search_dids_results.html'
            
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'numbers.get_numbers' : 'get_numbers',         // Get a list of DIDs for this account
            'numbers.find_number' : 'find_number',         // Find new numbers
            'numbers.add_number_prompt' : 'add_number_prompt',           // Buy/add a number to this account
            'numbers.post_number': 'post_number',

            'numbers.cancel_number' : 'cancel_number',     // Cancel a number from the account (prompts for confirmation)
            'numbers.delete_number' : 'delete_number',     // Immediately delete & cancel a number from account (no prompt)
            'numbers.map_number' : 'map_number',           // Map a number to a whApp or PBX/Server (or unmap/map to nothing)
            'numbers.update_number' : 'update_number',     // Update features / settings for a number
            'numbers.toggle_fax' : 'toggle_fax',           // Toggle Fax / T.38 support
            'numbers.edit_cnam' : 'edit_cnam',             // Configure CNAM
            'numbers.update_cnam' : 'update_cnam',         // Update CNAM
            'numbers.edit_e911' : 'edit_e911',             // Configure e911
            'numbers.update_e911' : 'update_e911',         // Update e911
            'numbers.edit_failover' : 'edit_failover',     // Configure Failover
            'numbers.update_failover' : 'update_failover', // Update Failover
            'numbers.unassign' : 'unassign',

            'numbers.request_port' : 'request_port',       // Request to port a number
            'numbers.port_number' : 'port_number',         // Submit a port request
            'numbers.post_port_number' : 'post_port_number',

            'numbers.search_npa_nxx': 'search_npa_nxx'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            /* Search DIDs */
            "numbers.search_npa_nxx": {
                url: 'https://store.2600hz.com/v1/{account_id}/searchNPANXX',
                contentType: 'application/json',
                verb: 'POST'
            },

            "numbers.search_npa": {
                url: 'https://store.2600hz.com/v1/{account_id}/searchNPA',
                contentType: 'application/json',
                verb: 'POST'
            },

            "numbers.port": {
                url: 'https://store.2600hz.com/v1/{account_id}/request_portDID',
                contentType: 'application/json',
                verb: 'POST'
            },

            "numbers.lnp": {
                url: 'https://store.2600hz.com/v1/{account_id}/getLNPData',
                contentType: 'application/json',
                verb: 'POST'
            },



            /* DID Management */
            "numbers.add": {
                url: 'https://store.2600hz.com/v1/{account_id}/addDIDs',
                contentType: 'application/json',
                verb: 'POST'
            },

            "numbers.map_number": {
                url: 'https://store.2600hz.com/v1/{account_id}/moveDID',
                contentType: 'application/json',
                verb: 'POST'
            },

            "numbers.delete_number": {
                url: 'https://store.2600hz.com/v1/{account_id}/delDID',
                contentType: 'application/json',
                verb: 'POST'
            },

            "numbers.update_e911": {
                url: 'https://store.2600hz.com/v1/{account_id}/e911',
                contentType: 'application/json',
                verb: 'POST'
            },

            "numbers.update_failover": {
                url: 'https://store.2600hz.com/v1/{account_id}/failover',
                contentType: 'application/json',
                verb: 'POST'
            },

            "numbers.update_cnam": {
                url: 'https://store.2600hz.com/v1/{account_id}/cnam',
                contentType: 'application/json',
                verb: 'POST'
            }

        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function() {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.__whapp, this.config.resources);

        // Number manipulation from carrier
        $('#ws-content').delegate('.numbers.add', 'click', function() {
            winkstart.publish('numbers.add_number_prompt');
        });

        $('#ws-content').delegate('.numbers.import', 'click', function() {
            winkstart.publish('numbers.port_number');
        });


        // Existing number manipulation
        $('#ws-content').delegate('.numbers .unassign', 'click', function() {
            winkstart.publish('numbers.unassign', $(this).dataset());
        });

        $('#ws-content').delegate(".numbers .edit_failover", "click", function(){
            winkstart.publish('numbers.edit_failover', $(this).dataset());
        });

        $('#ws-content').delegate(".numbers .edit_cnam", "click", function(){
            winkstart.publish('numbers.edit_cnam', $(this).dataset());
        });

        $('#ws-content').delegate(".numbers .edit_e911", "click", function(){
            winkstart.publish('numbers.edit_e911', $(this).dataset());
        });

        $('#ws-content').delegate(".numbers .edit_misc", "click", function(){
            winkstart.publish('numbers.edit_misc', $(this).dataset());
        });

        $('#ws-content').delegate(".numbers .check_port", 'click', function(){
            winkstart.publish('numbers.check_port', $(this).dataset());
        });

        $('#ws-content').delegate(".numbers .cancel_number", 'click', function(){
            winkstart.publish('numbers.cancel_number', $(this).dataset());
        });


        // Make numbers draggable
        $('#ws-content .number:not(.ui-draggable)').live('mousemove',function(){
            $(this).draggable({
                cursor: 'pointer',
                opacity: 0.35,
                revert: 'invalid',
                scope: 'moveDID',
                appendTo: 'body',
                helper: 'clone',
                zIndex: 9999
            });
        });

    }, // End initialization routine



    /* Define the functions for this module */
    {
        edit_failover: function(args) {
            var dialogDiv = winkstart.dialog(this.templates.edit_failover.tmpl(args), {
                title: 'Edit Failover'
            });

            $('.submit_btn', dialogDiv).click(function() {
                var data = $.extend({}, args, form2object('failover'));     // Grab data from failover form

                // TODO: Validate data here

                // Request an update & provide a callback for success or failure
                winkstart.publish('numbers.update_failover', {
                    data : data,
                    success : function() {
                        // On success, close the dialog.
                        dialogDiv.dialog('close');

                        if (args.success) {
                            args.success(args);
                        }
                    },
                    error : function() {
                        alert('Failed to save.');
                    }
                })
            });
        },

        update_failover: function(args) {
            winkstart.postJSON('numbers.update_failover',
                {
                    data: args.data,
                    account_id : winkstart.apps['connect'].account_id
                },
                function(json) {
                    if (json.errs && json.errs[0] && json.errs[0].type == 'info') {
                        winkstart.apps['connect'].account = json.data;
                        winkstart.publish('numbers.refresh');
                        if (args.success)
                            args.success();
                    } else if (json.errs && json.errs[0] && json.errs[0].type == 'error') {
                        alert(json.errs[0].msg);
                    } else {
                        // TODO: Better process XHR here
                        alert('We had trouble talking to the server. Are you sure you\'re online?');
                    }
                }
            );
        },


        edit_cnam: function(args) {
            var dialogDiv = winkstart.dialog(this.templates.edit_cnam.tmpl(args), {
                title: 'Edit Caller ID Name'
            });

            $('.submit_btn', dialogDiv).click(function() {
                var data = $.extend({}, args, form2object('cnam'));     // Grab data from cnam form

                // TODO: Validate data here

                // Request an update & provide a callback for success or failure
                winkstart.publish('numbers.update_cnam', {
                    data : data,
                    success : function() {
                        // On success, close the dialog.
                        dialogDiv.dialog('close');

                        if (args.success) {
                            args.success(args);
                        }
                    },
                    error : function() {
                        alert('Failed to save.');
                    }
                })
            });
        },

        update_cnam: function(args) {
            winkstart.postJSON('numbers.update_cnam',
                {
                    data: args.data,
                    account_id : winkstart.apps['connect'].account_id
                },
                function(json) {
                    if (json.errs && json.errs[0] && json.errs[0].type == 'info') {
                        winkstart.apps['connect'].account = json.data;
                        winkstart.publish('numbers.refresh');
                        if (args.success)
                            args.success();
                    } else if (json.errs && json.errs[0] && json.errs[0].type == 'error') {
                        alert(json.errs[0].msg);
                    } else {
                        // TODO: Better process XHR here
                        alert('We had trouble talking to the server. Are you sure you\'re online?');
                    }
                }
            );
        },


        edit_e911: function(args) {
            var dialogDiv = winkstart.dialog(this.templates.edit_e911.tmpl(args), {
                title: 'Edit Emergency 911 Location'
            });

            $('.submit_btn', dialogDiv).click(function() {
                var data = $.extend({}, args, form2object('e911'));     // Grab data from e911 form

                // TODO: Validate data here

                // Request an update & provide a callback for success or failure
                winkstart.publish('numbers.update_e911', {
                    success : function() {
                        // On success, close the dialog.
                        dialogDiv.dialog('close');

                        if (args.success) {
                            args.success(args);
                        }
                    },
                    error : function() {
                        alert('Failed to save.');
                    }
                })
            });
        },

        update_e911: function(args) {
            winkstart.postJSON('numbers.update_e911',
                {
                    data: args.data,
                    account_id : winkstart.apps['connect'].account_id
                },
                function(json) {
                    if (json.errs && json.errs[0] && json.errs[0].type == 'info') {
                        winkstart.apps['connect'].account = json.data;
                        winkstart.publish('numbers.refresh');
                        if (args.success)
                            args.success();
                    } else if (json.errs && json.errs[0] && json.errs[0].type == 'error') {
                        alert(json.errs[0].msg);
                    } else {
                        // TODO: Better process XHR here
                        alert('We had trouble talking to the server. Are you sure you\'re online?');
                    }
                }
            );
        },


        edit_fax: function(args) {
            var dialogDiv = winkstart.dialog(this.templates.edit_fax.tmpl(args), {
                title: 'Edit Fax Settings'
            });

            $('.submit_btn', dialogDiv).click(function() {
                var data = $.extend({}, args, form2object('#fax'));     // Grab data from cnam form

                // TODO: Validate data here

                // Request an update & provide a callback for success or failure
                winkstart.publish('numbers.update_fax', {
                    data : data,
                    success : function() {
                        // On success, close the dialog.
                        dialogDiv.dialog('close');

                        if (args.success) {
                            args.success(args);
                        }
                    },
                    error : function() {
                        alert('Failed to save.');
                    }
                })
            });
        },

        update_fax: function(args) {
            winkstart.postJSON('numbers.update_fax',
                {
                    data: args.data,
                    account_id : winkstart.apps['connect'].account_id
                },
                function(json) {
                    if (json.errs && json.errs[0] && json.errs[0].type == 'info') {
                        winkstart.apps['connect'].account = json.data;
                        winkstart.publish('numbers.refresh');
                        if (args.success)
                            args.success();
                    } else if (json.errs && json.errs[0] && json.errs[0].type == 'error') {
                        alert(json.errs[0].msg);
                    } else {
                        // TODO: Better process XHR here
                        alert('We had trouble talking to the server. Are you sure you\'re online?');
                    }
                }
            );
        },


        cancel_number: function(args) {
            var dialogDiv = winkstart.dialog(this.templates.cancel_number.tmpl(args), {
                title: 'Cancel Number'
            });

            $('.submit_btn', dialogDiv).click(function() {
                // TODO: Validate data here

                // Request an update & provide a callback for success or failure
                winkstart.publish('numbers.delete_number', {
                    data : args,
                    success : function() {
                        // On success, close the dialog.
                        dialogDiv.dialog('close');

                        if (args.success) {
                            args.success(args);
                        }
                    },
                    error : function() {
                        alert('Failed to save.');
                    }
                });
                dialogDiv.dialog('close');
            });
        },

        delete_number: function(args) {
            winkstart.postJSON('numbers.delete_number',
                {
                    data: args.data,
                    account_id : winkstart.apps['connect'].account_id
                },
                function(json) {
                    if (json.errs && json.errs[0] && json.errs[0].type == 'info') {
                        winkstart.apps['connect'].account = json.data;
                        winkstart.publish('numbers.refresh');
                        if (args.success)
                            args.success();
                    } else if (json.errs && json.errs[0] && json.errs[0].type == 'error') {
                        alert(json.errs[0].msg);
                    } else {
                        // TODO: Better process XHR here
                        //alert('We had trouble talking to the server. Are you sure you\'re online?');
                        winkstart.apps['connect'].account = json.data;
                        winkstart.publish('numbers.refresh');
                    }
                }
            );
        },


        defaults: function(info) {
            //	winkstart.log(JSON.stringify({s: info.serverid, theinfo: acct.servers[info.serverid], 'tst': info}));
            winkstart.dialog($('#tmpl_modSRVDefs_prompt').tmpl( {
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




        /*********************
         * Porting Functions *
         *********************/
        LNPPrompt: function(args) {
            if (typeof args != 'object') {
                args= new Object();
            }
            winkstart.dialog($('#tmpl_LNP_prompt').tmpl(args));
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
            winkstart.getJSON("getLNPData",
            {
                account_id: winkstart.apps['connect'].account_id,
                data: lnp_did
            },
            function(msg){
                if (typeof msg == 'object' && msg.data) {
                    var trackData=msg.data;
                    if (typeof trackData == "object" && typeof trackData.lnp == "object" ) {
                        winkstart.dialog($('#tmpl_LNP_prompt_s2').tmpl(trackData));
                        createUploader($('#lnp_s2_uploader')[0], '/v1/uploadLNP', {
                            account_id: winkstart.apps['connect'].account_id,
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
                    account_id: winkstart.apps['connect'].account_id,
                    data: {
                        number: data.number,
                        address: data.address,
                        someOtherData: data.someOtherData
                    }
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




        /******************
         * DID Purchasing *
         ******************/
        // This function takes args.data with a { NPA : ###, NXX : ### } as arguments and searches for available phone numbers.
        //
        // OTHER THEN A PLEASE WAIT BOX, NO "PAINTING" OF RESULTS COMES FROM THIS FUNCTION.
        // All results will be passed to args.callback(results) for display/processing
        search_npa_nxx: function(args) {

            NPA = args.data.NPA;
            NXX = args.data.NXX;

            // must use toString()
            if (NPA.toString().match('^[2-9][0-8][0-9]$')) {
                if (NPA.toString().match('^8(:?00|88|77|66|55)$')) {
                    $('#sad_LoadingTime').slideDown();
                    winkstart.postJSON('numbers.search_npa',
                     {
                    	account_id: winkstart.apps['connect'].account_id,
	                    data:args.data
	                   },
                    function(jdata) {
                        // Remove please wait
                        $('#sad_LoadingTime').hide();

                        // Send results to the callback
                        args.callback(jdata);
                    });

                } else if (NXX && NXX.toString().match('^[2-9][0-9][0-9]$')) {
                    $('#sad_LoadingTime').slideDown();
                    winkstart.postJSON('numbers.search_npa_nxx',
                     {
                     account_id: winkstart.apps['connect'].account_id,
                     data:args.data},
                    function(jdata) {
                        // Remove please wait
                        $('#sad_LoadingTime').hide();

                        // Send results to the callback
                        args.callback(jdata);
                    });

                } else 	if (NPA.toString().match('^[2-9][0-8][0-9]$')) {
                    $('#sad_LoadingTime').slideDown();
                    winkstart.postJSON('numbers.search_npa',
                     {
                    	account_id: winkstart.apps['connect'].account_id,
                     data:args.data},
                    function(jdata) {
                        // Remove please wait
                        $('#sad_LoadingTime').hide();

                        // Send results to the callback
                        args.callback(jdata);
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
            var THIS = this;
            var rCost= 0;
            var oCost= 0;
            var buyThese = new Array();
            $.each(DIDs, function(index, elm) {
                rCost+=$(elm).dataset('recurringCost') *1;
                oCost+=$(elm).dataset('oneTimeCost') * 1;
                buyThese.push( $(elm).dataset());
            //			winkstart.log($(elm).dataset('did'));
            });

            //TODO: check credits
            //var enoughCredits=checkCredits( oCost );
            winkstart.getJSON('credits.get', {crossbar: true, account_id: winkstart.apps['connect'].account_id}, function(json, xhr) {
                var enoughCredits = oCost < json.data.prepay;
                var purchasedDIDs=new Array();
                if (enoughCredits) {
                    //purchasedDIDs=addIDs(buyThese);
                    purchasedDIDs=THIS.add(buyThese);

                } else {
                    alert('Not enough credits to add these DIDs');
                    return false;
                }

                return purchasedDIDs;
            });
            /*var enoughCredits = true;
            var purchasedDIDs=new Array();
            if (enoughCredits) {
                //purchasedDIDs=addIDs(buyThese);
                purchasedDIDs=THIS.add(buyThese);

            } else {
                msgAlert('Not enough credits to add these DIDs');
                return false;
            }

            return purchasedDIDs;*/
        },

        searchDIDsPrompt: function() {
            THIS=this;
            winkstart.dialog(THIS.templates.tmpl_searchDIDs_prompt.tmpl(), {
                'title' : 'blah'
            });
        //TODO:  display "Add Credits" if it goes negative
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


        add_number_prompt: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.add_numbers.tmpl({}).dialog({
                title: 'Add/Search Numbers',
                width : '600px'
            });

            winkstart.publish('sipservice.input_css');
            $(dialogDiv).find('#sdid_npa').keyup(function() {
                if($('#sdid_npa').val().match('^8(:?00|88|77|66)$')) {
                    $('#sdid_nxx').hide('slow');
                } else {
                    $('#sdid_nxx').show('slow');
                }
                });



                $('#search_numbers_button', dialogDiv).click(function() {
                    var NPA = $('#sdid_npa', dialogDiv).val();
                    var NXX = $('#sdid_nxx', dialogDiv).val();
                    winkstart.publish('numbers.search_npa_nxx',
                    	{
	                    	account_id: winkstart.apps['connect'].account_id,
                        	data : {'NPA': NPA, 'NXX': NXX},
	                        callback: function(results) {
	                            winkstart.log('Found these #s:', results);

                                // Draw results on screen
                                $('#foundDIDList', dialogDiv).html(THIS.templates.search_dids_results.tmpl(results));

                                $('.needCreditAdj', dialogDiv).change(function() {
                                    THIS.updateDIDQtyCosts($(this).attr('data-did'), $(this).val());
                                });

                                $('.needCreditAdj', dialogDiv).blur(function() {
                                    THIS.updateDIDQtyCosts($(this).attr('data-did'), $(this).val());
                                });
                            }
                        }

                    );
                });

                $('#add_numbers_button', dialogDiv).click(function() {
                    THIS.purchaseDIDs($('#addDIDForm input:checkbox:checked.f_dids'));
                    dialogDiv.dialog('close');
                    dialogDiv.remove();
                });

        },
        updateDIDQtyCosts: function(did, qty) {
            if ( ! isNaN( parseInt( qty ) ) && $('#fd_' + did) ) {
                $('#fd_' + did).dataset('qty',  parseInt( qty ));
                return parseInt( qty );
            }
            return -1;
        },

        add: function(dids) {
            winkstart.postJSON('numbers.add',
            {
                account_id: winkstart.apps['connect'].account_id,
                data: {
                    DIDs:dids
                }
            },
            function(msg){
                if (typeof msg =="object") {
                    $("body").trigger('addDIDs', msg.data);
                    if (msg && msg.errs && msg.errs[0]) {
                        //display_errs(msg.errs);
                    }

                    if (typeof msg.data == 'object' && typeof msg.data.acct == 'object') {
                        redraw(msg.data.acct); // note more than just acct is returned
                    }
                }
                winkstart.apps['connect'].account = msg.data.data;
                winkstart.publish('numbers.refresh');
            });
        },




        /**************************
         * Managing Owned Numbers *
         **************************/
        map_number: function(args) {
            var THIS = this;
            srv = args.new_server.serverid;
            did = args.did.did;

            winkstart.postJSON('numbers.map_number',
	            {
	            	data: {"DID" : {"did": did},"server":{"serverid":srv}},
	            	account_id: winkstart.apps['connect'].account_id
	            },
	            function(json) {
                        if (json.errs && json.errs[0] && json.errs[0].type == 'info') {
                            winkstart.apps['connect'].account = json.data;
                        
                            winkstart.publish('numbers.refresh');
                            if (args.success)
                                args.success();
                        } else if (json.errs && json.errs[0] && json.errs[0].type == 'error') {
                            alert(json.errs[0].msg);
                        } else {
                            // TODO: Better process XHR here
                            //alert('We had trouble talking to the server. Are you sure you\'re online?');
                            winkstart.apps['connect'].account = json.data;
                            winkstart.publish('numbers.refresh');
                        }
                    }
	        );
        },
        
        unassign: function(data) {
            var did = data.did;
            var serverid = data.serverid;
            /* 
            	not sure about this code:

            delete(THIS.account.servers[serverid].DIDs[did]);
            if(THIS.account.DIDs_Unassigned == undefined) {
                THIS.account.DIDs_Unassigned = {};
            }
            THIS.account.DIDs_Unassigned[did] = {};
            */
            winkstart.postJSON('numbers.map_number',
                {
                    data: {"DID" : {"serverid" : serverid, "did" : did}, "server" : null} ,
                    account_id : winkstart.apps['connect'].account_id
                },
                function(json) {
                    if (json.errs && json.errs[0] && json.errs[0].type == 'info') {
                        winkstart.apps['connect'].account = json.data;
                        winkstart.publish('numbers.refresh');
                        if (args.success)
                            args.success();
                    } else if (json.errs && json.errs[0] && json.errs[0].type == 'error') {
                        alert(json.errs[0].msg);
                    } else {
                        // TODO: Better process XHR here
                        //alert('We had trouble talking to the server. Are you sure you\'re online?');
                        winkstart.apps['connect'].account = json.data;
                        winkstart.publish('numbers.refresh');
                    }
                }
            );
        },

        LNP_s1: function(frm) {
            winkstart.putJSON("request_portDID",
            {
                account_id: winkstart.apps['connect'].account_id,
                data: frm.serializeObject()
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


        /*************************
         * DID Display / Listing *
         *************************/
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

            winkstart.log(tmp);

            winkstart.log('Refreshing DIDs...');
            $('#my_numbers').empty();
            THIS.templates.main_dids.tmpl(tmp).appendTo ( $('#my_numbers') );
        },


        /*****************
         * Other Helpers *
         *****************/
        createUploader: function(elm, act, args, cb){
            var uploader = new qq.FileUploader({
                allowedExtensions: ['jpg', 'jpeg', 'png','tiff','pdf','psd'],
                sizeLimit: 10000000,
                minSizeLimit: 20000,

                onComplete: function(id, fileName, responseJSON){
                    cb(id, fileName, responseJSON);
                },

                element: elm,
                action: act,
                params: args
            });
        }
    } // End function definitions

 );  // End module









        // '<pre>' + JSON.stringify(did) + '</pre>' +
/*        failover: function(did) {
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
        },*/




/*        not_used_anymore_searchNPA: function(nbr, cb) {
            //			$.getJSON('/api/searchNPA', function(data) {
            //				$('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(data));			});
            winkstart.getJSON("searchNPA",
            {
                account_id: winkstart.apps['connect'].account_id,
                data: nbr
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
                    account_id: winkstart.apps['connect'].account_id,
                    data: nbr
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    redraw(msg.data);

                }
            }
            );

        },*/

/*        post_failover: function(data) {
            var THIS = this;
            winkstart.log(data);
            if(data.number == '') {
                delete  THIS.account.servers[data.parent.serverid].DIDs[data.parent.did].failover;
            } else {
                THIS.account.servers[data.parent.serverid].DIDs[data.parent.did].failover = {
                    e164: data.number
                };
            }

            data.success();
            THIS.update_account();*/
        /*$.ajax({
                url: "#",
                global: true,
                type: "POST",
                data: ({
                    account_id: winkstart.apps['connect'].account_id,
                    data: {
                        number: data.number
                    }
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
/*        },*/



/*
        updateDIDQtyCosts: function(did, qty) {
            if ( ! isNaN( parseInt( qty ) ) && $('#fd_' + did) ) {
                $('#fd_' + did).dataset('qty',  parseInt( qty ));
                return parseInt( qty );
            }
            return -1;
        },

 */





/*
 * Old DID Map code
/*            winkstart.log('DID ', did, ' srv', srv);

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
            }*/

