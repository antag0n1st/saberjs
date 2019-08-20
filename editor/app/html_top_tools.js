(function (window, undefined) {


    function HtmlTopTools(editor) {
        this.initialize(editor);
    }

    HtmlTopTools.prototype.initialize = function (editor) {

        this.editor = editor;



    };

    HtmlTopTools.prototype.bindHTML = function () {


        

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
                if(o.type === "MessageBoxObject"){
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

    window.HtmlTopTools = HtmlTopTools;

}(window));