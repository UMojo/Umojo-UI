winkstart.module('connect', 'sipservice', {
        css: [
            'css/style.css',
            'css/popups.css'
        ],

        templates: {
            index: 'tmpl/index.html',
            main: 'tmpl/main.html',
            main_services : 'tmpl/main_services.html'
        },

        subscribe: {
            'trunkstore.refresh': 'render_trunkstore',
            'sipservice.activate' : 'activate'
        },

        resources: {
            "sipservice.get": {
                //url: winkstart.apps['connect'].api_url + '/ts_accounts/{account_id}',
                url: 'https://store.2600hz.com/v1/{account_id}/get_idoc',
                verb: 'GET'
            },

            "sipservice.createTicket": {
                url: 'https://store.2600hz.com/v1/createTicket',
                verb: 'PUT'
            },

            'trunkstore.create': {
                url: '{api_url}/ts_accounts',
                contentType: 'application/json',
                verb: 'PUT'
            },
            'trunkstore.get': {
                url: '{api_url}/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'trunkstore.update': {
                url: '{api_url}/ts_accounts/{account_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);
    },

    {
        render_trunkstore: function(data, _parent) {
            var THIS = this,
                parent = _parent || $('#ws-content'),
                trunkstore_html = THIS.templates.main.tmpl();

            THIS.templates.main_services.tmpl().appendTo($('#my_services', trunkstore_html));

            winkstart.publish('credits.render', data, trunkstore_html);
            winkstart.publish('channels.render', data, trunkstore_html);
            winkstart.publish('endpoints.render', data, trunkstore_html);
            winkstart.publish('numbers.render', data, trunkstore_html);

            (parent)
                .empty()
                .append(trunkstore_html);
        },



        activate: function(parent) {
            var THIS = this;

            winkstart.request(true, 'trunkstore.get', {
                    account_id: winkstart.apps['connect'].account_id,
                    api_url: winkstart.apps['connect'].api_url
                },
                function(data, status) {
                    THIS.render_trunkstore(data.data, parent);
                }
            );
        }
    }
);
