winkstart.module('connect', 'sipservice', 
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
        'css/sipservice.css',
        'css/style.css',
        'css/custom_popups.css',
        'css/popups.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            index: 'tmpl/index.html',        // This is utilized later as THIS.templates.index.tmpl({ data_here})
            main: 'tmpl/main.html',
            main_dids : 'tmpl/main_dids.html',
            main_servers : 'tmpl/main_servers.html',
            main_services : 'tmpl/main_services.html',
            thankyou: 'tmpl/thankyou.html',
            service_loc: 'tmpl/service_loc.html',
            service_limits: 'tmpl/service_limits.html',
            port_number: 'tmpl/port_number.html',
            order_history: 'tmpl/order_history.html',
            monitoring: 'tmpl/monitoring.html',
            edit_fraud: 'tmpl/edit_fraud.html',
            failover: 'tmpl/edit_failover.html',
            edit_auth: 'tmpl/edit_auth.html',
            edit_trunks: 'tmpl/edit_trunks.html',
            edit_server: 'tmpl/edit_server.html',
            edit_numbers: 'tmpl/edit_numbers.html',
            add_credits: 'tmpl/add_credits.html',
            edit_billing: 'tmpl/edit_billing.html',
            recover_password: 'tmpl/recover_password.html',
            login: 'tmpl/login.html',
            edit_cnam: 'tmpl/edit_cnam.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'sipservice.activate' : 'activate',

            /* DID Provisioning */
            'sipservice.getNumbers' : 'getNumbers',         // Get a list of DIDs for this account
            'sipservice.findNumber' : 'findNumber',         // Find new numbers
            'sipservice.addNumber' : 'addNumber',           // Buy/add a number to this account
            'sipservice.postNumber': 'postNumber',
            'sipservice.cancelNumber' : 'cancelNumber',     // Cancel a number from the account
            'sipservice.mapNumber' : 'mapNumber',           // Map a number to a whApp or PBX/Server (or unmap/map to nothing)
            'sipservice.updateNumber' : 'updateNumber',     // Update features / settings for a number
            'sipservice.requestPort' : 'requestPort',       // Request to port a number
            'sipservice.portNumber' : 'portNumber',         // Submit a port request
            'sipservice.postPortNumber' : 'postPortNumber', 
            'sipservice.toggleFax' : 'toggleFax',           // Toggle Fax / T.38 support
            'sipservice.configureCnam' : 'configureCnam',    // Configure CNAM
            'sipservice.postCnam' : 'postCnam',

            /* Credit Management */
            'sipservice.addCredit' : 'addCredit',
            'sipservice.postCredit' : 'postCredit',
            'sipservice.changeRecurring' : 'changeRecurring',
            'sipservice.editBilling' : 'editBilling',
            'sipservice.postBilling' : 'postBilling',

            /* Server Management */
            'sipservice.getServers' : 'getServers',         // Get server list
            'sipservice.addServer' : 'addServer',           // Add a server
            'sipservice.addServerPrompt' : 'addServerPrompt',
            'sipservice.deleteServer' : 'deleteServer',     // Delete a server
            'sipservice.updateServer' : 'updateServer',     // Update defaults/general server settings
            'sipservice.editFailover' : 'editFailover',
            'sipservice.postFailover' : 'postFailover',


            // Trunk Management
            'sipservice.editTrunks': 'editTrunks',

            /* */
            'sipservice.refreshDIDs' : 'refreshDIDs',
            'sipservice.refreshServices' : 'refreshServices',
            'sipservice.refreshServers' : 'refreshServers',
            'sipservice.editAuth' : 'editAuth',
            
            'sipservice.login' : 'login',
            'sipservice.recover_password' : 'recover_password',
            
            
            'sipservice.input_css' : 'input_css'
            
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
    }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /*winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'SIP Services'
        });*/

        winkstart.publish('sipservice.activate');
    }, // End initialization routine



    /* Define the functions for this module */
    {
        login: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.login.tmpl({}).dialog({
                title: 'Login',
                width: 535,
                height: 565,
                position: 'center'
            });
            
            winkstart.publish('sipservice.input_css');
        },
        
        recover_password: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.recover_password.tmpl({}).dialog({
                title: 'Recover Password',
                width: 535,
                height: 565,
                position: 'center'
            });
            
            winkstart.publish('sipservice.input_css');
        },
        
        addNumber: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.edit_numbers.tmpl({}).dialog({
                title: 'Add/Search Numbers',
                width: 535,
                height: 565,
                position: 'center'
            });
            
            winkstart.publish('sipservice.input_css');
            
            $(dialogDiv).find('.ctr_btn').click(function() {
                winkstart.publish('sipservice.postNumber', {
                    number : 4159086655,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });
               
            });
        },
        
        postNumber: function(data) {
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
        
        portNumber: function(args) {
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
                winkstart.publish('sipservice.postPortNumber', {
                    number : 4159086655,
                    address: 'Here or there',
                    someOtherData: 'dazdaz',
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });
               
            });
        },
        
        postPortNumber: function(data) {
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
        
        
        configureCnam: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.edit_cnam.tmpl({}).dialog({
                title: 'Edit Caller Id',
                width: 580,
                height: 250,
                position: 'center'
            });
            
            winkstart.publish('sipservice.input_css');
            
            $(dialogDiv).find('.submit_btn').click(function() {
                winkstart.publish('sipservice.postCnam', {
                    caller_id : 500,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });
               
            });
            
        },
        
        postCnam: function(data) {
            $.ajax({
                url: "#",
                global: true,
                type: "POST",
                data: ({
                    key: data.key,
                    json: JSON.stringify({
                        caller_id: data.caller_id
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

        refreshDIDs: function(numbers) {
            var THIS = this;

            THIS.templates.main_dids.tmpl(numbers).appendTo ( $('#my_numbers') );

        },

        refreshServices: function(services) {
            var THIS = this;

            THIS.templates.main_services.tmpl( services ).appendTo ( $('#my_services') );
        },

        refreshServers: function(servers) {
            var THIS = this;
            
            THIS.templates.main_servers.tmpl( servers  ).appendTo ( $('#my_servers') );
        },

        addCreditCard: function(frm) {

            $.ajax({
                url: "/api/addCreditCard",
                global: true,
                type: "POST",
                data: {
                    key: key,
                    json: JSON.stringify(frm.serializeObject())
                },
                dataType: "json",
                async:false,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }

                }
            }
            );
        },

        delCreditCard: function(tid) {

            $.ajax({
                url: "/api/delCreditCard",
                global: true,
                type: "POST",
                data: {
                    key: key,
                    json: JSON.stringify({
                        token: tid
                    })
                },
                dataType: "json",
                async:false,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }

                }
            }
            );
        },

        addPromoCode: function(pc) {

            $.ajax({
                url: "/api/addPromoCode",
                global: true,
                type: "POST",
                data: {
                    key: key,
                    json: JSON.stringify({
                        promo_code: pc
                    })
                },
                dataType: "json",
                async:false,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }

                }
            }
            );
        },
        
        editBilling: function() {
            var THIS = this;

            //var dialogDiv = winkstart.popup(THIS.templates.add_credits.tmpl(), { title : 'Add Credits' } );
            var dialogDiv = THIS.templates.edit_billing.tmpl({}).dialog({
                title: 'Add Billing Account',
                position: 'center',
                height: 700,
                width: 620
            });
            
            winkstart.publish('sipservice.input_css');
            
            $(dialogDiv).find('.submit_btn').click(function() {
                winkstart.publish('sipservice.postBilling', {
                    card_number : 8969756879,
                    car_name: 'John Doe',
                    address: '123, Some Street NoWhereCity Ca',
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });
               
            });
        },
        
        postBilling: function(data) {
            $.ajax({
                url: "#",
                global: true,
                type: "POST",
                data: ({
                    key: data.key,
                    json: JSON.stringify({
                        card_number: data.card_number,
                        car_name: data.car_name,
                        address: data.address
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
        
        

        addCredit: function() {
            var THIS = this;

            var dialogDiv = THIS.templates.add_credits.tmpl({}).dialog({
                title: 'Add Credits',
                width: 680,
                height: 620,
                position: 'center'
            });

            winkstart.publish('sipservice.input_css');

            $(dialogDiv).find('.ctr_btn').click(function() {
                winkstart.publish('sipservice.postCredit', {
                    credit_amount : 5,
                    creditCard: 73928372930,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });
               
            });
        },

        editAuth: function() {
            var THIS = this;

            var dialogDiv = THIS.templates.edit_auth.tmpl({}).dialog({
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

        /******************
         * DID Management *
         ******************/
        moveDID: function(did, srv) {
            $.ajax({
                url: "/api/moveDID",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify({
                        DID:did,
                        server: srv
                    })
                }),
                dataType: "json",
                async:false,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);

                //TODO: redraw servers and allDIDs
                }
            }
            );
        },

        delDID: function(did) {
            $.ajax({
                url: "/api/delDID",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify(did)
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, 'Error');
                    }
                    redraw(msg.data);

                //TODO: redraw servers and allDIDs
                }
            }
            );
        },

        addDID: function(dids) {
            if ( checkCredit() ) {
                $.ajax({
                    url: "/api/addDID",
                    global: true,
                    type: "POST",
                    data: ({
                        key: key,
                        json: JSON.stringify({
                            DID:did
                        })
                    }),
                    dataType: "json",
                    async:true,
                    success: function(msg){
                        // trigger custom event 'numberAdded'
                        if (msg && msg.errs && msg.errs[0]) {
                            display_errs(msg.errs, "Error");
                        }
                        redraw(msg.data);

                    //TODO: redraw servers and allDIDs
                    //TOD: update credits
                    }
                }
                );
            } else {
                msgAlert('Not enough credits to add ' + did);
                return false;
            }
        },


        addDIDs: function(dids) {

            var addedDIDs = $.ajax({
                url: "/api/addDIDs",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify({
                        DIDs:dids
                    })
                }),
                dataType: "json",
                async:false,
                success: function(msg){
                    if (typeof msg =="object") {
                        // trigger custom event 'numberAdded'
                        $("body").trigger('addDIDs', msg.data);
                        //TODO: redraw servers and allDIDs
                        //TOD: update credits
                        if (msg && msg.errs && msg.errs[0]) {
                            display_errs(msg.errs);
                        }
                        //TODO: redraw this DID
                        if (typeof msg.data == 'object' && typeof msg.data.acct == 'object') {
                            redraw(msg.data.acct); // note more than just acct is returned
                        }
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
                    var gJ = $.getJSON('/api/searchNPA', {
                        key: key,
                        json: JSON.stringify({
                            NPA: NPA
                        })
                    }, function(jdata) {
                        $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(jdata));
                        $('#sad_LoadingTime').hide();
                    });
                    return gJ;

                } else if (NXX && NXX.toString().match('^[2-9][0-9][0-9]$')) {
                    var gJ = $.getJSON('/api/searchNPANXX', {
                        key: key,
                        json: JSON.stringify({
                            NPA: NPA,
                            NXX: NXX
                        })
                    }, function(jdata) {
                        $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(jdata));
                    });
                    return gJ;

                } else 	if (NPA.toString().match('^[2-9][0-8][0-9]$')) {
                    $('#sad_LoadingTime').slideDown();
                    var gJ = $.getJSON('/api/searchNPA', {
                        key: key,
                        json: JSON.stringify({
                            NPA: NPA
                        })
                    }, function(jdata) {
                        $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(jdata));
                        $('#sad_LoadingTime').hide();
                    });

                    return gJ;
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
            //			console.log($(elm).dataset('did'));
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
            $.ajax({
                url: "/api/setE911",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify({
                        "e911_info": e911.e911_info,
                        "did":e911.did,
                        "serverid":e911.serverid
                    })
                }),
                dataType: "json",
                async:false,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }
                    //TODO: redraw this DID
                    redraw(msg.data);

                }
            }
            );


        },

        setFailOver: function(info) {
            $.ajax({
                url: "/api/setFailOver",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify({
                        did:info.did.did,
                        serverid:info.did.serverid,
                        failover: info.uri
                    })
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }
                    //TODO: redraw this DID
                    redraw(msg.data);

                }
            }
            );
        },

        setCID: function(info){

            $.ajax({
                url: "/api/setCID",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify(info)
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }
                    redraw(msg.data);

                //TODO: redraw this DID
                }
            }
            );

        },


        LNP_s1: function(frm) {
            $.ajax({
                url: "/api/requestPortDID",
                global: true,
                type: "POST",
                data: {
                    key: key,
                    json: JSON.stringify(frm.serializeObject())
                },
                dataType: "json",
                async:false,
                success: function(msg){

                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }
                    else {
                        LNPPrompt_s2(msg.data);
                    }


                // trigger custom event 'numberAdded'

                //TODO: redraw servers and allDIDs
                //TOD: update credits
                // MUST update acct

                }
            }
            );

        },


        portDID: function() {

        },


        searchNPA: function(nbr, cb) {
            //			$.getJSON('/api/searchNPA', function(data) {
            //				$('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(data));			});

            $.ajax({
                url: "/api/searchNPA",
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


        searchNPANXX: function(nbr, cb) {
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



        /**********************
         * Recurring Services *
         **********************/
        addTrunk: function() {
            if ( 'not from prepay' || checkCredits(25) ) {
                $.ajax({
                    url: "/api/addTrunk",
                    global: true,
                    type: "POST",
                    data: ({
                        key: key,
                        json: JSON.stringify({
                            addTrunks: 1
                        })
                    }),
                    dataType: "json",
                    async:true,
                    success: function(msg){

                        if (msg && msg.errs && msg.errs[0]) {
                            display_errs(msg.errs);
                        }
                        redraw(msg.data);
                    // trigger custom event 'trunkAdded'
                    //TODO: redraw servers and allDIDs
                    //TOD: update credits
                    }
                }
                );
            } else {
                msgAlert('Not enough credits to add a trunk');
                return false;
            }
        },


        editTrunks: function(args) {
            var THIS = this;

            THIS.templates.edit_trunks.tmpl({}).dialog({
                title: 'Edit Trunks'
            });
        },


        setTrunks: function(trunks) {
            if ( 'not from prepay' || checkCredits(25) ) {
                $.ajax({
                    url: "/api/setTrunks",
                    global: true,
                    type: "POST",
                    data: ({
                        key: key,
                        json: JSON.stringify({
                            setTrunks: trunks
                        })
                    }),
                    dataType: "json",
                    async:false,
                    success: function(msg){
                        if (msg && msg.errs && msg.errs[0]) {
                            display_errs(msg.errs);
                        }
                        redraw(msg.data);
                    // trigger custom event 'trunkAdded'
                    //TODO: redraw servers and allDIDs
                    //TOD: update credits
                    }
                }
                );
            } else {
                msgAlert('Not able to set trunks: credits could not be applied');
                return false;
            }
        },

        delTrunk: function(trunks) {
            if (acct.account.trunks < trunks) {
                msgAlert('Not enough trunks to remove!');
                return false;
            }
            $.ajax({
                url: "/api/delTrunk",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify({
                        delTrunks: trunks
                    })
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    acct=msg;
                    //TODO: redraw trunks
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);

                }

            }
            );
        },


        /*********************
         * Server Management *
         *********************/
        
        addServerPrompt: function() {
            var THIS = this;

            var dialogDiv = THIS.templates.edit_server.tmpl({}).dialog({
                title: 'Add Server',
                position: 'center',
                height: 700,
                width: 550
            });
            
            winkstart.publish('sipservice.input_css');
            
            $(dialogDiv).find('.submit_btn').click(function() {
                winkstart.publish('sipservice.addServer', {
                    server_name: 'SERVER',
                    server_usr: 'root',
                    server_pwd: 'root',
                    server_ip: '192.168.0.1',
                    server_add: 'here street Nowhere City',
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });
               
            });
            
        },
        
        addServer: function(srv) {

            $.ajax({
                url: "/api/addServer",
                global: true,
                type: "POST",
                data: ({
                    key: srv.key,
                    json: JSON.stringify({
                        server_name: srv.server_name,
                        server_usr: srv.server_usr,
                        server_pwd: srv.server_pwd,
                        server_ip: srv.server_ip,
                        server_add: srv.server_add
                    })
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    // check for errs
                    // trigger custom event 'serverAdded'
                    //TODO: redraw servers

                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }
                    redraw(msg.data);

                }
            }
            );
        },
        
        delServer: function(srvid) {

            $.ajax({
                url: "/api/delServer",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify({
                        serverid: srvid
                    })
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    // check for errs
                    // trigger custom event 'serverAdded'
                    //TODO: redraw servers

                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }
                    redraw(msg.data);

                }
            }
            );
        },



        setServerDefaults: function(nsd) {

            $.ajax({
                url: "/api/setServerDefaults",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify(nsd)
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }
                    redraw(msg.data);


                }
            }
            );
        },
        
        editFailover: function() {
            var THIS = this;

            var dialogDiv = THIS.templates.failover.tmpl({}).dialog({
                title: 'Edit Failover',
                position: 'center',
                height: 360,
                width: 520
            });
            
            winkstart.publish('sipservice.input_css');
            
            $(dialogDiv).find('.submit_btn').click(function() {
                winkstart.publish('sipservice.postFailover', {
                    number : 4159086655,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });
               
            });
        },
        
        postFailover: function(data) {
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
            //	console.log(JSON.stringify({s: info.serverid, theinfo: acct.servers[info.serverid], 'tst': info}));
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
            popup($('#tmpl_searchDIDs_prompt').tmpl({}));
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

            $.ajax({
                url: "/api/getLNPData",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify(lnp_did)
                }),
                dataType: "json",
                async:true,
                success: function(msg){

                    if (typeof msg == 'object' && msg.data) {
                        var trackData=msg.data;
                        if (typeof trackData == "object" && typeof trackData.lnp == "object" ) {
                            popup($('#tmpl_LNP_prompt_s2').tmpl(trackData));
                            createUploader($('#lnp_s2_uploader')[0], '/api/uploadLNP', {
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
            }
            );

        },

       


        removeSIPAuthIP: function(aip) {
            $.ajax({
                url: "/api/removeSIPAuthIP",
                global: true,
                type: "POST",
                data: ({
                    key: key,
                    json: JSON.stringify(aip)
                }),
                dataType: "json",
                async:true,
                success: function(msg){
                    // redraw server or at lease IP list
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);
                }
            }
            );


        },


        showMyAccountPrompt: function(opts) {
            if (typeof opts != 'object') {
                opts = new Object();
            }
            var gJ = $.getJSON('/api/getCreditCards', {
                key: key,
                json: JSON.stringify({})
            }, function(jdata) {
                jdata.tmplOpts = typeof opts.tmplOpts == 'object' ? opts.tmplOpts : {} ;
                jdata.fa = typeof opts.fa == 'object' ? opts.fa : {} ;
                //console.log(JSON.stringify(jdata));
                popup($('#tmpl_display_acct_info').tmpl(jdata), {
                    title: 'Account Billing Information'
                });
            });
            return gJ;
        },


        delServerPrompt: function(sinfo) {
            popup($('#tmpl_del_server').tmpl(sinfo), {
                title: 'Remove Server - ' + acct.servers[sinfo.serverid].server_name
            });
        },

        // credit mgmt
        updatePreAuth: function(){
            var newItems = $('.inCart');
            rCost=0;
            oCost=0;
            $.each(newItems, function(index, elm) {

                if ( isNaN( parseInt( $(elm).dataset('qty') ) ) ) {
                    rCost+=$(elm).dataset('recurringCost') *1;
                    oCost+=$(elm).dataset('oneTimeCost') * 1;
                } else {
                    rCost+=$(elm).dataset('recurringCost') * $(elm).dataset('qty');
                    oCost+=$(elm).dataset('oneTimeCost') * $(elm).dataset('qty');
                }
            });

            return {
                rCost: rCost,
                oCost: oCost
            };
        },

        checkCredits: function(bill) {
            return true; // not doing pre-paid
            if(acct.account.credits.prepay > bill) {
                return acct.account.credits.prepay - bill;
            } else {
                return false;
            }
        },


        msgAlert: function(msg) {
            alert(msg);
        },



        display_errs: function (errs, title, cb, data) {
            popup($('#tmpl_display_errs').tmpl({
                errs:errs,
                cb: cb
            }), {
                title: title || "Messages"
            });
        //setTimeout("eval(" + cb + ")", 1200);
        },






        // JS additions:

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
        },



        updateDIDQtyCosts: function(did, qty) {
            if ( ! isNaN( parseInt( qty ) ) && $('#fd_' + did) ) {
                $('#fd_' + did).dataset('qty',  parseInt( qty ));
                return parseInt( qty );
            }
            return -1;
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
        
        input_css:function(){
            $('input[type="text"]').addClass("idleField");
            $('input[type="text"]').focus(function() {
                $(this).removeClass("idleField").addClass("focusField");
                if (this.value == this.defaultValue){
                    this.value = '';
                }
                if(this.value != this.defaultValue){
                    this.select();
                }
            });
            $('input[type="text"]').blur(function() {
                $(this).removeClass("focusField").addClass("idleField");
                if ($.trim(this.value) == ''){
                    this.value = (this.defaultValue ? this.defaultValue : '');
                }
            });
            
        },

        /* WHAT IS THIS? */

        /*
    // for the filter
    (function ($) {
        // custom css expression for a case-insensitive contains()
        jQuery.expr[':'].Contains = function(a,i,m){
            return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
        };




    }(jQuery));

*/




        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
     * if appropriate. You should also attach to any default click items you want to respond to when people click
     * on them. Also register resources.
     */
        activate: function(data) {
            var THIS = this;
            /* Clear out the center part of the window - get ready to put our own content in there */
            $('#ws-content').empty();

            // Prepare the dialog box for use
            //$('#dialog').dialog({autoOpen : false});


            /* Draw our base template into the window */
            //THIS.templates.index.tmpl().appendTo( $('#ws-content') );

            // Paint the main screen
            THIS.templates.main.tmpl().appendTo( $('#ws-content') );

            var numbers = {
                
            };

            THIS.refreshDIDs(numbers);

            THIS.refreshServices({
                account : {
                    credits : {}
                }
            });
            
            THIS.refreshServers({});

            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);
            
            $('#t_m_add_server').click(function() {
                winkstart.publish('sipservice.addServerPrompt');
            });

            // This is where we define our click listeners (NOT INLINE IN THE HTML) 
            $('#ws-content #add_prepay_button').click(function() {
                winkstart.publish('sipservice.addCredit');
            });

            $('.trunk_detail img').click(function() {
                winkstart.publish('sipservice.editTrunks');
            });

            $('#tmp_add_number').click(function() {
                winkstart.publish('sipservice.addNumber');
            });
            
            $('#tmp_edit_billing').click(function() {
                winkstart.publish('sipservice.editBilling');
            });
            
            $('#tmp_edit_failover').click(function() {
                winkstart.publish('sipservice.editFailover');
            });
            
            $('#tmp_edit_portNumber').click(function() {
                winkstart.publish('sipservice.portNumber');
            });

            $('#tmp_edit_cnam').click(function() {
                winkstart.publish('sipservice.configureCnam');
            });
            
            $('#tmp_edit_auth').click(function() {
                winkstart.publish('sipservice.editAuth');
            });
            
            $('#tmp_login').click(function() {
                winkstart.publish('sipservice.login');
            });
            
            $('#tmp_recover_password').click(function() {
                winkstart.publish('sipservice.recover_password');
            });

            winkstart.publish('layout.updateLoadedModule', {
                label: 'SIP Services',              // <-- THIS UPDATES THE BREADCRUMB TO SHOW WHERE YOU ARE
                module: this.__module
            });
            
        }
    } // End function definitions

    );  // End module
