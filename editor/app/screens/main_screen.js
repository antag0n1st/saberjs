(function (window, undefined) {

    function MainScreen() {
        this.initialize();
    }

    MainScreen.prototype = new HScreen();
    MainScreen.prototype.screen_initialize = MainScreen.prototype.initialize;

    MainScreen.MODE_SELECT = 0;
    MainScreen.MODE_POLYGON = 1;
    MainScreen.MODE_POINTS = 2;
    MainScreen.MODE_LINES = 3;
    MainScreen.MODE_BEZIER = 4;
    // make sure to map them to the position in the array

    MainScreen.prototype.initialize = function () {

        this.screen_initialize();



        this.mouseDownPosition = new V();
        this.screenMouseOffset = new V();
        this.isPointInAnimator = false;

        this.content = new PIXI.Container();
        this.addChild(this.content);


        this.mode = MainScreen.MODE_SELECT;
        this.modes = [
            new ModeSelect(this),
            new ModePolygon(this),
            new ModePoints(this),
            new ModeLines(this),
            new ModeBezier(this)
        ];

        var texture = PIXI.Sprite.prototype.findTexture('repeatable_chess_pattern');
        this.repatable = new PIXI.extras.TilingSprite(texture, app.width, app.height);
        this.repatable.zIndex = -1;
        this.addChild(this.repatable);

        this.repatable.tint = store.get('tint-' + ContentManager.baseURL) || 0xffffff;

        this.graphics = new PIXI.Graphics();
        this.graphics.zIndex = 10;
        this.addChild(this.graphics);

        ////////
        // Ctrl + Z
        this.commands = new Commands();

        this.guideLines = [
            {x: 0},
            {y: 0}
        ];

        var lines = store.get('guideLines-' + ContentManager.baseURL);
        if (lines) {
            this.guideLines = JSON.parse(lines);
        }

        /////////


        this.selectedObjects = []; //
        this.isSelectionStarted = false;
        this.isClickedInsideObject = false;
        this.isClickedInsideSameObject = false;
        this.didDrag = false;
        this.dragPosition = new V();
        this.handlesClickedObject = null;
        this.clickedObject = null;
        this.selectionRectangle = null;
        this.initialSize = null;
        this.initialRotation = 0;
        this.lastCickTime = 0;
        this._zoom = 0;
        this._zoomPoint = null;
        this._toZoomScale = 0;
        this._screenPosition = new V();
        this.targetDropObject = null; // the object in which we are going to drop the children.
        this.clipboard = null;
        this.previewScreenName = '';

        this.activeLayer = null;

        ////////////////////

        this.importer = new EditorImporter(this);

        ////////////////////
        this.htmlInterface = new HtmlInterface(this);
        this.shortcuts = new Shortcuts(this);
        this.propertiesBinder = new PropertiesBinder(this);
        this.localReader = new LocalFileReader(this);


        this.infoLabel = new Label();
        this.infoLabel.txt = 'Info';
        this.infoLabel.position.set(10, app.height - 40);
        this.addChild(this.infoLabel);

        this.addTouchable(this); // let the screen be a touchable

        // IMPORTING STUFF
        this.htmlInterface.htmlLibrary.addFiles(app.libraryImages);
        this.htmlInterface.activateTab('imageLibrary');
        this.importSavedData();
        this.setDefaultLayer();


        this.shortcuts.isCtrlPressed = false;

        // set the animator

        if (editorConfig.features.animator) {



            timeout(function () {

                this.animator = new AnimationPanel();
                this.animator.zIndex = 11; // above the 
                this.animator.position.set(0, app.height - this.animator.panelHeight);
                this.addTouchable(this.animator);
                this.addChild(this.animator);

                var actor = this.findById('actor');
                this.animator.show(actor);
            }, 600, this);

        }



    };

    MainScreen.prototype.onGalleryObjectDropped = function (id) {

        if (id === "GenericObject") {
            var object = new GenericObject();
            object.build();
        } else if (id === "LabelObject") {
            var object = new LabelObject('Text');
            object.build();
        } else if (id === "ContainerObject") {
            var object = new ContainerObject();
            object.build();
        } else if (id === "ButtonObject") {
            var object = new ButtonObject('_default_button');
            object.build();
        } else if (id === "InputObject") {
            var object = new InputObject('_default_input');
            object.build();
        }

        // _default_button

        if (object) {
            this.placeObjectOnScreen(object);
        } else {
            console.warn("You need to define an object before droping it to the screen!");
        }

    };

    MainScreen.prototype.onPrefabDropped = function (data) {

        var index = data.getData('index');

        var prefabs = store.get('prefabs-' + ContentManager.baseURL);
        prefabs = JSON.parse(prefabs);

        var prefab = prefabs[index];


        var cp = new V().copy(this.activeLayer.getGlobalPosition());
        var p = V.substruction(app.input.point, cp);
        p.scale(1 / this.activeLayer.scale.x);


        prefab.position.x = p.x;
        prefab.position.y = p.y;


        var io = this.importer.importObjects([prefab], this.activeLayer);

        this.deselectAllObjects();
        for (var i = 0; i < io.length; i++) {
            this.addObjectToSelection(io[i]);
        }

    };

    MainScreen.prototype.onLibraryImageDropped = function (id) {

        var object = new ImageObject(id);
        object.build();
        this.placeObjectOnScreen(object);
    };

    MainScreen.prototype.onLabelDropped = function () {

        var object = new LabelObject('Text');
        object.build();
        this.placeObjectOnScreen(object);

    };

    MainScreen.prototype.placeObjectOnScreen = function (object, p) {

        if (p) {

        } else {
            var cp = new V().copy(this.activeLayer.getGlobalPosition());
            p = V.substruction(app.input.point, cp);
            p.scale(1 / this.activeLayer.scale.x);
        }

        object.position.set(p.x, p.y);

        var command = new CommandAdd(object, this.activeLayer, this);
        this.commands.add(command);

        this.deselectAllObjects();
        this.addObjectToSelection(object);

        object.updateFrame();


    };

    MainScreen.prototype.onFilesReaded = function (files, reader) {

        this.htmlInterface.htmlLibrary.addFiles(files);

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            ContentManager.addImage(file.name, file.data, true);
        }

        ContentManager.downloadResources(function () {

            this.htmlInterface.htmlLibrary.show();

        }, this);
    };

    MainScreen.prototype.addObjectToSelection = function (object) {
        if (this.selectedObjects.indexOf(object) === -1) {
            this.selectedObjects.push(object);
            object.select();
            this.onSelectionChange();
        }
    };

    MainScreen.prototype.deselectObject = function (object) {
        if (this.selectedObjects.indexOf(object) !== -1) {
            this.selectedObjects.removeElement(object);
            object.deselect();
            this.onSelectionChange();
        }
    };

    MainScreen.prototype.deselectAllObjects = function () {

        if (this.selectedObjects.length) {

            for (var i = 0; i < this.selectedObjects.length; i++) {
                var object = this.selectedObjects[i];
                object.deselect();
            }

            this.selectedObjects = [];

            if (this.targetDropObject) {
                this.targetDropObject = null;
            }

            this.onSelectionChange();
        }

    };



    MainScreen.prototype.renderPolygon = function (polygon) {

        var points = polygon.points;
        var p = polygon.pos;

        this.graphics.moveTo(p.x + points[0].x, p.y + points[0].y);

        for (var i = points.length - 1; i >= 0; i--) {
            this.graphics.lineTo(p.x + points[i].x, p.y + points[i].y);
        }

    };

    // check agianst the selection rectangle
    MainScreen.prototype.checkSelection = function (x, y, width, height, children) {

        if (this.activeLayer.visible) {
            children = children ? children : this.activeLayer.children;
        } else {
            children = children ? children : [];
        }


        for (var i = children.length - 1; i >= 0; i--) {
            var object = children[i];

            if (!object.export || !object.visible) {
                continue;
            }



            if (this.checkSelection(x, y, width, height, object.children)) {
                // return true;
            }

            //TODO the method of checking the selection needs to change
            var rectangle = object.getSensor();
            if ((object._checkPolygon && object._checkPolygon(this.selectionRectangle)) || SAT.testPolygonPolygon(this.selectionRectangle, rectangle)) {

                if (this.selectedObjects.length && this.selectedObjects[0].parent.id !== object.parent.id) {
                    continue;
                }

                if (!object.isSelected) {
                    object.save();

                    this.addObjectToSelection(object);
                }
            } else if (object.isSelected) {
                this.deselectObject(object);
            }
        }

    };

    // check if the point is inside some object
    MainScreen.prototype.checkPointInChildren = function (children, event, bottomFirst) {

        if (bottomFirst) {
            // if it is alternative selection
            // we are going in reverse ( check the one that is on the bottom first ) 
            for (var i = 0; i < children.length; i++) {
                var object = this.checkPointInObject(children[i], event, bottomFirst);
                if (object) {
                    return object;
                }
            }
        } else {

            for (var i = children.length - 1; i >= 0; i--) {
                var object = this.checkPointInObject(children[i], event, bottomFirst);
                if (object) {
                    return object;
                }
            }
        }

        return false;
    };

    MainScreen.prototype.checkPointInObject = function (object, event, bottomFirst) {

        if (!object.export || !object.visible) {
            return false;
        }

        if (bottomFirst) {
            var sensor = object.getSensor();
            if ((object._checkPoint && object._checkPoint(event.point)) || SAT.pointInPolygon(event.point, sensor)) {
                return object;
            }

            var obj = this.checkPointInChildren(object.children, event, bottomFirst);
            if (obj) {
                return obj;
            }
        } else {
            var obj = this.checkPointInChildren(object.children, event, bottomFirst);
            if (obj) {
                return obj;
            }

            var sensor = object.getSensor();
            if ((object._checkPoint && object._checkPoint(event.point)) || SAT.pointInPolygon(event.point, sensor)) {
                return object;
            }
        }



        return false;
    };

    // check already selected objects for drag / resize / rotate ...
    MainScreen.prototype.checkSelectedObjects = function (children, event) {

        for (var i = children.length - 1; i >= 0; i--) {
            var object = children[i];

            if (!object.export || !object.visible) {
                continue;
            }


            if (object.checkHandles(event.point)) {

                this.handlesClickedObject = object;
                object.save();

                this.handlesClickedObject.onHandleDown(event, this);

                return true;
            }

        }

        return false;
    };

    MainScreen.prototype.checkPointPaths = function (children, event, methodName) {

        for (var i = children.length - 1; i >= 0; i--) {

            var object = children[i];

            if (!object.export || !object.visible) {
                continue;
            }

            var hasInteraction = this.checkPointPaths(object.children, event, methodName);

            if (hasInteraction) {
                return true;
            }

            // check if the object is clicked

            if (object.type === "PathObject") {
                object.isCtrl = this.shortcuts.isCtrlPressed;
                object.isAlt = this.shortcuts.isAltPressed;

                hasInteraction = object[methodName](event, null);

                if (hasInteraction) {
                    return true;
                }
            }

        }

    };

    MainScreen.prototype.onMouseDown = function (event, sender) {

        if (editorConfig.features.animator && this.animator) {
            var s = this.animator.getSensor();

            if (SAT.pointInPolygon(event.point, s)) {
                event.stopPropagation();
                this.animator.onMouseDown(event, sender);
                this.isPointInAnimator = true;
                return false;
            }
        }

        if (this.shortcuts.isSpacePressed) {
            var pp = event.point.clone();
            pp.scale(1 / (this.activeLayer.factor + this._zoom));
            this.screenMouseOffset = V.substruction(this._screenPosition, pp);
            return;
        }

        if (this.activeLayer.visible) {
            if (this.checkPointPaths(this.activeLayer.children, event, 'onMouseDown')) {
                return;
            }
        }

        this.modes[this.mode].onMouseDown(event, sender);
    };

    MainScreen.prototype.onMouseMove = function (event, sender) {

        if (editorConfig.features.animator && this.animator && this.isPointInAnimator) {
            this.animator.onMouseMove(event, sender);
            event.stopPropagation();
            return;
        }

        if (this.shortcuts.isSpacePressed && !this.selectionRectangle) {
            var offset = new V().copy(this.screenMouseOffset);
            var pp = event.point.clone();
            pp.scale(1 / (this.activeLayer.factor + this._zoom));
            var p = V.addition(offset, pp);
            this.moveScreenTo(p);
            return;
        }

        if (this.checkPointPaths(this.activeLayer.children, event, 'onMouseMove')) {
            return;
        }

        this.modes[this.mode].onMouseMove(event, sender);
    };

    MainScreen.prototype.onMouseUp = function (event, sender) {

        if (editorConfig.features.animator && this.animator && this.isPointInAnimator) {
            this.isPointInAnimator = false;
            this.animator.onMouseUp(event, sender);
            return;
        } else {
            this.modes[this.mode].onMouseUp(event, sender);
        }

        this.isPointInAnimator = false;

    };


    MainScreen.prototype.onRightMouseDown = function (event, sender) {

        this.htmlInterface.contextMenu.close();
        this.htmlInterface.contextMenu.closeImageBrowser();

        if (this.shortcuts.isSpacePressed) {
            var pp = event.point.clone();
            pp.scale(1 / this.activeLayer.factor * 5);
            this.screenMouseOffset = V.substruction(this._screenPosition, pp);

            return;
        }

    };


    MainScreen.prototype.onRightMouseMove = function (event, sender) {
        if (this.shortcuts.isSpacePressed && !this.selectionRectangle) {
            var offset = new V().copy(this.screenMouseOffset);
            var pp = event.point.clone();
            pp.scale(1 / this.activeLayer.factor * 5);
            var p = V.addition(offset, pp);
            this.moveScreenTo(p);
            return;
        }
    };

    MainScreen.prototype.onRightMouseUp = function (event, sender) {

        if (this.shortcuts.isSpacePressed && !this.selectionRectangle) {
            return;
        }

        if (this.selectedObjects.length) {
            this.htmlInterface.contextMenu.open(event.point);
            event.stopPropagation();
            return false;
        } else {

        }

        // prevent default behaviour

    };

    MainScreen.prototype.onWheel = function (event, sender) {

        if (editorConfig.features.animator && this.animator) {
            var s = this.animator.getSensor();

            if (SAT.pointInPolygon(app.input.point, s)) {
               
                var scrollY = -1;
                if (event.point.y < 0) {
                    scrollY = 1;
                }

                this.animator.onScroll(scrollY);
                return false;
            }
        }

        var scale = 0.1;
        if (event.point.y < 0) {
            scale = -0.1;
        }
        var p = new V(app.input.point.x, app.input.point.y);

        if (Actions.isRunning('zoom')) {
            this._zoom = Math.roundDecimal(this._toZoomScale, 1);
        }

        var toScale = this._zoom + scale;

        toScale = Math.clamp(toScale, -0.8, 3);

        this._toZoomScale = toScale;

        this.htmlInterface.htmlTopTools.zoomSlider.setValue(toScale);

        this.htmlInterface.htmlTopTools.zoomInAt(toScale, p, 200);
    };

    MainScreen.prototype.onMouseCancel = function (event, sender) {
        this.selectionRectangle = null;
    };


    MainScreen.prototype.copySelection = function () {

        if (this.selectedObjects.length) {

            var clipboard = [];

            for (var i = 0; i < this.selectedObjects.length; i++) {
                clipboard.push(this.selectedObjects[i].export());
            }

            if (clipboard.length) {
                var json = JSON.stringify(clipboard);
                store.set('clipboard', json);
            } else {
                store.set('clipboard', null);
            }

        }

    };

    MainScreen.prototype.paste = function () {


        var json = store.get('clipboard');

        if (json) {

            var clipboard = JSON.parse(json);

            var contentLayer = this.activeLayer;

            contentLayer = this.selectedObjects.length ? this.selectedObjects[0].parent : contentLayer;

            // figure out the position

            if (this.selectedObjects.length) {

                // if there is selected object , then find its position 
                // and then paste near it

                var so = this.selectedObjects[0];
                var co = clipboard[0];

                if (Math.floor(so.position.x) === Math.floor(co.position.x)
                        && Math.floor(so.position.y) === Math.floor(co.position.y)) {

                    // this is the case (copy paste in place)

                    for (var i = 0; i < clipboard.length; i++) {
                        var o = clipboard[i];
                        o.position.x += 30;
                        o.position.y += 30;
                    }

                } else {

                    // in case we are pasting when there is no selection object

                    var dv = V.substruction(so.position, co.position);
                    for (var i = 0; i < clipboard.length; i++) {
                        var o = clipboard[i];
                        o.position.x += dv.x + 30;
                        o.position.y += dv.y + 30;
                    }
                }

            } else {

                var co = clipboard[0];

                var p = contentLayer.getGlobalPosition();
                p.x = app.width / 2 - p.x;
                p.y = app.height / 2 - p.y;

                var dv = V.substruction(p, co.position);

                for (var i = 0; i < clipboard.length; i++) {
                    var o = clipboard[i];
                    o.position.x += dv.x;
                    o.position.y += dv.y;
                }

            }


            var io = this.importer.importObjects(clipboard, contentLayer);

            this.deselectAllObjects();
            for (var i = 0; i < io.length; i++) {
                this.addObjectToSelection(io[i]);
            }

            this.copySelection();

        }

    };


    MainScreen.prototype.onShow = function () {
        Config.canvas_padding = '50 360 0 50';
        app.resize();
    };

    MainScreen.prototype.onHide = function () {

    };

    MainScreen.prototype.onAfterHide = function () {

    };

    MainScreen.prototype.onBeforeShow = function () {

    };

    MainScreen.prototype.onNote = function (eventName, data, sender) {

    };

    MainScreen.prototype.onUpdate = function (dt) {

        var x = app.input.point.x - this._screenPosition.x;
        var y = app.input.point.y - this._screenPosition.y;

        this.infoLabel.txt = 'x: ' + Math.round(x) + ' y: ' + Math.round(y);

        this.graphics.clear();

        // draw coordinate System
        this.drawGuideLines();


        if (this.selectionRectangle) {
            // render the selection
            this.graphics.lineStyle(2, 0x0000FF, 1);
            this.graphics.beginFill(0xFF700B, 0.1);
            this.renderPolygon(this.selectionRectangle);
            this.graphics.endFill();

        }

        for (var i = 0; i < this.selectedObjects.length; i++) {
            var object = this.selectedObjects[i];
            object.drawFrame(this.graphics);
        }

        if (this.targetDropObject) {
            this.targetDropObject.drawFrame(this.graphics);
        }


    };

    MainScreen.prototype.drawGuideLines = function () {
        var p = this._screenPosition;

        for (var i = 0; i < this.guideLines.length; i++) {
            var l = this.guideLines[i];

            if (l.x === 0 || l.y === 0) {
                this.graphics.lineStyle(1, 0x0000FF, 1);
            } else {
                this.graphics.lineStyle(3, 0xff0000, 1);
            }

            if (l.x !== undefined) {
                var x = p.x + l.x;

                if (x > 0 && x < app.width) {
                    this.graphics.moveTo(x, 0);
                    this.graphics.lineTo(x, app.height);
                }

            } else if (l.y !== undefined) {
                var y = p.y + l.y;

                if (y > 0 && y < app.height) {
                    this.graphics.moveTo(0, y);
                    this.graphics.lineTo(app.width, y);
                }
            }

        }

        this.graphics.endFill();
    };

    MainScreen.prototype.onResize = function (width, height) {

        this.repatable.width = width;
        this.repatable.height = height;

    };

    MainScreen.prototype.importSavedData = function () {
        var jsonData = store.get(ContentManager.baseURL + 'editor-saved-content');
        if (jsonData) {
            var data = JSON.parse(jsonData);
            this.importer.import(data);
        }

    };

    MainScreen.prototype.moveScreenTo = function (p) {

        var dp = V.substruction(p, this._screenPosition);
        this._screenPosition = p;
        this.repatable.tilePosition.set(p.x, p.y);

        // adjust the layers acording to their factor

        for (var i = 0; i < this.content.children.length; i++) {
            var layer = this.content.children[i];
            var np = new V().copy(dp).scale(layer.factor * layer.scale.x);
            this.adjustLayerPosition(layer, np);
        }


    };

    MainScreen.prototype.adjustLayerPosition = function (layer, np) {
        layer.position.x += np.x;
        layer.position.y += np.y;
    };

    MainScreen.prototype.updateAllSensors = function (children) {

        for (var i = children.length - 1; i >= 0; i--) {
            var object = children[i];
            if (object.export) {
                object.updateFrame();
                this.updateAllSensors(object.children);
            }
        }

    };

    MainScreen.prototype.addLayer = function (name, factor, id, isInputContent) {

        var oldP = new V().copy(this._screenPosition);

        this.moveScreenTo(new V());
        var layer = null;

        if (id) {
            for (var i = 0; i < this.content.children.length; i++) {
                var l = this.content.children[i];
                if (l.id === id) {
                    layer = l;
                    break;
                }
            }


        } else {
            layer = new Layer();

        }

        layer.name = name;
        layer.factor = Number(factor);
        layer.isInputContent = isInputContent;
        layer.build();

        if (!id) {
            var command = new CommandAdd(layer, this.content, this);
            this.commands.add(command);
            this.htmlInterface.tree.build();
        }

        this.moveScreenTo(oldP);


    };

    MainScreen.prototype.setDefaultLayer = function () {
        // if there are no layers , then we are going to create one

        if (!this.content.children.length) {
            this.addLayer('Default Layer', 1, null, true);
            this.content.children[0].isActive = true;
        }

        for (var i = 0; i < this.content.children.length; i++) {
            var layer = this.content.children[i];
            if (layer.isActive) {
                this.activeLayer = layer;
            }
        }

        if (!this.activeLayer) {
            this.activeLayer = this.content.children[this.content.children.length - 1];
            this.activeLayer.isActive = true;
        }

    };

    MainScreen.prototype.activateLayer = function (id) {

        if (this.activeLayer) {
            this.activeLayer.isActive = false;
        }

        for (var i = 0; i < this.content.children.length; i++) {
            var layer = this.content.children[i];

            if (layer.id === id) {
                this.activeLayer = layer;
                this.activeLayer.isActive = true;
            }
        }
    };

    MainScreen.prototype.findById = function (id, parent) {
        parent = parent || this.content;
        for (var i = 0; i < parent.children.length; i++) {
            var c = parent.children[i];
            if (c.id === id) {
                return c;
            }
            var b = this._findById(id, c.children);
            if (b) {
                return b;
            }
        }

        return null;
    };

    MainScreen.prototype._findById = function (id, children) {
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c.id === id) {
                return c;
            }
            var b = this._findById(id, c.children);
            if (b) {
                return b;
            }
        }
        return null;
    };

    MainScreen.prototype.onSelectionChange = function () {
        // build the align buttons

        if (this.selectedObjects.length > 1) {
            this.htmlInterface.htmlTopTools.showAlignButtons(this.selectedObjects);
        } else {
            this.htmlInterface.htmlTopTools.hideAlignButtons();
        }

        if (this.selectedObjects.length > 0) {
            this.htmlInterface.htmlTopTools.showZIndexButtons();
        } else {
            this.htmlInterface.htmlTopTools.hideZIndexButtons();
        }

        if (this.selectedObjects.length === 0) {
            // empty , unbind all

            if (this.htmlInterface.propertiesPanel.style.display === "block") {
                this.htmlInterface['propertiesContent'].innerHTML = '';
            } else if (this.htmlInterface.commonPropertiesPanel.style.display === "block") {
                this.htmlInterface['commonPropertiesContent'].innerHTML = '';
            }

        } else {
            if (this.htmlInterface.propertiesPanel.style.display === "block") {
                this.htmlInterface.onProperties();
            } else if (this.htmlInterface.commonPropertiesPanel.style.display === "block") {
                this.htmlInterface.onCommonProperties();
            }
        }

    };

    MainScreen.prototype.isInputActive = function () {
        var obj = document.activeElement;
        var isInputFocused = (obj instanceof HTMLInputElement) && obj.type == 'text';
        var isAreaFocused = (obj instanceof HTMLTextAreaElement);

        return isInputFocused || isAreaFocused;
    };

    MainScreen.prototype.focusOnCanvas = function () {
        document.activeElement.blur();
    };

    MainScreen.prototype.isIdUnique = function (id, children, count) {

        children = children || this.content.children;
        count = count || 0;

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.id === id) {
                count++;

                if (count > 1) {
                    return count;
                }
            }

            var c = this.isIdUnique(id, child.children, count);

            if (c > 1) {
                return false;
            }
        }


        return true;

    };

    MainScreen.prototype.onSelectedObjectPropertyChange = function (property, value, element, inputType, feedbackID) {
        for (var i = 0; i < this.selectedObjects.length; i++) {
            var object = this.selectedObjects[i];
            object._onPropertyChange(this, property, value, element, inputType, feedbackID);
        }
    };

    MainScreen.prototype.setMode = function (mode) {
        this.modes[this.mode].onModeEnd();

        this.mode = mode;
        this.modes[this.mode].onModeStart();

        this.htmlInterface.htmlTopTools.showEditorModes();
    };

    MainScreen.prototype._changeCustomProperty = function (property, value, element, inputType, feedbackID) {

        if (this.selectedObjects.length === 1) {
            this.selectedObjects[0].changeCustomProperty(this, property, value, element, inputType, feedbackID);
        }

    };

    MainScreen.prototype.addCustomProperty = function () {
        $("#addCustomPropertyModal").modal('show');
    };

    MainScreen.prototype.onCustomPropertyDelete = function (property) {

        if (this.selectedObjects.length === 1) {
            this.selectedObjects[0].onCustomPropertyDelete(this, property);
        }

    };

    MainScreen.prototype.addGuideLine = function () {
        // display it
        $("#addGuidesModal").modal("show");
    };

    MainScreen.prototype.onGuideLineDelete = function (property, value) {

        value = Math.round(value);

        for (var i = 0; i < this.guideLines.length; i++) {
            var g = this.guideLines[i];

            if (g[property] === value) {
                this.guideLines.removeElement(g);
                this.htmlInterface.activateTab('settings');
                break;
            }
        }

        var json = JSON.stringify(this.guideLines);
        store.set('guideLines-' + ContentManager.baseURL, json);

    };

    MainScreen.prototype.onBackgroundTintChanged = function (property, value) {
        var tint = PIXI.utils.string2hex(value);
        this.repatable.tint = tint;
        store.set('tint-' + ContentManager.baseURL, tint);
    };

    MainScreen.prototype.layoutObjects = function () {

        var object = this.selectedObjects[0];
        var props = object.properties;
        var children = object.children;

        // alignment - bottom , center , compact

        // (items, width, x_offset, y_offset, spacing, alignment, wrap, h_spacing, custom)
        Layout.hbox(children, parseInt(props.width), parseInt(props.xOffset), parseInt(props.yOffset), parseInt(props.spacing), props.alignment, props.wrap, parseInt(props.hSpacing));

    };

    MainScreen.prototype.resetObjectsAnchor = function () {

        var batch = new CommandBatch();

        var object = this.selectedObjects[0];
        var children = object.children;

        for (var i = 0; i < children.length; i++) {
            var object = children[i];
            var command = new CommandProperty(object, 'anchor.x', 0);
            var command2 = new CommandProperty(object, 'anchor.y', 0);
            batch.add(command);
            batch.add(command2);
        }

        this.commands.add(batch);

    };

    MainScreen.prototype.changePreviewScreen = function (name, value) {
        this.previewScreenName = value;
    };

    MainScreen.prototype.blank = function () {
        // used to call it , and do nothing
    };

    window.MainScreen = MainScreen; // make it available in the main scope

}(window));