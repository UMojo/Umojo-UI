winkstart.module('voip', 'cdr',
    /* Start module resource definitions */
    {
        /* What CSS stylesheets do you want automatically loaded? */
        css: [
            'css/style.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            index: 'tmpl/index.html',        // This is utilized later as THIS.templates.index.tmpl({ data_here})
            results: 'tmpl/results.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'cdr.activate' : 'activate',
            'cdr.index' : 'viewIndex'
        },

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "cdr.list": {
                url: 'http://pbx.2600hz.com/get_cdr.php?key={account}',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    }, // End module resource definitions



    /* Bootstrap routine - runs automatically when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.config.resources);

        winkstart.publish('subnav.add', {
            whapp: 'voip',
            module: this.__module,
            label: 'CDRs'
        });
    }, // End initialization routine



    /* Define the functions for this module */
    {

        /*
         * View some data
         * Called when someone clicks something on the screen or does winkstart.publish('cdr.index');'
         */
        viewIndex : function() {
            var THIS = this;
            winkstart.log('Sample debug message!');

            // Clear out the section of the screen named cdr-view
            $('#cdr-view').empty();

            // Go get data from the server
            winkstart.getJSON('cdr.list',
                /* Arguments to pass to the other server, or config parameters on HOW to pass to the server */
                {
                    /*crossbar: true,
                    account_id: MASTER_ACCOUNT_ID,*/
                    account : "urban"
                },

                /* What to do on successfully getting JSON */
                function (json, xhr) {
                    /* Do something with the results */
			/* Clear old results */
			$('#ws-content').empty();

			// Grab doc.Call-Direction, doc.Call-ID, doc.Callee-ID-Name, doc.Callee-ID-Number, doc.Caller-ID-Name, doc.Caller-ID-Number, doc.Custom-Channel-Vars, doc.
		console.log(json);
		console.log(json.rows[0].doc['From-Uri'],  json.rows[0].doc['To-Uri']);

		             /*<div>{data.doc['From-Uri']}</div> */
            THIS.templates.results.tmpl({data:json.rows}).appendTo( $('#ws-content') );
		}
            );

       },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            var THIS = this;
            /* Clear out the center part of the window - get ready to put our own content in there */
            $('#ws-content').empty();

            /* Draw our base template into the window */
            THIS.templates.index.tmpl().appendTo( $('#ws-content') );

            winkstart.publish('layout.updateLoadedModule', {
                label: 'CDRs',
                module: this.__module
            });

            /* Global binding to click event */
            $('.list-cdr').live({
                click: function(evt){
                    winkstart.publish('cdr.index');
                }
            });
        }
    } // End function definitions

);  // End module

