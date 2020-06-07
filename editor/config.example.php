<?php

// used for caching

define('DS', DIRECTORY_SEPARATOR);
define('BASE_DIR', dirname(dirname(__FILE__)) . DS);

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$_config = [
    'name' => 'editor',
    'features' =>
    [
        'zoom' => true,
        'constraints' => true,
        'customProperties' => true,
        'playButton' => true,
        'animator' => false,
        'exportToFiles' => true,
        'shapeModes' => true
    ],
    'colors' => [],
    'library' => '../assets/images',
    'fonts' => '../assets/fonts',
    'import' =>
    [
        'filesURL' => '../assets/data',
    ],
    'export' =>
    [
        'url' => 'app/php/export.php',
        'writeDir' => '../assets/data',
        'callback' => ['../tools/assets.php', '../tools/fonts.php'],
    ],
    'plugins' => [],
    'html_path' => 'html.php'
];

$json = json_encode($_config);

$editorConfig = json_decode($json);

////////////////////////////////////////////////////////////////////////////////
////// APP Config

$_app_config = [
    'game_width' => 1920,
    'game_height' => 1400,
    'name' => 'editor',
    'MODE_FLEXIBLE_WIDTH' => 0,
    'MODE_FLEXIBLE_HEIGHT' => 1,
    'MODE_STRETCH' => 2,
    'MODE_CENTERED' => 3,
    'MODE_NONE' => 4,
    'MODE_PADDING' => 5,
    'window_mode' => 5,
    'window_mode_mobile' => NULL,
    'canvas_padding' => '0 0 0 0',
    'is_sound_on' => true,
    'debug_info' => true,
    'debug' => false,
    'should_clear_stage' => true,
    'slow_motion_factor' => 1,
    'is_game_paused' => false,
    'master_volume' => 0.8,
    'base_url' => '',
    'lang' => 'en',
    'background_color' => 3355443,
    'ROTATION_MODE_ALLOW' => 0,
    'ROTATION_MODE_HORIZONTAL' => 1,
    'ROTATION_MODE_VERTICAL' => 2,
    'rotation_mode' => 1,
    'initialScreen' => 'MainScreen',
    'initialScreenArgs' => [],
    'colors' => [
        'transparent' => 'transparent',
        'black' => '#000000',
        'white' => '#ffffff',
        'color_background' => '#cfeef0',
        'color_theme' => '#f4971e',
        'color_theme_panel' => '#e99630',
        'color_theme_dark' => '#af662f',
        'color_blue_dark' => '#374b63',
        'color_gray' => '#939393',
        'color_brown' => '#332c24',
        'color_green_light' => '#68cedc',
        'color_orange_bright' => '#ead3a1'
    ]
];

$_app_config_json = json_encode($_app_config);

$Config = json_decode($_app_config_json);

//////////////////////// scripts to load

$_css = [
    'assets/font-awesome/css/font-awesome.min.css',
    'assets/bootstrap/css/bootstrap.min.css',
    'assets/colorpicker/css/bootstrap-colorpicker.min.css',
    'assets/slider/bootstrap-slider.css',
    'assets/jstree/themes/default/style.css',
    'assets/toastr/toastr.css',
    'assets/bootstrap-navbar/css/bootstrap-4-navbar.css',
    'assets/css/style.css'
];

$_base_scripts = [
    '../pixi.min.js',
    '../lib.min.js'
];

$_extra_scripts = [
];
