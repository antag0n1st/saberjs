<div id="leftToolbar" style="visibility: hidden;" >

    <div style="height: 50px;"></div>

    <div id="editorModes" style="display: inline;">

    </div>

    <div id="alignButtons" style="display: inline;">

    </div>

</div>

<div id="topToolbar" style="visibility: hidden;" >

    <button id="saveButton" class="btn btn-success "  type="button" >
        <i class="fa fa-save"></i>
    </button>

    <button id="playButton" class="btn btn-info" style="width: 100px; margin-left: 5px;"  >
        <i class="fa fa-play"></i>
    </button>

    <?php if ($editorConfig->features->zoom): ?>
        <div id="zoomControl" style="display: inline-block; margin-left: 10px; padding-top: 7px;" >

            <label style="margin-right: 10px;">Zoom</label>
            <input style="display: none;" id="zoomSlider" data-slider-id='ex1Slider' type="text" data-slider-min="0" data-slider-max="20" data-slider-step="1" data-slider-value="14"/>
        </div>
    <?php endif; ?>

    <div id="spacingButtons" style="display: inline;margin-left: 20px;">

    </div>

    <div id="zIndexButtons" style="display: inline;margin-left: 20px;">

    </div>

</div>

<div id="sideToolbar" style="visibility: hidden;" >

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

            <div id="imageLibraryContent" class="libraryContent" >

            </div>
        </div>

        <div id="layersPanel" class="form-inline none">
            <div id="layersContent" class="content">

            </div>
        </div>

    </div>

</div>


<div id="textUpdatePanel" class="card">

    <div id="textUpdatePanelHeader" class="card-header" style="cursor: move; height: 20px;">

    </div>

    <div class="card-body">
        <textarea id="textUpdateArea" class="form-control"></textarea>
    </div>

    <div class="card-body" style="margin-bottom: 0px">
        <label>Font</label>
        <input id="textFontSize" class="form-control" style="width: 60px;">
        <div id="colorPicker" class="input-group color-pickers" style="width: 140px; display: inline-flex;">
            <input type="text" class="form-control" value="#DD0F20"/>
            <span class="input-group-text colorpicker-input-addon"><i></i></span>
        </div>
        <select id="textFontFamily" class="form-control" style="width: 165px; display: inline;">
        </select>                
        <select id="textAlign" class="form-control" style="width: 90px; display: inline;">
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
        </select>
    </div>

    <div class="card-body" style="margin-bottom: 0px">
        <label>Stroke</label>
        <input id="textStrokeThickness" class="form-control" style="width: 60px;">
        <div id="strokeColorPicker" class="input-group color-pickers" style="width: 165px; display: inline-flex;">
            <input type="text" class="form-control" value="#DD0F20"/>
            <span class="input-group-text colorpicker-input-addon"><i></i></span>
        </div>
    </div>

    <div class="card-body" style="margin-bottom: 0px">
        <label>Shadow</label>
        <input id="shadowDistance" class="form-control" style="width: 40px;">
        <label> Angle</label>
        <input id="shadowAngle" class="form-control" style="width: 60px;">
        <div id="shadowColorPicker" class="input-group color-pickers" style="width: 165px; display: inline-flex;">
            <input type="text" class="form-control" value="#DD0F20"/>
            <span class="input-group-text colorpicker-input-addon"><i></i></span>
        </div>
    </div>

    <div class="card-body">
        <label>Letter Spacing</label>
        <input id="letterSpacing" class="form-control" style="width: 60px;">
        <label> Line Height</label>
        <input id="lineHeight" class="form-control" style="width: 60px;">
        <label> Texture Padding</label>
        <input id="texturePadding" class="form-control" style="width: 60px;">
    </div>


</div>

<div id="addLayerModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Layer</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>  
            <div class="modal-body">
                <div class="form-group">
                    <input id="layerName" class="form-control" Placeholder="Name"/>
                </div>
                <div class="form-group">
                    <input type="number" id="layerFactor" class="form-control" Placeholder="Factor Number (Normal Value)" value="1"/>
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
                <h5 class="modal-title">Custom Property</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
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
                <h5 class="modal-title">Guide Lines</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
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

<div id="imageBrowser" style="position: absolute; background: white; width: 450px; padding: 0px 5px 5px 5px; display: none; border: 1px solid #555555;" >

    <div class="panel-heading" style="padding: 0; overflow: hidden;">
        <div id="closeImageBrowser" class="btn btn-xs" style="float: right;">
            <i class="fa fa-close"></i>
        </div>
    </div>

    <div id="imageLibraryBrowseContent"  class="libraryContent"  >

    </div>
</div>

<script type="text/javascript">
    window.addEventListener("load", function () {

        Config.lang = 'en';

        PIXI.utils.skipHello();

        app = new App();

    }, false);
</script>