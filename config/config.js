( function(winkstart, amplify, $) {

    winkstart.config =  {
        /* Was winkstart.debug */
        debug: false,

        advancedView: false,

        register_type: 'onboard',

        onboard_roles: {
            'default': {
                apps: {
                    voip: {
                        label: 'Hosted PBX',
                        icon: 'phone',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    },
                    pbxs: {
                        label: 'PBX Connector',
                        icon: 'device',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    },
                    numbers: {
                        label: 'Number Manager',
                        icon: 'menu1',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    }
                },
                available_apps: ['voip', 'cluster', 'userportal', 'accounts', 'developer', 'numbers', 'pbxs'],
                default_api_url: 'http://api.2600hz.com:8000/v1'
            },
            'reseller': {
                apps: {
                    voip: {
                        label: 'Hosted PBX',
                        icon: 'phone',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    },
                    accounts: {
                        label: 'Accounts',
                        icon: 'account',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    },
                    numbers: {
                        label: 'Number Manager',
                        icon: 'menu1',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    }
                },
                available_apps: ['voip', 'cluster', 'userportal', 'accounts', 'developer', 'numbers', 'pbxs'],
                default_api_url: 'http://api.2600hz.com:8000/v1'
            },
            'small_office': {
                apps: {
                    voip: {
                        label: 'Hosted PBX',
                        icon: 'phone',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    },
                    numbers: {
                        label: 'Number Manager',
                        icon: 'menu1',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    }
                },
                available_apps: ['voip', 'cluster', 'userportal', 'accounts', 'developer', 'numbers', 'pbxs'],
                default_api_url: 'http://api.2600hz.com:8000/v1'
            },
            'single_phone': {
                apps: {
                    voip: {
                        label: 'Hosted PBX',
                        icon: 'phone',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    },
                    numbers: {
                        label: 'Number Manager',
                        icon: 'menu1',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    }
                },
                available_apps: ['voip', 'cluster', 'userportal', 'accounts', 'developer', 'numbers', 'pbxs'],
                default_api_url: 'http://api.2600hz.com:8000/v1'
            },
            'api_developer': {
                apps: {
                    developer: {
                        label: 'Developer Tool',
                        icon: 'connectivity',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    },
                    numbers: {
                        label: 'Number Manager',
                        icon: 'menu1',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    }
                },
                available_apps: ['voip', 'cluster', 'userportal', 'accounts', 'developer', 'numbers', 'pbxs'],
                default_api_url: 'http://api.2600hz.com:8000/v1'
            },
            'voip_minutes': {
                apps: {
                    pbxs: {
                        label: 'PBX Connector',
                        icon: 'device',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    },
                    numbers: {
                        label: 'Number Manager',
                        icon: 'menu1',
                        api_url: 'http://api.2600hz.com:8000/v1'
                    }
                },
                available_apps: ['voip', 'cluster', 'userportal', 'accounts', 'developer', 'numbers', 'pbxs'],
                default_api_url: 'http://api.2600hz.com:8000/v1'
            }
        },

        device_threshold: [5, 20, 50, 100],

        /* web server used by the cdr module to show the link to the logs */
        logs_web_server_url: 'http://cdrs.2600hz.com/',

        /* Customized name displayed in the application (login page, resource module..) */
        company_name: '2600hz',

        base_urls: {
            'u.2600hz.com': {
                /* If this was set to true, Winkstart would look for u_2600hz_com.png in config/images/logos */
                custom_logo: false
            },
            'apps.2600hz.com': {
                custom_logo: false
            }
        },

        /* Was winkstart.realm_suffix */
        realm_suffix: {
            login: '.sip.2600hz.com',
            register: '.trial.2600hz.com'
        },

        /* What applications is available for a user that just registered */
        register_apps: {
            cluster: {
               label: 'Cluster Manager',
               icon: 'cluster_manager',
               api_url: 'http://apps.2600hz.com:8000/v1'
            },
            voip: {
                label: 'Trial PBX',
                icon: 'phone',
                api_url: 'http://apps.2600hz.com:8000/v1'
            },
            accounts: {
                label: 'Accounts',
                icon: 'account',
                api_url: 'http://apps.2600hz.com:8000/v1'
            }
        },

        /* Custom links */
        nav: {
            help: 'http://www.2600hz.org/support.html'
            /* logout: ''*/
        },

        default_api_url: 'http://apps.2600hz.com:8000/v1',

        available_apps: {
            'voip': {
                features: [
                    "Manage call flows",
                    "Create individual extensions for your entire small office ",
                    "Auto-provision phones and ",
                    "Create customized feature codes ",
                    "Manage devices for all users",
                ],
                id: 'voip',
                label: 'Hosted PBX',
                icon: 'device',
                desc: "This application gives you full access to add, edit and control all the PBX features you need including call flows, voicemails, conferencing, time of day call routing, etc. It's a complete web portal that allows you to visualize and manage your PBX without an ounce of hardware. "
            },
            'cluster': {
                id: 'cluster',
                label: 'Cluster Manager',
                icon: 'cluster_manager',
                desc: "Having a fully redundant system often means having several servers in various different data centers around the world. This application allows you to control and manage all those servers spread out across the full range of your data centers. An easy manager allows you to add and delete servers, shows you all the servers in your cluster, the role and location of each server and most importantly - the status of each one. "
            },
            'userportal': {
                id: 'userportal',
                label: 'Userportal',
                icon: 'user',
                desc: "This application gives you access to all the information you need to know about your personal account. It's your simple one-stop location to access call history, devices. Now, the user can have all the information about their devices and phone system from the web. "
            },
            'accounts': {
                id: 'accounts',
                label: 'Accounts',
                icon: 'account',
                desc: "This application allows you to easily see and manage all the sub-accounts you have under your main account. Now you can easily edit and configure all the accounts while saving time and money. "
            },
            'developer': {
                id: 'developer',
                label: 'Developer',
                icon: 'connectivity',
                desc: "This application gives you access to over 15 APIs where you can  build your own applications or customize and edit the Kazoo applications  using these simple APIs. Here, you will be able to understand how to add, edit, and build with our APIs using different buttons such as GET, PUT, POST, and DELETE to see the APIs in action with some sample code.  "
            },
            'pbxs': {
                id: 'pbxs',
                label: 'PBX Connector',
                icon: 'device',
                desc: "PBX Connector is an application that allows you to bring your existing PBX to Kazoo. So you can continue using the PBX you've always had and only use Kazoo minutes and phone lines. "
            },
            'numbers': {
                id: 'numbers',
                label: 'Number Manager',
                icon: 'menu1',
                desc: "When you're managing a PBX or running a business there are more numbers in your hands than you can manage. Number Manager is an application that allows you to purchase and delete numbers, port numbers from other carriers, and see which ones are assigned and which ones are available to assign to new customers. "
            }
        }
    };

    winkstart.apps = {
        'auth' : {
            api_url: 'http://apps.2600hz.com:8000/v1',
            /* These are some settings that are set automatically. You are free to override them here.
            account_id: null,
            auth_token: null,
            user_id: null,
            realm: null
            */
        },
        'myaccount': {}
    };

    amplify.cache = false;

})(window.winkstart = window.winkstart || {}, window.amplify = window.amplify || {}, jQuery);
