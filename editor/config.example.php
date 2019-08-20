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
        'zoom' => false,
        'constraints' => false,
        'customProperties' => false,
        'playButton' => true,
        'animator' => false,
        'exportToFiles' => false,
        'shapeModes' => false
    ],
    'colors' => [],
    'library' => '../content/images',
    'fonts' => '../client/assets/fonts',
    'import' =>
    [
        'filesURL' => '../jscore/assets/data',
    ],
    'export' =>
    [
        'url' => 'app/php/export.php',
        'writeDir' => '../jscore/assets/data',
        'callback' => ['../jscore/tools/assets.php', '../jscore/tools/fonts.php'],
    ],
    'plugins' => ['mymathcore'],
    'html_path' => 'mymathcore/layout.php'
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
    '../jscore/pixi.min.js',
    '../jscore/lib.min.js'
];

$_extra_scripts = [
    
    '../jscore/app/system/notes.js',
    '../jscore/app/filter-glow.js',
    '../jscore/app/filter-outline.js',
    '../jscore/app/custom_import.js',
    '../jscore/app/screens/question_screen.js',
    '../jscore/app/helpers/progress.js',
    '../jscore/app/gui/collection_button.js',
    '../jscore/app/gui/message.js',
    '../jscore/app/gui/question_timer.js',
    '../jscore/app/gui/volume_controller.js',
    '../jscore/app/gui/feedback_box.js',
    '../jscore/app/gui/round_loading_bar.js',
    '../jscore/app/gui/loading.js',
    '../jscore/app/gui/board.js',
    '../jscore/app/pixi-multistyle-text.js',
    '../jscore/app/gui/styled_label.js',
    '../jscore/app/system/style.js',
    
    '../jscore/app/objects/type_in_object.js',
    '../jscore/app/objects/number_line_object.js',
    '../jscore/app/objects/arrow_object.js',
    '../jscore/app/objects/continuous_arrow_object.js',
    '../jscore/app/objects/parabolic_object.js',
    '../jscore/app/objects/balance_beam_object.js',
    '../jscore/app/objects/balance_scale_object.js',
    '../jscore/app/objects/ten_frame_object.js',
    '../jscore/app/objects/ten_frame_cell_object.js',
    '../jscore/app/objects/analog_clock_object.js',
    '../jscore/app/objects/analog_clock_hand.js',
    '../jscore/app/objects/label_box_object.js',
    '../jscore/app/objects/hundred_board_object.js',
    '../jscore/app/objects/hundred_board_cell_object.js',
    '../jscore/app/objects/photo_object.js',
    '../jscore/app/objects/shape_object.js',
    '../jscore/app/objects/shape.js',
    '../jscore/app/objects/x_out.js',
    '../jscore/app/objects/move_point_object.js',
    '../jscore/app/objects/typed/radio_button_object.js',
    '../jscore/app/objects/typed/check_box_object.js',
    '../jscore/app/objects/typed/draggable_object.js',
    '../jscore/app/objects/typed/drop_area_object.js',
    '../jscore/app/objects/typed/weight_object.js',
    '../jscore/app/objects/typed/sortable_object.js',
    '../jscore/app/objects/typed/free_object.js',
    '../jscore/app/text_box.js',
    
    'mymathcore/mathcore.js',
    'mymathcore/extends/app_extended.js',
    'mymathcore/extends/context_menu_extended.js',
    'mymathcore/extends/entity_extended.js',
    'mymathcore/extends/main_screen_extended.js',
    'mymathcore/extends/pixi_extended.js',
    'mymathcore/extends/html_top_tools.js',
    'mymathcore/math_symbols.js',
    'mymathcore/gui/drop_down_menu.js',
    
    'mymathcore/objects/message_box_object.js',
    'mymathcore/objects/text_object.js',
    'mymathcore/behaviours/behavior.js',
    'mymathcore/behaviours/arrow_movement_behavior.js',
    'mymathcore/behaviours/continuous_arrow_movement_behavior.js',
    'mymathcore/behaviours/move_behavior.js',
    'mymathcore/behaviours/count_behavior.js',
    'mymathcore/behaviours/x_out_behavior.js',
    'mymathcore/behaviours/bounce_behavior.js',
    'mymathcore/behaviours/glow_behavior.js',
    
    'mymathcore/mode_cell_paint.js',
    'mymathcore/mode_draw_box.js',
    'mymathcore/mode_path.js',
];


///////////////////////////////// AUTHENTICATION


/**
 * ======================================================
 *                     CONSTANTS
 * ======================================================
 * set BASE_URL and BASE_DIR for different environments
 */
define('BASE_URL', "http://localhost/mymathcore/api/");
define('CONTENT_URL', 'http://localhost/mymathcore/content/');
define('CONTENT_DIR', realpath(BASE_DIR . '../content/') . DS);

//    define('BASE_URL', "http://dev.mymathcore.com/api/");
//    define('CONTENT_URL', 'http://dev.mymathcore.com/content/');
//    define('CONTENT_DIR', realpath(BASE_DIR.'../content/'). DS);


/**
 * ======================================================
 *                 DATABASE CONNECTION
 * ======================================================
 */
define("DB_SERVER", "localhost");
define("DB_USER", "root");
define("DB_PASS", "");
define("DB_NAME", "my_math_core_db");

include_once BASE_DIR . 'editor' . DS . 'mymathcore' . DS . 'authentication.php';

//    define("DB_SERVER", "127.0.0.1");
//    define("DB_USER", "mymathco_devuser");
//    define("DB_PASS", "FJiic&&qm~)5");
//    define("DB_NAME", "mymathco_dev");
    
