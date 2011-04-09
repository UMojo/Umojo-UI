<?php
	$data = new stdClass();
	$data->symbol = 'IBM';
	$data->price = '91.42';
	
	echo $_GET['callback'] . '(' . json_encode($data) . ');';
?>