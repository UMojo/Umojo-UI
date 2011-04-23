<?php
    $location = "http://" . $_SERVER['HTTP_HOST'] . "/proto/headertest/server2.php";
    header ('HTTP/1.1 301 Moved Permanently');
    header ('Location: '.$location);
?>