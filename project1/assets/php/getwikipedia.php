<?php
$count = $_GET['country'] ;
$apiKey ='';

//jignesh2810
//jignesh@28

$url = 'https://api.wikimedia.org/core/v1/wikipedia/en/search/page?q='.urlencode($count).'&limit=10';

//echo $url;
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
//$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

exit;

// $executionStartTime = microtime(true);

// $url = "https://newsapi.org/v2/everything?q=" . urlencode($count) . "&apiKey=" . $apiKey;

// $ch = curl_init();
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_URL, $url);

// $result = curl_exec($ch);

// curl_close($ch);

// $decode = json_decode($result, true);

// $output['status']['code'] = "200";
// $output['status']['name'] = "ok";
// $output['status']['description'] = "success";
// $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
// $output['data'] = $decode['articles'];

// header('Content-Type: application/json; charset=UTF-8');

// echo json_encode($output);
?>

