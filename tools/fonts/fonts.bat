@echo off

rem navigate to batch file directory
cd /D "%~dp0"



cd package
echo Available Fonts:
echo.
dir /b /a-d 
echo.
echo Font you want to convert ? default (all) options (name \ all \ none) PRESS TAB TO LIST THEM
set /p font_name=


cd ../charsets
echo Available Charsets:
echo.
dir /b /a-d 
echo.
echo Which charset default(latin-with-extra) PRESS TAB TO LIST THEM
set /p charset=


cd ..

php ./fonts.php --font_name=%font_name% --charset=%charset%

timeout 3