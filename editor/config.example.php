<?php

// used for caching

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$_config = [
    'name' => 'Saber Editor',
    'features' =>
    [
        'zoom' => true,
        'constraints' => true,
        'customProperties' => true,
        'playButton' => true,
        'animator' => true,
        'exportToFiles' => true,
        'authentication' => false,
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
];

$json = json_encode($_config);

$editorConfig = json_decode($json);

////////////////////////////////////////////////////////////////////////////////
////// APP Config

$_app_config = [
    'game_width' => 1920,
    'game_height' => 1200,
    'name' => 'editor',
    'MODE_FLEXIBLE_WIDTH' => 0,
    'MODE_FLEXIBLE_HEIGHT' => 1,
    'MODE_STRETCH' => 2,
    'MODE_CENTERED' => 3,
    'MODE_NONE' => 4,
    'MODE_PADDING' => 5,
    'window_mode' => 5,
    'window_mode_mobile' => NULL,
    'canvas_padding' => '50 360 0 50',
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
    '../app/screens/dashboard_screen.js', // preview
    'editor_ready.example.js', // hooks
    'app/animator/gui/animation_gui.js',
    'app/animator/gui/animation_panel.js',
    'app/animator/gui/animation_control_panel.js',
    'app/animator/animator.js',
    'app/animator/animation.js',
    'app/animator/animation_thread.js',
    'app/animator/gui/animation_playbar.js',
    'app/animator/gui/animation_play_head.js',
    'app/animator/gui/animation_panel_left.js',
    'app/animator/gui/animation_panel_right.js',
    'app/animator/gui/animation_scroll_right.js',
    'app/animator/gui/animation_scroll_bottom.js'
];


///////////////////////////////// do other code here


