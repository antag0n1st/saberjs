@echo off
title Release

rem navigate to batch file directory
cd /D "%~dp0"

cls
set /p vernum=<tools/release/version
set /a vernum=%vernum% + 1
echo %vernum% > tools/release/version

call grunt
call py tools/release/release.py %vernum%


timeout 5


