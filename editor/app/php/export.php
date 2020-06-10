<?php

include_once '../../config.php';


define('ASSETS_DIR', str_replace('/', DS, $editorConfig->export->writeDir));


$path = getcwd() . DS . '..' . DS . '..' . DS . ASSETS_DIR . DS;

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function get_string_between($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return substr($string, $ini, $len);
}

function replace_between($str, $needle_start, $needle_end, $replacement) {
    $pos = strpos($str, $needle_start);
    $start = $pos === false ? 0 : $pos + strlen($needle_start);

    $pos = strpos($str, $needle_end, $start);
    $end = $pos === false ? strlen($str) : $pos;

    return substr_replace($str, $replacement, $start, $end - $start);
}

function create_subdirs($file) {

    $parts = explode("/", $file);

    global $path;

    for ($i = 0; $i < count($parts) - 1; $i++) {

        $folder = $parts[$i];

        if (!file_exists($path . "/" . $folder)) {
            mkdir($path . "/" . $folder, 0777, true);
        }

        $path .= "/" . $folder;
    }
}

if (isset($_POST) and $_POST['file_name']) {

    $file_name = $_POST['file_name'];

    $data = "";

    if (isset($_POST) and $_POST['data']) {
        $data = $_POST['data'];
    }

    $decoded = json_decode($data);

    $clean_name = str_replace('.json', '', $file_name);
    
    if (isset($decoded->layoutType) and $decoded->layoutType === "screen") {
        if(!endsWith($clean_name,'_screen')){
            $file_name = $clean_name.'_screen.json';
            $decoded->fileName = $file_name;
            $data = json_encode($decoded);
        }
    }


    // write to file
    // create directory if it does not exist

    create_subdirs($file_name);

    if (!file_exists($path . $file_name)) {

        // also check the type

        if (isset($decoded->layoutType) and $decoded->layoutType === "screen") {

            $screen_name = str_replace(" ", "", ucwords(str_replace('_', ' ', str_replace('.json', '', $file_name))));

            $template_dir = getcwd();

            $template = file_get_contents($template_dir . '/../../../tools/screen');
            $template = str_replace("{start_screen_class_name}", $screen_name, $template);
            $template = str_replace("{start_screen_file_name}", str_replace('.json', '', $file_name), $template);

            // also create a screen with the given name
            $sceen_file_name = str_replace('json', 'js', $file_name);

            if (!file_exists($path . '../../app/screens/' . $sceen_file_name)) {

                $myfile = fopen($path . '../../app/screens/' . $sceen_file_name, "w");
                fwrite($myfile, $template);
                fclose($myfile);
                
            
                // insert the screen script into the index.html file.
                
                $index_file = getcwd().'/../../../index.html';
                
                $index_content = file_get_contents($index_file);
                
                
                $existing_content = get_string_between($index_content,"<!--//SCREENS-BEGIN-->","<!--//SCREENS-END-->");
                $existing_content = rtrim($existing_content);
                $existing_content .= "\n\t";
                $existing_content .= '<script src="app/screens/'.$sceen_file_name.'" type="text/javascript"></script>';
                $existing_content .= "\n\n\t";
                
                $index_content = replace_between($index_content , "<!--//SCREENS-BEGIN-->","<!--//SCREENS-END-->" , $existing_content);
                
                $myfile = fopen($index_file, "w");
                fwrite($myfile, $index_content);
                fclose($myfile);
                
            }
            
            
        }
    }

    $myfile = fopen($path . $file_name, "w");
    fwrite($myfile, $data);
    fclose($myfile);

    header('Content-type: application/json');
    print_r(json_encode(["message" => "Data exported to: \n" . $file_name]));
}


