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
               api_url: 'http://api.2600hz.com:8000/v1'
            },
            voip: {
                label: 'Trial PBX',
                icon: 'phone',
                api_url: 'http://api.2600hz.com:8000/v1'
            },
            accounts: {
                label: 'Accounts',
                icon: 'account',
                api_url: 'http://api.2600hz.com:8000/v1'
            }
        },

        /* Custom links */
        nav: {
            help: 'http://www.2600hz.org/support.html'
            /* logout: ''*/
        },

        default_api_url: 'http://api.2600hz.com:8000/v1',

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
                features: [
                    "Add / Delete servers ",
                    "Location of each server ",
                    "Role of each server ",
                    "Status"
                ],
                id: 'cluster',
                label: 'Cluster Manager',
                icon: 'cluster_manager',
                desc: "This application allows you to deploy, control and manage servers across all your data centers. An easy manager allows you to add and delete servers, shows you all the servers in your cluster, the role of each server, location, and most importantly - the status of each one."
            },
            'userportal': {
                features: [
                    "View realtime call history",
                    "See and listen to all your voicemails from the browser",
                    "Set up simple call forwarding",
                    "Choose an email to send voicemails to",
                    "Add and edit any device of your choice to communicate with"
                ],
                id: 'userportal',
                label: 'Userportal',
                icon: 'user',
                desc: "This application gives end-users access to control features related to their own phones. It's a simple one-stop location for accessing call history, configured devices and voicemail. Now, the user can have all the information about their devices and phone system from the web. "
            },
            'accounts': {
                features: [
                    "Customize all sub accounts ",
                    "White-label the portal that all your customers will see ",
                    "Set up monitoring so you can be notified exactly when an account de-registers¡"
                ],
                id: 'accounts',
                label: 'Accounts',
                icon: 'account',
                desc: "This application allows resellers and service providers to manage their customer accounts. Via this tool you can easily see and manage all the sub-accounts you have under your main account. Easily edit and configure all the accounts while saving time and money. "
            },
            'developer': {
                features: [
                    "Over 15 APIs",
                    "Real-time REST interface shows actual GET/PUT/POST/DELETE responses",
                    "Access to API and Account tokens"
                ],
                id: 'developer',
                label: 'Developer',
                icon: 'connectivity',
                desc: "This application allows you to try out using our APIs on the live production server. With access to over 15 APIs, you can try out the API calls that would be required to build your own applications. This will help developers fast-track their understanding on how to interact with our APIs."
            },
            'pbxs': {
                features: [
                    "Compliant with any PBX - Avaya, blue.box, Mitel, Shoretel, etc.",
                    "All can be done in just a few steps"
                ],
                id: 'pbxs',
                label: 'PBX Connector',
                icon: 'device',
                desc: "PBX Connector is an application that allows you to bring your existing PBX to Kazoo. So you can continue using the PBX you're comfortable with and only use Kazoo minutes and phone lines."
            },
            'numbers': {
                features: [
                    "Set Caller ID for each number",
                    "Designate a secondary number or SIP device that serves as the \"Failover Number\" in case that number becomes unreachable",
                    "Designate the e911 address associated to each numbe"
                ],
                id: 'numbers',
                label: 'Number Manager',
                icon: 'menu1',
                desc: "When you're managing a PBX or running a business there are more numbers in your hands than you can manage. Number Manager is an application that allows you to purchase and delete numbers, port numbers from other carriers, and see which ones are already assigned and which ones are available to assign to new customers. "
            }
        }
    };

    winkstart.apps = {
        'auth' : {
            api_url: 'http://api.2600hz.com:8000/v1',
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
