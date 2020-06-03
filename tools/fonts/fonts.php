<?php

// read from config/models
// ask if a new migration should be started and deal with it
// if table does not exist ask if pages need to be created , if so deal with it
// create the table and the model
// if table exists , alter the model and the table
// log create and alters in migrations script

if (php_sapi_name() != "cli") {
    die("Can't work on the web");
}

$content = "";

function stringContains($haystack, $needle) {
    return strpos($haystack, $needle) !== false;
}

function startsWith($haystack, $needle) {
    // search backwards starting from haystack length characters from the end
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
}

function endsWith($haystack, $needle) {
    // search forward starting from end minus needle length characters
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}

function beforeComma($string) {

    return substr($string, 0, strrpos($string, '.'));
}

function getStringsBetween($string, $start, $end) {
    $pattern = sprintf(
            '/%s(.*?)%s/', preg_quote($start), preg_quote($end)
    );
    preg_match_all($pattern, $string, $matches);

    return $matches[1];
}



function listFolderFiles($dir , $callback) {

    $ffs = scandir($dir);
 
    foreach ($ffs as $ff) {

        if ($ff != '.' && $ff != '..') {
            $callback($ff);
        }
    }
}

function delete_file($file) {
    if (file_exists($file)) {
        unlink($file);
        echo "Deleting " . $file;
        echo "\n";
    } else {
        echo "Already deleted " . $file;
        echo "\n";
    }
}


$font_name = str_replace('--font_name=', '', $argv[1]);
$charset = str_replace('--charset=', '', $argv[2]);

if (!$font_name) {
    $font_name = 'all';
}

if (!$charset) {
    $charset = 'latin-with-extra';
}

echo "\n";
echo "=====================================\n";
echo "Selected Font: " . $font_name;
echo "\n";
echo "=====================================\n";

echo $charset;

if($font_name === "all"){
   
   
    
    listFolderFiles('./package/',function($font_name){
        
         global $charset;
        
        $parts = explode('.', $font_name);
        $extension = array_pop($parts);
        $name = implode("-", $parts);
        $name = str_replace(" ", "-", $name);
        $name = strtolower($name);
        
        echo "Converted ".$font_name;
        echo "\n";
        echo "To: ".$name.".ttf\n";
        echo "\n";
        
        $command = 'call pyftsubset package/'.$font_name.' --text-file="charsets/'.$charset.'"  --layout-features=""  --output-file="../../assets/fonts/'.$name.'.ttf"';
        exec($command);
        
    });
    
    echo "=====================================\n";
    echo "=====================================\n";
    echo "DONE !!!";
    
} else {
    $command = 'call pyftsubset package/'.$font_name.' --text-file="charsets/'.$charset.'"  --layout-features=""  --output-file="../../assets/fonts/'.$font_name.'"';
    exec($command);
    
}
