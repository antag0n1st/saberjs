<?php

function get_string_between($string, $start, $end) {
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0)
        return '';
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

if (isset($_POST) and $_POST['styles']) {

    $template_dir = getcwd();

    $template = file_get_contents($template_dir . '/../../../app/styles.js');
    //echo $template;
    
    $styles = json_decode($_POST['styles']);
    
    $stylesLabel = [];

    if (isset($styles->labelStyles)) {
        $stylesLabel = $styles->labelStyles;
    }

    $stylesButton = [];

    if (isset($styles->buttonStyles)) {
        $stylesButton = $styles->buttonStyles;
    }

    $colors = [];
    if (isset($styles->colors)) {
        $colors = $styles->colors;
    }

    $style = "// NOTE ! Use only addColor | addButton | addLabel , the system overwrites this file ";
    $style .= "\n\n";

    foreach ($colors as $name => $color) {

        $style .= 'Styles.addColor("' . $name . '", "' . $color . '");';
        $style .= "\n\n";
    }

    foreach ($stylesButton as $name => $btnStyle) {

        $style .= 'Styles.addButton("' . $name . '", ' . json_encode($btnStyle->style , JSON_NUMERIC_CHECK) . ' , ' . json_encode($btnStyle->properties, JSON_NUMERIC_CHECK) . ' );';
        $style .= "\n\n";
    }

    foreach ($stylesLabel as $name => $labelStyle) {

        $style .= 'Styles.addLabel("' . $name . '", ' . json_encode($labelStyle , JSON_NUMERIC_CHECK) . '  );';
        $style .= "\n\n";
    }

    $myfile = fopen($template_dir . '/../../../app/styles.js', "w");
    fwrite($myfile, $style);
    fclose($myfile);
}