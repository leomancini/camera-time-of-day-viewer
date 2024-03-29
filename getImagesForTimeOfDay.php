<?php
    require('config.php');

    date_default_timezone_set('America/New_York');

    $hour = $_GET['h'];
    $minute = $_GET['m'];

    // Based on https://stackoverflow.com/a/3207849
    $begin = new DateTime('2021-12-16');
    $end = new DateTime(); // Today

    $interval = DateInterval::createFromDateString('1 day');
    $period = new DatePeriod($begin, $interval, $end);

    $images = Array();

    foreach ($period as $dt) {
        $date = $dt->format("Y-m-d-$hour-$minute");

        array_push($images, $CONFIG['SERVER']."/".$CONFIG['IMG_PATH']."/$date.jpg");
    }

    $images = array_reverse($images); // Sort by date, reverse chronological

    if (isset($_GET['page'])) {
        $perPage = 15;

        $pageOfImages = array_slice($images, intval($_GET['page']) * $perPage, $perPage);

        echo json_encode($pageOfImages);
    } else {
        echo json_encode($images);
    }
?>