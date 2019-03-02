<?php

$json = file_get_contents('../../config.json');
$editorConfig = json_decode($json);

$atlas_array = [];

define('DS', DIRECTORY_SEPARATOR);


define('ASSETS_DIR', str_replace('/', DS, $editorConfig->library));

$main_dir = getcwd() . DS . '..' . DS . '..' . DS . ASSETS_DIR;

$content = [];


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

function create_url($dir) {
    global $main_dir;
    $url = str_replace($main_dir, '', $dir);
    $url = str_replace("\\", "/", $url);
    $url = str_replace(DS, "/", $url);
 
    //  return $url;
    return str_replace(DS, "/",ASSETS_DIR) . $url . '/';
}

function listFolderFiles($dir, $folder_name) {
    $ffs = scandir($dir);
    global $main_dir, $content,$atlas_array;

    $folder = [];
    $folder['name'] = $folder_name;
    $folder['children'] = [];
    

    foreach ($ffs as $ff) {

        if ($ff != '.' && $ff != '..') {

            /////////////////////////
            // files to skip

            if ($ff === "assets.js" || $ff === "css") {
                // do nothing   
            } else {


                if (stringContains($dir, 'assets' . DS . 'images' . DS . "atlases")) {

                    if (endsWith($ff, '.json')) {
                        
                        $string = file_get_contents($dir . DS . $ff);
                        $json_a = json_decode($string, true);

                        $url = create_url($dir);     
                        $url = ltrim($url, '/');
                       
                        $atlas_array[] = $url.$ff;
                      
                        $url = str_replace('.json', '.png', $url.$ff);
                        
                      
                        
                        foreach ($json_a['frames'] as $k => $v) {
                            $node = ['url' => $url , 'name' => $k , 'frame' => $v['frame'],'rotated' => $v['rotated']];
                            $folder['children'][] = $node;
                        }
                        
                       
                        
                    }
                } else if (endsWith($ff, '.png') or endsWith($ff, '.jpg') or endsWith($ff, '.jpeg')) {

                    $basic = beforeComma($ff);
                   
                    $basic = substr($basic, 0, strpos($basic, "@"))?: $basic;
                    $url = create_url($dir);
                    //   $url = str_replace('', '', $url);
                    $url = ltrim($url, '/');

                    $node = ['url' => $url . $ff, 'name' => $basic];

                    $folder['children'][] = $node;
                }
            }

            ///////////////////////////////


            if (is_dir($dir . DS . $ff)) {

                $sub_folder = listFolderFiles($dir . DS . $ff, $ff);
                array_unshift($folder['children'], $sub_folder);
            }
        }
    }

    return $folder;
}

$debug = false;

if ($debug) {
    $structure = listFolderFiles($main_dir, 'root');
    echo '<pre>';
    print_r($structure);
} else {
    header('Content-type: application/json');

    $data = [];
    
    $data['structure'] = listFolderFiles($main_dir, 'root')['children'];
    $data['atlases'] = $atlas_array;
    print_r(json_encode($data, JSON_PRETTY_PRINT));
}




//print_r(json_encode($content));
