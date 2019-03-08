<?php
////////////////////////////////////////////////////////////////////////////////

include_once './config.php';


////////////////////////////////////////////////////////////////////////////////
?><!DOCTYPE HTML>
<html lang='en'>
    <head>
        <title>SaberEditor</title>
        <meta charset="UTF-8">

        <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" sizes="256x256" href="assets/images/favicon.png" />
        <meta name="HandheldFriendly" content="true" />

        <link rel="shortcut icon" sizes="256x256" href="assets/images/favicon.png" />

        <?php
        foreach ($_css as $stylesheet) {
            echo '<link href="' . $stylesheet . '?v=' . time() . '" rel="stylesheet" />' . "\n\t\t";
        }

        echo "\n\t\t";
        echo '<script>  var editorConfig =' . $json . ' ; </script> ' . "\n\t\t";
        echo "\n\t\t";
        echo '<script>  var Config =' . $_app_config_json . ' ; </script> ' . "\n\t\t";
        echo "\n\t\t";

        foreach ($_base_scripts as $script) {
            echo '<script src="' . $script . '?v=' . time() . '" ></script>' . "\n\t\t";
        }

        include './scripts.php';

        foreach ($_javascripts as $jscript) {
            echo '<script src="' . $jscript . '?v=' . time() . '" ></script>' . "\n\t\t";
        }

        echo "\n\t\t";

        foreach ($_extra_scripts as $extra_script) {
            echo '<script src="' . $extra_script . '?v=' . time() . '" ></script>' . "\n\t\t";
        }

        echo "\n\t\t";
        ?>


        <style>
            body{
                background-color: white;
            }
        </style>

    </head>

    <body class="unselectable">   

        <?php include_once './html.php'; ?>

    </body>

</html>
