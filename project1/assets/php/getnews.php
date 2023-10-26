<?php
$count = $_REQUEST['country'] ;
//$apiKey ='dda39d1a4f49426a9bb0d0d8a7fadccf';
$apiKey ='pub_31530d92f4e11f4fbdb4530c7bb68b5d19842';


//$url ='https://newsapi.org/v2/top-headlines?country=us&apiKey=' . $apiKey;

$url ='https://newsdata.io/api/1/news?country=' . $count . '&apikey=pub_31530d92f4e11f4fbdb4530c7bb68b5d19842';

//echo $url;
//echo 'https://' . substr($url, 8);

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