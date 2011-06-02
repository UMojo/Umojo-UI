winkstart.module('voip', 'device', {
    css: [
    'css/style.css'
    ],
				
    templates: {
        device: 'tmpl/device.html',
        viewDevice: 'tmpl/view.html',
        editDevice: 'tmpl/edit.html',
        createDevice: 'tmpl/create.html'
    },
		
    subscribe: {
        'device.activate' : 'activate',
        'device.list-panel-click' : 'viewDevice',
        'device.create-device' : 'createDevice',
        'device.edit-device' : 'editDevice'
    },
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
            httpMethod: 'POST'
        },
        "device.update": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/devices/{device_id}',
            dataType: 'json',
            httpMethod: 'POST'
        }
    }
},
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
        winkstart.getJSON('device.get', {
            crossbar: true,
            account_id: MASTER_ACCOUNT_ID,
            device_id: device_data.id
            }, function (json, xhr) {
            THIS.templates.viewDevice.tmpl(json).appendTo( $('#device-view') );
        //$('#code').html(JSON.stringify(json));
        });
    },
		
    createDevice: function(){
        $('#device-view').empty();
        var THIS = this;
			
        this.templates.createDevice.tmpl({}).appendTo( $('#device-view') );
        winkstart.cleanForm();
			
        $('#device-form').submit(function() {
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
		
    editDevice: function(device_id){
        $('#device-view').empty();
        var THIS = this;
        winkstart.getJSON('device.get', {
            crossbar: true,
            account_id: MASTER_ACCOUNT_ID,
            device_id: device_id
        }, function (json, xhr) {
				
            var form_data = json;
            form_data.form_lookup_data = winkstart.getModuleFormLookupData('device', 'editDevice');
            form_data.isChecked = function(){
                return 'dfdsfdsds';
            }
				
            THIS.templates.editDevice.tmpl(form_data).appendTo( $('#device-view') );
				
            winkstart.cleanForm();
			
            $('#device-form').submit(function(event) {
					
                event.preventDefault();
					
                var formData = form2object('device-form');
					
                //Handle Checkboxes
                if(!jQuery.inArray(formData.media, 'codecs')){
                    formData.media.codecs = [];
                }
					
                var post_data = {};
                post_data.crossbar = true;
                post_data.account_id = MASTER_ACCOUNT_ID;
                post_data.data = formData;
                post_data.device_id = device_id;
					
                winkstart.postJSON('device.update', post_data, function (json, xhr) {
                    THIS.buildListView();
                    THIS.viewDevice({
                        id: device_id
                    });
                });
					
                return false;
            });
        });
    },
		
    activate: function(data) {
        $('#ws-content').empty();
        var THIS = this;
        this.templates.device.tmpl({}).appendTo( $('#ws-content') );

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
                THIS.editDevice(device_id);
            }
        });

        THIS.buildListView();
    },
		
    buildListView: function(){
        var THIS = this;
			
        //winkstart.getJSON('device.list', {crossbar: true, account_id: MASTER_ACCOUNT_ID}, function (json, xhr) {
				
        //List Data that would be sent back from server
        function map_crossbar_data(crossbar_data){
            var new_list = [];
            _.each(crossbar_data, function(elem){
                new_list.push({
                    id: elem.id,
                    title: elem.name
                    });
            });
            return new_list;
        };
	        	            	
        var json = [
        {
            id: '1234',
            title: 'D1234'
        },

        {
            id: '1235',
            title: 'D1235'
        },

        {
            id: '1236',
            title: 'D1236'
        },

        {
            id: '1237',
            title: 'D1237'
        },

        {
            id: '1238',
            title: 'D1238'
        }
        ]
	        	
	        	
        var options = {};
        options.label = 'Device Module';
        options.identifier = 'device-module-listview';
        options.new_entity_label = 'Device';
        //options.data = map_crossbar_data(json.data);
        options.data = json;
        options.publisher = winkstart.publish;
        options.notifyMethod = 'device.list-panel-click';
        options.notifyCreateMethod = 'device.create-device';
	
        $("#device-listpanel").empty();
        $("#device-listpanel").listpanel(options);
	            
    //});
    }
}
);