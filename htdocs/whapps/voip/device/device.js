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
        'device.list-panel-click' : 'editDevice',
        'device.create-device' : 'createDevice',
        'device.edit-device' : 'editDevice'
    },
    
    formData: {
		users: [{value: '-- Select --'}, {value:'Eric Francis'}, {value: 'Mark Windsor'}, {value:'Jeff Jonson'}],
		status_types: [{value: 'Enabled'}, {value:'Disabled'}],
		auth_methods: [{value: 'Password'}, {value:'IP Address'}],
		invite_formats: [{value: 'Username'}, {value:'NPANXXXXX'}, {value:'E. 164'}],
		bypass_media_types: [{value: 'Automatic'}, {value:'Never'}, {value:'Always'}],
		media_audio_codecs: [
			{field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G729', value: 'G729', caption: '8kbps (Requires License)'},
			{field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G711u / PCMU', value: 'PCMU', caption: '64kbps (North America)'},
			{field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G711a / PCMA', value: 'PCMA', caption: '64kbps (Elsewhere)'},
			{field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G722 (HD) @ 16kHz', value: 'G722_16', caption: '48kbps'},
			{field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'G722_32G722.1 (HD) @ 32kHz', value: 'G722_32', caption: '56kbps'},
			{field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'Siren (HD) @ 48kHz', value: 'CELT_48', caption: '56kbps'},
			{field_id:'media_audio_codecs', field_name: 'media.audio.codecs[]', field_label: 'Siren (HD) @ 64kHz', value: 'CELT_64', caption: '64kbps'}
		],
		media_video_codecs: [
			{field_id:'media_video_codecs', field_name: 'media.video.codecs[]', field_label: 'H261', value: 'H261', caption: 'H261'},
			{field_id:'media_video_codecs', field_name: 'media.video.codecs[]', field_label: 'H263', value: 'H263', caption: 'H263'},
			{field_id:'media_video_codecs', field_name: 'media.video.codecs[]', field_label: 'H264', value: 'H264', caption: 'H264'}
		],
		media_fax_codecs: [{value: 'Auto-Detect'}, {value:'Always Force'}, {value:'Disabled'}]
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
    winkstart.publish('subnav.add', {
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
	 validateForm: function(state) {
        if(state==undefined) {
            winkstart.validate.add($('#name'), /^\w+$/);
            winkstart.validate.add($('#mac_address'), /^[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}$/);
            winkstart.validate.add($('#caller-id-name-internal'), /^.+$/);
            winkstart.validate.add($('#caller-id-number-internal'), /^[\+]?[0-9]+$/);
            winkstart.validate.add($('#caller-id-name-external'), /^.+$/);
            winkstart.validate.add($('#caller-id-number-external'), /^[\+]?[0-9]+$/);
            winkstart.validate.add($('#sip_realm'), /^[0-9A-Za-z\-\.\:]+$/);
            winkstart.validate.add($('#sip_username'), /^[^\s]+$/);
            winkstart.validate.add($('#sip_password'), /^[^\s]+$/);
            winkstart.validate.add($('#sip_expire-seconds'), /^[0-9]+$/);
        }
        else if(state=='save') {
            winkstart.validate.save($('#name'), /^\w+$/);
            winkstart.validate.save($('#mac_address'), /^[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}$/);
            winkstart.validate.save($('#caller-id-name-internal'), /^.+$/);
            winkstart.validate.save($('#caller-id-number-internal'), /^[\+]?[0-9]+$/);
            winkstart.validate.save($('#caller-id-name-external'), /^.+$/);
            winkstart.validate.save($('#caller-id-number-external'), /^[\+]?[0-9]+$/);
            winkstart.validate.save($('#sip_realm'), /^[0-9A-Za-z\-\.\:]+$/);
            winkstart.validate.save($('#sip_username'), /^[^\s]+$/);
            winkstart.validate.save($('#sip_password'), /^[^\s]+$/);
            winkstart.validate.save($('#sip_expire-seconds'), /^[0-9]+$/);
        }
    },
    createDevice: function(){
        $('#device-view').empty();
        var THIS = this;
			
        var form_data = {};
	    form_data.field_data = THIS.config.formData;
        
        this.templates.createDevice.tmpl(form_data).appendTo( $('#device-view') );
        winkstart.cleanForm();
        
        this.validateForm();
    
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
			
            /* Check validation before saving */
            THIS.validateForm('save');

            /* If there is no invalid property, save it */
            if(!$('.invalid').size()) {
                winkstart.putJSON('device.create', put_data, function (json, xhr) {
                    THIS.buildListView();
                    THIS.viewDevice({
                        id: json.id
				    });
                });
            } 
            else {
                alert('Please correct errors that you have on the form.');
            }
				
            return false;
        });
    },
    editDevice: function(data){
        $('#device-view').empty();
        var THIS = this;
		var device_id = data.id;
        /* Grab JSON data from server for device_id */
        winkstart.getJSON('device.get', {
            	crossbar: true,
            	account_id: MASTER_ACCOUNT_ID,
            	device_id: device_id
            },

            /* On Grab JSON success, run this function */
            function (json, xhr) {
				
				/* Take JSON and populate the form fields */
                
            	var form_data = json;
            	
            	if(undefined == form_data.data.media.audio){
            		form_data.data.media.audio = {};
            		form_data.data.media.audio.codecs = [];
            	}
            	if(undefined == form_data.data.media.video){
            		form_data.data.media.video = {};
            		form_data.data.media.video.codecs = [];            		
            	}
            	
                form_data.field_data = THIS.config.formData;
                
                console.log(form_data);
                
                /* Paint the template with HTML of form fields onto the page */
                THIS.templates.editDeviceNew.tmpl(form_data).appendTo( $('#device-view') );

                winkstart.cleanForm();

                THIS.validateForm();
                
				$("ul.settings1").tabs("div.pane > div");
        		$("ul.settings2").tabs("div.advanced_pane > div");

                /* Listen for the submit event (i.e. they click "save") */
                $('.device-save').click(function(event) {
                    /* Save the data after they've clicked save */

                    /* Ignore the normal behavior of a submit button and do our stuff instead */
                    event.preventDefault();
                        
                    /* Grab all the form field data */
                    var formData = form2object('device-form');

                    /* Construct the JSON we're going to send */
                    var post_data = {};
                    post_data.crossbar = true;
                    post_data.account_id = MASTER_ACCOUNT_ID;
                    post_data.data = formData;
                    post_data.device_id = device_id;
                    
                    /* Check validation before saving */
                    THIS.validateForm('save');

                    if(!$('.invalid').size()) {
                        /* Actually send the JSON data to the server */
                        winkstart.postJSON('device.update', post_data, function (json, xhr) {
                            THIS.buildListView();
                            THIS.viewDevice({
                                id: device_id
                            });
                        }) ;
                    } else alert('Please correct errors that you have on the form.'); 
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
        
        winkstart.loadFormHelper('forms');

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
