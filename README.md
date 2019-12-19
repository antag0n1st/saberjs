# saberjs
framework based on PIXIJS
# optimize fonts here https://www.fontsquirrel.com/tools/webfont-generator
# https://www.glyphrstudio.com/online/

https://www.pwabuilder.com/
https://whatwebcando.today/
https://www.netguru.com/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native

unblock apache in firewall wamp/bin/apache/apahce{versuin}/bin/httpd.exe , httpd.exe

add this in C:\wamp64\bin\apache\apache2.4.27\conf\extra\httpd-vhosts.conf

<VirtualHost *:80>
    ServerName localhost
    DocumentRoot C:/wamp64/www
    <Directory  "C:/wamp64/www/">
        Options +Indexes +Includes +FollowSymLinks +MultiViews
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
