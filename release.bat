@echo off
title Release

rem navigate to batch file directory
cd /D "%~dp0"

cls
set /p vernum=<tools/release/version
set /a vernum=%vernum% + 1
echo %vernum% > tools/release/version

echo.
echo "Starting PRE Release";
echo.
call py tools/release/pre_release.py %vernum%
echo "End PRE Release";
echo.
echo "RELEASING";
echo.

call grunt
call py tools/release/release.py %vernum%

echo.
echo "Starting POST Release";

call py tools/release/post_release.py %vernum%
call grunt

echo.
echo "END POST Release";
echo.

@echo off
echo.
echo.
echo Would you like to publish this ? y/n default(y)
set /p publish_me=


if "%publish_me%" == "n" (
timeout 5
) else (
call publish.bat
)


