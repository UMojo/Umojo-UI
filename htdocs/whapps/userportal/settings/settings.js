winkstart.module('userportal', 'settings', {
    css: [
        'css/style.css'
    ],
				
    templates: {
        settings: 'tmpl/settings.html',
    },
		
    subscribe: {
        'settings.activate': 'activate'
    },
    validation : [
                {name : '#vm-to-email-txt', regex: /^(([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)?$/},
                {name : '#ring-number-txt', regex: /^(([\+]?[0-9]{7,11})|(sip[s]?:[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+))$/}
        ],

    resources: {
        'settings.get': {
            url: '{api_url}/accounts/{account_id}/users/{user_id}',
            contentType: 'application/json',
            verb: 'GET'
        },
        'settings.post': {
            url: '{api_url}/accounts/{account_id}/users/{user_id}',
            contentType: 'application/json',
            verb: 'POST'
        },
    }
},
function(args) {
    winkstart.registerResources(this.__whapp, this.config.resources);

    winkstart.publish('subnav.add', {
        whapp: 'userportal',
        module: this.__module,
        label: 'My Settings',
        icon: 'settings',
        weight: '30'
    });
},
{	
    validateForm: function(state) {
            var THIS = this;

            $(THIS.config.validation).each(function(k, v) {
                if(state == undefined) {
                    winkstart.validate.add($(v.name), v.regex);
                } else if (state == 'save') {
                    winkstart.validate.save($(v.name), v.regex);
                }
            });
        },

    activate: function(data) {
        var THIS = this;
        
        winkstart.getJSON('settings.get', {
                crossbar: true,
                account_id: winkstart.apps['userportal'].account_id,
                api_url: winkstart.apps['userportal'].api_url,
                user_id: winkstart.apps['auth'].user_id
            },
            function(reply) {
                $('#ws-content').empty();
                THIS.templates.settings.tmpl({}).appendTo( $('#ws-content') );
                THIS.setup_page();        

                if(reply.data.email != undefined) {
                    $('#vm-to-email-txt').val(reply.data.email);
                }

                if(reply.data.vm_to_email_enabled != undefined && reply.data.vm_to_email_enabled == true) {
                    $('#vm-to-email-checkbox').attr("checked", "checked");
                }
                else {
                    $('.email-field').hide();
                }
                
                if(reply.data.call_forward != undefined)
                {
                    if(reply.data.call_forward.substitute==false) {
                         $('#ring-device-checkbox').attr("checked", "checked");
                    }
                }           

                if(reply.data.call_forward != undefined && reply.data.call_forward.enabled == true) {
                    if(reply.data.call_forward.number != undefined && reply.data.call_forward.number != '') {        
                        $('#ring-number-txt').val(reply.data.call_forward.number);
                    }
                }
                else {
                    $('.device-field').hide();
                }
                THIS.validateForm();
            }
        );

        winkstart.publish('layout.updateLoadedModule', {
            label: 'My Settings',
            module: this.__module
            });

    },
    update_user_settings: function(data) {
        var post_data = {  
            crossbar: true,
            account_id: winkstart.apps['userportal'].account_id,
            api_url: winkstart.apps['userportal'].api_url,
            user_id: winkstart.apps['auth'].user_id,
        }
        winkstart.getJSON('settings.get', {
                crossbar: true, 
                account_id: winkstart.apps['userportal'].account_id, 
                api_url: winkstart.apps['userportal'].api_url,
                user_id: winkstart.apps['auth'].user_id
            }, 
            function(reply) {
                if(data.email != undefined) {
                    reply.data.email = data.email;
                }
            
                if(data.vm_to_email_enabled != undefined) {
                    reply.data.vm_to_email_enabled = data.vm_to_email_enabled;
                }
    
                if(data.call_forward != undefined) {
                    reply.data.call_forward = data.call_forward;
                    reply.data.call_forward.keep_caller_id = true;
                    reply.data.call_forward.require_keypress = true;
                }
            
                post_data.data = reply.data;
                delete post_data.data.id;
                winkstart.postJSON('settings.post', post_data, function (json, xhr) {
                        /* Refresh the list and the edit content */
                    alert('Settings saved');
                });

//                winkstart.postJSON('settings.post', post_data, function () {});
            }
        );
    },
    setup_page: function() {
        var THIS = this;

        $("input").focus(function() {
            //$("input").removeClass("focusField");
            $(this).addClass("focusField");
        });

        $("input").blur(function() {
            $(this).removeClass("focusField");
        });
       
        $('#ring-number-txt').keyup(function() { 
            if($(this).val() == '') {
                $('.device-field').slideUp();
                $('#ring-device-checkbox').removeAttr('checked');
            } else {
                $('.device-field').slideDown();
                $('#ring-device-checkbox').attr('checked', 'checked');
            }
        });

        $('#vm-to-email-checkbox').change(function() {
            $('#vm-to-email-checkbox').attr('checked') ? $('.email-field').slideDown() : $('.email-field').slideUp();
        });

        $('#cancel-settings-link').click(function() {
            winkstart.publish('settings.activate');
        }); 
 
        $('#save-settings-link').click(function() {
            var data = {
                vm_to_email_enabled: false
            };
            
            if($('#vm-to-email-checkbox').attr('checked')) {
                data.vm_to_email_enabled = true;
                data.email = $('#vm-to-email-txt').val();
            }
            
            data.call_forward = {
                number: $('#ring-number-txt').val(),
                enabled: false
            };
            if(data.call_forward.number != '') { 
                data.call_forward.enabled = true;
            }
            //Substitute equals true to enable real call forwarding, false in order to ring devices as well.
            data.call_forward.substitute = $('#ring-device-checkbox').attr('checked') ? false : true; 

            THIS.update_user_settings(data);
        });        

    }
    
}
);
