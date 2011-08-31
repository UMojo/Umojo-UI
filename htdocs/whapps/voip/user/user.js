winkstart.module('voip', 'user',
    {
        css: [
            'css/user.css'
        ],

        /* What HTML templates will we be using? */
        templates: {
            user: 'tmpl/user.html',
            editUser: 'tmpl/edit.html'
        },

        /* What events do we listen for, in the browser? */
        subscribe: {
            'user.activate' : 'activate',
            'user.list-panel-click' : 'editUser',
            'user.edit-user' : 'editUser'
        },

        formData: {
            timezones:  [{text: "Africa/Abidjan"},{text: "Africa/Accra"},{text: "Africa/Addis_Ababa"},{text: "Africa/Algiers"},{text: "Africa/Asmera"},{text: "Africa/Bamako"},{text: "Africa/Bangui"},{text: "Africa/Banjul"},{text: "Africa/Bissau"},{text: "Africa/Blantyre"},{text: "Africa/Brazzaville"},{text: "Africa/Bujumbura"},{text: "Africa/Cairo"},
 {text: "Africa/Casablanca"},{text: "Africa/Ceuta"},{text: "Africa/Conakry"},{text: "Africa/Dakar"},{text: "Africa/Dar_es_Salaam"},{text: "Africa/Djibouti"},{text: "Africa/Douala"},{text: "Africa/El_Aaiun"},{text: "Africa/Freetown"},{text: "Africa/Gaborone"},{text: "Africa/Harare"},{text: "Africa/Johannesburg"},{text: "Africa/Kampala"},{text: "Africa/Khartoum"},{text: "Africa/Kigali"},{text: "Africa/Kinshasa"},{text: "Africa/Lagos"},{text: "Africa/Libreville"},{text: "Africa/Lome"},{text: "Africa/Luanda"},{text: "Africa/Lubumbashi"},{text: "Africa/Lusaka"},{text: "Africa/Malabo"},{text: "Africa/Maputo"},{text: "Africa/Maseru"},{text: "Africa/Mbabane"},{text: "Africa/Mogadishu"},{text: "Africa/Monrovia"},{text: "Africa/Nairobi"},{text: "Africa/Ndjamena"},{text: "Africa/Niamey"},{text: "Africa/Nouakchott"},{text: "Africa/Ouagadougou"},{text: "Africa/Porto-Novo"},{text: "Africa/Sao_Tome"},{text: "Africa/Timbuktu"},{text: "Africa/Tripoli"},{text: "Africa/Tunis"},{text: "Africa/Windhoek"},{text: "America/Adak"},{text: "America/Anchorage"},{text: "America/Anguilla"},{text: "America/Antigua"},{text: "America/Araguaina"},{text: "America/Aruba"},{text: "America/Asuncion"},{text: "America/Barbados"},{text: "America/Belem"},{text: "America/Belize"},{text: "America/Boa_Vista"},{text: "America/Bogota"},{text: "America/Boise"},{text: "America/Buenos_Aires"},{text: "America/Cambridge_Bay"},{text: "America/Cancun"},{text: "America/Caracas"},{text: "America/Catamarca"},{text: "America/Cayenne"},{text: "America/Cayman"},{text: "America/Chicago"},{text: "America/Chihuahua"},{text: "America/Cordoba"},{text: "America/Costa_Rica"},{text: "America/Cuiaba"},{text: "America/Curacao"},{text: "America/Danmarkshavn"},{text: "America/Dawson"},{text: "America/Dawson_Creek"},{text: "America/Denver"},{text: "America/Detroit"},{text: "America/Dominica"},{text: "America/Edmonton"},{text: "America/Eirunepe"},{text: "America/El_Salvador"},{text: "America/Fortaleza"},{text: "America/Glace_Bay"},{text: "America/Godthab"},{text: "America/Goose_Bay"},{text: "America/Grand_Turk"},{text: "America/Grenada"},{text: "America/Guadeloupe"},{text: "America/Guatemala"},{text: "America/Guayaquil"},{text: "America/Guyana"},
 {text: "America/Halifax"},{text: "America/Havana"},{text: "America/Hermosillo"},{text: "America/Indiana/Indianapolis"},{text: "America/Indiana/Knox"},{text: "America/Indiana/Marengo"},{text: "America/Indiana/Vevay"},{text: "America/Indianapolis"},{text: "America/Inuvik"},{text: "America/Iqaluit"},{text: "America/Jamaica"},{text: "America/Jujuy"},{text: "America/Juneau"},{text: "America/Kentucky/Louisville"},{text: "America/Kentucky/Monticello"},{text: "America/La_Paz"},{text: "America/Lima"},{text: "America/Los_Angeles"},{text: "America/Louisville"},{text: "America/Maceio"},{text: "America/Managua"},{text: "America/Manaus"},{text: "America/Martinique"},{text: "America/Mazatlan"},{text: "America/Mendoza"},{text: "America/Menominee"},{text: "America/Merida"},{text: "America/Mexico_City"},{text: "America/Miquelon"},{text: "America/Monterrey"},{text: "America/Montevideo"},{text: "America/Montreal"},{text: "America/Montserrat"},{text: "America/Nassau"},{text: "America/New_York"},{text: "America/Nipigon"},{text: "America/Nome"},{text: "America/Noronha"},{text: "America/North_Dakota/Center"},{text: "America/Panama"},{text: "America/Pangnirtung"},{text: "America/Paramaribo"},{text: "America/Phoenix"},{text: "America/Port-au-Prince"},{text: "America/Port_of_Spain"},{text: "America/Porto_Velho"},{text: "America/Puerto_Rico"},{text: "America/Rainy_River"},{text: "America/Rankin_Inlet"},{text: "America/Recife"},{text: "America/Regina"},
 {text: "America/Rio_Branco"},{text: "America/Rosario"},{text: "America/Santiago"},{text: "America/Santo_Domingo"},{text: "America/Sao_Paulo"},{text: "America/Scoresbysund"},{text: "America/Shiprock"},{text: "America/St_Johns"},{text: "America/St_Kitts"},{text: "America/St_Lucia"},{text: "America/St_Thomas"},{text: "America/St_Vincent"},{text: "America/Swift_Current"},{text: "America/Tegucigalpa"},{text: "America/Thule"},{text: "America/Thunder_Bay"},{text: "America/Tijuana"},{text: "America/Tortola"},{text: "America/Vancouver"},{text: "America/Whitehorse"},{text: "America/Winnipeg"},{text: "America/Yakutat"},{text: "America/Yellowknife"},{text: "Antarctica/Casey"},{text: "Antarctica/Davis"},{text: "Antarctica/DumontDUrville"},{text: "Antarctica/Mawson"},{text: "Antarctica/McMurdo"},{text: "Antarctica/Palmer"},{text: "Antarctica/South_Pole"},{text: "Antarctica/Syowa"},{text: "Antarctica/Vostok"},{text: "Arctic/Longyearbyen"},{text: "Asia/Aden"},{text: "Asia/Almaty"},{text: "Asia/Amman"},{text: "Asia/Anadyr"},{text: "Asia/Aqtau"},{text: "Asia/Aqtobe"},{text: "Asia/Ashgabat"},{text: "Asia/Baghdad"},{text: "Asia/Bahrain"},{text: "Asia/Baku"},{text: "Asia/Bangkok"},{text: "Asia/Beirut"},{text: "Asia/Bishkek"},{text: "Asia/Brunei"},{text: "Asia/Calcutta"},{text: "Asia/Choibalsan"},{text: "Asia/Chongqing"},{text: "Asia/Colombo"},{text: "Asia/Damascus"},{text: "Asia/Dhaka"},{text: "Asia/Dili"},{text: "Asia/Dubai"},{text: "Asia/Dushanbe"},{text: "Asia/Gaza"},{text: "Asia/Harbin"},{text: "Asia/Hong_Kong"},{text: "Asia/Hovd"},{text: "Asia/Irkutsk"},{text: "Asia/Istanbul"},{text: "Asia/Jakarta"},{text: "Asia/Jayapura"},{text: "Asia/Jerusalem"},{text: "Asia/Kabul"},{text: "Asia/Kamchatka"},{text: "Asia/Karachi"},{text: "Asia/Kashgar"},{text: "Asia/Katmandu"},{text: "Asia/Krasnoyarsk"},{text: "Asia/Kuala_Lumpur"},{text: "Asia/Kuching"},{text: "Asia/Kuwait"},{text: "Asia/Macao"},{text: "Asia/Macau"},{text: "Asia/Magadan"},{text: "Asia/Makassar"},{text: "Asia/Manila"},{text: "Asia/Muscat"},{text: "Asia/Nicosia"},{text: "Asia/Novosibirsk"},{text: "Asia/Omsk"},{text: "Asia/Oral"},{text: "Asia/Phnom_Penh"},{text: "Asia/Pontianak"},{text: "Asia/Pyongyang"},{text: "Asia/Qyzylorda"},{text: "Asia/Qatar"},{text: "Asia/Rangoon"},{text: "Asia/Riyadh"},{text: "Asia/Saigon"},{text: "Asia/Sakhalin"},{text: "Asia/Samarkand"},{text: "Asia/Seoul"},{text: "Asia/Shanghai"},{text: "Asia/Singapore"},{text: "Asia/Taipei"},{text: "Asia/Tashkent"},{text: "Asia/Tbilisi"},{text: "Asia/Tehran"},{text: "Asia/Thimphu"},{text: "Asia/Tokyo"},{text: "Asia/Ujung_Pandang"},{text: "Asia/Ulaanbaatar"},{text: "Asia/Urumqi"},{text: "Asia/Vientiane"},{text: "Asia/Vladivostok"},{text: "Asia/Yakutsk"},{text: "Asia/Yekaterinburg"},{text: "Asia/Yerevan"},{text: "Atlantic/Azores"},{text: "Atlantic/Bermuda"},{text: "Atlantic/Canary"},{text: "Atlantic/Cape_Verde"},{text: "Atlantic/Faeroe"},
 {text: "Atlantic/Jan_Mayen"},{text: "Atlantic/Madeira"},{text: "Atlantic/Reykjavik"},{text: "Atlantic/South_Georgia"},{text: "Atlantic/St_Helena"},{text: "Atlantic/Stanley"},{text: "Australia/Adelaide"},{text: "Australia/Brisbane"},{text: "Australia/Broken_Hill"},{text: "Australia/Darwin"},{text: "Australia/Hobart"},{text: "Australia/Lindeman"},{text: "Australia/Lord_Howe"},{text: "Australia/Melbourne"},{text: "Australia/Perth"},{text: "Australia/Sydney"},{text: "Europe/Amsterdam"},{text: "Europe/Andorra"},{text: "Europe/Athens"},{text: "Europe/Belfast"},{text: "Europe/Belgrade"},{text: "Europe/Berlin"},{text: "Europe/Bratislava"},{text: "Europe/Brussels"},{text: "Europe/Bucharest"},{text: "Europe/Budapest"},{text: "Europe/Chisinau"},{text: "Europe/Copenhagen"},{text: "Europe/Dublin"},{text: "Europe/Gibraltar"},{text: "Europe/Helsinki"},{text: "Europe/Istanbul"},{text: "Europe/Kaliningrad"},{text: "Europe/Kiev"},{text: "Europe/Lisbon"},{text: "Europe/Ljubljana"},{text: "Europe/London"},{text: "Europe/Luxembourg"},{text: "Europe/Madrid"},{text: "Europe/Malta"},{text: "Europe/Minsk"},{text: "Europe/Monaco"},{text: "Europe/Moscow"},{text: "Europe/Nicosia"},{text: "Europe/Oslo"},{text: "Europe/Paris"},{text: "Europe/Prague"},{text: "Europe/Riga"},{text: "Europe/Rome"},{text: "Europe/Samara"},{text: "Europe/San_Marino"},{text: "Europe/Sarajevo"},{text: "Europe/Simferopol"},{text: "Europe/Skopje"},{text: "Europe/Sofia"},{text: "Europe/Stockholm"},{text: "Europe/Tallinn"},{text: "Europe/Tirane"},{text: "Europe/Uzhgorod"},{text: "Europe/Vaduz"},{text: "Europe/Vatican"},{text: "Europe/Vienna"},{text: "Europe/Vilnius"},{text: "Europe/Warsaw"},{text: "Europe/Zagreb"},{text: "Europe/Zaporozhye"},{text: "Europe/Zurich"},{text: "Indian/Antananarivo"},{text: "Indian/Chagos"},{text: "Indian/Christmas"},{text: "Indian/Cocos"},{text: "Indian/Comoro"},{text: "Indian/Kerguelen"},{text: "Indian/Mahe"},{text: "Indian/Maldives"},{text: "Indian/Mauritius"},{text: "Indian/Mayotte"},{text: "Indian/Reunion"},{text: "Pacific/Apia"},{text: "Pacific/Auckland"},{text: "Pacific/Chatham"},{text: "Pacific/Easter"},{text: "Pacific/Efate"},{text: "Pacific/Enderbury"},{text: "Pacific/Fakaofo"},{text: "Pacific/Fiji"},{text: "Pacific/Funafuti"},{text: "Pacific/Galapagos"},{text: "Pacific/Gambier"},{text: "Pacific/Guadalcanal"},{text: "Pacific/Guam"},{text: "Pacific/Honolulu"},{text: "Pacific/Johnston"},{text: "Pacific/Kiritimati"},{text: "Pacific/Kosrae"},{text: "Pacific/Kwajalein"},{text: "Pacific/Majuro"},{text: "Pacific/Marquesas"},{text: "Pacific/Midway"},{text: "Pacific/Nauru"},{text: "Pacific/Niue"},{text: "Pacific/Norfolk"},{text: "Pacific/Noumea"},{text: "Pacific/Pago_Pago"},{text: "Pacific/Palau"},{text: "Pacific/Pitcairn"},{text: "Pacific/Ponape"},{text: "Pacific/Port_Moresby"},{text: "Pacific/Rarotonga"},{text: "Pacific/Saipan"},{text: "Pacific/Tahiti"},{text: "Pacific/Tarawa"},{text: "Pacific/Tongatapu"},{text: "Pacific/Truk"},{text: "Pacific/Wake"},{text: "Pacific/Wallis"},{text: "Pacific/Yap"}
   ] 
        },

        validation : [
                {name : '#first_name', regex : /^[a-zA-Z\s\-]+$/},
                {name : '#last_name', regex : /^[a-zA-Z\s\-]+$/},
                {name : '#email', regex: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/},
                {name : '#caller_id_number_internal', regex: /^[\+]?[0-9]*$/},
                {name : '#caller_id_name_internal', regex: /^.*$/},
                {name : '#caller_id_number_external', regex: /^[\+]?[0-9]*$/},
                {name : '#caller_id_name_external', regex: /^.*/},
                {name : '#call_forward_number', regex: /^[\+]?[0-9]*$/}
        ],

        /* What API URLs are we going to be calling? Variables are in { }s */
        resources: {
            "user.list": {
                url: '{api_url}/accounts/{account_id}/users',
                contentType: 'application/json',
                verb: 'GET'
            },
            "user.get": {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            "user.create": {
                url: '{api_url}/accounts/{account_id}/users',
                contentType: 'application/json',
                verb: 'PUT'
            },
            "user.update": {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'POST'
            },
            "user.delete": {
                url: '{api_url}/accounts/{account_id}/users/{user_id}',
                contentType: 'application/json',
                verb: 'DELETE'
            }
        }
    },

    /* Bootstrap routine - run when the module is first loaded */
    function(args) {
        /* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
        winkstart.registerResources(this.__whapp, this.config.resources);

        winkstart.publish('subnav.add', {
            whapp: 'voip',
            module: this.__module,
            label: 'Users',
            icon: 'user',
            weight: '10'
        });
    },

    {
        validateForm: function(state) {
            var THIS = this;
            
            $(THIS.config.validation).each(function(k, v) {
                if(state == undefined) {
                    winkstart.validate.add($(v.name), v.regex);
                } else if (state == 'save') {
                    winkstart.validate.save($(v.name), v.regex);
                }
            });
        },

        saveUser: function(user_id, form_data) {
            var THIS = this;
            
            // Deleting the password values from the infos gathered in the form
            delete form_data.pwd_mngt_pwd1;
            delete form_data.pwd_mngt_pwd2;

            /* Check validation before saving */
            THIS.validateForm('save');

            var tmpPassword = $('#pwd_mngt_pwd1').val();
            
            if($('#pwd_mngt_pwd1').val() == $('#pwd_mngt_pwd2').val()) {
                if(!$('.invalid').size()) {
                    /* Construct the JSON we're going to send */

                    /* Is this a create or edit? See if there's a known ID */
                    if (user_id) {
                        
                        winkstart.getJSON('user.get', {
                            crossbar: true,
                            account_id: winkstart.apps['voip'].account_id,
                            api_url: winkstart.apps['voip'].api_url,
                            user_id: user_id
                        }, function(data, status){
                            delete data.data.id;
                            
                            // If there is no apps object
                            if (!("apps" in data.data)) {
                                data.data.apps = {};
                            }
                            
                            // If the user is an admin
                            if (form_data.user_level == "admin") {
                                if (!("voip" in data.data.apps)) {
                                    data.data.apps.voip = {
                                        "label": "VoIP Services",
                                        "icon": "phone",
                                        "api_url": "http://apps.2600hz.com:8000/v1"
                                    };
                                }
                                
                                if ("userportal" in data.data.apps) {
                                    delete data.data.apps.userportal;
                                }
                            } else { // If the user is a "simple" user.
                                if (!("userportal" in data.data.apps)) {
                                    data.data.apps.userportal = {
                                        "label": "User Portal",
                                        "icon": "phone",
                                        "api_url": "http://apps.2600hz.com:8000/v1"
                                    };
                                }
                                
                                if ("voip" in data.data.apps) {
                                    delete data.data.apps.voip;
                                }
                            }
                            
                            delete form_data.user_level;
                            
                            var newform_data = $.extend(true, {}, data.data, form_data);
                            
                            var rest_data = {};
                            rest_data.crossbar = true;
                            rest_data.account_id = winkstart.apps['voip'].account_id,
                            rest_data.api_url = winkstart.apps['voip'].api_url,
                            rest_data.user_id = user_id;
                            rest_data.data = newform_data;
                            
                            // If another password is set ("fakePassword" is the default value)
                            if (tmpPassword != "fakePassword") {
                                rest_data.data.password = tmpPassword;
                            }
                            
                            /* EDIT */
                            winkstart.postJSON('user.update', rest_data, function (json, xhr) {
                                /* Refresh the list and the edit content */
                                THIS.renderList();
                                THIS.editUser({
                                    id: user_id
                                });
                            });
                        });
                        
                        
                    } else {
                        /* CREATE */
                        
                        form_data.apps = {};
                        
                        if (form_data.user_level == "admin") {
                            form_data.apps.voip = {
                                "label": "VoIP Services",
                                "icon": "phone",
                                "api_url": "http://apps.2600hz.com:8000/v1"
                            };
                        } else {
                            form_data.apps.userportal = {
                                "label": "User Portal",
                                "icon": "phone",
                                "api_url": "http://apps.2600hz.com:8000/v1"
                            }
                        }
                        
                        var tmpPassword = $('#pwd_mngt_pwd1').val();
                        
                        delete form_data.user_level;
                        delete form_data.pwd_mngt_pwd1;
                        delete form_data.pwd_mngt_pwd2;
                        
                        // If another password is set ("fakePassword" is the default value)
                        if (tmpPassword != "fakePassword") {
                            form_data.data.password = tmpPassword;
                        }

                        /* Actually send the JSON data to the server */
                        winkstart.putJSON('user.create', {
                            crossbar: true,
                            account_id: winkstart.apps['voip'].account_id,
                            api_url: winkstart.apps['voip'].api_url,
                            data: form_data
                        }, function (json, xhr) {
                            THIS.renderList();
                            THIS.editUser({
                                id: json.data.id
                            });
                        });
                    }

                } else {
                    alert('Please correct errors that you have on the form.');
                }
            } else {
                alert('Please confirm your password');
            }

            

            
        },

        /*
         * Create/Edit user properties (don't pass an ID field to cause a create instead of an edit)
         */
        editUser: function(data){

            $('#user-view').empty();
            var THIS = this;
            var form_data = {
                data : {
                    call_forward: {},
                    caller_id: {internal: { }, external: { }}
                }
            };
            
            form_data.field_data = THIS.config.formData;


            if (data && data.id) {
                /* This is an existing user - Grab JSON data from server for user_id */
                winkstart.getJSON('user.get', {
                    crossbar: true,
                    account_id: winkstart.apps['voip'].account_id,
                    api_url: winkstart.apps['voip'].api_url,
                    user_id: data.id
                }, function(json, xhr) {
                    /* On success, take JSON and merge with default/empty fields */
                    $.extend(true, form_data, json);

                    THIS.renderUser(form_data);
                });
            } else {
                /* This is a new user - pass along empty params */
                THIS.renderUser(form_data);
            }
        },

        deleteUser: function(user_id) {
            var THIS = this;
            
            var rest_data = {
                crossbar: true,
                account_id: winkstart.apps['voip'].account_id,
                api_url: winkstart.apps['voip'].api_url,
                user_id: user_id
            };

            /* Actually send the JSON data to the server */
            winkstart.deleteJSON('user.delete', rest_data, function (json, xhr) {
                THIS.renderList();
                $('#user-view').empty();
            });
        },

        /**
         * Draw user fields/template and populate data, add validation. Works for both create & edit
         */
        renderUser: function(form_data){
            var THIS = this;
            var user_id = form_data.data.id;
            
            // If the voip whapps is present, then it's an admin'
            if ('apps' in form_data.data && 'voip' in form_data.data.apps) {
                form_data.priv_level = 'admin';
            } else {
                form_data.priv_level = 'user';
            }

            /* Paint the template with HTML of form fields onto the page */
            THIS.templates.editUser.tmpl(form_data).appendTo( $('#user-view') );

            winkstart.cleanForm();

            /* Initialize form field validation */
            THIS.validateForm();

            $("ul.settings1").tabs("div.pane > div");
            $("ul.settings2").tabs("div.advanced_pane > div");
            $("#first_name").focus();
            
            $(".advanced_pane").hide();
            $(".advanced_tabs_wrapper").hide();

            $("#advanced_settings_link").click(function(event) {
                if($(this).attr("enabled")=="true") {
                    $(this).attr("enabled", "false");
                    $(".advanced_pane").slideToggle(function(event) {
                        $(".advanced_tabs_wrapper").animate({width: 'toggle'});
                    });
                }
                else {
                    $(this).attr("enabled", "true");
                    $(".advanced_tabs_wrapper").animate({width: 'toggle'}, function(event) {
                        $(".advanced_pane").slideToggle();
                    });
                }
            });

            /* Listen for the submit event (i.e. they click "save") */
            $('.user-save').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                /* Grab all the form field data */
                var form_data = form2object('user-form');
                //form_data.username = form_data.email;
                THIS.saveUser(user_id, form_data);

                return false;
            });

            $('.user-cancel').click(function(event) {
                event.preventDefault();

                /* Cheat - just delete the main content area. Nothing else needs doing really */
                $('#user-view').empty();

                return false;
            });

            $('.user-delete').click(function(event) {
                /* Save the data after they've clicked save */

                /* Ignore the normal behavior of a submit button and do our stuff instead */
                event.preventDefault();

                THIS.deleteUser(user_id);

                return false;
            });
            
            $.each($('body').find('*[tooltip]'), function(){
                $(this).tooltip({attach:'body'});
            });
        },

        /* Builds the generic data list on the left hand side. It's responsible for gathering the data from the server
         * and populating into our standardized data list "thing".
         */
        renderList: function(){
            var THIS = this;

            winkstart.getJSON('user.list', {
                crossbar: true,
                account_id: winkstart.apps['voip'].account_id,
                api_url: winkstart.apps['voip'].api_url
            }, function (json, xhr) {

                // List Data that would be sent back from server
                function map_crossbar_data(crossbar_data){
                    var new_list = [];
                    if(crossbar_data.length > 0) {
                        _.each(crossbar_data, function(elem){
                            var title = elem.username;
                            if (elem.first_name) {
                                title += ' (' + elem.first_name;
                                if (elem.last_name) {
                                    title += ' ' + elem.last_name;
                                }
                                title += ')';
                            }

                            new_list.push({
                                id: elem.id,
                                title: elem.first_name + ' ' + elem.last_name
                            });
                        });
                    }
                    new_list.sort(function(a, b) {
                        var answer;
                        a.title.toLowerCase() < b.title.toLowerCase() ? answer = -1 : answer = 1;
                        return answer;
                    });
                    return new_list;
                }

                var options = {};
                options.label = 'User Module';
                options.identifier = 'user-module-listview';
                options.new_entity_label = 'User';
                options.data = map_crossbar_data(json.data);
                options.publisher = winkstart.publish;
                options.notifyMethod = 'user.list-panel-click';
                options.notifyCreateMethod = 'user.edit-user';  /* Edit with no ID = Create */

                $("#user-listpanel").empty();
                $("#user-listpanel").listpanel(options);

            });
        },

        /* This runs when this module is first loaded - you should register to any events at this time and clear the screen
         * if appropriate. You should also attach to any default click items you want to respond to when people click
         * on them. Also register resources.
         */
        activate: function(data) {
            $('#ws-content').empty();
            var THIS = this;
            this.templates.user.tmpl({}).appendTo( $('#ws-content') );

            winkstart.loadFormHelper('forms');

            winkstart.publish('layout.updateLoadedModule', {
                label: 'User Management',
                module: this.__module
            });

            $('.edit-user').live({
                click: function(evt){
                    var target = evt.currentTarget;
                    var user_id = target.getAttribute('rel');
                    winkstart.publish('user.edit-user', {
                        'user_id' : user_id
                    });
                }
            });

            THIS.renderList();
        }
    }
);
