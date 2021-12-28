<?php
    require('config.php');

    date_default_timezone_set('America/New_York');

    $location = [
        'lat' => '40.730610',
        'lng' => '-73.935242'
    ];

    $type = $_GET['type'];

    // Based on https://stackoverflow.com/a/3207849
    $begin = new DateTime('2021-12-16');
    $end = new DateTime(); // Today

    $interval = DateInterval::createFromDateString('1 day');
    $period = new DatePeriod($begin, $interval, $end);
    
    $images = Array();

    foreach ($period as $dt) {
        $request = curl_init();
        curl_setopt($request, CURLOPT_URL, "http://api.sunrise-sunset.org/json?lat=".$location['lat']."&lng=".$location['lng']."&date=".$dt->format("Y-m-d"));
        curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
        $results = curl_exec($request);
        curl_close($request);

        $sunData = json_decode($results)->results;

        $sunTimeUTC = new DateTime($dt->format("Y-m-d")." ".$sunData->$type, new DateTimeZone('UTC'));
        $sunTimeUTC->setTimezone(new DateTimeZone('America/New_York'));
        $sunTimeET = $sunTimeUTC->format('Y-m-d-H-i');

        $date = $sunTimeET;

        array_push($images, "http://".$CONFIG['SERVER']."/".$CONFIG['IMG_PATH']."/$date.jpg");
    }

    echo json_encode($images);
?>