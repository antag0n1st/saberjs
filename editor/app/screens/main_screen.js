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

        this.content = new Sprite();
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

        this.graphics = new PIXI.Graphics();
        this.graphics.zIndex = 10;
        this.addChild(this.graphics);

        ////////
        // Ctrl + Z
        this.commands = new Commands();

        this.guideLines = [
            {x: 0},
            {y: 0},
            {x: 450},
            {x: 1460}
        ];

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
        this._screenPosition = new V();
        this.targetDropObject = null; // the object in which we are going to drop the children.
        this.clipboard = null;

        this.activeLayer = null;

        ////////////////////

        this.importer = new Importer(this);

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


//        var path = new PathObject();
//        path.addPoint(new OV(100, 100));
//        path.addPoint(new OV(300, 500));
//        path.addPoint(new OV(500, 500));
//        path.addPoint(new OV(800, 400));
//        path.position.set(0, 0);
//        path.build();
//        this.activeLayer.addChild(path);

    

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
        }

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

            var rectangle = object.getSensor();
            if (SAT.testPolygonPolygon(this.selectionRectangle, rectangle)) {

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
    MainScreen.prototype.checkPointInChildren = function (children, event) {

        for (var i = children.length - 1; i >= 0; i--) {

            var object = children[i];

            if (!object.export || !object.visible) {

                continue;
            }

            var obj = this.checkPointInChildren(object.children, event);
            if (obj) {
                return obj;
            }

            // check if the object is clicked

            var sensor = object.getSensor();
            if (SAT.pointInPolygon(event.point, sensor)) {

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



        if (this.shortcuts.isSpacePressed) {
            var pp = event.point.clone();
            pp.scale(1 / this.activeLayer.factor);
            this.screenMouseOffset = V.substruction(this._screenPosition, pp);
            return;
        }

        if (this.checkPointPaths(this.activeLayer.children, event, 'onMouseDown')) {
            return;
        }

        this.modes[this.mode].onMouseDown(event, sender);
    };

    MainScreen.prototype.onMouseMove = function (event, sender) {

        if (this.shortcuts.isSpacePressed && !this.selectionRectangle) {
            var offset = new V().copy(this.screenMouseOffset);
            var pp = event.point.clone();
            pp.scale(1 / this.activeLayer.factor);
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
        this.modes[this.mode].onMouseUp(event, sender);
    };


    MainScreen.prototype.onRightMouseDown = function (event, sender) {

        this.htmlInterface.contextMenu.close();

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
        } else {

        }

    };

    MainScreen.prototype.onWheel = function (event, sender) {

        var scale = 0.1;
        if (event.point.y < 0) {
            scale = -0.1;
        }
        var p = new V(app.input.point.x, app.input.point.y);

        var toScale = this._zoom + scale;

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

    };

    MainScreen.prototype.onHide = function () {

    };

    MainScreen.prototype.onAfterHide = function () {

    };

    MainScreen.prototype.onBeforeShow = function () {

    };

    MainScreen.prototype.onNote = function (eventName, data, sender) {

    };

    MainScreen.prototype.update = function (dt) {

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
        layer.factor = factor;
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
            this.addLayer('Default Layer', 1);
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

    MainScreen.prototype.blank = function () {
        // used to call it , and do nothing
    };

    window.MainScreen = MainScreen; // make it available in the main scope

}(window));