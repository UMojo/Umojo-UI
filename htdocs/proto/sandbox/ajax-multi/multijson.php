<?php

echo
	json_encode(array(
		"value" => "val0"
	)) .
	"-----" .
	json_encode(array(
		"value" => "val1"
	)) .
	"-----" .
	json_encode(array(
		"value" => "val2"
	));
