winkstart.module('voip', 'conference', {
    css: [
    'css/style.css'
    ],

    templates: {
        conference: 'tmpl/conference.html',
        editConference: 'tmpl/edit.html',
        createConference: 'tmpl/create.html',
        viewConference: 'tmpl/view.html'
    },

    subscribe: {
        'conference.activate' : 'activate',
        'conference.list-panel-click' : 'editConference',
        'conference.create-conference' : 'createConference',
        'conference.edit-conference' : 'editConference'
    },
    
    resources: {
        "conference.list": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/conferences',
            dataType: 'json',
            httpMethod: 'GET'
        },
        "conference.get": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/conferences/{conference_id}',
            dataType: 'json',
            httpMethod: 'GET'
        },
        "conference.create": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/conferences',
            dataType: 'json',
            httpMethod: 'PUT'
        },
        "conference.update": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/conferences/{conference_id}',
            dataType: 'json',
            httpMethod: 'POST'
        },
        "conference.delete": {
            url: CROSSBAR_REST_API_ENDPOINT + '/accounts/{account_id}/conferences/{conference_id}',
            dataType: 'json',
            httpMethod: 'DELETE'
        }
    }
},
function(args) {
    winkstart.publish('subnav.add', {
        module: this.__module,
        label: 'Conferences'
    });
},
{	
	 validateForm: function(state) {
        if(state==undefined) {
            winkstart.validate.add($('#conference_name'), /^[^\s][\w\s]*$/);
            winkstart.validate.add($('#member_pins'), /^[0-9]+$/);
            winkstart.validate.add($('#moderator_pins'), /^[0-9]+$/);
        }
        else if(state=='save') {
            winkstart.validate.save($('#conference_name'), /^[^\s][\w\s]*$/);
            winkstart.validate.save($('#member_pins'), /^[0-9]+$/);
            winkstart.validate.save($('#moderator_pins'), /^[0-9]+$/);
        }
    },
    deleteConference: function(conference_id){
        var THIS = this;
    
        var rest_data = {
            crossbar: true,
            account_id: MASTER_ACCOUNT_ID,
            conference_id: conference_id
        }
        
        winkstart.deleteJSON('conference.delete', rest_data, function (json, xhr) {
            THIS.buildListView();
            $('#conference-view').empty();
        });
    },
    createConference: function(){
        $('#conference-view').empty();
        var THIS = this;
			
        var form_data = {};
	    form_data.field_data = THIS.config.formData;
        
        this.templates.createConference.tmpl(form_data).appendTo( $('#conference-view') );
        winkstart.cleanForm();
        
        this.validateForm();
    
        $("ul.settings1").tabs("div.pane > div");
        $("ul.settings2").tabs("div.advanced_pane > div");
			
        $('.conference-save').click(function() {
            var put_data = {};
            put_data.crossbar = true;
            put_data.account_id = MASTER_ACCOUNT_ID;
            var formData = {
                name: $('#conference_name').val(),
                member_pins: { 0: $('#member_pins').val() },
                moderator_pins: { 0: $('#moderator_pins').val() },
                member_join_deaf: $('#join-deaf-members').attr("checked"),
                member_join_muted: $('#join-muted-members').attr("checked"),
                moderator_join_deaf: $('#join-deaf-moderators').attr("checked"),
                moderator_join_muted: $('#join-muted-moderators').attr("checked")
            }
            put_data.data = formData;
			
            /* Check validation before saving */
            THIS.validateForm('save');

            /* If there is no invalid property, save it */
            if(!$('.invalid').size()) {
                winkstart.putJSON('conference.create', put_data, function (json, xhr) {
                    THIS.viewConference({
                        id: json.data.id
                    });
                    THIS.buildListView();
                });
            } 
            else {
                alert('Please correct errors that you have on the form.');
            }
				
            return false;
        });
    },
    editConference: function(data){
        $('#conference-view').empty();
        var THIS = this;
		var conference_id = data.id;
        winkstart.getJSON('conference.get', {
            	crossbar: true,
            	account_id: MASTER_ACCOUNT_ID,
            	conference_id: conference_id
            },

            function (json, xhr) {
				
            	var form_data = json;
            	
                THIS.templates.editConference.tmpl(form_data).appendTo( $('#conference-view') );

                winkstart.cleanForm();

                console.log(form_data);

                THIS.validateForm();
                
				$("ul.settings1").tabs("div.pane > div");
        		$("ul.settings2").tabs("div.advanced_pane > div");
                
                $('.conference-delete').click(function(event) {
                    THIS.deleteConference(conference_id);

                    return false;
                });
                $('.conference-cancel').click(function(event) {
                    $('#conference-view').empty();
                });

                $('.conference-save').click(function(event) {
                    var formData = {
                        name: $('#conference_name').val(),
                        member_pins: { 0: $('#member_pins').val() },
                        moderator_pins: { 0: $('#moderator_pins').val() },
                        member_join_deaf: $('#join-deaf-members').attr("checked"),
                        member_join_muted: $('#join-muted-members').attr("checked"),
                        moderator_join_deaf: $('#join-deaf-moderators').attr("checked"),
                        moderator_join_muted: $('#join-muted-moderators').attr("checked")
                    }
                    
                    var post_data = {};
                    post_data.crossbar = true;
                    post_data.account_id = MASTER_ACCOUNT_ID;
                    post_data.data = formData;
                    post_data.conference_id = conference_id;
                    
                    /* Check validation before saving */
                    THIS.validateForm('save');

                    if(!$('.invalid').size()) {
                        winkstart.postJSON('conference.update', post_data, function (json, xhr) {
                            THIS.viewConference({
                                 id: json.data.id
                            });
                            THIS.buildListView();
                        }) ;
                    } else alert('Please correct errors that you have on the form.'); 
                    return false;
                });
            } 
        );
    },
    viewConference: function(data) {
        $('#conference-view').empty();
        var THIS = this;
        var conference_id = data.id;
        console.log(conference_id);
        /* Grab JSON data from server for conference_id */
        winkstart.getJSON('conference.get', {
                crossbar: true,
                account_id: MASTER_ACCOUNT_ID,
                conference_id: conference_id
            },

            /* On Grab JSON success, run this function */
            function (json, xhr) {

                /* Take JSON and populate the form fields */

                var form_data = json;

                /* Paint the template with HTML of form fields onto the page */
                THIS.templates.viewConference.tmpl(form_data).appendTo( $('#conference-view') );

                winkstart.cleanForm();
            });
        },
    /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
     * if appropriate. You should also attach to any default click items you want to respond to when people click
     * on them. Also register resources.
     */
    activate: function(data) {
        $('#ws-content').empty();
        var THIS = this;
        this.templates.conference.tmpl({}).appendTo( $('#ws-content') );
        
        winkstart.loadFormHelper('forms');

        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);

        winkstart.publish('layout.updateLoadedModule', {
            label: 'Conferences',
            module: this.__module
            });

        $('.edit-conference').live({
            click: function(evt){
                console.log('Got here');
                var target = evt.currentTarget;
                var conference_id = target.getAttribute('rel');
                winkstart.publish('conference.edit-conference', { 'conference_id' : conference_id});
            }
        });

        THIS.buildListView();
    },

    /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
     * and populating into our standardized data list "thing".
     */
    buildListView: function(){
        var THIS = this;
			
        winkstart.getJSON('conference.list', {crossbar: true, account_id: MASTER_ACCOUNT_ID}, function (json, xhr) {
				
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
	        options.label = 'Conference';
	        options.identifier = 'conference-module-listview';
	        options.new_entity_label = 'Conference';
	        options.data = map_crossbar_data(json.data);
	        options.publisher = winkstart.publish;
	        options.notifyMethod = 'conference.list-panel-click';
	        options.notifyCreateMethod = 'conference.create-conference';
		
	        $("#conference-listpanel").empty();
	        $("#conference-listpanel").listpanel(options);
        
    	});
    }
}
);
