<?php

	function rand_str($length = 32, $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890') {
		// Length of character list
		$chars_length = (strlen ( $chars ) - 1);
		
		// Start our string
		$string = $chars {rand ( 0, $chars_length )};
		
		// Generate random string
		for($i = 1; $i < $length; $i = strlen ( $string )) {
			// Grab a random character from our list
			$r = $chars {rand ( 0, $chars_length )};
			
			// Make sure the same two characters don't appear next to each other
			if ($r != $string {$i - 1})
				$string .= $r;
		}
		
		// Return the string
		return $string;
	}
	
	$module = $_REQUEST ['module'];
	
	$accounts = array ("June " . rand_str(8), "Abe " . rand_str(8), "James " . rand_str(8), "Big " . rand_str(8), "Ben " . rand_str(8) );
	$media = array ("Media " . rand_str(8), "Media " . rand_str(8), "Media " . rand_str(12), "Media " . rand_str(8), "Media " . rand_str(8), "Media " . rand_str(8), "Media " . rand_str(8), "Media " . rand_str(8), "Media " . rand_str(8), "Media " . rand_str(8), "Media " . rand_str(8));

	$response = new stdClass ( );
	
	switch ($module) {
		case 'accounts' :
			$response->accounts = array ();
			
			foreach ( $accounts as $account_name ) {
				$account = new stdClass ( );
				$account->title = $account_name;
				$response->accounts [] = $account;
			}
			
			break;
		case 'media' :
			$response->media_assets = array ();
			
			foreach ( $media as $media_name ) {
				$media = new stdClass ( );
				$media->title = $media_name;
				$response->media_assets [] = $media;
			}
			break;
	}
	
	header ( 'Cache-Control: no-cache, must-revalidate' );
	header ( 'Expires: Mon, 26 Jul 1997 05:00:00 GMT' );
	header ( 'Content-type: application/json' );
	echo json_encode ( $response );

?>