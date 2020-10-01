(function (window, undefined) {


    function HtmlTopTools(editor) {
        this.initialize(editor);
    }

    HtmlTopTools.prototype.initialize = function (editor) {

        this.editor = editor;



    };

    HtmlTopTools.prototype.bindHTML = function () {

        // WORKING WITH LABEL

        var that = this;


        this.textUpdatePanel = document.getElementById('textUpdatePanel');
        this.textUpdateArea = document.getElementById('textUpdateArea');
        this.textUpdateArea.onkeyup = this.onTextareaKey.bind(this);
        this.textUpdateArea.oninput = this.onTextareaKey.bind(this);

        var closeTextPanel = document.getElementById('closeTextPanel');
        closeTextPanel.onclick = function () {
            that.hideTextEdit();
        };


        var size = app.device.windowSize();

        var b = this.textUpdatePanel.getBoundingClientRect();
        var width = 524;
        var height = 359;

        var x = (size.width) - width - 400;
        var y = size.height - height - 10;
        this.textUpdatePanel.style.left = x + 'px';
        this.textUpdatePanel.style.top = y + 'px';

        this.textFontSize = document.getElementById('textFontSize');
        this.textFontFamily = document.getElementById('textFontFamily');
        this.textAlign = document.getElementById('textAlign');

        this.textFontSize.onkeyup = this.onFontSizeKey.bind(this);
        this.textFontSize.onwheel = this.onFontSizeWheel.bind(this);
        this.textAlign.onchange = this.onTextAlignChange.bind(this);

        this.textFontFamily.onchange = this.onFontFamily.bind(this);

        var pickerOptions = HtmlElements.getPickerOptions();

        delete pickerOptions.extensions[0].options.colors.transparent;

        this.textColorPicker = $('#colorPicker').colorpicker(pickerOptions);
        this.textColorPicker.on('change', function (e) {
            that.onTextColorChange(e.color.toHexString());
        });

        /////////////////////

        this.textStrokeThickness = document.getElementById('textStrokeThickness');
        this.textStrokeThickness.onwheel = this.onStrokeThicknessWheel.bind(this);
        this.textStrokeThickness.onkeyup = this.onStrokeThickness.bind(this);

        this.textStrokeColorPicker = $('#strokeColorPicker').colorpicker(pickerOptions);
        this.textStrokeColorPicker.on('change', function (e) {
            that.onStrokeColorChange(e.color.toHexString());
        });

        this.snapCheckbox = document.getElementById('snapCheckbox');
        this.snapCheckbox.onclick = this.onSnapModeChange.bind(this);
        this.snapCheckbox.checked = this.editor.isSnaping;

        ///////////////////////////////////////////////////////
        // drop shadow


        this.shadowDistance = document.getElementById('shadowDistance');
        this.shadowDistance.onwheel = this.onShadowDistanceWheel.bind(this);
        this.shadowDistance.onkeyup = this.onShadowDistance.bind(this);

        this.shadowAngle = document.getElementById('shadowAngle');
        this.shadowAngle.onkeyup = this.onShadowAngle.bind(this);

        this.shadowColorPicker = $('#shadowColorPicker').colorpicker(pickerOptions);
        this.shadowColorPicker.on('change', function (e) {
            that.onShadowColorChange(e.color.toHexString());
        });

        this.letterSpacing = document.getElementById('letterSpacing');
        this.letterSpacing.onkeyup = this.onLetterSpacing.bind(this);

        this.lineHeight = document.getElementById('lineHeight');
        this.lineHeight.onkeyup = this.onLineHeight.bind(this);

        this.texturePadding = document.getElementById('texturePadding');
        this.texturePadding.onkeyup = this.onTexturePadding.bind(this);

        ////////////////////

        var fonts = '';


        fonts += '<option value="ArialHebrew-Bold,Helvetica,Impact">ArialHebrew-Bold,Helvetica,Impact</option>';
//        fonts += '<option value="Impact, Charcoal, sans-serif">Impact, Charcoal, sans-serif</option>';
//        fonts += '<option value="Tahoma, Geneva, sans-serif">Tahoma, Geneva, sans-serif</option>';

        this.textFontFamily.innerHTML = '';


        for (var i = 0; i < Fonts.fonts.length; i++) {
            var font = Fonts.fonts[i];

            var opt = document.createElement('option');
            opt.value = font.family;
            opt.innerHTML = font.family;
            this.textFontFamily.appendChild(opt);
        }

//        for (var property in Fonts) {
//            if (Fonts.hasOwnProperty(property)) {
//                var font = Fonts[property];
//
//                var opt = document.createElement('option');
//                opt.value = font.fontFamily;
//                opt.innerHTML = font.fontFamily;
//                this.textFontFamily.appendChild(opt);
//
//            }
//        }

        this.textFontFamily.innerHTML += fonts;

        this.saveButton = document.getElementById('saveButton');
        this.saveButton.onclick = this.onSaveBtn.bind(this);

        this.duplicateButton = document.getElementById('duplicateButton');
        this.duplicateButton.onclick = this.onDuplicateButton.bind(this);

        if (editorConfig.features.playButton) {
            this.playButton = document.getElementById('playButton');
            this.playButton.onclick = this.editor.onPlayButton.bind(this.editor);
        } else {
            var playButton = document.getElementById('playButton');
            playButton.style.display = 'none';
        }

        // ZOOM
        if (editorConfig.features.zoom) {

            this.zoomSlider = new Slider('#zoomSlider', {
                ticks: [-0.8, 0, 3],
                ticks_positions: [0, 50, 100],
                value: 0,
                step: 0.1,
                tooltip_position: 'bottom',
                formatter: function (value) {
                    return 'Zoom: ' + value;
                }
            });

            this.zoomSlider.on('change', this.onZoomSlider, this);
        }

        /////

        this.editorModes = document.getElementById('editorModes');
        this.showEditorModes();

        this.alignButtons = document.getElementById('alignButtons');
        this.spacingButtons = document.getElementById('spacingButtons');
        this.zIndexButtons = document.getElementById('zIndexButtons');


    };

    ///////////////////////// LABEL EDIT PANEL /////////////////////////////////

    HtmlTopTools.prototype.onTextColorChange = function (colorHex) {
        var clickedObject = this.editor.selectedObjects[0];
        if (clickedObject) {
            if (clickedObject.isStyled) {
                clickedObject.label.label.textStyles.default.fill = colorHex;
                clickedObject.label.label.dirty = true;
            } else {
                clickedObject.label.style.fill = colorHex;
            }
        }
    };

    HtmlTopTools.prototype.onStrokeColorChange = function (colorHex) {
        var clickedObject = this.editor.selectedObjects[0];
        if (clickedObject) {
            if (clickedObject.isStyled) {
                clickedObject.label.label.textStyles.default.stroke = colorHex;
                clickedObject.label.label.dirty = true;
            } else {
                clickedObject.label.style.stroke = colorHex;
            }

        }
    };

    HtmlTopTools.prototype.onShadowColorChange = function (colorHex) {
        var clickedObject = this.editor.selectedObjects[0];
        if (clickedObject) {
            if (clickedObject.isStyled) {
                clickedObject.label.label.textStyles.default.dropShadowColor = colorHex;
                clickedObject.label.label.dirty = true;
            } else {
                clickedObject.label.style.dropShadowColor = colorHex;
            }
        }
    };

    HtmlTopTools.prototype.onStrokeThickness = function (e) {
        var clickedObject = this.editor.selectedObjects[0];
        if (clickedObject) {
            if (clickedObject.isStyled) {
                clickedObject.label.label.textStyles.default.strokeThickness = Math.round(this.textStrokeThickness.value);
                clickedObject.label.label.dirty = true;
            } else {
                clickedObject.label.style.strokeThickness = Math.round(this.textStrokeThickness.value);
            }
        }
    };

    HtmlTopTools.prototype.onShadowDistance = function (e) {
        var clickedObject = this.editor.selectedObjects[0];
        if (clickedObject) {
            var value = Math.round(this.shadowDistance.value);

            if (clickedObject.isStyled) {

                clickedObject.label.label.textStyles.default.dropShadowDistance = value;
                if (value) {
                    clickedObject.label.label.textStyles.default.dropShadow = true;
                } else {
                    clickedObject.label.label.textStyles.default.dropShadow = false;
                }

                clickedObject.label.label.dirty = true;
            } else {

                clickedObject.label.style.dropShadowDistance = value;
                if (value) {
                    clickedObject.label.style.dropShadow = true;
                } else {
                    clickedObject.label.style.dropShadow = false;
                }
            }
        }
    };

    HtmlTopTools.prototype.onShadowAngle = function (e) {
        var clickedObject = this.editor.selectedObjects[0];
        if (clickedObject) {
            var angle = Math.round(this.shadowAngle.value);
            angle = Math.degreesToRadians(angle);

            if (clickedObject.isStyled) {
                clickedObject.label.label.textStyles.default.dropShadowAngle = angle;
                clickedObject.label.label.dirty = true;
            } else {
                clickedObject.label.style.dropShadowAngle = angle;
            }
        }
    };

    HtmlTopTools.prototype.onTextAlignChange = function (e) {
        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.isStyled) {
            clickedObject.label.label.textStyles.default.align = this.textAlign.value;
            clickedObject.label.label.style.align = this.textAlign.value;
            clickedObject.label.label.dirty = true;
        } else {
            clickedObject.label.style.align = this.textAlign.value;
        }
        clickedObject.updateSize();
        clickedObject.updateFrame();
    };

    HtmlTopTools.prototype.onFontSizeWheel = function (e) {
        var fontSize = (this.textFontSize.value + '').replace('px', '');
        fontSize = Math.round(fontSize);
        if (e.wheelDelta > 0) {
            fontSize += 1;
        } else {
            fontSize -= 1;
        }

        var clickedObject = this.editor.selectedObjects[0];

        fontSize = (fontSize < 10) ? 10 : fontSize;
        fontSize = (fontSize > 600) ? 600 : fontSize;

        if (clickedObject.isStyled) {
            clickedObject.label.label.textStyles.default.fontSize = fontSize + 'px';
            clickedObject.label.label.dirty = true;
        } else {
            clickedObject.label.style.fontSize = fontSize + 'px';
        }


        clickedObject.updateSize();
        clickedObject.updateFrame();

        this.textFontSize.value = fontSize;
    };

    HtmlTopTools.prototype.onStrokeThicknessWheel = function (e) {

        var value = Math.round(this.textStrokeThickness.value);
        if (e.wheelDelta > 0) {
            value += 1;
        } else {
            value -= 1;
        }
        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.isStyled) {
            clickedObject.label.label.textStyles.default.strokeThickness = value;
            clickedObject.label.label.dirty = true;
        } else {
            clickedObject.label.style.strokeThickness = value;
        }
        this.textStrokeThickness.value = value;

    }; // onStrokeThicknessWheel

    HtmlTopTools.prototype.onShadowDistanceWheel = function (e) {

        var value = Math.round(this.shadowDistance.value);
        if (e.wheelDelta > 0) {
            value += 1;
        } else {
            value -= 1;
        }

        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.isStyled) {

            clickedObject.label.label.textStyles.default.dropShadowDistance = value;
            if (value) {
                clickedObject.label.label.textStyles.default.dropShadow = true;
            } else {
                clickedObject.label.label.textStyles.default.dropShadow = false;
            }

            clickedObject.label.label.dirty = true;
        } else {

            clickedObject.label.style.dropShadowDistance = value;
            if (value) {
                clickedObject.label.style.dropShadow = true;
            } else {
                clickedObject.label.style.dropShadow = false;
            }
        }

        this.shadowDistance.value = value;
    };
    //onShadowDistanceWheel


    HtmlTopTools.prototype.onFontSizeKey = function (e) {

        var fontSize = (this.textFontSize.value + '').replace('px', '');
        fontSize = Math.round(fontSize);
        fontSize = (fontSize < 10) ? 10 : fontSize;
        fontSize = (fontSize > 600) ? 600 : fontSize;

        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.isStyled) {
            clickedObject.label.label.textStyles.default.fontSize = fontSize + 'px';
            clickedObject.label.label.dirty = true;
        } else {
            clickedObject.label.style.fontSize = fontSize + 'px';
        }

        clickedObject.updateSize();
        clickedObject.updateFrame();
    };

    HtmlTopTools.prototype.onFontFamily = function (e) {

        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.isStyled) {
            clickedObject.label.label.textStyles.default.fontFamily = this.textFontFamily.value;
            clickedObject.label.label.dirty = true;
        } else {
            clickedObject.label.style.fontFamily = this.textFontFamily.value;
            clickedObject.label.updateText();
        }


        clickedObject.updateSize();
        clickedObject.updateFrame();
    };


    HtmlTopTools.prototype.onLetterSpacing = function () {
        var clickedObject = this.editor.selectedObjects[0];

        var value = Math.round(this.letterSpacing.value);
        value = Math.clamp(value, -100, 100) || 0;

        if (clickedObject.isStyled) {
            clickedObject.label.label.textStyles.default.letterSpacing = value;
            clickedObject.label.label.dirty = true;
        } else {
            clickedObject.label.style.letterSpacing = value;
            clickedObject.label.updateText();
        }

        clickedObject.updateSize();
        clickedObject.updateFrame();
    };

    HtmlTopTools.prototype.onLineHeight = function () {
        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.isStyled) {
            clickedObject.label.label.textStyles.default.lineHeight = Math.round(this.lineHeight.value);
            clickedObject.label.label.dirty = true;
        } else {
            clickedObject.label.style.lineHeight = Math.round(this.lineHeight.value);
            clickedObject.label.updateText();
        }
        clickedObject.updateSize();
        clickedObject.updateFrame();
    };

    HtmlTopTools.prototype.onTexturePadding = function () {
        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.isStyled) {
            clickedObject.label.label.textStyles.default.padding = Math.round(this.texturePadding.value);
            clickedObject.label.label.dirty = true;
        } else {
            clickedObject.label.style.padding = Math.round(this.texturePadding.value);
            clickedObject.label.updateText();
        }
        clickedObject.updateSize();
        clickedObject.updateFrame();
    };




    HtmlTopTools.prototype.onTextareaKey = function (e) {

        var clickedObject = this.editor.selectedObjects[0];

        if (clickedObject.text !== undefined) {
            clickedObject.text = this.textUpdateArea.value;
        } else {
            clickedObject.label.txt = this.textUpdateArea.value;
        }

        clickedObject.updateSize();
        clickedObject.updateFrame();

    };
    ///////////////////////////

    HtmlTopTools.prototype.showTextEdit = function (object) {

        this.textUpdatePanel.style.display = 'block';

        var style = null;
        if (object.isStyled) {
            style = object.label.label.textStyles.default;
        } else {
            style = object.label.style;
        }

        this.textUpdateArea.value = object.text || object.label.txt;
        this.textFontSize.value = (style.fontSize + '').replace('px', '');
        this.textAlign.value = style.align;
        this.textColorPicker.colorpicker('setValue', style.fill);
        this.textFontFamily.value = style.fontFamily;

        this.textStrokeThickness.value = style.strokeThickness;
        this.textStrokeColorPicker.colorpicker('setValue', style.stroke);

        this.shadowAngle.value = Math.round(Math.radiansToDegrees(style.dropShadowAngle));
        this.shadowDistance.value = style.dropShadowDistance;
        this.shadowColorPicker.colorpicker('setValue', style.dropShadowColor);

        this.lineHeight.value = style.lineHeight;
        this.letterSpacing.value = style.letterSpacing;
        this.texturePadding.value = style.padding;

        this.textUpdateArea.focus();
    };



    HtmlTopTools.prototype.hideTextEdit = function () {
        this.textUpdatePanel.style.display = 'none';
    };

    /////////////////////////////////////////////////////////////////////////////

    HtmlTopTools.prototype.onSaveBtn = function () {
        if (this.editor._customSave) {
            this.editor._customSave();
        } else {
            this.editor.htmlInterface.saveCurrentContent();
        }

    };

    HtmlTopTools.prototype.onDuplicateButton = function () {

        if (this.editor.selectedObjects.length) {

            for (var i = 0; i < this.editor.selectedObjects.length; i++) {
                var o = this.editor.selectedObjects[i];
                if (o.type === "MessageBoxObject") {
                    toastr.warning("Can't duplicate a Question Message Box");
                    return;
                }
            }

            this.editor.copySelection();
            this.editor.paste();
        }
    };



    // This method is inivoked when the zoom slider is moved
    HtmlTopTools.prototype.onZoomSlider = function (data) {
        this.zoomInAt(data.newValue, new V(app.width / 2, app.height / 2), 300);
    };

    HtmlTopTools.prototype.alignSelectedObjects = function (type) {

        var edges = this.findAlignEdges();

        var batch = new CommandBatch();

        for (var i = 0; i < this.editor.selectedObjects.length; i++) {
            var object = this.editor.selectedObjects[i];
            var bounds = object.getBounds();

            var dx = 0;
            var dy = 0;

            if (type === "top") {
                dy = edges.minY - bounds.top;
            } else if (type === "right") {
                dx = edges.maxX - bounds.right;
            } else if (type === "bottom") {
                dy = edges.maxY - bounds.bottom;
            } else if (type === "left") {
                dx = edges.minX - bounds.left;
            } else if (type === "centerX") {
                var cy = edges.minY + (edges.maxY - edges.minY) / 2;
                dy = cy - bounds.top - (bounds.bottom - bounds.top) / 2;
            } else if (type === "centerY") {
                var cx = edges.minX + (edges.maxX - edges.minX) / 2;
                dx = cx - bounds.left - (bounds.right - bounds.left) / 2;
            }

            var moveCommand = new CommandMove(object, object.position.x + dx, object.position.y + dy);

            batch.add(moveCommand);

        }

        this.editor.commands.add(batch);
    };

    HtmlTopTools.prototype.findAlignEdges = function () {

        var objects = this.editor.selectedObjects;
        var b = objects[0].getBounds();

        var minX = b.left;
        var maxX = b.right;
        var minY = b.top;
        var maxY = b.bottom;

        for (var i = 0; i < objects.length; i++) {

            var bounds = objects[i].getBounds();

            if (minX > bounds.left) {
                minX = bounds.left;
            }

            if (maxX < bounds.right) {
                maxX = bounds.right;
            }

            if (minY > bounds.top) {
                minY = bounds.top;
            }

            if (maxY < bounds.bottom) {
                maxY = bounds.bottom;
            }

        }

        return {
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY
        };

    };

    HtmlTopTools.prototype.hideAlignButtons = function (objects) {
        this.spacingButtons.innerHTML = '';
        this.alignButtons.innerHTML = '';

        this.showEditorModes(objects);
    };

    HtmlTopTools.prototype.showAlignButtons = function (objects) {

        var html = HtmlElements.createImageButton('align_top', 'htmlInterface.htmlTopTools.alignSelectedObjects', "'top'", 'image-button').html;
        html += HtmlElements.createImageButton('align_bottom', 'htmlInterface.htmlTopTools.alignSelectedObjects', "'bottom'", 'image-button').html;

        html += HtmlElements.createImageButton('align_left', 'htmlInterface.htmlTopTools.alignSelectedObjects', "'left'", 'image-button').html;
        html += HtmlElements.createImageButton('align_right', 'htmlInterface.htmlTopTools.alignSelectedObjects', "'right'", 'image-button').html;

        html += HtmlElements.createImageButton('align_center_y', 'htmlInterface.htmlTopTools.alignSelectedObjects', "'centerY'", 'image-button').html;
        html += HtmlElements.createImageButton('align_center_x', 'htmlInterface.htmlTopTools.alignSelectedObjects', "'centerX'", 'image-button').html;

        var opt1 = {name: 'spacingX', displayName: 'Space X', value: 0, class: 'inline-small', method: 'htmlInterface.htmlTopTools.onSpacing'};
        var opt2 = {name: 'spacingY', displayName: 'Y', value: 0, class: 'inline-small', method: 'htmlInterface.htmlTopTools.onSpacing'};

        var html2 = '';
        html2 += HtmlElements.createInput(opt1).html;
        html2 += HtmlElements.createInput(opt2).html;

        this.alignButtons.innerHTML = html;
        this.spacingButtons.innerHTML = html2;


        this.hideEditorModes(objects);

    };


    HtmlTopTools.prototype.showEditorModes = function () {
        // (imageName, method, argsString, className, tooltip)

        var a1 = "";
        var a2 = "";
        var a3 = "";
        var a4 = "";
        var a5 = "";

        if (this.editor.mode === MainScreen.MODE_SELECT) {
            a1 = "active";
        } else if (this.editor.mode === MainScreen.MODE_POLYGON) {
            a2 = "active";
        } else if (this.editor.mode === MainScreen.MODE_POINTS) {
            a3 = "active";
        } else if (this.editor.mode === MainScreen.MODE_LINES) {
            a4 = "active";
        } else if (this.editor.mode === MainScreen.MODE_BEZIER) {
            a5 = "active";
        }



        var html = '';
//        html += HtmlElements.createButton({name:'copy' , displayName: ' ' , icon: 'fa fa-copy' , class: 'btn-sm btn-info',style: 'margin-bottom: 2px; font-size:15px;'} ).html;
//        html += '<div style="width:100%;border-bottom:1px solid #555555; border-top:1px solid white; margin: 5px 0px 10px 0px; padding:0;" ></div>';
//        
        html += HtmlElements.createImageButton('_icon_select', 'htmlInterface.htmlTopTools.onModeChange', "0", 'image-button ' + a1, 'Select Mode').html;

        if (editorConfig.features.shapeModes) {
            html += HtmlElements.createImageButton('_icon_polygon', 'htmlInterface.htmlTopTools.onModeChange', "1", 'image-button ' + a2, 'Polygon Mode').html;
            html += HtmlElements.createImageButton('_icon_points', 'htmlInterface.htmlTopTools.onModeChange', "2", 'image-button ' + a3, 'Points Mode').html;
            html += HtmlElements.createImageButton('_icon_lines', 'htmlInterface.htmlTopTools.onModeChange', "3", 'image-button ' + a4, 'Lines Mode').html;
            html += HtmlElements.createImageButton('_icon_bezier', 'htmlInterface.htmlTopTools.onModeChange', "4", 'image-button ' + a5, 'Bezier Mode').html;

        }

        if (this._extraModes) {
            html = this._extraModes(this.editor, html);
        }

        this.editorModes.innerHTML = html;
    };

    HtmlTopTools.prototype.hideEditorModes = function (objects) {
        this.editorModes.innerHTML = "";
    };

    HtmlTopTools.prototype.onModeChange = function (mode) {
        this.editor.setMode(mode);


    };

    HtmlTopTools.prototype.onSpacing = function (name, value) {

        var objects = this.editor.selectedObjects;

        if (name === "spacingX") {

            Math.bubbleSort(objects, function (a, b) {
                return a.position.x > b.position.x;
            });

            var total = 0;
            var padding = Math.round(value) || 0;
            var x = objects[0].getBounds().left;

            var batch = new CommandBatch();

            for (var i = 0; i < objects.length; i++) {
                var object = objects[i];
                var bounds = object.getBounds();
                var width = bounds.right - bounds.left;
                var dx = x - bounds.left + total;
                total += width + padding;
                // object.position.x += dx;
                var command = new CommandMove(object, object.position.x + dx, object.position.y);
                batch.add(command);
            }
            this.editor.commands.add(batch);

        } else if (name === "spacingY") {

            Math.bubbleSort(objects, function (a, b) {
                return a.position.y > b.position.y;
            });

            var total = 0;
            var padding = Math.round(value) || 0;
            var y = objects[0].getBounds().top;

            var batch = new CommandBatch();

            for (var i = 0; i < objects.length; i++) {
                var object = objects[i];
                var bounds = object.getBounds();
                var height = bounds.bottom - bounds.top;
                var dy = y - bounds.top + total;
                total += height + padding;
                var command = new CommandMove(object, object.position.x, object.position.y + dy);
                batch.add(command);
            }
            this.editor.commands.add(batch);

        }


    };


    HtmlTopTools.prototype.moveItemsUp = function () {

        if (this.editor.selectedObjects.length) {

            var parent = this.editor.selectedObjects[0].parent;

            Math.bubbleSort(this.editor.selectedObjects, function (a, b) {
                return a.parent.getChildIndex(a) < b.parent.getChildIndex(b);
            });

            if (parent.children.length > 1) {

                var lastOne = parent.children[parent.children.length - 1];
                var object = this.editor.selectedObjects[0];
                if (lastOne.id === object.id) {
                    return;
                }

                for (var j = 0; j < this.editor.selectedObjects.length; j++) {

                    var object = this.editor.selectedObjects[j];



                    for (var i = parent.children.length - 2; i >= 0; i--) {
                        var child = parent.children[i];

                        if (child.id === object.id) {

                            var prevChild = parent.children[i + 1];
                            parent.swapChildren(child, prevChild);
                        }
                    }
                }
            }

        }

    };

    HtmlTopTools.prototype.moveItemsDown = function () {

        if (this.editor.selectedObjects.length) {

            var parent = this.editor.selectedObjects[0].parent;

            Math.bubbleSort(this.editor.selectedObjects, function (a, b) {
                return a.parent.getChildIndex(a) > b.parent.getChildIndex(b);
            });

            if (parent.children.length > 1) {

                var firstOne = parent.children[0];
                var object = this.editor.selectedObjects[0];
                if (firstOne.id === object.id) {
                    return;
                }

                for (var j = 0; j < this.editor.selectedObjects.length; j++) {
                    var object = this.editor.selectedObjects[j];

                    for (var i = 0; i <= parent.children.length - 1; i++) {
                        var child = parent.children[i];
                        if (child.id === object.id) {
                            var prevChild = parent.children[i - 1];
                            parent.swapChildren(child, prevChild);
                        }
                    }
                }
            }

        }

    };


    HtmlTopTools.prototype.setZoom = function (scale, point, layer) {

        this.editor._zoom = scale; // set global zoom

        var cp = new V().copy(layer.getGlobalPosition());

        var aw = point.x - cp.x;
        var ah = point.y - cp.y;

        // layer scale x
        var oz = layer.scale.x;

        var nz = 1 + (scale * layer.factor);

        var nw = (aw / oz) * nz;
        var nh = (ah / oz) * nz;

        var dx = aw - nw;
        var dy = ah - nh;

        layer.scale.set(nz);

        var np = new V(cp.x + dx, cp.y + dy);
        layer.position.set(np.x, np.y);

        this.editor.updateAllSensors(layer.children);

    };

    HtmlTopTools.prototype.zoomInAt = function (scale, zoomPoint, duration) {

        if (!this.editor._zoomPoint) {
            this.editor._zoomPoint = new V().copy(zoomPoint);
        }

        scale = Math.clamp(scale, -0.8, 3);


        Actions.stopByTag('zoom');
        var zoom = this.editor._zoom;
        scale = scale - zoom;

        new Stepper(function (step) {
            for (var i = 0; i < this.editor.content.children.length; i++) {
                var layer = this.editor.content.children[i];
                this.setZoom(zoom + scale * step, this.editor._zoomPoint, layer);
            }

        }, duration, null, new Bezier(.46, .79, .79, .99), function () {

            if (this.editor._zoom === 0) {
                this.editor._zoomPoint = null;
            }

        }, this).run('zoom');
    };

    HtmlTopTools.prototype.showZIndexButtons = function () {
        var html = '';

        var opt1 = {name: 'up', displayName: ' ', class: '', icon: 'fa fa-arrow-up', tooltip: '', method: 'htmlInterface.htmlTopTools.moveItemsUp', };
        var opt2 = {name: 'up', displayName: ' ', class: '', icon: 'fa fa-arrow-down', tooltip: '', method: 'htmlInterface.htmlTopTools.moveItemsDown', };

        html += HtmlElements.createButton(opt1).html;
        html += HtmlElements.createButton(opt2).html;

        this.zIndexButtons.innerHTML = html;
    };

    HtmlTopTools.prototype.hideZIndexButtons = function () {
        this.zIndexButtons.innerHTML = '';
    };

    HtmlTopTools.prototype.onSnapModeChange = function () {
        this.editor.isSnaping = this.snapCheckbox.checked;
        store.set('isSnapping-' + ContentManager.baseURL, this.editor.isSnaping);
    };

    window.HtmlTopTools = HtmlTopTools;

}(window));