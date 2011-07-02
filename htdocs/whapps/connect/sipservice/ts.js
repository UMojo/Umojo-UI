
var addCreditCard = function(frm) {

	$.ajax({
      url: "/api/addCreditCard",
      global: true,
      type: "POST",
		      data: {key: key, json: JSON.stringify(frm.serializeObject())},
      dataType: "json",
      async:false,
      success: function(msg){
				if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );}

      }
   }
);
};

var delCreditCard = function(tid) {

	$.ajax({
      url: "/api/delCreditCard",
      global: true,
      type: "POST",
		      data: {key: key, json: JSON.stringify({token: tid})},
      dataType: "json",
      async:false,
      success: function(msg){
				if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );}

      }
   }
);
};







var addPromoCode = function(pc) {

	$.ajax({
      url: "/api/addPromoCode",
      global: true,
      type: "POST",
		      data: {key: key, json: JSON.stringify({promo_code: pc})},
      dataType: "json",
      async:false,
      success: function(msg){
				if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );}

      }
   }
);
};





var showAddCreditsPrompt = function() {
	popup($('#tmpl_add_prepay').tmpl( {} ) , { title: 'Add Credits'}	);
};


var addCredits  = function(buyCreds) {
		$.ajax({
	      url: "/api/addPrepayCredits",
	      global: true,
	      type: "POST",
	      data: ({key: key, json: JSON.stringify({addCredits: buyCreds})}),
	      dataType: "json",
	      async:true,
	      success: function(msg){

							if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs);}
			redraw(msg.data);
	      }
	   }
	);
};













var moveDID = function(did, srv) {
	$.ajax({
      url: "/api/moveDID",
      global: true,
      type: "POST",
      data: ({key: key, json: JSON.stringify({DID:did, server: srv})}),
      dataType: "json",
      async:false,
      success: function(msg){
							if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs);}
			redraw(msg.data);

         //TODO: redraw servers and allDIDs
      }
   }
);
};

var delDID  = function(did) {
	$.ajax({
      url: "/api/delDID",
      global: true,
      type: "POST",
      data: ({key: key, json: JSON.stringify(did)}),
      dataType: "json",
      async:true,
      success: function(msg){
							if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, 'Error');}
			redraw(msg.data);

         //TODO: redraw servers and allDIDs
      }
   }
);
};

var addDID  = function(dids) {
	if ( checkCredit() ) {
		$.ajax({
	      url: "/api/addDID",
	      global: true,
	      type: "POST",
	      data: ({key: key, json: JSON.stringify({DID:did})}),
	      dataType: "json",
	      async:true,
	      success: function(msg){
	      // trigger custom event 'numberAdded'
							if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, "Error");}
			redraw(msg.data);

	         //TODO: redraw servers and allDIDs
	         //TOD: update credits
	      }
	   }
	);
	} else {
		msgAlert('Not enough credits to add ' + did);
		return false;
	}
};




var addDIDs  = function(dids) {

		var addedDIDs = $.ajax({
	      url: "/api/addDIDs",
	      global: true,
	      type: "POST",
	      data: ({key: key, json: JSON.stringify({DIDs:dids})}),
	      dataType: "json",
	      async:false,
	      success: function(msg){
	      if (typeof msg =="object") {
	      // trigger custom event 'numberAdded'
	         $("body").trigger('addDIDs', msg.data);
	         //TODO: redraw servers and allDIDs
	         //TOD: update credits
					if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs);} 
		         //TODO: redraw this DID
		         if (typeof msg.data == 'object' && typeof msg.data.acct == 'object') {
					redraw(msg.data.acct); // note more than just acct is returned
				}
	      }
	      }
	   }
	);
	return addedDIDs;
};


var addTrunk  = function() {
	if ( 'not from prepay' || checkCredits(25) ) {
		$.ajax({
	      url: "/api/addTrunk",
	      global: true,
	      type: "POST",
	      data: ({key: key, json: JSON.stringify({addTrunks: 1})}),
	      dataType: "json",
	      async:true,
	      success: function(msg){

							if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs);}
			redraw(msg.data);
	      // trigger custom event 'trunkAdded'
	         //TODO: redraw servers and allDIDs
	         //TOD: update credits
	      }
	   }
	);
	} else {
		msgAlert('Not enough credits to add a trunk');
		return false;
	}
};







var setTrunkPrompt  = function(args) {
	popup($('#tmpl_set_trunk_qty').tmpl( {} ) , { title: 'Set Trunks'}	);
};









var setTrunks  = function(trunks) {
	if ( 'not from prepay' || checkCredits(25) ) {
		$.ajax({
	      url: "/api/setTrunks",
	      global: true,
	      type: "POST",
	      data: ({key: key, json: JSON.stringify({setTrunks: trunks})}),
	      dataType: "json",
	      async:false,
	      success: function(msg){
							if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs);}
			redraw(msg.data);
	      // trigger custom event 'trunkAdded'
	         //TODO: redraw servers and allDIDs
	         //TOD: update credits
	      }
	   }
	);
	} else {
		msgAlert('Not able to set trunks: credits could not be applied');
		return false;
	}
};

var delTrunk  = function(trunks) {
	if (acct.account.trunks < trunks) {		msgAlert('Not enough trunks to remove!');
		return false;
	}
		$.ajax({
	      url: "/api/delTrunk",
	      global: true,
	      type: "POST",
	      data: ({key: key, json: JSON.stringify({delTrunks: trunks})}),
	      dataType: "json",
	      async:true,
	      success: function(msg){
	         acct=msg;
	         //TODO: redraw trunks
							if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs);}
			redraw(msg.data);

	      }

	   }
	);
};



var addServer  = function(srv) {

		$.ajax({
	      url: "/api/addServer",
	      global: true,
	      type: "POST",
	      data: ({key: key, json: JSON.stringify(srv) }),
	      dataType: "json",
	      async:true,
	      success: function(msg){
			// check for errs
	      // trigger custom event 'serverAdded'
	         //TODO: redraw servers

				if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );}
			redraw(msg.data);

	      }
	   }
	);
};



var delServer  = function(srvid) {

		$.ajax({
	      url: "/api/delServer",
	      global: true,
	      type: "POST",
	      data: ({key: key, json: JSON.stringify({serverid: srvid}) }),
	      dataType: "json",
	      async:true,
	      success: function(msg){
			// check for errs
	      // trigger custom event 'serverAdded'
	         //TODO: redraw servers

				if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );}
			redraw(msg.data);

	      }
	   }
	);
};



var searchAvailDIDs = function(NPA, NXX) {
	// must use toString()
	if (NPA.toString().match('^[2-9][0-8][0-9]$')) {
		if (NPA.toString().match('^8(:?00|88|77|66|55)$')) {
	  		$('#sad_LoadingTime').slideDown(); 	
	      var gJ = $.getJSON('/api/searchNPA', {key: key, json: JSON.stringify({NPA: NPA})}, function(jdata) { $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(jdata));   $('#sad_LoadingTime').hide();});
	      return gJ;

		} else if (NXX && NXX.toString().match('^[2-9][0-9][0-9]$')) {
		   var gJ = $.getJSON('/api/searchNPANXX', {key: key, json: JSON.stringify({NPA: NPA, NXX: NXX})}, function(jdata) { $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(jdata));   });
	      return gJ;

	   } else 	if (NPA.toString().match('^[2-9][0-8][0-9]$')) {
	  		$('#sad_LoadingTime').slideDown(); 	
	      var gJ = $.getJSON('/api/searchNPA', {key: key, json: JSON.stringify({NPA: NPA})}, function(jdata) { $('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(jdata));   	  		$('#sad_LoadingTime').hide(); 	});
	      
	      return gJ;
	   } else {return false;}

	}
   else {return false;}
};


var purchaseDIDs = function(DIDs) {
		var rCost= 0;
		var oCost= 0;
		var buyThese = new Array();
		$.each(DIDs, function(index, elm) { 
			rCost+=$(elm).dataset('recurringCost') *1;
			oCost+=$(elm).dataset('oneTimeCost') * 1;
			buyThese.push( $(elm).dataset());
//			console.log($(elm).dataset('did'));
		});
		
		
		var enoughCredits=checkCredits( oCost );
		var purchasedDIDs=new Array();
			if (enoughCredits) {
					purchasedDIDs=addDIDs(buyThese);
					
					} else { 		msgAlert('Not enough credits to add these DIDs');
						return false;
					}
					
		return purchasedDIDs;
};

var setE911 = function(e911) {
			$.ajax({
		      url: "/api/setE911",
		      global: true,
		      type: "POST",
		      data: ({key: key, json: JSON.stringify({"e911_info": e911.e911_info, "did":e911.did, "serverid":e911.serverid})}),
		      dataType: "json",
		      async:false,
		      success: function(msg){
					if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );} 
		         //TODO: redraw this DID
				redraw(msg.data);

		      }
		   }
		);
		

};

var setFailOver = function(info) {
			$.ajax({
		      url: "/api/setFailOver",
		      global: true,
		      type: "POST",
		      data: ({key: key, json: JSON.stringify({did:info.did.did, serverid:info.did.serverid, failover: info.uri})}),
		      dataType: "json",
		      async:true,
		      success: function(msg){
				if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );}
		         //TODO: redraw this DID
				redraw(msg.data);

		      }
		   }
		);
	};
	
var setCID = function(info){
			
			$.ajax({
		      url: "/api/setCID",
		      global: true,
		      type: "POST",
		      data: ({key: key, json: JSON.stringify(info)}),
		      dataType: "json",
		      async:true,
		      success: function(msg){
							if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );}
							redraw(msg.data);

		         //TODO: redraw this DID
		      }
		   }
		);

};


var LNP_s1 = function(frm) {
			$.ajax({
		      url: "/api/requestPortDID",
		      global: true,
		      type: "POST",
		      data: {key: key, json: JSON.stringify(frm.serializeObject())},
		      dataType: "json",
		      async:false,
 		      success: function(msg){

								if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );}
								else {
			      LNPPrompt_s2(msg.data);								
								}

	
	      // trigger custom event 'numberAdded'

	         //TODO: redraw servers and allDIDs
	         //TOD: update credits
	         // MUST update acct

		      }
		   }
		);	
	
};


var portDID = function() {};


var searchNPA = function(nbr, cb) {
//			$.getJSON('/api/searchNPA', function(data) {
//				$('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(data));			});

			$.ajax({
		      url: "/api/searchNPA",
		      global: true,
		      type: "POST",
		      data: ({key: key, json: JSON.stringify(nbr)}),
		      dataType: "json",
		      async:true,
		      success: function(msg){
				redraw(msg.data);

		      }
		   }
		);
	
}


var searchNPANXX = function(nbr, cb) {
			$.getJSON('/api/searchNPANXX', function(data) {
				$('#foundDIDList').html($('#tmpl_foundDIDs').tmpl(data));			});
			$.ajax({
		      url: "/api/searchNPANXX",
		      global: true,
		      type: "POST",
		      data: ({key: key, json: JSON.stringify(nbr)}),
		      dataType: "json",
		      async:true,
		      success: function(msg){
				redraw(msg.data);

		      }
		   }
		);
	
}


var setServerDefaults = function(nsd) {

			$.ajax({
		      url: "/api/setServerDefaults",
		      global: true,
		      type: "POST",
		      data: ({key: key, json: JSON.stringify(nsd)}),
		      dataType: "json",
		      async:true,
		      success: function(msg){
				if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs, null, eval(msg.errs[0].cb) );}
			redraw(msg.data);


		      }
		   }
		);
};


//prompts

// '<pre>' + JSON.stringify(did) + '</pre>' + 
var failoverPrompt= function(did) {
popup($('#tmpl_fo_prompt').tmpl( did ) , { title: 'Set Failover'}	);
						$('#fo_button').click(function() {setFailOver({ did: $('#fo_uri').dataset(), uri: $('#fo_uri').val() } );});
						$('#fo_uri').blur();
};
var cidPrompt= function(did) {popup($('#tmpl_cid_prompt').tmpl( did ) , {title: 'Set CallerID'}	);
						$('#cid_prompt_form').submit(function() {setCID({ did: $('#cid_name').dataset('did'), serverid: $('#cid_name').dataset('serverid'), cid_name: $('#cid_name').val() } );     return false;});
};

var e911Prompt= function(e911) {

	popup($('#tmpl_e911_prompt').tmpl( {did: e911.did, serverid:e911.serverid,  e911_info: e911.e911_info || acct.servers[e911.serverid].DIDs[e911.did]['e911_info'] || {} }), {title: 'Set E911'} 	);
						$('#e911_update_form').submit(function() {setE911({'e911_info': $('#e911_update_form').serializeObject(), 'did': $('#e911_button').dataset('did'), 'serverid': $('#e911_button').dataset('serverid') }); return false;});
};

var miscPrompt= function() {};

var modifySRVDefaultsPrompt = function(info) {
//	console.log(JSON.stringify({s: info.serverid, theinfo: acct.servers[info.serverid], 'tst': info}));
	popup($('#tmpl_modSRVDefs_prompt').tmpl( {s: info.serverid, srv: acct.servers[info.serverid], 'fa':info.fa || {}}) , {title: 'Modify Server Defaults for '  + acct.servers[info.serverid].server_name}	);
	
	$('#modSRV_button').click(function() {setServerDefaults($('#srvDefs_update_form').serializeObject());});
};


var searchDIDsPrompt = function() {
	popup($('#tmpl_searchDIDs_prompt').tmpl({}));
	//TODO:  display "Add Credits" if it goes negative
};

var LNPPrompt = function(args) {
	if (typeof args != 'object') { args= new Object(); }
	popup($('#tmpl_LNP_prompt').tmpl(args));
		$('#lnpRDate').datepicker({ autoSize: true , dateFormat: 'yy-mm-dd', defaultDate: '+7', maxDate: '+3m +1w',  minDate: '+1w'  });
		

};
var LNPPrompt_s2 = function(lnp_f) {
	
		var lnp_did = lnp_f.serializeObject();
	
		$.ajax({
		      url: "/api/getLNPData",
		      global: true,
		      type: "POST",
		      data: ({key: key, json: JSON.stringify(lnp_did)}),
		      dataType: "json",
		      async:true,
		      success: function(msg){

		if (typeof msg == 'object' && msg.data) {
			var trackData=msg.data;
			if (typeof trackData == "object" && typeof trackData.lnp == "object" ) {
				popup($('#tmpl_LNP_prompt_s2').tmpl(trackData));
				createUploader($('#lnp_s2_uploader')[0], '/api/uploadLNP', {key: key, did:trackData.lnp.did, tracking:trackData.lnp.tracking}, function(a,b,c,d) {display_errs([{msg: "Upload successful.  You'll be notified with updates on the porting status.", type: 'info'}]);});
			} else {
				display_errs([{msg: "Could not confirm porting information.  Try again.", type: 'error'}], "Bad Port Tracking Data");
			}
		      }
		   }
		  }
		);
	
};




var addServerPrompt = function(info) {
	if (! info) {info = new Object();}
	popup($('#tmpl_add_server').tmpl({ 'fa':info.fa || {} }), {title: 'Add Server' });
	$('#addSRV_button').click(function() {addServer($('#add_server_form').serializeObject());});
};


var removeSIPAuthIP = function(aip) {

			$.ajax({
		      url: "/api/removeSIPAuthIP",
		      global: true,
		      type: "POST",
		      data: ({key: key, json: JSON.stringify(aip)}),
		      dataType: "json",
		      async:true,
		      success: function(msg){
		         // redraw server or at lease IP list
							if (msg && msg.errs && msg.errs[0]) {display_errs(msg.errs);}
			redraw(msg.data);
		      }
		   }
		);


};







var showMyAccountPrompt = function(opts) {
	if (typeof opts != 'object') { opts = new Object();}
	 var gJ = $.getJSON('/api/getCreditCards', {key: key, json: JSON.stringify({})}, function(jdata) {
	 	jdata.tmplOpts = typeof opts.tmplOpts == 'object' ? opts.tmplOpts : {} ;
	 	jdata.fa = typeof opts.fa == 'object' ? opts.fa : {} ;
	 	//console.log(JSON.stringify(jdata));
	 	popup($('#tmpl_display_acct_info').tmpl(jdata), {title: 'Account Billing Information'});   });
		 return gJ;
	};
	
	
	
	

var delServerPrompt = function(sinfo) {
	popup($('#tmpl_del_server').tmpl(sinfo), {title: 'Remove Server - ' + acct.servers[sinfo.serverid].server_name });	
};

// credit mgmt
var  updatePreAuth = function(){
 var newItems = $('.inCart');
 			rCost=0;
 			oCost=0;
		$.each(newItems, function(index, elm) { 

			if ( isNaN( parseInt( $(elm).dataset('qty') ) ) ) {
				rCost+=$(elm).dataset('recurringCost') *1;
				oCost+=$(elm).dataset('oneTimeCost') * 1;
			} else {
				rCost+=$(elm).dataset('recurringCost') * $(elm).dataset('qty');
				oCost+=$(elm).dataset('oneTimeCost') * $(elm).dataset('qty');
			}
		});
		
		return {rCost: rCost, oCost: oCost};	
};

var checkCredits = function(bill) { return true; // not doing pre-paid
	if(acct.account.credits.prepay > bill) {
		return acct.account.credits.prepay - bill;
	} else {return false;}
};


var msgAlert = function(msg) {alert(msg);}



var display_errs = function (errs, title, cb, data) {
	popup($('#tmpl_display_errs').tmpl({errs:errs, cb: cb}), { title: title || "Messages"}); 
		//setTimeout("eval(" + cb + ")", 1200);
	};




var redraw = function(idoc) {
	if (! idoc || typeof idoc == 'null') {return false;}
	acct=idoc;
//	$(".drop_area").droppable('destroy');
//	$('.numbers').draggable( "destroy" );

	// reset counters
	did__unassigned_count=0;
	did_count=0;
	
	setTimeout('	$("#server_area").html($("#tmpl_servers").tmpl( acct ))', 200);
	setTimeout('	$("#my_numbers").html($("#tmpl_allDIDs").tmpl( acct ))', 880);
	setTimeout('	$("#my_trunks").html($("#tmpl_trunks").tmpl( acct ))', 400);
	setTimeout('			$(".number").draggable(				{cursor: "pointer", 				 opacity: 0.35 ,				 revert: true,				 scope: "moveDID",	appendTo: "body",	helper: "clone"	}			)	', 1100);	

//	setTimeout('				$(".drop_area").droppable({				drop: function(event, ui) { console.log("644");										moveDID($(ui.draggable).dataset(), $(this).dataset());				},				accept: ".number" ,				activeClass: "ui-state-highlight",				activate: function(event, ui) { ; },				scope: "moveDID"			})', 1500);



	setTimeout('						$(".drop_area").droppable({			drop: function(event, ui) {				tmp_ui=ui;				tmp_md_this=this;				setTimeout("moveDID($(tmp_ui.draggable).dataset(), $(tmp_md_this).dataset())", 1);			},			accept: ".number" ,			activeClass: "ui-state-highlight",			activate: function(event, ui) { ; },			scope: "moveDID"		});	', 1500);




	setTimeout(    'search_numbers_list($("#header"), $("#list"))'	, 	1500);

		
/*
		$(".number").draggable(
			{cursor: "pointer", 
			 opacity: 0.35 ,
			 revert: true,
			 scope: "moveDID",
			 
			}
		);
*/
/*

		$(".drop_area").droppable({
			drop: function(event, ui) {
				
				moveDID($(ui.draggable).dataset(), $(this).dataset());
			},
			accept: ".number" ,
			activeClass: "ui-state-highlight",
			activate: function(event, ui) { ; },
			scope: "moveDID"
		});
*/
};




















// JS additions:

var createUploader = function(elm, act, args, cb){            
            var uploader = new qq.FileUploader({
                allowedExtensions: ['jpg', 'jpeg', 'png','tiff','pdf','psd'],
				sizeLimit: 10000000,
				minSizeLimit: 20000,
				
				onComplete: function(id, fileName, responseJSON){cb(id, fileName, responseJSON);},

                element: elm,
                action: act,
                params: args
            });
        };
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
	var updateDIDQtyCosts = function(did, qty) {
		if ( ! isNaN( parseInt( qty ) ) && $('#fd_' + did) ) {
			$('#fd_' + did).dataset('qty',  parseInt( qty ));
			return parseInt( qty );
		}
		return -1;
	};


        

      var search_numbers_list = function (elm, list) {
      
        var filter = $(elm).val();
        if(filter) {
          // this finds all links in a list that contain the input,
          // and hide the ones not containing the input while showing the ones that do
          $(list).find("span.number:not(:Contains(" + filter + "))").parent().slideUp();
          $(list).find("span.number:Contains(" + filter + ")").parent().slideDown();
        } else {
          $(list).find("div").slideDown();
        }
        return false;
      };    
        
        
        
        
        
        
// for the filter 
(function ($) {
  // custom css expression for a case-insensitive contains()
  jQuery.expr[':'].Contains = function(a,i,m){
      return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };




}(jQuery));








// cookies 
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};






var updateBilling = function(tst) {alert(tst + 'Billing Check');};