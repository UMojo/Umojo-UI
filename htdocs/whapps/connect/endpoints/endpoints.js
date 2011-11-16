winkstart.module('connect', 'endpoints', {
        css: [
            'css/style.css',
        ],

        templates: {
            endpoints: 'tmpl/endpoints.html',
            endpoint: 'tmpl/endpoint.html',
            endpoint_dialog: 'tmpl/endpoint_dialog.html'
        },

        subscribe: {
            'endpoints.render' : 'render_endpoints',
        }
    },

    function() {
    },

    {
        save_endpoint: function(endpoint_data, data, success, error) {
            var THIS = this,
                index = endpoint_data.serverid,
                new_data = $.extend(true, {}, data);

            THIS.normalize_data(endpoint_data);

            if(index || index === 0) {
                $.extend(true, new_data.servers[index], endpoint_data);
            }
            else {
                new_data.servers.push($.extend(true, {
                    DIDs: {},
                    options: {
                        enabled: true,
                        inbound_format: 'e.164',
                        international: false,
                        caller_id: {},
                        e911_info: {},
                        failover: {}
                    },
                    permissions: {
                        users: []
                    },
                    monitor: {
                        monitor_enabled: false
                    }
                }, endpoint_data));
            }

            winkstart.request('trunkstore.update', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    data: new_data
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

        delete_endpoint: function(endpoint_data, data, success, error) {
            var THIS = this,
                index = endpoint_data.serverid,
                new_data = $.extend(true, {}, data);

            if(index || index === 0) {
                /* Move the server's dids into the unassigned did list before removal */
                $.extend(true, new_data.DIDs_Unassigned, new_data.servers[index].DIDs);

                new_data.servers.splice(index, 1);
            }

            winkstart.request('trunkstore.update', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url,
                    data: new_data
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

        normalize_data: function(data) {
            delete data.serverid;
            delete data.realm;

            return data;
        },

        render_endpoint_dialog: function(endpoint_data, data, callback) {
            var THIS = this,
                popup_html = THIS.templates.endpoint_dialog.tmpl(endpoint_data),
                popup;

            $('.endpoint.edit', popup_html).click(function(ev) {
                var form_data = form2object('endpoint');

                ev.preventDefault();

                THIS.save_endpoint(form_data, data, function(_data) {
                    popup.dialog('close');

                    if(typeof callback == 'function') {
                        callback(_data);
                    }
                });
            });

            popup = winkstart.dialog(popup_html, { title: 'Edit endpoint' });
        },

        render_endpoint: function(data, index, parent) {
            var THIS = this,
                endpoint_data = $.extend({
                        serverid: index,
                        realm: data.account.auth_realm
                    },
                    data.servers[index]
                ),
                endpoint_html = THIS.templates.endpoint.tmpl(endpoint_data);

            $('.modifyServerDefaults', endpoint_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_endpoint_dialog(endpoint_data, data, function(_data) {
                    winkstart.publish('trunkstore.refresh', _data.data);
                });
            });

            $('.deleteServer', endpoint_html).click(function(ev) {
                ev.preventDefault();

                THIS.delete_endpoint(endpoint_data, data, function(_data) {
                    winkstart.publish('trunkstore.refresh', _data.data);
                });
            });

            winkstart.publish('numbers.render_endpoint_numbers', endpoint_data, data, $('.did_list', endpoint_html));
            winkstart.publish('numbers.render_endpoint_number_dropzone', endpoint_data, data, $('.dropzone', endpoint_html));

            (parent).append(endpoint_html);
        },

        render_endpoints: function(data, parent) {
            var THIS = this,
                target = $('#endpoints', parent),
                endpoints_html = THIS.templates.endpoints.tmpl(data);

            $.each(data.servers, function(index) {
                THIS.render_endpoint(data, index, $('#endpoint_list', endpoints_html));
            });

            $('#add_server', endpoints_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_endpoint_dialog({
                        realm: data.account.auth_realm,
                        auth: {},
                        options: {
                            e911_info: {}
                        }
                    },
                    data,
                    function(_data) {
                        winkstart.publish('trunkstore.refresh', _data.data);
                    }
                );
            });

            (target)
                .empty()
                .append(endpoints_html);
        }
    }
);
