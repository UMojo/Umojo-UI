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
		'cdr.deactivate': 'deactivate'
	},

	resources: {
		'cdr.list': {
			url: '{api_url}/accounts/{account_id}/users/{user_id}/cdr',
			contentType: 'application/json',
			verb: 'GET'
		},
		'cdr.read': {
			url: '{api_url}/accounts/{account_id}/users/{user_id}/cdr/{cdr_id}',
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
	deactivate: function(data) {
		var THIS = this;
        
		$.fn.dataTableExt.afnFiltering.pop();
	},
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

				winkstart.getJSON('cdr.read', {
					crossbar: true, 
					account_id: winkstart.apps['userportal'].account_id, 
		            user_id: winkstart.apps['userportal'].user_id,
                    api_url: winkstart.apps['userportal'].api_url,
					cdr_id: cdr_id
				}, function(reply) {
					var caller_id_name = reply.data.caller_id_name;
					var caller_id_number = reply.data.caller_id_number;
					var callee_id_name = reply.data.callee_id_name;
					var callee_id_number = reply.data.callee_id_number;
					var duration = reply.data.billing_seconds;
					var seconds = duration % 60;
					var minutes = (duration-seconds) / 60;
					if(seconds < 10) {
						seconds = '0'+seconds;
					}
					duration = minutes+':'+seconds;
					var date = new Date((reply.data.timestamp - 62167219200)*1000);
					var month = date.getMonth() +1;
					var year = date.getFullYear();
					var day = date.getDate();
					var humanDate = month+'/'+day+'/'+year;
					var humanTime = date.toLocaleTimeString();
                    
                    var humanFullDate = humanDate + ' ' + humanTime;
                    
					if(caller_id_name && caller_id_number && callee_id_name && callee_id_number){
						winkstart.table.cdr.fnAddData([
							noData(caller_id_name), 
							noData(caller_id_number), 
							noData(callee_id_name), 
							noData(callee_id_number), 
							noData(duration), 
							noData(humanFullDate)]);
					}
				});
			}); 
		});

		winkstart.publish('layout.updateLoadedModule', {
			label: 'My Call History',
			module: this.__module
		});
	}
}
);
