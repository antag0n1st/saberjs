
var Config = {};



/////////////

Config.game_width = 720; // set the size of the canvas here 
Config.game_height = 1280;

Config.name = 'app'; // Its the name of the running environment

Config.MODE_FLEXIBLE_WIDTH = 0; // it will scale to the same height and adjust the width acordingly
Config.MODE_FLEXIBLE_HEIGHT = 1; // use the same width , but change the height to flll the screen
Config.MODE_STRETCH = 2; // I dont know why I would use this mode
Config.MODE_CENTERED = 3; // it will preserve the aspect ratio an fit into the screen
Config.MODE_NONE = 4; // do not do anything about it
Config.MODE_PADDING = 5; // it will leave some space on the sides
Config.MODE_FLIXIBLE = 6; // it will flex on all sides

Config.window_mode = Config.MODE_CENTERED; // set the scaling method
Config.window_mode_mobile = Config.MODE_FLEXIBLE_WIDTH; // if you need special mode for mobile devices

Config.is_canvas_auto_layout = true;

Config.canvas_padding = '0 0 0 0'; // top - right - bottom - left

Config.is_sound_on = true; // switch the sound on/off
Config.debug_info = false;
Config.debug = false;
Config.should_clear_stage = false;
Config.slow_motion_factor = 1;
Config.is_game_paused = false;

Config.master_volume = 0.8;

Config.base_url = '';
Config.lang = 'en';
Config.background_color = 0x555555;

Config.ROTATION_MODE_ALLOW = 0;
Config.ROTATION_MODE_HORIZONTAL = 1;
Config.ROTATION_MODE_VERTICAL = 2;

Config.rotation_mode = Config.ROTATION_MODE_ALLOW;

//////////////// KEYBOARD

Config.keyboardFont = 'sf-pro-text-regular';

//Config.keyboardFontWeight = null; // no need
//Config.keyboardFontSize = 30;
//Config.keyboardPreviewScale = 5; // font scale
//Config.keyboardVibrate = true;
//Config.keyboardCellHeight = 80;
//Config.keyboardSpacingX = 8;
//Config.keyboardSpacingY = 16;
//Config.keyboardPreviewBubbleScale = 0.5; // preview bubble scale
//Config.keyboardDoneText = 'Done';
//Config.keyboardNextText = 'Next';
//Config.hasRaisedBed = false;

//////////////////////// TOAST 

//Config.TOAST_TEXTURE = 'rounded-15';
//Config.TOAST_FONT_NAME = 'sf-pro-display-bold';
//Config.TOAST_FONT_SIZE = 26;
//Config.TOAST_PADDING = 25;
//Config.TOAST_ALPHA = 0.95;
//Config.TOAST_SUCCESS_BACK_COLOR = 0x16b86c;
//Config.TOAST_SUCCESS_TEXT_COLOR = 0xffffff;
//Config.TOAST_WARRNING_BACK_COLOR = 0xf7a736;
//Config.TOAST_WARRNING_TEXT_COLOR = 0xffffff;
//Config.TOAST_ERROR_BACK_COLOR = 0xcf1d1d;
//Config.TOAST_ERROR_TEXT_COLOR = 0xffffff;

Config.initialScreen = 'MainScreen'; // name of the screen
Config.initialScreenArgs = []; // list of arguments to pass to the screen
