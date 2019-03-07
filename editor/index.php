<?php
////////////////////////////////////////////////////////////////////////////////

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$json = file_get_contents('./config.json');
$editorConfig = json_decode($json);

////////////////////////////////////////////////////////////////////////////////
?><!DOCTYPE HTML>
<html>
    <head>
        <title>SaberEditor</title>
        <meta charset="UTF-8">

        <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" sizes="256x256" href="assets/images/favicon.png" />
        <meta name="HandheldFriendly" content="true" />

        <link rel="shortcut icon" sizes="256x256" href="assets/images/favicon.png" />

        <?php include './views/css.php'; ?>

        <?php include './views/base_scripts.php'; ?>
        <?php include './views/scripts.php'; ?>
        <?php include './views/extra_scripts.php'; ?>

        <style type="text/css">
            body{
                background-color: white;
            }
        </style>

    </head>

    <body class="unselectable">   

        <?php include_once './views/html.php'; ?>

    </body>

</html>
