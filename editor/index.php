<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
?><!DOCTYPE HTML>
<html>
    <head>
        <title>Editor</title>
        <meta charset="UTF-8">


        <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" sizes="256x256" href="assets/images/favicon.png" />
        <meta name="HandheldFriendly" content="true" />

        <link rel="shortcut icon" sizes="256x256" href="assets/images/favicon.png" />
        <link href="assets/font-awesome/css/font-awesome.min.css?<?php echo time(); ?>" rel="stylesheet" type="text/css"/>

        <script src="assets/bootstrap/jquery.min.js?<?php echo time(); ?>" type="text/javascript"></script>

        <link href="assets/bootstrap/css/bootstrap.min.css?<?php echo time(); ?>" rel="stylesheet" type="text/css"/>        
        <script src="assets/bootstrap/js/bootstrap.min.js?<?php echo time(); ?>" type="text/javascript"></script>
        <link href="assets/colorpicker/css/bootstrap-colorpicker.min.css?<?php echo time(); ?>" rel="stylesheet" type="text/css"/>
        <script src="assets/colorpicker/js/bootstrap-colorpicker.js?<?php echo time(); ?>" type="text/javascript"></script>
        <link href="assets/slider/bootstrap-slider.css?<?php echo time(); ?>" rel="stylesheet" type="text/css"/>
        <script src="assets/slider/bootstrap-slider.js?<?php echo time(); ?>" type="text/javascript"></script>

        <link href="assets/treeview/themes/default/style.css?<?php echo time(); ?>" rel="stylesheet" type="text/css"/>
        <script src="assets/treeview/jstree.js?<?php echo time(); ?>" type="text/javascript"></script>


        <link href="assets/toastr/toastr.css?<?php echo time(); ?>" rel="stylesheet" type="text/css"/>
        <script src="assets/toastr/toastr.min.js?<?php echo time(); ?>" type="text/javascript"></script>

        <link href="assets/css/style.css?<?php echo time(); ?>" rel="stylesheet" type="text/css"/>


        <script src="config.js?<?php echo time(); ?>" type="application/javascript" ></script>

        <script src="../pixi.min.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="../lib.min.js?<?php echo time(); ?>" type="text/javascript"></script>


        <script src="app/system/app.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/system/style.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/system/loading_screen.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/system/boot.js?<?php echo time(); ?>" type="text/javascript"></script>

        <script src="assets/assets.js?<?php echo time(); ?>" type="text/javascript"></script>

        <script src="app/screens/main_screen.js?<?php echo time(); ?>" type="text/javascript"></script>


        <script src="app/local_file_reader.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/html_interface.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/html_library.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/html_context_menu.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/html_elements.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/html_top_tools.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/properties_binder.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/importer.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/layers_tree.js?<?php echo time(); ?>" type="text/javascript"></script>

        <script src="app/objects/entity.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/image_object.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/label_object.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/layer.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/button_object.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/input_object.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/generic_object.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/container_object.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/polygon_object.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/generic_point.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/path_object.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/objects/line_object.js?<?php echo time(); ?>" type="text/javascript"></script>

        <script src="app/modes/mode_polygon.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/modes/mode_select.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/modes/mode_points.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/modes/mode_lines.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/modes/mode_bezier.js?<?php echo time(); ?>" type="text/javascript"></script>

        <script src="app/commands/commands.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/commands/command_batch.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/commands/command_add.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/commands/command_delete.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/commands/command_move.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/commands/command_property.js?<?php echo time(); ?>" type="text/javascript"></script>
        <script src="app/commands/command_scale.js?<?php echo time(); ?>" type="text/javascript"></script>

        <script src="app/shortcuts.js?<?php echo time(); ?>" type="text/javascript"></script>



    </head>

    <body class="unselectable">   

        <div id="topToolbar" >
            <div id="saveButton" class="btn btn-success "  >
                <i class="fa fa-save"></i>
            </div>
            <div style="display: inline-block; margin-left: 10px; padding-top: 7px;" >

                <label style="margin-right: 10px;">Zoom</label>
                <input style="display: none;" id="zoomSlider" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="14"/>
            </div>

            <div id="editorModes" style="display: inline;margin-left: 20px;">

            </div>

            <div id="alignButtons" style="display: inline;margin-left: 20px;">

            </div>

            <div id="zIndexButtons" style="display: inline;margin-left: 20px;">

            </div>
        </div>

        <div id="sideToolbar" >

            <div id="side-toolbar-navigation">
                <div id="commonPropertiesTab" class="nav-bar-btn fa fa-file fa-2x "></div>
                <div id="propertiesTab" class="nav-bar-btn fa fa-list fa-2x"></div>
                <div id="layersTab" class="nav-bar-btn fa fa-clone fa-2x"></div>
                <div id="objectsGaleryTab" class="nav-bar-btn fa fa-cube fa-2x"></div>                                
                <div id="imageLibraryTab" class="nav-bar-btn fa fa-image fa-2x"></div>
                <div id="prefabsTab" class="nav-bar-btn fa fa-copy fa-2x"></div>
                <div id="settingsTab" class="nav-bar-btn fa fa-cog fa-2x"></div>
            </div>

            <div id="sideToolbarPanel" class="panel-body">

                <div id="settingsPanel" class="form-inline none">
                    <div id="settingsContent" class="content">  

                    </div>
                </div>

                <div id="commonPropertiesPanel" class="form-inline none">
                    <div id="commonPropertiesContent" class="content">

                    </div>
                </div>

                <div id="propertiesPanel" class="form-inline none">
                    <div id="propertiesContent" class="content">

                    </div>
                </div>

                <div id="objectsGaleryPanel" class="form-inline none">
                    <div id="objectsGaleryContent" class="libraryContent">

                    </div>
                </div>

                <div id="prefabsPanel" class="form-inline none">
                    <div id="prefabsContent" class="libraryContent">

                    </div>
                </div>

                <div id="imageLibraryPanel" class="none">
                    <div>
                        <input class="form-control" id="localFileLoaderBtn" type="file" webkitdirectory mozdirectory msdirectory odirectory directory multiple="multiple" />
                    </div>
                    <div id="imageLibraryContent" class="libraryContent" >

                    </div>
                </div>

                <div id="layersPanel" class="form-inline none">
                    <div id="layersContent" class="content">

                    </div>
                </div>

            </div>



        </div>

        <div id="textUpdatePanel" class="panel">
            <div id="textUpdatePanelHeader" class="panel-heading" style="cursor: move;"></div>
            <textarea id="textUpdateArea" class="form-control"></textarea>
            <div class="form-group  form-inline" style="padding-top: 5px;">
                <label>Font</label>
                <input id="textFontSize" class="form-control" style="width: 60px;">
                <div id="colorPicker" class="input-group colorpicker-component" style="width: 140px;">
                    <input type="text" class="form-control" value="#DD0F20"/>
                    <span class="input-group-addon"><i></i></span>
                </div>
                <select id="textFontFamily" class="form-control" style="width: 165px; display: inline;">
                </select>                
                <select id="textAlign" class="form-control" style="width: 90px; display: inline;">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                </select>

                <br />
                <div style="margin-top: 10px;">
                    <label>Stroke</label>
                    <input id="textStrokeThickness" class="form-control" style="width: 60px;">
                    <div id="strokeColorPicker" class="input-group colorpicker-component" style="width: 165px;">

                        <input type="text" class="form-control" value="#171616"/>
                        <span class="input-group-addon"><i></i></span>
                    </div>
                </div>

                <div style="margin-top: 10px;">
                    <label>Shadow</label>
                    <input id="shadowDistance" class="form-control" style="width: 40px;">
                    <label> Angle</label>
                    <input id="shadowAngle" class="form-control" style="width: 60px;">
                    <div id="shadowColorPicker" class="input-group colorpicker-component" style="width: 165px;">

                        <input type="text" class="form-control" value="#171616"/>
                        <span class="input-group-addon"><i></i></span>
                    </div>
                </div>

                <div style="margin-top: 10px;">
                    <label>Letter Spacing</label>
                    <input id="letterSpacing" class="form-control" style="width: 60px;">
                    <label> Line Height</label>
                    <input id="lineHeight" class="form-control" style="width: 60px;">
                    <label> Texture Padding</label>
                    <input id="texturePadding" class="form-control" style="width: 60px;">

                </div>


            </div>
        </div>
        <div id="addLayerModal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Layer</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <input id="layerName" class="form-control" Placeholder="Name"/>
                        </div>
                        <div class="form-group">
                            <input type="number" id="layerFactor" class="form-control" Placeholder="Factor Number (Normal Value)"/>
                        </div>

                        <div class="form-group">
                            <label for="layerInputContent" style="cursor: pointer;">
                                Is Input Content
                            </label>
                            <input id="layerInputContent" class="checkbox-inline"  type="checkbox" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button id="addLayerBtn" type="button" class="btn btn-primary" >Save</button>
                    </div>
                    <input type="hidden" id="layerID" name="layerID" value="" />
                </div>
            </div>
        </div>


        <div id="addCustomPropertyModal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Custom Property</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <input id="customPropertyKey" class="form-control" Placeholder="Key"/>
                        </div>
                        <div class="form-group">
                            <input id="customPropertyValue" class="form-control" Placeholder="Value"/>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button id="addCustomPropertyBtn" type="button" class="btn btn-primary" >Save</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="addGuidesModal" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Guide Lines</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <select id="guideLineAxis" class="form-control">
                                <option value="y">Horizontal</option>
                                <option value="x">Vertical</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <input id="guideLineValue" class="form-control" Placeholder="Value" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button id="addGuideLineBtn" type="button" class="btn btn-primary" >Save</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="imageBrowser" style="position: absolute; background: white; width: 450px; height: 400px; padding: 0px 5px 5px 5px; display: none;" >
            
            <div class="panel-heading" style="padding: 0; overflow: hidden;">
                <div id="closeImageBrowser" class="btn btn-xs" style="float: right;">
                    <i class="fa fa-close"></i>
                </div>
            </div>
            
            <div id="imageLibraryBrowseContent"  class="libraryContent"  >

            </div>
        </div>




    </body>

</html>
