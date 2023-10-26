<?php
$count = $_REQUEST['country'] ;
$apiKey ='59d8ac6a-18e4-4317-b276-601a9eaee2fc';



//cities
///$url ='https://airlabs.co/api/v9/cities?country_code=' . $count . '&api_key=59d8ac6a-18e4-4317-b276-601a9eaee2fc';

//airports
$url ='https://airlabs.co/api/v9/airports?country_code=' . $count . '&api_key=59d8ac6a-18e4-4317-b276-601a9eaee2fc';


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