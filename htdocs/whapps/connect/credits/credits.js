winkstart.module('connect', 'credits', {
        css: [
            'css/credits.css'
        ],

        templates: {
            credits: 'tmpl/credits.html',
            credits_dialog: 'tmpl/credits_dialog.html'
        },

        subscribe: {
            'credits.render' : 'render_credits'
        },

        resources: {
            'credits.update': {
                url: '{api_url}/{account_id}/credits',
                contentType: 'application/json',
                verb: 'POST'
            }
        }
    },

    function() {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        add_credits: function(credits, success, error) {
            var THIS = this;

            winkstart.request('credits.update', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: 'https://store.2600hz.com/v1',
                    data: {
                        'add_credits': credits
                    }
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

        render_credits_dialog: function(data, callback) {
            var THIS = this,
                popup_html = THIS.templates.credits_dialog.tmpl(data),
                popup;

            $('.credits.add', popup_html).click(function(ev) {
                ev.preventDefault();

                THIS.add_credits($('input[type="radio"]:checked', popup_html).val(), function(_data) {
                    popup.dialog('close');

                    if(typeof callback == 'function') {
                        callback(_data);
                    }
                });
            });

            popup = winkstart.dialog(popup_html, { title: 'Add Credits' });
        },

        render_credits: function(data, parent) {
            var THIS = this,
                target = $('#credits', parent),
                credits_html = THIS.templates.credits.tmpl(data);

            $('#add_prepay_button', credits_html).click(function(ev) {
                ev.preventDefault();

                THIS.render_credits_dialog(data, function(_data) {
                    THIS.render_credits(_data.data, parent);
                });
            });

            (target)
                .empty()
                .append(credits_html);
        }
    }
);
