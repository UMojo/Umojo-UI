winkstart.module('voip', 'device', {
    /* What CSS stylesheets do you want automatically loaded? */
    css: [
    'css/style.css'
    ],

    /* What HTML templates will we be using? */
    templates: {
        device: 'tmpl/device.html',
        viewDevice: 'tmpl/view.html',
        editDevice: 'tmpl/edit.html',
        editDeviceNew: 'tmpl/edit_new.html',
        createDevice: 'tmpl/create.html'
    },

    /* What events do we listen for, in the browser? */
    subscribe: {
        'device.activate' : 'activate',
        'device.list-panel-click' : 'viewDevice',
        'device.create-device' : 'createDevice',
        'device.edit-device' : 'editDevice'
    },
    
    /* What API URLs are we going to be calling? Variables are in { }s */
    resources: {
        "device.list": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices',
            dataType: 'json',
            httpMethod: 'GET'
        },
        "device.get": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices/{device_id}',
            dataType: 'json',
            httpMethod: 'GET'
        },
        "device.create": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices',
            dataType: 'json',
            httpMethod: 'PUT'
        },
        "device.update": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices/{device_id}',
            dataType: 'json',
            httpMethod: 'POST'
        },
        "device.delete": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices/{device_id}',
            dataType: 'json',
            httpMethod: 'DELETE'
        }
    }
},
/* Bootstrap routine - run when the module is first loaded */
function(args) {
    winkstart.publish('nav.add', {
        module: this.__module,
        label: 'Device Manager'
    });
},
{	
    viewDevice: function(device_data){
        console.log('Got here.', device_data);
        $('#device-view').empty();
        var THIS = this;

        /*winkstart.publish('notify', {
            level: 'debug',
            msg: 'Editing Device ' + device_data.id
        });*/

        winkstart.getJSON('device.get', {
            crossbar: true,
            account_id: MASTER_ACCOUNT_ID,
            device_id: device_data.id
            }, function (json, xhr) {
            THIS.templates.viewDevice.tmpl(json).appendTo( $('#device-view') );
        });
    },
		
    createDevice: function(){
        $('#device-view').empty();
        var THIS = this;
			
        this.templates.createDevice.tmpl({}).appendTo( $('#device-view') );
        winkstart.cleanForm();

        $("ul.settings1").tabs("div.pane > div");
        $("ul.settings2").tabs("div.advanced_pane > div");
			
        $('.device-save').click(function() {
            var formData = form2object('device-form');
				
            //Handle Checkboxes
            if(!jQuery.inArray(formData.media, 'codecs')){
                formData.media.codecs = [];
            }
				
            var put_data = {};
            put_data.crossbar = true;
            put_data.account_id = MASTER_ACCOUNT_ID;
            put_data.data = formData;
				
            winkstart.putJSON('device.create', put_data, function (json, xhr) {
                THIS.buildListView();
                THIS.viewDevice({
                    id: json.id
				});
            });
				
            return false;
        });
    },
		
    editDevice: function(data){
        $('#device-view').empty();
        var THIS = this;

        /* Grab JSON data from server for device_id */
        winkstart.getJSON('device.get', {
            crossbar: true,
            account_id: MASTER_ACCOUNT_ID,
            device_id: data.device_id
            },

            /* On Grab JSON success, run this function */
            function (json, xhr) {

                /* Take JSON and populate the form fields */
                var form_data = json;
                form_data.form_lookup_data = winkstart.getModuleFormLookupData('device', 'editDevice');
                form_data.isChecked = function(){
                }
				
                /* Paint the template with HTML of form fields onto the page */
                THIS.templates.editDeviceNew.tmpl(form_data).appendTo( $('#device-view') );

                winkstart.cleanForm();
                
				$("ul.settings1").tabs("div.pane > div");
        		$("ul.settings2").tabs("div.advanced_pane > div");

                /* Listen for the submit event (i.e. they click "save") */
                $('#device-form').submit(function(event) {
                    /* Save the data after they've clicked save */

                    /* Ignore the normal behavior of a submit button and do our stuff instead */
                    event.preventDefault();

                    /* Grab all the form field data */
                    var formData = form2object('device-form');

                    //Handle Checkboxes
                    if(!jQuery.inArray(formData.media, 'codecs')){
                        formData.media.codecs = [];
                    }

                    /* Construct the JSON we're going to send */
                    var post_data = {};
                    post_data.crossbar = true;
                    post_data.account_id = MASTER_ACCOUNT_ID;
                    post_data.data = formData;
                    post_data.device_id = device_id;

                    /* Actually send the JSON data to the server */
                    winkstart.postJSON('device.update', post_data, function (json, xhr) {
                        THIS.buildListView();
                        THIS.viewDevice({
                            id: device_id
                        });
                    });
					
                    return false;
                });
            } // End JSON Success routine

        );
    },

    /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
     * if appropriate. You should also attach to any default click items you want to respond to when people click
     * on them. Also register resources.
     */
    activate: function(data) {
        $('#ws-content').empty();
        var THIS = this;
        this.templates.device.tmpl({}).appendTo( $('#ws-content') );

        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);

        winkstart.publish('layout.updateLoadedModule', {
            label: 'Device Management',
            module: this.__module
            });

        $('.edit-device').live({
            click: function(evt){
                console.log('Got here');
                var target = evt.currentTarget;
                var device_id = target.getAttribute('rel');
                winkstart.publish('device.edit-device', { 'device_id' : device_id});
            }
        });

        THIS.buildListView();
    },

    /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
     * and populating into our standardized data list "thing".
     */
    buildListView: function(){
        var THIS = this;
			
        winkstart.getJSON('device.list', {crossbar: true, account_id: MASTER_ACCOUNT_ID}, function (json, xhr) {
				
	        //List Data that would be sent back from server
	        function map_crossbar_data(crossbar_data){
	            var new_list = [];
	            if(crossbar_data.length > 0) {
		            _.each(crossbar_data, function(elem){
		                new_list.push({
		                    id: elem.id,
		                    title: elem.name
						});
		            });
	            }
	            return new_list;
	        };
		        	
	        var options = {};
	        options.label = 'Device Module';
	        options.identifier = 'device-module-listview';
	        options.new_entity_label = 'Device';
	        options.data = map_crossbar_data(json.data);
	        options.publisher = winkstart.publish;
	        options.notifyMethod = 'device.list-panel-click';
	        options.notifyCreateMethod = 'device.create-device';
		
	        $("#device-listpanel").empty();
	        $("#device-listpanel").listpanel(options);
        
    	});
    }
}
);
