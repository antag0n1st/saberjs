<?php

if (php_sapi_name() != "cli") {
    die("Can't work on the web");
}

define('DS', DIRECTORY_SEPARATOR);

include_once './install/credentials.php';

// lets go up and pretend
chdir("..");

function recurseCopy($src, $dst) {
    $dir = opendir($src);

    if (!file_exists($dst)) {
        mkdir($dst, 0777, true);
    }

    while (false !== ( $file = readdir($dir))) {
        if (( $file != '.' ) && ( $file != '..' )) {
            if (is_dir($src . '/' . $file)) {
                recurseCopy($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

function recursiveRemove($path) {
    if (is_dir($path)) {
        foreach (scandir($path) as $entry) {
            if (!in_array($entry, ['.', '..'])) {
                recursiveRemove($path . DS . $entry);
            }
        }
        rmdir($path);
    } else {
        unlink($path);
    }
}

function replaceContent($content, $data_strings) {

    foreach ($data_strings as $key => $value) {
        $content = str_replace('{' . $key . '}', $value, $content);
    }
    return $content;
}

$dir_name = str_replace('--dir=', '', $argv[1]);

$name = str_replace('--name=', '', $argv[2]);
$width = str_replace('--width=', '', $argv[3]);
$height = str_replace('--height=', '', $argv[4]);
$start_screen = str_replace('--start_screen=', '', $argv[5]);
$window_mode = str_replace('--window_mode=', '', $argv[6]);
$window_mode_mobile = str_replace('--window_mode_mobile=', '', $argv[7]);
$background_color = str_replace('--background_color=', '', $argv[8]);


if (!$name) {
    $name = $dir_name;
}

$width = !$width ? '1920' : $width;
$height = !$height ? '1080' : $height;
$start_screen = !$start_screen ? 'home' : $start_screen;
$window_mode = !$window_mode ? 'Config.MODE_CENTERED' : $window_mode;
$window_mode_mobile = !$window_mode_mobile ? 'Config.MODE_FLEXIBLE_WIDTH' : $window_mode_mobile;
$background_color = !$background_color ? '0x555555' : $background_color;

// lets do start screen
$s = strtolower($start_screen);
$start_screen_file_name = $s . '_screen';
$start_screen_class_name = ucfirst($s) . 'Screen';

$data_strings = [
    'dir_name' => $dir_name,
    'name' => $name,
    'width' => $width,
    'height' => $height,
    'start_screen' => $start_screen,
    'window_mode' => $window_mode,
    'window_mode_mobile' => $window_mode_mobile,
    'background_color' => $background_color,
    'background_color_css' => str_replace('0x', "#", $background_color),
    'start_screen_file_name' => $start_screen_file_name,
    'start_screen_class_name' => $start_screen_class_name,
    'server' => PUBLISH_SERVER , 
    'user' => PUBLISH_USER,
    'pass' => PUBLISH_PASS,
    'rsa' => PUBLISH_RSA , 
    'publish_url' => PUBLISH_URL , 
    'publish_dir' => PUBLISH_SERVER_DIR
];

$config_content = replaceContent(file_get_contents('tools/install/config'), $data_strings);
$index_content = replaceContent(file_get_contents('tools/install/index'), $data_strings);
$screen_content = replaceContent(file_get_contents('tools/screen'), $data_strings);
$assets_content = replaceContent(file_get_contents('tools/install/assets'), $data_strings);
$release_content = replaceContent(file_get_contents('tools/install/release'), $data_strings);
$publish_content = replaceContent(file_get_contents('tools/install/publish'), $data_strings);

chdir("..");

if (!file_exists($dir_name)) {
    mkdir($dir_name, 0777, true);
} else {
    echo "The directory already exist\n";
    echo "Aboring ...";
    exit;
}

recurseCopy('saberjs/tools', $dir_name . '/tools');
recursiveRemove($dir_name . '/tools/install/');
unlink($dir_name . '/tools/install.php');

recurseCopy('saberjs/app', $dir_name . '/app');
recurseCopy('saberjs/assets', $dir_name . '/assets');
recurseCopy('saberjs/editor', $dir_name . '/editor');
recurseCopy('saberjs/lib', $dir_name . '/lib');

copy('saberjs/.gitignore', $dir_name . '/.gitignore');
copy('saberjs/Gruntfile.js', $dir_name . '/Gruntfile.js');
copy('saberjs/lib.min.js', $dir_name . '/lib.min.js');
copy('saberjs/package.json', $dir_name . '/package.json');
copy('saberjs/pixi.min.js', $dir_name . '/pixi.min.js');

// remove some content here 

array_map('unlink', array_filter((array) glob($dir_name . '/app/screens/*')));
recursiveRemove($dir_name . '/app/kimenatics/');
array_map('unlink', array_filter((array) glob($dir_name . '/assets/data/*')));
recursiveRemove($dir_name . '/assets/files/');
recursiveRemove($dir_name . '/assets/spine/');

unlink($dir_name . '/app/goo.js');
unlink($dir_name . '/app/my_line.js');
unlink($dir_name . '/app/threshold_filter.js');
unlink($dir_name . '/assets/assets.js');
unlink($dir_name . '/assets/localization/en.txt');

// clear images

unlink($dir_name . '/assets/images/_default_button.png');
unlink($dir_name . '/assets/images/_default_input.png');
unlink($dir_name . '/assets/images/circle.png');
unlink($dir_name . '/assets/images/circle-blur.png');
unlink($dir_name . '/assets/images/dragon@2x.png');


// create new content
file_put_contents($dir_name . '/config.js', $config_content);
file_put_contents($dir_name . '/index.html', $index_content);
file_put_contents($dir_name . '/app/screens/'.$start_screen_file_name.'.js', $screen_content);
file_put_contents($dir_name . '/assets/assets.js', $assets_content);
file_put_contents($dir_name . '/release.bat', $release_content);
file_put_contents($dir_name . '/publish.bat', $publish_content);

