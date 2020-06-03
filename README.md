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


source: https://everythingfonts.com/subsetter

Ranges: 

0x20-0x7E basic latin
0x41-0x5A uppercase
0x61-0x7A lowercas
0x30-0x39 numberals
0x20-0x2F,0x3A-0x40,0x5B-0x60,0x7B-0x7E basic punctuation
0x0024,0x00A2-0x00A5,0x20A0-0x20CF currency symbols
0xD7,0x2013,0x2014,0x2018,0x2019,0x201C,0x201D,0x2022,0x2026,0x2032,0x2033,0x2122 advanced punctuation

0xA0-0xFF,0x20AC Latin-1 Supplement , Combine with Basic Latin to cover most European languages. Contains Latin glyphs within the Unicode range U+00A0 to U+00FF and the euro sign U+20AC. Includes punctuation, some currency symbols, numerals and common accented characters. 
0x400-0x4FF,0x500-0x52F,0x2DE0-0x2DFF,0xA640-0xA69F cyrilic alphabet

pyftsubset SF-Pro-Text-Regular.otf --unicodes="0x20-0x7E,0x41-0x5A,0x61-0x7A,0x30-0x39,0x20-0x2F,0x3A-0x40,0x5B-0x60,0x7B-0x7E,0x0024,0x00A2-0x00A5,0x20A0-0x20CF,0xD7,0x2013,0x2014,0x2018,0x2019,0x201C,0x201D,0x2022,0x2026,0x2032,0x2033,0x2122" --layout-features="" --flavor="ttf" --output-file="SF-Pro-Text-Regular.ttf"

pyftsubset SF-Pro-Text-Regular.otf –-text-file="charset.txt"  --layout-features=""  --output-file="SF-Pro-Text-Regular.ttf"