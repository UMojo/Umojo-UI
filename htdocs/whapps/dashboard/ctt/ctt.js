winkstart.module('dashboard', 'ctt',
	{
		css: [
		'css/ctt.css'
		],

		/* What HTML templates will we be using? */
		templates: {
			ctt: 'tmpl/ctt.html'
		},

		/* What events do we listen for, in the browser? */
		subscribe: {
			'ctt.activate' : 'activate'
		},

		formData: {
		},
		validation : [
		],

		/* What API URLs are we going to be calling? Variables are in { }s */
		resources: {
			"cdr.list": {
				url: winkstart.apps['dashboard'].api_url + '/accounts/{account_id}/cdr',
				contentType: 'application/json',
				verb: 'GET'
			},
			"cdr.read": {
				url: winkstart.apps['dashboard'].api_url + '/accounts/{account_id}/cdr/{cdr_id}',
				contentType: 'application/json',
				verb: 'GET'
			}
		}
	},

	/* Bootstrap routine - run when the module is first loaded */
	function(args) {
		/* Tell winkstart about the APIs you are going to be using (see top of this file, under resources */
		winkstart.registerResources(this.__whapp, this.config.resources);
        
		winkstart.publish('subnav.add', {
			whapp: 'dashboard',
			module: this.__module,
			label: 'Call Trace Tool',
			icon: 'registration'
		});
	},

	{
		/* This runs when this module is first loaded - you should register to any events at this time and clear the screen
     * if appropriate. You should also attach to any default click items you want to respond to when people click
     * on them. Also register resources.
     */
		activate: function(data) {
			$('#ws-content').empty();
			$('body').after('<div id="details_dialog"></div>');
			var THIS = this;
            
			winkstart.loadFormHelper('forms');

			this.templates.ctt.tmpl({}).appendTo( $('#ws-content') );
			
			var num_rows = 0;

			winkstart.getJSON('cdr.list', {
				crossbar: true, 
				account_id: winkstart.apps['dashboard'].account_id
				//account_id: '04152ed2b428922e99ac66f3a71b0215'
			}, function(reply) {
				THIS.setup_table();
				
				$.each(reply.data, function() {
					var cdr_id = this.id;
                    
					winkstart.getJSON('cdr.read',{
						crossbar: true, 
						account_id: winkstart.apps['dashboard'].account_id,
						//account_id: '04152ed2b428922e99ac66f3a71b0215', 
						cdr_id: cdr_id
					}, function(reply) {
						if(reply.data == undefined) {
							return false;
						}
                        
						function noData(data){
							if(data == null){
								return 'No data';
							}else{
								return data;
							}
						}
						
						function formatDate(timestamp){
							var tmp = null;
							var tpmDate = new Date((timestamp - 62167219200)*1000);
						
							if(tpmDate != null && tpmDate != undefined){
								tmp = $.datepicker.formatDate('mm/dd/y', tpmDate);
								
								var min = tpmDate.getUTCMinutes();
								
								if(min < 10){
									tmp += ' '+tpmDate.getHours()+':0'+min;
								}else{
									tmp += ' '+tpmDate.getHours()+':'+min;
								}
							}
							return tmp;
						}
                            
						function writeDetailsDialog(obj){
							var out = '<div><table class="details_table">';                          

							$.each(obj, function(index, value){
								//Hack to get Data from local and remote sdp
								if(index == 'local_sdp' || index == 'remote_sdp'){
									out += '<tr><td class="bold" colspan="2" style="text-align:center;">'+index+'</td></tr>';
									
									var sdp = value.split('\n');
									sdp.splice(sdp.length-1, 1);
                                    
									$.each(sdp, function(i, v){
										$.each(v.split('='), function($i, $v){
											if($i == 0){
												out += '<tr><td class="bold">'+$v+'</td>'; 
											}
											if($i == 1){
												out += '<td>'+$v+'</td></tr>';  
											}  
										});
									}); 
								}else{
									out += '<tr><td class="bold">'+index+'</td><td>'+value+'</td></tr>';
								}
							});
							out += '</table></div>'
							return out;
						}
                        
						function writeLegsDialog(legA, legB){
                            
							var out = '<div class="legA"><table class="details_table">'; 
                            
							if(legB != null && legB != undefined){
								$.each(legA, function(index, value){
									if(index == 'local_sdp' || index == 'remote_sdp'){
										out += '<tr><td class="bold" colspan="2" style="text-align:center;">'+index+'</td></tr>';
										
										var sdp = value.split('\n');
										sdp.splice(sdp.length-1, 1);
                                    
										$.each(sdp, function(i, v){
											$.each(v.split('='), function($i, $v){
												if($i == 0){
													out += '<tr><td class="bold">'+$v+'</td>'; 
												}
												if($i == 1){
													out += '<td>'+$v+'</td></tr>';  
												}
											});
										});
									}else{
										out += '<tr><td class="bold">'+index+'</td><td>'+value+'</td></tr>';
									}
								});
								out += '</table></div><div class="legB"><table class="details_table">';                          

								$.each(legB, function(index, value){
									if(index == 'local_sdp' || index == 'remote_sdp'){
										out += '<tr><td class="bold" colspan="2" style="text-align:center;">'+index+'</td></tr>';
										
										var sdp = value.split('\n');
										sdp.splice(sdp.length-1, 1);
                                    
										$.each(sdp, function(i, v){
											$.each(v.split('='), function($i, $v){
												if($i == 0){
													out += '<tr><td class="bold">'+$v+'</td>'; 
												}
												if($i == 1){
													out += '<td>'+$v+'</td></tr>';  
												}
											});
										});
									}else{
										out += '<tr><td class="bold">'+index+'</td><td>'+value+'</td></tr>';
									}
								});
								out += '</table></div>'
							}else{
								out = 'B leg undefined or null';
							}

							return out;
						}
                        
						function drawRows(id, obj){

							winkstart.table.ctt.fnAddData([
								noData(id),
								noData(obj.callee_id_number),
								noData(obj.caller_id_number),
								noData(obj.duration_seconds),
								noData(obj.hangup_cause),
								'<div id="'+id+'_debug" class="link_table">Debug</div>',
								'<div id="'+id+'_details" class="link_table">Details</div>',
								'<div id="'+id+'_leg" class="link_table">Leg B</div>',
								noData(formatDate(obj.timestamp)),
								]);
                                
							$('#'+id+'_debug').live('click', function(){
								var uri = encodeURI('http://log001-prod-dfw.2600hz.com:9292/search#'+
									'{"offset":0,"count":50,"q":"'+obj.call_id+'","interval":3600000}');
								window.open(uri);
							});
                                    
							$('#'+id+'_details').live('click', function(){
                                
								$('#details_dialog').dialog('close');
                                
								var dialog_div = writeDetailsDialog(obj);
								$('#'+id+'_details').data('dialog', dialog_div);

								$('#details_dialog').dialog({
									open: function(event, ui){
										$('#details_dialog').html($('#'+id+'_details').data('dialog'))
									},
									autoOpen: false,
									title: 'Details for call id: '+id,
									minWidth:550,
									width: 550, 
									minHeight:575,
									height: 575
								});
								$('#details_dialog').dialog('open');
							});
                            
							$('#'+id+'_leg').live('click', function(){

								if(obj.other_leg_call_id != undefined && obj.other_leg_call_id != null){

									winkstart.getJSON('cdr.read',{
										crossbar: true, 
										account_id: winkstart.apps['dashboard'].account_id,
										//account_id: '04152ed2b428922e99ac66f3a71b0215', 
										cdr_id: obj.id
									}, function(reply) {
										var dialog_div = writeLegsDialog(obj, reply.data);
										$('#'+id+'_leg').data('dialog', dialog_div);
                                
										$('#details_dialog').dialog('close');

										$('#details_dialog').dialog({
											open: function(event, ui){
												$('#details_dialog').html($('#'+id+'_leg').data('dialog'))
											},
											autoOpen: false,
											title: 'Leg A: '+id+' Leg B: '+obj.other_leg_call_id,
											minWidth:1115,
											width: 1115, 
											minHeight:575,
											height: 575
										});
										$('#details_dialog').dialog('open');
									});
								}else{
									alert('No B leg');
								}
							});
						}
						
						if(reply.data['related_cdrs'] != null && reply.data['related_cdrs'] != undefined){
							$.each(reply.data['related_cdrs'], function(index, value) {
								num_rows = num_rows+1;                       
								drawRows(reply.data.id+'_'+index, value);
							});
						}else{
							drawRows(reply.data.id, reply.data);
						}
                        
						num_rows = num_rows+1;
                        
						//Hack to hide pagination if number of rows < 10
						if(num_rows < 10){
							$('body').find('.dataTables_paginate').hide();
						}else{
							$('body').find('.dataTables_paginate').show();
						}
					});
				});                
			});

			winkstart.publish('layout.updateLoadedModule', {
				label: 'Voicemail Boxes Management',
				module: this.__module
			});
			
			$('#filter_today').live('click', function(){
				winkstart.table.ctt.fnFilter($.datepicker.formatDate('mm/dd/y', new Date()));
			});

			
		},
		setup_table: function() {
			var THIS = this;
			var columns = [
			{
				'sTitle': 'Call id',
				'sWidth': '20%'
			},

			{
				'sTitle': 'Called to'
			},

			{
				'sTitle': 'Called from'
			},

			{
				'sTitle': 'Call duration'
			},

			{
				'sTitle': 'Hangup cause'
			},
            
			{
				'sTitle': 'Debug'
			},
            
			{
				'sTitle': 'Details'
			},
			
			{
				'sTitle': 'Other leg'
			},
			
			{
				'sTitle': 'Date'
			}];

			winkstart.table.create('ctt', $('#ctt-grid'), columns);
			$('#ctt-grid_filter input[type=text]').first().focus();
			$('#ctt-grid_filter').append('<a id="filter_today" ref="#">Today</a>');
			
			$('.cancel-search').click(function(){
				$('#ctt-grid_filter input[type=text]').val('');
				winkstart.table.ctt.fnFilter('');
			});
		}
	});
