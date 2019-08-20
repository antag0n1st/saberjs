(function (window, undefined) {

    function TextEditor(editor, htmlInterface) {
        this.initialize(editor, htmlInterface);
    }

    TextEditor.prototype.initialize = function (editor, htmlInterface) {

        this.editor = editor;

        this.createEditor();
        this.bindControls();

        htmlInterface.dragElement(document.getElementById('textUpdatePanel'));

    };

    TextEditor.prototype.createEditor = function () {

        var div = document.createElement('div');
        div.className = 'card';
        div.id = 'textUpdatePanel';

        function createEvent(property, eventName) {
            eventName = eventName || 'onkeyup';

            // also attach the wheel event
            // onwheel

            var event = eventName + '="' + "app.navigator.currentScreen.htmlInterface.textEditor.onPropertyChange('" + property + "',this);" + '"';

            if (eventName === "onkeyup") {
                // also bind the wheel event
                event += " onwheel=\"app.navigator.currentScreen.htmlInterface.textEditor.onPropertyWheelChange('" + property + "',this,event);" + '"';
            }

            return event;
        }

        div.innerHTML = `
        

    <div id="textUpdatePanelHeader" class="card-header" style="padding: 0; overflow: hidden;cursor: move;">
        <h3 style="line-height:normal;font-size:22px;float:left;color:#666666;margin:3px 0 0 10px;" >Text Editor</h3>
        <div id="closeTextPanel" class="btn btn-xs" style="float: right; cursor: pointer;">
            <i class="fa fa-close"></i>
        </div>
    </div>


    <div class="card-body">
        <textarea id="textUpdateArea" class="form-control"></textarea>
    </div>
        
    <div class="card-body" style="line-height:normal;">
         
         <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a class="nav-item nav-link active" id="text-editor-basic-tab" data-toggle="tab" href="#text-editor-basic" role="tab" aria-controls="text-editor-basic" aria-selected="true">
                Basic
              </a>
              <a class="nav-item nav-link" id="text-editor-more-tab" data-toggle="tab" href="#text-editor-more" role="tab" aria-controls="text-editor-more" aria-selected="false">
                Advanced
              </a>
              <a class="nav-item nav-link" id="text-editor-background-tab" data-toggle="tab" href="#text-editor-background" role="tab" aria-controls="text-editor-background" aria-selected="false">
                Background
              </a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="text-editor-basic" role="tabpanel" aria-labelledby="text-editor-basic-tab">
              
                <div class="card-body" style="margin-bottom: 0px">
                    <label>Font</label>
                    <input ${createEvent('fontSize')} id="textFontSize" class="form-control" style="width: 60px;">
                    <div id="colorPicker" class="input-group color-pickers" style="width: 140px; display: inline-flex;">
                        <input type="text" class="form-control" value="#DD0F20"/>
                        <span class="input-group-text colorpicker-input-addon"><i></i></span>
                    </div>
                    <select ${createEvent('fontFamily', 'onchange')} id="textFontFamily" class="form-control" style="width: 165px; display: inline;">
                    </select>                
                    <select ${createEvent('align', 'onchange')} id="textAlign" class="form-control" style="width: 90px; display: inline;">
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
                </div>

            </div>
        
            <div class="tab-pane fade" id="text-editor-more" role="tabpanel" aria-labelledby="text-editor-more-tab"> 
                
                <div class="card-body" style="margin-bottom: 0px">
                    <label>Word Wrap Width</label>
                    <input ${createEvent('wordWrapWidth')} id="textWordWrapWidth" class="form-control" style="width: 60px;">
                </div>
                
                <div class="card-body" style="margin-bottom: 0px">
                    <label>Stroke</label>
                    <input ${createEvent('strokeThickness')} id="textStrokeThickness" class="form-control" style="width: 60px;">
                    <div id="strokeColorPicker" class="input-group color-pickers" style="width: 165px; display: inline-flex;">
                        <input type="text" class="form-control" value="#DD0F20"/>
                        <span class="input-group-text colorpicker-input-addon"><i></i></span>
                    </div>
                </div>

                <div class="card-body" style="margin-bottom: 0px">
                    <label>Shadow</label>
                    <input ${createEvent('dropShadowDistance')} id="shadowDistance" class="form-control" style="width: 40px;">
                    <label> Angle</label>
                    <input ${createEvent('dropShadowAngle')} id="shadowAngle" class="form-control" style="width: 60px;">
                    <div id="shadowColorPicker" class="input-group color-pickers" style="width: 165px; display: inline-flex;">
                        <input type="text" class="form-control" value="#DD0F20"/>
                        <span class="input-group-text colorpicker-input-addon"><i></i></span>
                    </div>
                </div>

                <div class="card-body">
                    <label>Letter Spacing</label>
                    <input ${createEvent('letterSpacing')} id="letterSpacing" class="form-control" style="width: 60px;">
                    <label> Line Height</label>
                    <input ${createEvent('lineHeight')} id="lineHeight" class="form-control" style="width: 60px;">
                    <label> Texture Padding</label>
                    <input ${createEvent('padding')} id="texturePadding" class="form-control" style="width: 60px;">
                </div>


            </div>
        
            <div class="tab-pane fade" id="text-editor-background" role="tabpanel" aria-labelledby="text-editor-background-tab"> 

                <div class="card-body">
                    <label>Alpha</label>
                    <input ${createEvent('backgroundAlpha')} id="backgroundAlpha" class="form-control" style="width: 80px;"> 
                    <div id="backgroundColorPicker" class="input-group color-pickers" style="width: 165px; display: inline-flex;">
                        <input type="text" class="form-control" value="#DD0F20"/>
                        <span class="input-group-text colorpicker-input-addon"><i></i></span>
                    </div>
                    <label>Padding</label>
                    <input ${createEvent('backgroundPadding')} id="backgroundPadding" class="form-control" style="width: 80px;">
                                       
                </div>

            </div>
          </div>
         
    </div>

`;

        document.body.appendChild(div);

    };

    ///

    TextEditor.prototype.bindControls = function () {


        this.textUpdatePanel = document.getElementById('textUpdatePanel');
        this.textUpdateArea = document.getElementById('textUpdateArea');
        var closeTextPanel = document.getElementById('closeTextPanel');
        this.textFontSize = document.getElementById('textFontSize');
        this.textFontFamily = document.getElementById('textFontFamily');
        this.textAlign = document.getElementById('textAlign');
        this.textStrokeThickness = document.getElementById('textStrokeThickness');
        this.shadowDistance = document.getElementById('shadowDistance');
        this.shadowAngle = document.getElementById('shadowAngle');
        this.letterSpacing = document.getElementById('letterSpacing');
        this.lineHeight = document.getElementById('lineHeight');
        this.texturePadding = document.getElementById('texturePadding');
        this.wordWrapWidth = document.getElementById('textWordWrapWidth');
        this.backgroundPadding = document.getElementById('backgroundPadding');
        this.backgroundAlpha = document.getElementById('backgroundAlpha');


        ////////////////////////////////
        // set position

        var size = app.device.windowSize();


        var width = 524;
        var height = 359;

        var x = (size.width) - width - 400;
        var y = size.height - height - 10;
        this.textUpdatePanel.style.left = x + 'px';
        this.textUpdatePanel.style.top = y + 'px';

        //////////////////////////////////////////



        this.textUpdateArea.onkeyup = this.onTextareaKey.bind(this);
        this.textUpdateArea.oninput = this.onTextareaKey.bind(this);


        closeTextPanel.onclick = function () {
            this.hideTextEdit();
        }.bind(this);

        ////////////////////

        this.setFonts();
        this.setColorPickers();


    };

    TextEditor.prototype.setColorPickers = function () {

        var that = this;

        var pickerOptions = HtmlElements.getPickerOptions();
        
        this.backgroundColorPicker = $('#backgroundColorPicker').colorpicker(pickerOptions);
        this.backgroundColorPicker.on('change', function (e) {
             that.setStyleValue('backgroundColor',e.color.toHexString());
        });

        delete pickerOptions.extensions[0].options.colors.transparent;

        this.textColorPicker = $('#colorPicker').colorpicker(pickerOptions);
        this.textColorPicker.on('change', function (e) {
            that.setStyleValue('fill', e.color.toHexString());
        });

        this.textStrokeColorPicker = $('#strokeColorPicker').colorpicker(pickerOptions);
        this.textStrokeColorPicker.on('change', function (e) {
            that.setStyleValue('stroke', e.color.toHexString());
        });

        this.shadowColorPicker = $('#shadowColorPicker').colorpicker(pickerOptions);
        this.shadowColorPicker.on('change', function (e) {
            that.setStyleValue('dropShadowColor', e.color.toHexString());
        });
        
        

        //
    };

    TextEditor.prototype.setFonts = function () {

        this.textFontFamily.innerHTML = '';

        var fonts = '';

        fonts += '<option value="\'Arial Black\', Impact, Charcoal">Arial Black, Impact, Charcoal</option>';

        for (var property in Fonts) {
            if (Fonts.hasOwnProperty(property)) {
                var font = Fonts[property];
                var opt = document.createElement('option');
                opt.value = font.fontFamily;
                opt.innerHTML = font.fontFamily;
                this.textFontFamily.appendChild(opt);
            }
        }

        this.textFontFamily.innerHTML += fonts;
    };

    TextEditor.prototype.onPropertyWheelChange = function (property, element, event) {

        var value = Number(element.value) || 0;
        var changeValue = 1;
        if (property === "backgroundAlpha") {
            changeValue = 0.1;
        }
        
        var delta = 0;
        
        if (!event) {
            event = window.event;
        }

        if(event.deltaY){
            delta = -event.deltaY;
        } else if (event.wheelDelta) { 
            delta = event.wheelDelta / 120;
        } else if (event.detail) { 
            delta = -event.detail / 3;
        } 

        var dir = (delta < 0) ? -1 : 1;

        if (dir > 0) {
            value += changeValue;
        } else {
            value -= changeValue;
        }

        var newValue = this.filterValues(property, value);

        this.setStyleValue(property, newValue);

        if (property === "dropShadowAngle") {
            element.value = Math.radiansToDegrees(newValue)
        } else {
            element.value = newValue;
        }


    };

    TextEditor.prototype.onPropertyChange = function (property, element) {

        var value = this.filterValues(property, element.value);

        this.setStyleValue(property, value);

    };

    TextEditor.prototype.setStyleValue = function (property, value) {

        var clickedObject = this.editor.selectedObjects[0];

        if (property.startsWith("background")) {
            if (property === "backgroundPadding") {
                clickedObject.label.properties.padding = value;
            } else {
                clickedObject.label.properties[property] = value;
            }
            clickedObject.label.setBackground(clickedObject.label.properties);
        } else {
            if (clickedObject) {
                if (clickedObject.isStyled) {
                    clickedObject.label.label.textStyles.default[property] = value;
                    clickedObject.label.label.style[property] = value;
                    clickedObject.label.label.dirty = true;
                } else {
                    clickedObject.label.style[property] = value;
                }
            }
        }


        this.postProcess(clickedObject, property, value);

        this.updateText();
    };

    TextEditor.prototype.filterValues = function (property, value) {

        if (property === "fontSize") {
            var fontSize = (value + '').replace('px', '');
            value = Math.clamp(Math.round(fontSize), 10, 600);
        } else if (property === "dropShadowDistance") {
            value = Math.clamp(Math.round(value), 0, 200);
        } else if (property === "strokeThickness") {
            value = Math.clamp(Math.round(value), 0, 100);
        } else if (property === "wordWrapWidth") {
            value = Math.clamp(Math.round(value), 0, 2000);
        } else if (property === "dropShadowAngle") {
            value = Math.degreesToRadians(Math.clamp(Math.round(value), 0, 360));
        } else if (property === "letterSpacing") {
            value = Math.clamp(Math.round(value), -500, 500);
        } else if (property === "lineHeight") {
            value = Math.clamp(Math.round(value), -500, 500);
        } else if (property === "padding") {
            value = Math.clamp(Math.round(value), 0, 200);
        } else if (property === "backgroundPadding") {
            value = Math.clamp(Math.round(value), 0, 300);
        } else if (property === "backgroundAlpha") {
            value = Math.roundDecimal(Math.clamp(value, 0, 1), 2);
        }

        return value;

    };

    TextEditor.prototype.postProcess = function (clickedObject, property, value) {

        if (clickedObject) {

            if (clickedObject.isStyled) {

                if (property === "dropShadowDistance") {
                    var dropShadow = (value > 0);
                    clickedObject.label.label.style.dropShadow = dropShadow;
                    clickedObject.label.label.textStyles.default.dropShadow = dropShadow;
                    clickedObject.label.label.dirty = true;
                } else if (property === "wordWrapWidth") {
                    var wordWrap = (value > 0);
                    clickedObject.label.label.style.wordWrap = wordWrap;
                    clickedObject.label.label.textStyles.default.wordWrap = wordWrap;
                    clickedObject.label.label.dirty = true;
                }

            } else {

                if (property === "dropShadowDistance") {
                    var dropShadow = (value > 0);
                    clickedObject.label.style.dropShadow = dropShadow;
                } else if (property === "wordWrapWidth") {
                    var wordWrap = (value > 0);
                    clickedObject.label.style.wordWrap = wordWrap;
                }

            }

        }

    };

    TextEditor.prototype.onTextareaKey = function (e) {

        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.text !== undefined) {
            clickedObject.text = this.textUpdateArea.value;
        } else {
            clickedObject.label.txt = this.textUpdateArea.value;
        }

        this.updateText();

    };

    TextEditor.prototype.updateText = function () {
        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.text !== undefined) {
            clickedObject.updateSize();
            clickedObject.updateFrame();
        } else if (clickedObject.label) {
            clickedObject.build();
        }
    };

    ///////////////////////////

    TextEditor.prototype.showTextEdit = function (object) {

        this.textUpdatePanel.style.display = 'block';

        var style = null;
        if (object.isStyled) {
            style = object.label.label.textStyles.default;
        } else {
            style = object.label.style;
        }

        /// set values

        this.textUpdateArea.value = object.text || object.label.txt;
        this.textFontSize.value = (style.fontSize + '').replace('px', '');
        this.textAlign.value = style.align;
        this.textColorPicker.colorpicker('setValue', style.fill);
        this.textFontFamily.value = style.fontFamily;

        this.textStrokeThickness.value = style.strokeThickness;
        this.textStrokeColorPicker.colorpicker('setValue', style.stroke);

        this.shadowAngle.value = Math.round(Math.radiansToDegrees(style.dropShadowAngle));
        if (style.dropShadow) {
            this.shadowDistance.value = style.dropShadowDistance;
        } else {
            this.shadowDistance.value = 0;
        }

        this.shadowColorPicker.colorpicker('setValue', style.dropShadowColor);

        this.lineHeight.value = style.lineHeight;
        this.letterSpacing.value = style.letterSpacing;
        this.texturePadding.value = style.padding;

        this.wordWrapWidth.value = style.wordWrap ? style.wordWrapWidth : 0;

        if (object.label.properties) {
            this.backgroundAlpha.value = object.label.properties.backgroundAlpha;
            this.backgroundPadding.value = object.label.properties.padding;
            this.backgroundColorPicker.colorpicker('setValue', object.label.properties.backgroundColor);
        }

        this.textUpdateArea.focus();
    };


    TextEditor.prototype.hideTextEdit = function () {
        this.textUpdatePanel.style.display = 'none';
    };

    /////////////////////////////////////////////////////////////////////////////

    window.TextEditor = TextEditor;

}(window));