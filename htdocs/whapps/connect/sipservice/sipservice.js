winkstart.module('connect', 'sipservice', 
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
        'css/style.css',
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
            edit_cnam: 'tmpl/edit_cnam.html',
            edit_circuits: 'tmpl/edit_trunks.html',
            switch_user: 'tmpl/switch_user.html',
            add_number_tmp: 'tmpl/add_number_tmp.html',
            add_user: 'tmpl/add_user.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'sipservice.activate' : 'activate',
            'sipservice.switchUser' : 'switchUser',
            'sipservice.addUser' : 'addUser',
            'sipservice.switchUserForreal' : 'switchUserForreal',

            /* DID Provisioning */
            'sipservice.getNumbers' : 'getNumbers',         // Get a list of DIDs for this account
            'sipservice.findNumber' : 'findNumber',         // Find new numbers
            'sipservice.addNumber' : 'addNumberPrompt',           // Buy/add a number to this account
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
            'sipservice.unassignDID' : 'unassignDID',

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
            'sipservice.editCircuits': 'editCircuits',

            /* */
            'sipservice.refreshDIDs' : 'refreshDIDs',
            'sipservice.refreshServices' : 'refreshServices',
            'sipservice.refreshServers' : 'refreshServers',
            'sipservice.refreshScreen' : 'refreshScreen',
            'sipservice.updateAccount' : 'updateAccount',
            'sipservice.newAccount' : 'newAccount',
            'sipservice.editAuth' : 'editAuth',
            
            'sipservice.login' : 'login',
            'sipservice.recover_password' : 'recover_password',
            
            
            'sipservice.input_css' : 'input_css'
            
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "sipservice.list": {
                url: CROSSBAR_REST_API_ENDPOINT + '/ts_accounts',
                contentType: 'application/json',
                verb: 'GET'
            },
            "sipservice.get": {
                url: CROSSBAR_REST_API_ENDPOINT + '/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "sipservice.create": {
                url: CROSSBAR_REST_API_ENDPOINT + '/ts_accounts',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "sipservice.update": {
                url: CROSSBAR_REST_API_ENDPOINT + '/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "sipservice.delete": {
                url: CROSSBAR_REST_API_ENDPOINT + '/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            
            
            
            "sipservice.billing.put": {
                url: 'https://store.2600hz.com/v1/billing',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "sipservice.billing.get": {
                url: 'https://store.2600hz.com/v1/billing',
                contentType: 'application/json',
                verb: 'GET'
            },
            "sipservice.billing.delete": {
                url: 'https://store.2600hz.com/v1/billing',
                contentType: 'application/json',
                verb: 'DELETE'
            },
            
            
            
            

            "sipservice.circuits.get": {
                url: 'https://store.2600hz.com/v1/circuits',
                contentType: 'application/json',
                verb: 'GET'
            },
            "sipservice.circuits.post": {
                url: 'https://store.2600hz.com/v1/circuits',
                contentType: 'application/json',
                verb: 'POST'
            },
            
            
            
            
            "sipservice.endpoints.put": {
                url: 'https://store.2600hz.com/v1/endpoints',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "sipservice.endpoints.get": {
                url: 'https://store.2600hz.com/v1/endpoints',
                contentType: 'application/json',
                verb: 'GET'
            },
            "sipservice.endpoints.post": {
                url: 'https://store.2600hz.com/v1/endpoints',
                contentType: 'application/json',
                verb: 'POST'
            },
            "sipservice.endpoints.delete": {
                url: 'https://store.2600hz.com/v1/endpoints',
                contentType: 'application/json',
                verb: 'DELETE'
            },




	"sipservice.addUser": {
                url: 'https://store.2600hz.com/v1/addUser',
                contentType: 'application/json',
                verb: 'POST'
            },

	"sipservice.editUser": {
                url: 'https://store.2600hz.com/v1/editUser',
                contentType: 'application/json',
                verb: 'POST'
            },

	"sipservice.getUser": {
                url: 'https://store.2600hz.com/v1/getUser',
                contentType: 'application/json',
                verb: 'POST'
            },

	"sipservice.checkIfExists": {
                url: 'https://store.2600hz.com/v1/checkIfExists',
                contentType: 'application/json',
                verb: 'GET'
            },

	"sipservice.getUserAuth": {
                url: 'https://store.2600hz.com/v1/getUserAuth',
                contentType: 'application/json',
                verb: 'POST'
            },









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


	"sipservice.requestPortDID": {
                url: 'https://store.2600hz.com/v1/requestPortDID',
                contentType: 'application/json',
                verb: 'POST'
            },



	"sipservice.getLNPData": {
                url: 'https://store.2600hz.com/v1/getLNPData',
                contentType: 'application/json',
                verb: 'POST'
            },




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
            },

		"sipservice.get_idoc": {
                url: 'https://store.2600hz.com/v1/get_idoc',
                contentType: 'application/json',
                verb: 'POST'
            },


	"sipservice.server.add": {
                url: 'https://store.2600hz.com/v1/addServer',
                contentType: 'application/json',
                verb: 'POST'
            },

	"sipservice.server.delete": {
                url: 'https://store.2600hz.com/v1/delServer',
                contentType: 'application/json',
                verb: 'POST'
            },


	"sipservice.server.setDefaults": {
                url: 'https://store.2600hz.com/v1/setServerDefaults',
                contentType: 'application/json',
                verb: 'POST'
            },

	"sipservice.server.auth.removeIP": {
                url: 'https://store.2600hz.com/v1/removeSIPAuthIP',
                contentType: 'application/json',
                verb: 'POST'
            },

	"sipservice.server.auth.set": {
                url: 'https://store.2600hz.com/v1/setSIPAuth',
                contentType: 'application/json',
                verb: 'POST'
            },














	"sipservice.createTicket": {
                url: 'https://store.2600hz.com/v1/createTicket',
                contentType: 'application/json',
                verb: 'PUT'
            },

            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Legal',
            icon: 'legal'
        });

        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Support',
            icon: 'support'
        });

        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'Rates',
            icon: 'price_tag'
        });

        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'How to Use',
            icon: 'book'
        });

        winkstart.publish('subnav.add', {
            module: this.__module,
            label: 'SIP Services',
            icon: 'active_phone'
        });

        // Only one option for now - go ahead and open it up!
        winkstart.publish('sipservice.activate');
    }, // End initialization routine



    /* Define the functions for this module */
    {
        account : {},

        login: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.login.tmpl({}).dialog({
                title: 'Login',
                width: 540,
                height: 320,
                position: 'center'
            });
            
            winkstart.publish('sipservice.input_css');
        },
        
        recover_password: function(args) {
            var THIS = this;

            var dialogDiv = THIS.templates.recover_password.tmpl({}).dialog({
                title: 'Recover Password',
                width: 535,
                height: 200,
                position: 'center'
            });
            
            winkstart.publish('sipservice.input_css');
        },
        
        addNumberPrompt: function(args) {
            var THIS = this;

            /*var dialogDiv = THIS.templates.edit_numbers.tmpl({}).dialog({
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
               
            });*/
            
            var dialogDiv = THIS.templates.add_number_tmp.tmpl().dialog({
                title: 'Add New Number'
            });

            dialogDiv.find('#add_number_button').click(function() {
                var did = dialogDiv.find('#number').val();
                if(THIS.account.DIDs_Unassigned == undefined) {
                    THIS.account.DIDs_Unassigned = {};
                }
                THIS.account.DIDs_Unassigned[did] = {};
                dialogDiv.dialog('close');
                THIS.updateAccount();
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
        winkstart.postJSON('something', {
                    key: data.key,
                    json: JSON.stringify({
                        caller_id: data.caller_id
                    }, function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs);
                    }
                    redraw(msg.data);
                });
        },

        addCreditCard: function(frm) {
			winkstart.postJSON('sipservice.billing.put',
				{
                    key: key,
                    json: JSON.stringify(frm.serializeObject())
                }, 
                function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }

                }
			 )
        },

        delCreditCard: function(tid) {
			winkstart.postJSON('sipservice.billing.delete',
				{
                    key: key,
                    json: JSON.stringify({
                        token: tid
                    })
                }, 
                function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                    }

                }
			 );
        },

        addPromoCode: function(pc) {

			winkstart.postJSON('sipservice.billing.put',
				{
                    key: key,
                    json: JSON.stringify({
                        promo_code: pc
                    })
                }, 
                function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
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
        
			winkstart.postJSON('sipservice.billing.put',
				{
                    key: data.key,
                    json: JSON.stringify({
                        card_number: data.card_number,
                        car_name: data.car_name,
                        address: data.address
                    }, 
                function(msg){
                    if (msg && msg.errs && msg.errs[0]) {
                        display_errs(msg.errs, null, eval(msg.errs[0].cb) );
                        redraw(msg.data)
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
        unassignDID: function(data) {
            var THIS = this;
            var did = data.did;
            var serverid = data.serverid;
            delete(THIS.account.servers[serverid].DIDs[did]);
            if(THIS.account.DIDs_Unassigned == undefined) {
                THIS.account.DIDs_Unassigned = {};
            }
            THIS.account.DIDs_Unassigned[did] = {};
            THIS.updateAccount();
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
				function(msg){ addedDIDs=msg; // I do not know why... (2011-07-15)
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
					{	key: key,
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
			winkstart.publish("sipservice.numbers.setE911",
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
			winkstart.publish("sipservice.numbers.setFailOver",
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
        winkstart.publish("sipservice.numbers.setCID",
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
			winkstart.publish("sipservice.requestPortDID",
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


        not_used_anymore_?_searchNPA: function(nbr, cb) {
            //			$.getJSON('/api/searchNPA', function(data) {
            //				$('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(data));			});
			winkstart.publish("sipservice.searchNPA",
				{
                    key: key,
                    json: JSON.stringify(nbr)
                },
                function(msg){
                    redraw(msg.data);
                }
            );
        },


        not_used_anymore_?_searchNPANXX: function(nbr, cb) {
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
                not_used_anymore_?_addTrunk: function() {
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


                not_used_anymore_?_editTrunks: function(args) {
            var THIS = this;

            THIS.templates.edit_trunks.tmpl({}).dialog({
                title: 'Edit Trunks'
            });
        },

        editCircuits: function(args) {
            var THIS = this;
            winkstart.popup(THIS.templates.edit_circuits.tmpl(THIS), {
                title: 'Edit Trunks / Circuits'
            });

            dialogDiv.find('#update_trunks_button').click(function() {
                THIS.account.account.trunks = dialogDiv.find('#trunks').val();
                THIS.account.account.inbound_trunks = dialogDiv.find('#inbound_trunks').val();
                dialogDiv.dialog('close');
                THIS.updateAccount();
            });
            
        },

        setTrunks: function(trunks) {
            if ( 'not from prepay' || checkCredits(25) ) {
				winkstart.publish("sipservice.circuits.post",
					{
                        key: key,
                        json: JSON.stringify({
                            setTrunks: trunks
                        })
                    },
                    function(msg){
                        if (msg && msg.errs && msg.errs[0]) {
                            display_errs(msg.errs);
                        }
                        redraw(msg.data);
                    // trigger custom event 'trunkAdded'
                    //TODO: redraw servers and allDIDs
                    //TOD: update credits
                    }
                    );
	            } else {
                msgAlert('Not able to set trunks: credits could not be applied');
                return false;
            }
        },

        delTrunk: function(trunks) {
        	console.log('no longer used?'); return;
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
                height: 312,
                width: 546
            });

            winkstart.publish('sipservice.input_css');
            
            dialogDiv.find('.submit_btn').click(function() {
                var $THIS = dialogDiv,
                    data = {
                    server_name: $THIS.find('#name').val(),
                    server_usr: $THIS.find('#username').val(),
                    server_pwd: $THIS.find('#password').val(),
                    success: function() {
                        $THIS.dialog('close');
                    }
                }
                winkstart.publish('sipservice.addServer', data);
            });
            
        },
        
        addServer: function(srv) {
            var THIS = this;

            winkstart.log(THIS.account);

            THIS.account.servers.push({
                auth: {
                    auth_password: srv.server_pwd,
                    auth_user: srv.server_usr,
                    auth_method: 'password'
                },
                options: {
                    inbound_format: 'e.164',
                    enabled: true
                },
                DIDs: {},
                server_name: srv.server_name
            });

            srv.success();
            THIS.updateAccount();
            winkstart.log(THIS.account);
            /* For now...
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
            );*/
        },
        
        delServer: function(srvid) {
			winkstart.publish("sipservice.endpoints.delete",
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



        setServerDefaults: function(nsd) {
			winkstart.publish("sipservice.server.setDefaults",

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
        
        editFailover: function(number) {
            var THIS = this;

            var dialogDiv = THIS.templates.failover.tmpl({failover: number.failover}).dialog({
                title: 'Edit Failover',
                position: 'center',
                height: 360,
                width: 520
            });
            
            winkstart.publish('sipservice.input_css');
            
            dialogDiv.find('.submit_btn').click(function() {
                console.log(dialogDiv);
                winkstart.publish('sipservice.postFailover', {
                    number : dialogDiv.find('#failover_number').val(),
                    parent: number,
                    success : function() {
                        dialogDiv.dialog('close');
                    }
                });
               
            });
        },
        
        postFailover: function(data) {
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
            THIS.updateAccount();
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
			winkstart.publish("sipservice.getLNPData",
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

        removeSIPAuthIP: function(aip) {
        	winkstart.publish(	"sipservice.server.auth.removeIP",
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

        showMyAccountPrompt: function(opts) {
            if (typeof opts != 'object') {
                opts = new Object();
            }
            winkstart.publish("sipservice.billing.get",
             {
                key: key,
                json: JSON.stringify({})
            }, function(jdata) {
                jdata.tmplOpts = typeof opts.tmplOpts == 'object' ? opts.tmplOpts : {} ;
                jdata.fa = typeof opts.fa == 'object' ? opts.fa : {} ;
                //winkstart.log(JSON.stringify(jdata));
                popup($('#tmpl_display_acct_info').tmpl(jdata), {
                    title: 'Account Billing Information'
                });
            });
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
        
        /*input_css:function(){
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
            
        },*/

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
        listAccounts: function(callback) {
            winkstart.getJSON('sipservice.list', {}, function(data) {
                winkstart.log(data.data);     // Account list, [ { id : 'name', name : 'some text' ... }, ... ]
                callback(data.data);
            });
        },

        switchUser: function() {
            var THIS = this;

            THIS.listAccounts(function(data) {
                var dialogDiv = THIS.templates.switch_user.tmpl({accounts: data}).dialog({
                    title: 'Switch Account',
                    position: 'center',
                    height: 300,
                    width: 450
                });

                winkstart.publish('sipservice.input_css');
            
                dialogDiv.find('.btn_wrapper #switch').click(function() {
                    winkstart.publish('sipservice.switchUserForreal', {
                        account_id: dialogDiv.find('#account').val(),
                        success : function(data) {
                            THIS.account = data; 
                            THIS.refreshScreen();
                            dialogDiv.dialog('close');
                        }
                    });

                });             
                dialogDiv.find('.btn_wrapper #add').click(function() {
                    winkstart.publish('sipservice.addUser');
                    dialogDiv.dialog('close');
                });
            });
        },
        addUser: function() {
            var THIS = this;

            var dialogDiv = THIS.templates.add_user.tmpl({}).dialog({
                title: 'Add User',
                position: 'center',
                height: 300,
                width: 450
            });

            winkstart.publish('sipservice.input_css');
        
            dialogDiv.find('.submit_btn').click(function() {
                winkstart.publish('sipservice.newAccount', {
                        account_id: dialogDiv.find('#name').val(),
                        realm: dialogDiv.find('#realm').val()
                });
                dialogDiv.dialog('close');
            });             
        },
        switchUserForreal: function(data) {
            var THIS = this;
            THIS.loadAccount(data.account_id, data.success); 
        },

        loadAccount: function(account_id, callback) {
            winkstart.getJSON('sipservice.get', {account_id : account_id}, function(data) {
                winkstart.log(data.data);
                callback(data.data);
            });

            return true;
        },

        newAccount : function(args) {
            var THIS = this;
            
            var data = {
               "name": args.account_id,
               "account": {
                   "credits": {
                       "prepay": "0.00"
                   },
                   "auth_realm": args.realm,
                   "trunks": "0",
                   "inbound_trunks" : "0"
                },
                "DIDs_Unassigned": {
                },
                "servers": [
               ]
            };

            winkstart.putJSON('sipservice.create', {data : data}, function(response) {
                winkstart.log(response);
                THIS.account = response.data;
                THIS.refreshScreen();
            })

        },

        updateAccount: function() {
            var THIS = this;
            
            winkstart.postJSON('sipservice.update', {account_id : THIS.account.id, data : THIS.account}, function(data) {
                winkstart.log(data);
                THIS.account = data.data;
                THIS.refreshScreen();
            });
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

        refreshDIDs: function(account) {
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
                    {cursor: 'pointer',
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
                setTimeout("winkstart.publish('sipservice.updateAccount')", 1);
            });
        },

        refreshServices: function(account) {
            var THIS = this;

            winkstart.log('Refreshing Services...');
            $('#my_services').empty();
            THIS.templates.main_services.tmpl( account ).appendTo ( $('#my_services') );
        },

        refreshServers: function(account) {
            var THIS = this;

            winkstart.log('Refreshing Servers...');
            $('#my_servers').empty();
            THIS.templates.main_servers.tmpl( account  ).appendTo ( $('#my_servers') );
            
            // Define areas where numbers can be dropped and what to do when they are dropped
            $("#ws-content .drop_area").droppable({
                    drop: function(event, ui) {
                            tmp_ui=ui;
                            tmp_md_this=this;
                            THIS.moveDID($(tmp_ui.draggable).dataset(), $(tmp_md_this).dataset());
                            setTimeout("winkstart.publish('sipservice.updateAccount')", 1);
                    },
                    accept: '.number' ,
                    activeClass: 'ui-state-highlight',
                    activate: function(event, ui) {;},
                    scope: 'moveDID'
            });
        },

        refreshScreen: function() {
            var THIS = this;

            winkstart.publish('sipservice.refreshServices', THIS.account);

            winkstart.publish('sipservice.refreshServers', THIS.account);

            //var DIDs = THIS.listDIDs(servers);      // Combines all DIDs across all servers into a single list
            winkstart.publish('sipservice.refreshDIDs', THIS.account);

        },

        mainMenu: function() {
            var THIS = this;

            // Paint the main screen
            $('#ws-content').empty();
            THIS.templates.main.tmpl().appendTo( $('#ws-content') );

            $('.universal_nav .my_account').click(function() {
                winkstart.publish('sipservice.switchUser');
            });

            // Wire the "Add Server" button
            $('#add_server').click(function() {
                winkstart.publish('sipservice.addServerPrompt');
            });

            // Wire up the numbers box
            $("#server_area").delegate(".unassign", "click", function(){
                moveDID($(this).dataset(), null);$(this).hide();
            });

            $("#my_servers").delegate(".failover", "click", function(){
                winkstart.publish('sipservice.editFailover', $(this).dataset());
            });

            $("#server_area").delegate(".cid", "click", function(){
                cidPrompt($(this).dataset(), null);
            });

            $("#server_area").delegate(".e911", "click", function(){
                e911Prompt($(this).dataset(), null);
            });

            $("#server_area").delegate(".misc", "click", function(){
                miscPrompt($(this).dataset(), null);
            });

            $("#server_area").delegate(".modifyServerDefaults", "click", function(){
                modifySRVDefaultsPrompt($(this).dataset(), null);
            });

            $('#my_numbers').delegate('.add', "click", function(){searchDIDsPrompt();});


            // This is where we define our click listeners (NOT INLINE IN THE HTML)
            $('#ws-content #add_prepay_button').click(function() {
                winkstart.publish('sipservice.addCredit');
            });

            $('#modify_circuits').live('click', function() {
                winkstart.publish('sipservice.editCircuits');
            });

            $('#tmp_add_number').click(function() {
                winkstart.publish('sipservice.addNumber');
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

            $('.unassign').live('click', function() {
                data = $(this).dataset();
                winkstart.publish('sipservice.unassignDID', data);
            });

            $('.add').live('click', function() {
                winkstart.publish('sipservice.addNumber');
            });
        },


        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function() {
            var THIS = this;
            /* Clear out the center part of the window - get ready to put our own content in there */
            $('#ws-content').empty();
            
            /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
            winkstart.registerResources(this.config.resources);
            
            winkstart.publish('layout.updateLoadedModule', {
                label: 'SIP Services',
                module: this.__module
            });
            
            // If user is already logged in, go ahead and show their trunks & stuff
            if (winkstart.modules['connect'].auth_token) {
                // Load user & show main page
                THIS.loadAccount(winkstart.modules['connect'].auth_token, function(data) {
                    THIS.account = data; 
                    THIS.mainMenu();
                    THIS.refreshScreen();
                }); 
            } else {
                // Show landing page
                
                /* Draw our base template into the window */
                THIS.templates.index.tmpl().appendTo( $('#ws-content') );

                $('#ws-content a#signup_button').click(function() {
                    THIS.mainMenu();
                });
            }

        }
    } // End function definitions

);  // End module
