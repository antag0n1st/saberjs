<?php

function endsWith($haystack, $needle) {
    // search forward starting from end minus needle length characters
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}

    $har_content = file_get_contents('./content.har');
    
    $har = json_decode($har_content);

    foreach($har->log->entries as $en){
       $url = $en->request->url;
       if(endsWith($url , '.png')){
           
           $parts = explode('/', $url);
           $name = end($parts);
           $img = file_get_contents($url);
           file_put_contents('images/'.$name, $img);
           
       }
    }
