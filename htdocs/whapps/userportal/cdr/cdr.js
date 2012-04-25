winkstart.module('userportal', 'cdr', {
	css: [
	'css/style.css'
	//'css/jquery-ui-1.8.8.custom.css'
	],

	templates: {
		cdr: 'tmpl/cdr.html'
	},

	subscribe: {
		'cdr.activate': 'activate',
	},

	resources: {
		'cdr.list': {
			url: '{api_url}/accounts/{account_id}/users/{user_id}/cdrs',
			contentType: 'application/json',
			verb: 'GET'
		},
		'cdr.read': {
			url: '{api_url}/accounts/{account_id}/users/{user_id}/cdrs/{cdr_id}',
			contentType: 'application/json',
			verb: 'GET'
		},
	}
},
function(args) {
    winkstart.registerResources(this.__whapp, this.config.resources);

	winkstart.publish('subnav.add', {
        whapp: 'userportal',
		module: this.__module,
		label: 'My Call History',
		icon: 'cdr',
        weight: '10'
	});
},
{
	activate: function(data) {
		var THIS = this;

		$('#ws-content').empty();

		this.templates.cdr.tmpl({}).appendTo( $('#ws-content') );

		var functionFilter = function(oSettings, aData, iDataIndex) {
			var dateMin = '';
			var dateMax = '';
			if($('#startDate').val() != '') {
				dateMin = new Date($('#startDate').val());
			}
			if($('#endDate').val() != '') {
				dateMax = new Date($('#endDate').val());
			}
			var dateVersion = new Date(aData[5]);
			if ( dateMin == "" && dateMax == "" )
			{
				return true;
			}
			else if ( dateMin == "" && dateVersion <= dateMax )
			{
				return true;
			}
			else if ( dateMin <= dateVersion && "" == dateMax )
			{
				return true;
			}
			else if ( dateMin <= dateVersion && dateVersion <= dateMax )
			{
				return true;
			}
			return false;
		};

		var columns = [
            {
                'sTitle': 'Caller ID Name',
                'sWidth': '150px'
            },

            {
                'sTitle': 'Caller ID Number',
                'sWidth': '150px'
            },
            {
                'sTitle': 'Callee ID Name',
                'sWidth': '150px'
            },
            {
                'sTitle': 'Callee ID Number',
                'sWidth': '150px'
            },
            {
                'sTitle': 'Duration',
                'sWidth': '80px'
            },
            {
                'sTitle': 'Date'
            }
		];

		winkstart.table.create('cdr', $('#cdr-grid'), columns, {}, {
			sDom: '<"date">frtlip'
		});
		$.fn.dataTableExt.afnFiltering.pop();
		$('div.date').html('Start Date: <input id="startDate" type="text"/>&nbsp;&nbsp;End Date: <input id="endDate" type="text"/>&nbsp;&nbsp;&nbsp;&nbsp;<a class="button-search" id="searchLink" href="#">Filter</a>');

		$('#startDate, #endDate').focus(function() {
			$('div.date input').removeClass('focusField');
			$(this).addClass('focusField');
		});

		$('#searchLink').click(function() {
			$.fn.dataTableExt.afnFiltering.push(functionFilter);
			winkstart.table.cdr.fnDraw();
		});

		$('#startDate').datepicker();
		$('#endDate').datepicker();

		function noData(data){
			if(data == null || data == undefined){
				data = '-';
			}

			return data;
		}

		winkstart.getJSON('cdr.list', {
			crossbar: true,
			account_id: winkstart.apps['userportal'].account_id,
		    user_id: winkstart.apps['userportal'].user_id,
            api_url: winkstart.apps['userportal'].api_url
		}, function(reply) {
			$.each(reply.data, function() {
				var cdr_id = this.cid || this.id;
                var caller_id_name = this.caller_id_name;
                var caller_id_number = this.caller_id_number;
                var callee_id_name = this.callee_id_name;
                var callee_id_number = this.callee_id_number;
                //var duration = this.billing_seconds;
                var duration = this.duration_seconds;
                var seconds = duration % 60;
                var minutes = (duration-seconds) / 60;

                if(minutes > 59) {
                    minutes -= 60;
                }
                var hours = (duration - (minutes*60) - seconds) / 3600;
                if(hours < 10) {
                    hours = '0' + hours;
                }
                if(minutes < 10) {
                    minutes = '0' + minutes;
                }
                if(seconds < 10) {
                    seconds = '0' + seconds;
                }
                duration = hours+':'+minutes+':'+seconds;
                var date = new Date((this.timestamp - 62167219200)*1000);
                var month = date.getMonth() +1;
                var year = date.getFullYear();
                var day = date.getDate();
                var humanDate = month+'/'+day+'/'+year;
                var humanTime = date.toLocaleTimeString();

                var humanFullDate = humanDate + ' ' + humanTime;

                if (!callee_id_number && this.call_direction == 'outbound') {
                    callee_id_number = this.from.split('@', 1);
                } else if (!callee_id_number && this.call_direction == 'inbound') {
                    callee_id_number = this.to.split('@', 1);
                }

                if (!caller_id_number && this.call_direction == 'outbound') {
                    caller_id_number = this.to.split('@', 1);
                } else if (!caller_id_number && this.call_direction == 'inbound') {
                    caller_id_number = this.from.split('@', 1);
                }

                winkstart.table.cdr.fnAddData([
                    noData(caller_id_name),
                    noData(caller_id_number),
                    noData(callee_id_name),
                    noData(callee_id_number),
                    noData(duration),
                    noData(humanFullDate)
                ]);
			});
		});

		winkstart.publish('layout.updateLoadedModule', {
			label: 'My Call History',
			module: this.__module
		});
	}
}
);
