winkstart.module('connect', 'channels', {
        templates: {
            channels: 'tmpl/channels.html',
            channels_dialog: 'tmpl/channels_dialog.html'
        },

        subscribe: {
            'channels.render': 'render_channels'
        },

        resources: {
            "channels.update": {
                url: '{api_url}/{account_id}/channels',
                verb: 'POST'
            }
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        rates: {
            trunks: 30.00,
            inbound_trunks: 4.00
        },

        update_channels: function(data, success, error) {
            var THIS = this;

            winkstart.request('channels.update', {
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

        render_channels_dialog: function(data, callback) {
            var THIS = this,
                popup_html = THIS.templates.channels_dialog.tmpl($.extend(data, { rates: THIS.rates })),
                popup;

            $('#trunks, #inbound_trunks', popup_html).bind('keyup change', function() {
                var id = $(this).attr('id');

                $('#' + id + '_total', popup_html).html($(this).val() * THIS.rates[id]);
            });

            $('.update_channels_button', popup_html).click(function(ev) {
                var size = $('input[name="tos_agreed"]:checked', popup_html).size();

                ev.preventDefault();

                if(size) {
                    THIS.update_channels({
                            trunks: $('#trunks', popup_html).val(),
                            inbound_trunks: $('#inbound_trunks', popup_html).val()
                        },
                        function(_data) {
                            popup.dialog('close');

                            if(typeof callback == 'function') {
                                callback(_data);
                            }
                        }
                    );
                }
                else {
                    alert('You must agree to the general Terms and Conditions before continuing!');
                }
            });

            popup = winkstart.dialog(popup_html, { title: 'Edit channels' });
        },

        render_channels: function(data, parent) {
            var THIS = this,
                target = $('#channels', parent),
                channels_html = THIS.templates.channels.tmpl(data);

            $('#edit_channels', channels_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_channels_dialog(data, function(_data) {
                    THIS.render_channels(_data.data, parent);
                });
            });

            (target)
                .empty()
                .append(channels_html);
        }
    }
);
