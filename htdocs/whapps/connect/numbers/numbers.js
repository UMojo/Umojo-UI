winkstart.module('connect', 'numbers', {
        css: [
            'css/numbers.css'
        ],

        templates: {
            numbers: 'tmpl/numbers.html',
            number: 'tmpl/number.html',
            endpoint_number: 'tmpl/endpoint_number.html',
            cancel_dialog: 'tmpl/cancel_dialog.html',
            failover_dialog: 'tmpl/failover_dialog.html',
            cnam_dialog: 'tmpl/cnam_dialog.html',
            e911_dialog: 'tmpl/e911_dialog.html',
            add_number_dialog: 'tmpl/add_number_dialog.html',
            add_number_search_results: 'tmpl/add_number_search_results.html'
        },

        subscribe: {
            'numbers.render': 'render_numbers',
            'numbers.render_endpoint_numbers': 'render_endpoint_numbers',
            'numbers.render_endpoint_number_dropzone': 'render_endpoint_number_dropzone',
        },

        resources: {
            "number.search_npa_nxx": {
                url: '{api_url}/{account_id}/searchNPANXX',
                contentType: 'application/json',
                verb: 'POST'
            },

            "number.search_npa": {
                url: '{api_url}/{account_id}/searchNPA',
                contentType: 'application/json',
                verb: 'POST'
            },

            "number.delete": {
                url: '{api_url}/{account_id}/delDID',
                contentType: 'application/json',
                verb: 'POST'
            },

            "number.add": {
                url: '{api_url}/{account_id}/addDIDs',
                contentType: 'application/json',
                verb: 'POST'
            },

            /*
            "number.port": {
                url: 'https://store.2600hz.com/v1/{account_id}/request_portDID',
                contentType: 'application/json',
                verb: 'POST'
            },

            "number.lnp": {
                url: 'https://store.2600hz.com/v1/{account_id}/getLNPData',
                contentType: 'application/json',
                verb: 'POST'
            },

            "number.update_e911": {
                url: 'https://store.2600hz.com/v1/{account_id}/e911',
                contentType: 'application/json',
                verb: 'POST'
            },

            "number.update_cnam": {
                url: 'https://store.2600hz.com/v1/{account_id}/cnam',
                contentType: 'application/json',
                verb: 'POST'
            }
            */
        }
    },

    function() {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
/*
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

        updateDIDQtyCosts: function(did, qty) {
            if ( ! isNaN( parseInt( qty ) ) && $('#fd_' + did) ) {
                $('#fd_' + did).dataset('qty',  parseInt( qty ));
                return parseInt( qty );
            }
            return -1;
        },

*/

/* Good stuff starts here */
        move_number: function(number_data, endpoint_data, data, success, error) {
            var THIS = this,
                did = number_data.did,
                src_did_list = ('serverid' in number_data) ? data.servers[number_data.serverid].DIDs : data.DIDs_Unassigned,
                dest_did_list = (endpoint_data && !$.isEmptyObject(endpoint_data)) ? endpoint_data.DIDs : data.DIDs_Unassigned;

            dest_did_list[did] = src_did_list[did];
            delete src_did_list[did];

            winkstart.request(true, 'trunkstore.update', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    data: data
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        cancel_number: function(number_data, success, error) {
            var THIS = this;

            winkstart.request(true, 'number.delete', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].ts_url,
                    data: number_data
                },
                function(data, status) {
                    if(typeof success == 'function') {
                        success(data, status);
                    }
                },
                function(data, status) {
                    if(typeof error == 'function') {
                        error(data, status);
                    }
                }
            );
        },

        update_failover: function(failover_data, number_data, data, success, error) {
            var THIS = this,
                failover_did = failover_data.did;

            if(failover_did) {
                failover_did = failover_did.replace(/^\+?1/, '');
                failover_did = failover_did.replace(/[\-\.\s\+\(\)]/g, '');

                number_data.options.failover = {
                    e164: "+1" + failover_did,
                    type: "E.164"
                };
            }
            else {
                delete number_data.options.failover;
            }

            winkstart.request(true, 'trunkstore.update', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    data: data
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        update_cnam: function(cnam_data, number_data, success, error) {
            var THIS = this;

            winkstart.request(true, 'number.update_cnam', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].ts_url,
                    data: {
                        did: number_data.did,
                        cid_number: number_data.did,
                        cid_name: cnam_data.cid_name
                    }
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        update_e911: function(e911_data, number_data, data, success, error) {
            var THIS = this;

            console.log(e911_data);

            if(typeof success == 'function') {
                success({});
            }
        },

        search_numbers: function(data, success, error) {
            var THIS = this;

            if('NPA' in data && data.NPA.match(/^8(:?00|88|77|66|55)$/)) {
                delete data.NXX;
            }

            if('NXX' in data) {
                winkstart.request(true, 'number.search_npa_nxx', {
                        account_id: winkstart.apps['connect'].account_id,
                        api_url: winkstart.apps['connect'].ts_url,
                        data: data
                    },
                    function(_data, status) {
                        if(typeof success == 'function') {
                            success(_data, status);
                        }
                    },
                    function(_data, status) {
                        if(typeof error == 'function') {
                            error(_data, status);
                        }
                    }
                );
            }
            else {
                winkstart.request(true, 'number.search_npa', {
                        account_id: winkstart.apps['connect'].account_id,
                        api_url: winkstart.apps['connect'].ts_url,
                        data: data
                    },
                    function(_data, status) {
                        if(typeof success == 'function') {
                            success(_data, status);
                        }
                    },
                    function(_data, status) {
                        if(typeof error == 'function') {
                            error(_data, status);
                        }
                    }
                );
            }
        },

        add_numbers: function(data, success, error) {
            var THIS = this;

            winkstart.request('number.add', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].ts_url,
                    data: {
                        DIDs: data
                    }
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        render_add_number_dialog: function(data, callback) {
            var THIS = this,
                popup_html = THIS.templates.add_number_dialog.tmpl(),
                popup;

            $('#search_numbers_button', popup_html).click(function(ev) {
                var npa_data = {},
                    npa = $('#sdid_npa', popup_html).val(),
                    nxx = $('#sdid_nxx', popup_html).val();

                ev.preventDefault();

                if(npa) {
                    npa_data.NPA = npa;
                }

                if(nxx) {
                    npa_data.NXX = nxx;
                }

                THIS.search_numbers(npa_data, function(results_data) {
                    var results_html = THIS.templates.add_number_search_results.tmpl(results_data);

                    $('#foundDIDList', popup_html)
                        .empty()
                        .append(results_html);
                });
            });

            $('#add_numbers_button', popup_html).click(function(ev) {
                var numbers_data = [];

                ev.preventDefault();

                $('#foundDIDList .f_dids:checked', popup_html).each(function() {
                    numbers_data.push($(this).dataset());
                });

                THIS.add_numbers(numbers_data, function(_data) {
                    popup.dialog('close');

                    if(typeof callback == 'function') {
                        callback(_data);
                    }
                });
            });

            popup = winkstart.dialog(popup_html, { title: 'Add number' });
        },

        render_e911_dialog: function(number_data, data, callback) {
            var THIS = this,
                popup_html = THIS.templates.e911_dialog.tmpl(),
                popup;

            $('.submit_btn', popup_html).click(function(ev) {
                var e911_data = {
                    address: $('input[name="address"]', popup_html).val(),
                    city: $('input[name="city"]', popup_html).val(),
                    state: $('input[name="state"]', popup_html).val(),
                    postalcode: $('input[name="postalcode"]', popup_html).val(),
                }

                ev.preventDefault();

                THIS.update_e911(e911_data, number_data, data, function(_data) {
                    popup.dialog('close');

                    if(typeof callback == 'function') {
                        callback(_data);
                    }
                });
            });

            popup = winkstart.dialog(popup_html, { title: 'Edit e911 Location' });
        },

        render_cnam_dialog: function(number_data, data, callback) {
            var THIS = this,
                popup_html = THIS.templates.cnam_dialog.tmpl(number_data.options.caller_id),
                popup;

            console.log(number_data.options);

            $('.submit_btn', popup_html).click(function(ev) {
                var cnam_data = {
                    cid_name: $('input[name="cid_name"]', popup_html).val()
                }

                ev.preventDefault();

                THIS.update_cnam(cnam_data, number_data, function(_data) {
                    popup.dialog('close');

                    if(typeof callback == 'function') {
                        callback(_data);
                    }
                });
            });

            popup = winkstart.dialog(popup_html, { title: 'Edit CID' });
        },

        render_failover_dialog: function(number_data, data, callback) {
            var THIS = this,
                popup_html = THIS.templates.failover_dialog.tmpl({
                    failover: ('failover' in number_data.options) ? number_data.options.failover.e164 : ''
                }),
                popup;

            $('.submit_btn', popup_html).click(function(ev) {
                var failover_data = {
                    did: $('input[name="failover"]', popup_html).val()
                };

                ev.preventDefault();

                THIS.update_failover(failover_data, number_data, data, function(_data) {
                    popup.dialog('close');

                    if(typeof callback == 'function') {
                        callback(_data);
                    }
                });

                popup.dialog('close');
            });

            popup = winkstart.dialog(popup_html, { title: 'Edit failover' });
        },

        render_endpoint_number_dropzone: function(endpoint_data, data, target) {
            var THIS = this,
                number_dropzone_html = $('<div class="drop_area"/>');

            (number_dropzone_html).droppable({
                /* The :not([data-serverid...]) bit prevents dropping a DID on the server it's currently assigned to */
                accept: '.number:not([data-serverid="' + endpoint_data.serverid + '"])',
                drop: function(ev, ui) {
                    var number_data = ui.draggable.dataset();

                    THIS.move_number(number_data, endpoint_data, data, function(_data) {
                        winkstart.publish('trunkstore.refresh', _data.data);
                    });
                }
            });

            (target)
                .empty()
                .append(number_dropzone_html);
        },

        render_endpoint_number: function(number_data, data, parent) {
            var THIS = this,
                number_html = THIS.templates.endpoint_number.tmpl(number_data);

            $('.number', number_html).draggable({
                cursor: 'pointer',
                opacity: 0.35,
                revert: 'invalid',
                appendTo: 'body',
                helper: 'clone',
                zIndex: 9999
            });

            $('.edit_failover', number_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_failover_dialog(number_data, data, function(_data) {
                    winkstart.publish('trunkstore.refresh', _data.data);
                });
            });

            $('.edit_cnam', number_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_cnam_dialog(number_data, data, function(_data) {
                    winkstart.publish('trunkstore.refresh', _data.data);
                });
            });

            $('.edit_e911', number_html).click(function(ev) {
                ev.preventDefault();

                alert('e911 is coming soon!');
                //THIS.render_e911_dialog(number_data, data, function(_data) {
                    //winkstart.publish('trunkstore.refresh', _data.data);
                //});
            });

            $('.unassign', number_html).click(function(ev) {
                ev.preventDefault();

                THIS.move_number(number_data, {}, data, function(_data) {
                    winkstart.publish('trunkstore.refresh', _data.data);
                });
            });

            (parent).append(number_html);
        },

        render_endpoint_numbers: function(endpoint_data, data, target) {
            var THIS = this,
                container = $('<div/>');

            $.each(endpoint_data.DIDs, function(did, options) {
                THIS.render_endpoint_number({
                        did: did,
                        options: options,
                        serverid: endpoint_data.serverid
                    },
                    data,
                    container
                );
            });

            (target)
                .empty()
                .append(container.children());
        },

        render_cancel_dialog: function(number_data, callback) {
            var THIS = this,
                popup_html = THIS.templates.cancel_dialog.tmpl(number_data),
                popup;

            $('.submit_btn', popup_html).click(function(ev) {
                ev.preventDefault();

                THIS.cancel_number(number_data, function(_data) {
                    popup.dialog('close');

                    if(typeof callback == 'function') {
                        callback(_data);
                    }
                });
            })

            popup = winkstart.dialog(popup_html, { title: 'Cancel number' });
        },

        render_number: function(number_data, data, parent) {
            var THIS = this,
                number_html = THIS.templates.number.tmpl(number_data);

            if(!('server_name' in data)) {
                $('.cancel_number', number_html).click(function(ev) {
                    ev.preventDefault();

                    THIS.render_cancel_dialog(number_data, function(_data) {
                        winkstart.publish('trunkstore.refresh', _data.data);
                    });
                });
            }

            $('.number', number_html).draggable({
                cursor: 'pointer',
                opacity: 0.35,
                revert: 'invalid',
                appendTo: 'body',
                helper: 'clone',
                zIndex: 9999
            });

            (parent).append(number_html);
        },

        render_numbers: function(data, parent) {
            var THIS = this,
                target = $('#numbers', parent),
                numbers_html = THIS.templates.numbers.tmpl({
                    unassigned: THIS.count(data.DIDs_Unassigned)
                });

            $('.numbers.add', numbers_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_add_number_dialog(data, function(_data) {
                    /* For some odd reason, addDIDs likes to return a nest data object. Differs from standard _data.data */
                    winkstart.publish('trunkstore.refresh', _data.data.data);
                });
            });

            $.each(data.servers, function(index, server) {
                $.each(server.DIDs, function(did, options) {
                    THIS.render_number({
                            did: did,
                            serverid: "" + index, /* Gross hack to prevent 0 tripping the false condition in the template */
                            server_name: server.server_name
                        },
                        data,
                        $('#number_list', numbers_html)
                    );
                });
            });

            $.each(data.DIDs_Unassigned, function(did, options) {
                THIS.render_number({
                        did: did,
                        status: 'unassigned'
                    },
                    data,
                    $('#number_list', numbers_html)
                );
            });

            (target)
                .empty()
                .append(numbers_html);
        },

        count: function(obj) {
            var size = 0;

            $.each(obj, function() {
                size++;
            });

            return size;
        }
    }
);
