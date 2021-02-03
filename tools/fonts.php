<?php

define('DS', DIRECTORY_SEPARATOR);
$main_dir = getcwd() . DS . '..' . DS . 'assets' . DS . 'fonts';

$content = "";

function endsWith($haystack, $needle) {
    // search forward starting from end minus needle length characters
    return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== false);
}

$index = file_get_contents('../index.html');

function replace_between($str, $needle_start, $needle_end, $replacement) {
    $pos = strpos($str, $needle_start);
    $start = $pos === false ? 0 : $pos + strlen($needle_start);

    $pos = strpos($str, $needle_end, $start);
    $end = $pos === false ? strlen($str) : $pos;

    return substr_replace($str, $replacement, $start, $end - $start);
}

function listFolderFiles($dir) {
    $ffs = scandir($dir);
    global $main_dir, $content, $index;

    $fonts = [];

    foreach ($ffs as $ff) {
        if ($ff != '.' && $ff != '..') {
            if (endsWith($ff, '.ttf')) {

                $fonts[] = $ff;
            }
        }
    }

    $css_content = '';
        
    $replacement = "\n\n";
    foreach ($fonts as $font) {
        $replacement .= "\t".'<p class="noselect" style="font-family: \'' . str_replace('.ttf', '', $font) . '\'; color: transparent; z-index: -100;position: absolute;"> '.str_replace('.ttf', '', $font).' </p>' . "\n";
        $css_content .= "@font-face { \n\tfont-family: '". str_replace('.ttf', '', $font)."'; \n\tsrc:  url('../fonts/".$font."') format('truetype'); \n}\n\n";
        }
    $replacement .= "\n    ";

    $index = replace_between($index, '<!--FONTS-START-->', '<!--//FONTS-END-->', $replacement);
    
    file_put_contents('..' . DS . 'assets' . DS . 'css'.DS.'fonts.css', $css_content);
    file_put_contents('..' . DS . 'index.html', $index);
    
}

listFolderFiles($main_dir);



