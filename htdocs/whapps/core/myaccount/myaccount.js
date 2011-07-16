winkstart.module('core', 'myaccount',
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
            'css/style.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            myaccount: 'tmpl/myaccount.html',
            billing: 'tmpl/billing.html',
            apps: 'tmpl/apps.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'myaccount.display' : 'display'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "myaccount.list": {
                url: 'http://www.mysite.com/get_json.php?somevar={some_value}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        // Tell winkstart about the APIs you are going to be using (see top of this file, under resources
        winkstart.registerResources(this.config.resources);

        // This app is slightly invasive - it assumes it should always be bound to an element named my_account anywhere on the page
        $('a#my_account').live('click', function() {
            console.log('Click');
            winkstart.publish('myaccount.display');
        })
    }, // End initialization routine



    /* Define the functions for this module */
    {
        display: function() {
            dialog = winkstart.popup(this.templates.myaccount.tmpl());

            $('#billing', dialog).append(this.templates.billing.tmpl());
            $('#apps', dialog).append(this.templates.apps.tmpl());
        }
    }
);  // End module
