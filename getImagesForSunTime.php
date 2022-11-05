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
    
    $dates = Array();

    foreach ($period as $dt) {
        array_push($dates, $dt->format("Y-m-d"));
    }

    $dates = array_reverse($dates); // Sort by date, reverse chronological

    if (isset($_GET['page'])) {
        $perPage = 15;

        $pageOfDates = array_slice($dates, intval($_GET['page']) * $perPage, $perPage);

        $dates = $pageOfDates;
    }

    $images = Array();

    foreach ($dates as $date) {
        $request = curl_init();
        curl_setopt($request, CURLOPT_URL, $CONFIG['SUNSET_API_PROXY_URL']."?date=".$date);
        curl_setopt($request, CURLOPT_RETURNTRANSFER, 1);
        $results = curl_exec($request);
        curl_close($request);

        $sunData = json_decode($results)->results;

        $sunTimeUTC = new DateTime($sunData->$type, new DateTimeZone('UTC'));
        $sunTimeUTC->setTimezone(new DateTimeZone('America/New_York'));
        $sunTimeET = $sunTimeUTC->format('Y-m-d-H-i');

        $date = $sunTimeET;

        array_push($images, $CONFIG['SERVER']."/".$CONFIG['IMG_PATH']."/$date.jpg");
    }

    echo json_encode($images);
?>