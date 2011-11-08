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
        },

        resources: {
            "endpoints.create": {
                url: '{api_url}/{account_id}/endpoints',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "endpoints.update": {
                url: '{api_url}/{account_id}/endpoints',
                contentType: 'application/json',
                verb: 'POST'
            },
            "endpoints.delete": {
                url: '{api_url}/{account_id}/endpoints',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    },

    function() {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        save_endpoint: function(data, success, error) {
            var THIS = this;

            if(data.serverid) {
                winkstart.request('endpoints.update', {
                        account_id: winkstart.apps['connect'].account_id,
                        api_url: winkstart.apps['connect'].api_url,
                        data: data
                    },
                    function(_data, status) {
                        if(typeof success == 'function') {
                            success(_data, status, 'update');
                        }
                    },
                    function(_data, status) {
                        if(typeof error == 'function') {
                            error(_data, status, 'update');
                        }
                    }
                );
            }
            else {
                winkstart.request('endpoints.create', {
                        account_id: winkstart.apps['connect'].account_id,
                        api_url: winkstart.apps['connect'].api_url,
                        data: $.extend(true, {}, data, {
                            DIDs: {},
                            options: {
                                inbound_format: 'e.164',
                                enabled: true
                            }
                        })
                    },
                    function(_data, status) {
                        if(typeof success == 'function') {
                            success(_data, status, 'create');
                        }
                    },
                    function(_data, status) {
                        if(typeof error == 'function') {
                            error(_data, status, 'create');
                        }
                    }
                );
            }
        },

        delete_server: function(data, success, error) {
            var THIS = this;

            winkstart.request('endpoints.delete', {
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

        render_endpoint_dialog: function(data, callback) {
            var THIS = this,
                popup_html = THIS.templates.endpoint_dialog.tmpl(data),
                popup;

            $('.endpoint.edit', popup_html).click(function(ev) {
                var form_data = form2object('endpoint');

                ev.preventDefault();

                THIS.save_endpoint(form_data, function(_data) {
                    popup.dialog('close');

                    if(typeof callback == 'function') {
                        callback(_data);
                    }
                });
            });

            popup = winkstart.dialog(popup_html, { title: 'Edit endpoint' });
        },

        render_endpoint: function(_data, index, target, parent) {
            var THIS = this,
                data = $.extend(true, {
                        serverid: index,
                        realm: _data.account.auth_realm
                    },
                    _data.servers[index]
                ),
                endpoint_html = THIS.templates.endpoint.tmpl(data);

            $('.modifyServerDefaults', endpoint_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_endpoint_dialog(data, function(_data) {
                    THIS.render_endpoint(_data.data, index, target);
                });
            });

            $('.deleteServer', endpoint_html).click(function(ev) {
                ev.preventDefault();

                THIS.delete_server({ serverid: index }, function(_data) {
                    THIS.render_endpoints(_data.data, parent);
                });
            });

            $(target)
                .empty()
                .append(endpoint_html);
        },

        render_endpoints: function(data, parent) {
            var THIS = this,
                target = $('#endpoints', parent),
                endpoints_html = THIS.templates.endpoints.tmpl(data);

            $.each(data.servers, function(index) {
                var endpoint = $('<div class="endpoint"/>').appendTo($('#endpoint_list', endpoints_html));

                THIS.render_endpoint(data, index, endpoint, parent);
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
                    function(_data) {
                        THIS.render_endpoints(_data.data, parent);
                    }
                );
            });

            (target)
                .empty()
                .append(endpoints_html);
        }
    }
);
