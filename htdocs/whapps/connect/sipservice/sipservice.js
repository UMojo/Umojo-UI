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

        /* Main Page */
        index: 'tmpl/index.html',
        main: 'tmpl/main.html',
        /*main_dids : 'tmpl/main_dids.html',
        main_servers : 'tmpl/main_servers.html',*/
        main_services : 'tmpl/main_services.html',

        /* Number Management */
        order_history: 'tmpl/order_history.html',
    },

    /* What events do we listen for, in the browser? */
    subscribe: {
        'sipservice.activate' : 'activate',

        'sipservice.index' : 'index',                       // Splash screen
        'sipservice.main_menu' : 'main_menu',               // Main menu, once logged in
        'sipservice.refresh_screen' : 'refresh_screen',     // Refresh entire screen (should never be used theoretically)
            
        'sipservice.input_css' : 'input_css'                // What is this?
            
    },

    /* What API URLs are we going to be calling? Variables are in { }s */
    resources: {
        "sipservice.get_idoc": {
            url: 'https://store.2600hz.com/v1/get_idoc',
            contentType: 'application/json',
            verb: 'POST'
        },


        /* Create Ticket */
	"sipservice.createTicket": {
            url: 'https://store.2600hz.com/v1/createTicket',
            contentType: 'application/json',
            verb: 'PUT'
        }
    }
}, // End module resource definitions



/* Bootstrap routine - runs automatically when the module is first loaded */
function(args) {
    winkstart.publish('subnav.add', {
        module: 'sipservice.legal',
        label: 'Legal',
        icon: 'legal'
    });

    winkstart.publish('subnav.add', {
        module: 'sipserivce.support',
        label: 'Support',
        icon: 'support'
    });

    winkstart.publish('subnav.add', {
        module: 'sipservice.rates',
        label: 'Rates',
        icon: 'price_tag'
    });

    winkstart.publish('subnav.add', {
        module: 'sipservice.howto',
        label: 'How to Use',
        icon: 'book'
    });

    winkstart.publish('subnav.add', {
        module: this.__module,
        label: 'SIP Services',
        icon: 'active_phone'
    });

    // Only one option for now - go ahead and open it up!
    winkstart.publish('subnav.activate', 'sipservice');

}, // End initialization routine



/* Define the functions for this module */
{
    account : {},

    delServerPrompt: function(sinfo) {
        popup($('#tmpl_del_server').tmpl(sinfo), {
            title: 'Remove Server - ' + acct.servers[sinfo.serverid].server_name
        });
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
    loadAccount: function(account_id, callback) {
        winkstart.getJSON('sipservice.get', {account_id : account_id}, function(data) {
            winkstart.log(data.data);
            callback(data.data);
        });

        return true;
    },

    update_account: function() {
        var THIS = this;
            
        winkstart.postJSON('sipservice.update', {account_id : THIS.account.id, data : THIS.account}, function(data) {
            winkstart.log(data);
            THIS.account = data.data;
            THIS.refresh_screen();
        });
    },
        
    refresh_screen: function() {
        var THIS = this;

        winkstart.publish('sipservice.refresh_services', THIS.account);

        winkstart.publish('sipservice.refresh_servers', THIS.account);

        //var DIDs = THIS.listDIDs(servers);      // Combines all DIDs across all servers into a single list
        winkstart.publish('sipservice.refresh_dids', THIS.account);

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
            winkstart.publish('sipservice.add_server_prompt');
        });

        // Wire up the numbers box
        $("#server_area").delegate(".unassign", "click", function(){
            moveDID($(this).dataset(), null);$(this).hide();
        });

        $("#my_servers").delegate(".failover", "click", function(){
            winkstart.publish('sipservice.edit_failover', $(this).dataset());
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

        $('#my_numbers').delegate('.add', "click", function(){
        	winkstart.publish('sipservice.add_number');
        });



        // This is where we define our click listeners (NOT INLINE IN THE HTML)
        $('#my_services').delegate('#add_prepay_button', 'click', function() {
            winkstart.publish('sipservice.add_credits');
        });

        $('#my_services').delegate('#modify_circuits', 'click', function() {
            winkstart.publish('sipservice.edit_circuits');
        });

        $('#tmp_add_number').click(function() {
            winkstart.publish('sipservice.add_number');
        });

        $('#tmp_edit_port_number').click(function() {
            winkstart.publish('sipservice.port_number');
        });

        /*$('#edit_cnam').click(function() {
            winkstart.publish('sipservice.configure_cnam');
        });

        $('#tmp_edit_auth').click(function() {
            winkstart.publish('sipservice.edit_auth');
        });*/

        $('.did_list .numbers .unassign').live('click', function() {
            data = $(this).dataset();
            winkstart.publish('sipservice.unassign_did', data);
        });

        $('.did_list .numbers .add').live('click', function() {
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
                THIS.refresh_screen();
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
