@echo off
title Create Icons

rem navigate to batch file directory
cd /D "%~dp0"


magick convert *.png -resize 512x512 ../../assets/icons/icon-512x512.png
magick convert *.png -resize 384x384 ../../assets/icons/icon-384x384.png
magick convert *.png -resize 192x192 ../../assets/icons/icon-192x192.png
magick convert *.png -resize 152x152 ../../assets/icons/icon-152x152.png
magick convert *.png -resize 144x144 ../../assets/icons/icon-144x144.png
magick convert *.png -resize 128x128 ../../assets/icons/icon-128x128.png
magick convert *.png -resize 96x96 ../../assets/icons/icon-96x96.png
magick convert *.png -resize 72x72 ../../assets/icons/icon-72x72.png




