@echo off
echo Installing Game Engine Saber JS
echo.
echo.
echo Where to install ? 
set /p dir_name=
echo What is the title of the application ?
set /p name=
echo What is the WIDTH of the canvas ? default(1920)
set /p width=
echo What is the HEIGHT of the canvas ? default(1080)
set /p height=
echo What is the name of the starting screen ? default(home)
set /p start_screen=
echo .
echo Modes:
echo .
echo Config.MODE_FLEXIBLE_WIDTH = 0; // it will scale to the same height and adjust the width acordingly
echo Config.MODE_FLEXIBLE_HEIGHT = 1; // use the same width , but change the height to flll the screen
echo Config.MODE_STRETCH = 2; // I dont know why I would use this mode
echo Config.MODE_CENTERED = 3; // it will preserve the aspect ratio an fit into the screen
echo Config.MODE_NONE = 4; // do not do anything about it
echo Config.MODE_PADDING = 5; // it will leave some space on the sides
echo .
echo .
echo What window mode ? default(3 - Config.MODE_CENTERED) 
set /p window_mode=
echo What window mode for mobile ? default(Config.MODE_FLEXIBLE_WIDTH) you can also type null to ignore it
set /p window_mode_mobile=
echo What background color ? default(0x555555)
set /p background_color=

cd tools

php ./install.php --dir="%dir_name%" --name="%name%" --width="%width%" --height="%height%" --start_screen="%start_screen%" --window_mode="%window_mode%" --window_mode_mobile="%window_mode_mobile%" --background_color="%background_color%"

cd ../../
cd %dir_name%

call npm install grunt-cli -g
call npm install

start "" http://localhost/%dir_name%

timeout 10