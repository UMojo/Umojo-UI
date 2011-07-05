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
            label: 'Registrations'
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
            
            winkstart.getJSON('registration.list', {crossbar: true, account_id: MASTER_ACCOUNT_ID}, function(reply) {
                THIS.setup_table();
                $.each(reply.data, function() {
                    var registration_id = this.id;

                    winkstart.getJSON('registration.read',{crossbar: true, account_id: MASTER_ACCOUNT_ID, registration_id: registration_id}, function(reply) {
                        if(reply.data == undefined) {
                            return false;
                        }

                        //Dumb hack before crossbar reply is normalized (with lower case and _)
                        if(reply.data['Event-Timestamp'] != undefined) {
                            reply.data.event_timestamp = reply.data['Event-Timestamp'];
                        }
                        if(reply.data['Username'] != undefined) {
                            reply.data.username = reply.data['Username'];
                        }                       
 
                        var friendlyDate = new Date((reply.data.event_timestamp - 62167219200)*1000);
                        var humanDate = friendlyDate.toLocaleDateString();
                        var humanTime = friendlyDate.toLocaleTimeString(); 
                        winkstart.table.registration.fnAddData([reply.data.username, humanDate, humanTime]);
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
            { 'sTitle': 'Date' },
            { 'sTitle': 'Time' }
        ];
        
        winkstart.table.create('registration', $('#registration-grid'), columns);
    },
    }
);
