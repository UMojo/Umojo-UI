<?php

sleep( 2 );
echo json_encode(array(
	"status" => "success",
	"data" => array(
		"hello" => "world"
	)
));