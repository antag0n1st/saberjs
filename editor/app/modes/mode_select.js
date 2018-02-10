(function (window, undefined) {


    function ModeSelect(editor) {
        this.initialize(editor);
    }
    
    ModeSelect.prototype.initialize = function (editor) {
        this.editor = editor;
    };

    ModeSelect.prototype.onMouseDown = function (event, sender) {
      
        // first reset the values
        this.editor.didDrag = false;
        this.editor.isClickedInsideObject = false;
        this.editor.isClickedInsideSameObject = false;
        this.editor.isSelectionStarted = false;
        this.editor.mouseDownPosition.copy(event.point);
        this.editor.handlesClickedObject = null;
        this.editor.clickedObject = null;

        this.editor.htmlInterface.contextMenu.close();

        // check if we are touching a handle of the selected objects
        if (this.editor.checkSelectedObjects(this.editor.selectedObjects, event)) {
            return;
        }

        var object = null;
        // recursivly check if an object was clicked down
        if (this.editor.activeLayer.visible) {
            object = this.editor.checkPointInChildren(this.editor.activeLayer.children, event);
        }

        if (object) {

            if (this.editor.shortcuts.isCtrlPressed) {

                if (object.isSelected) {
                    this.editor.deselectObject(object);
                } else {
                    if (this.editor.selectedObjects.length && this.editor.selectedObjects[0].parent.id !== object.parent.id) {

                    } else {
                        this.editor.addObjectToSelection(object);
                    }
                }

            } else {
                var isOneOfUs = false;

                for (var i = 0; i < this.editor.selectedObjects.length; i++) {
                    var o = this.editor.selectedObjects[i];
                    o.save();
                    if (o.id === object.id) {
                        isOneOfUs = true;
                        this.editor.isClickedInsideObject = true;
                        this.editor.clickedObject = object;
                    }

                }

                if (!isOneOfUs) {

                    this.editor.deselectAllObjects();
                    object.save();

                    if (this.editor.clickedObject && object.id === this.editor.clickedObject.id) {
                        this.editor.isClickedInsideSameObject = true;
                    } else {

                    }
                    this.editor.isClickedInsideObject = true;
                    this.editor.clickedObject = object;
                }
            }

        } else {
            // for ctrl select more object this will need to change
            this.editor.deselectAllObjects();
        }


    };


    ModeSelect.prototype.onMouseMove = function (event, sender) {

        if (this.editor.shortcuts.isCtrlPressed) {
            var object = null;
            if (this.editor.activeLayer.visible) {
                object = this.editor.checkPointInChildren(this.editor.activeLayer.children, event);
            }

            if (object) {

                var isSelected = false;
                for (var i = 0; i < this.editor.selectedObjects.length; i++) {
                    if (object.id === this.editor.selectedObjects[i].id) {
                        isSelected = true;
                    }
                }

                if (!isSelected) {
                    this.editor.targetDropObject = object;
                    app.input.setCursor('cell');
                } else if (this.editor.targetDropObject) {
                    this.editor.targetDropObject = null;
                }


            } else {
                if (this.editor.targetDropObject) {
                    this.editor.targetDropObject = null;
                }
                app.input.restoreCursor();
            }
            return;
        } else if (this.editor.handlesClickedObject) {
            this.editor.handlesClickedObject.onHandleMove(event, this.editor);
        } else if (this.editor.selectedObjects.length) {

            if (!this.editor.isSelectionStarted) {

                // dragging

                this.editor.didDrag = true;



                var dragBy = V.substruction(event.point, this.editor.mouseDownPosition);
                dragBy.scale(1 / this.editor.activeLayer.scale.x);

                for (var i = 0; i < this.editor.selectedObjects.length; i++) {
                    var object = this.editor.selectedObjects[i];
                    object.dragBy(dragBy);
                }

            }

        } else {
            this.editor.isSelectionStarted = true;

        }



        if (this.editor.isSelectionStarted) {

            // making a selection

            var width = event.point.x - this.editor.mouseDownPosition.x;
            var height = event.point.y - this.editor.mouseDownPosition.y;

            // quick! , start dragging this object
            this.editor.selectionRectangle = new SAT.Box(new V(this.editor.mouseDownPosition.x, this.editor.mouseDownPosition.y), width, height).toPolygon();
            this.editor.checkSelection(this.editor.mouseDownPosition.x, this.editor.mouseDownPosition.y, width, height);

        }

        this.editor.propertiesBinder.bindSelected();

    };

    ModeSelect.prototype.onMouseUp = function (event, sender) {


        app.input.restoreCursor();

        if (this.editor.shortcuts.isCtrlPressed) {
            if (this.editor.targetDropObject) {

                var targetAP = this.editor.targetDropObject.getGlobalPosition();

                for (var i = 0; i < this.editor.selectedObjects.length; i++) {
                    var object = this.editor.selectedObjects[i];

                    var objectAP = object.getGlobalPosition();

                    object.removeFromParent();
                    this.editor.targetDropObject.addChild(object);

                    var p = V.substruction(objectAP, targetAP);
                    object.position.set(p.x, p.y);
                }

                this.editor.deselectAllObjects();

            }


            this.editor.targetDropObject = null;
        }


        if (this.editor.shortcuts.isSpacePressed && !this.editor.selectionRectangle) {
            return;
        }

        var dt = app.pixi.ticker.lastTime - this.editor.lastCickTime;

        if (dt < 300 && this.editor.isClickedInsideObject) {

            // double click

            var object = this.editor.selectedObjects[0];
            if (object.properties) {
                this.editor.htmlInterface.activateTab('properties');
            } else {
                this.editor.htmlInterface.activateTab('commonProperties');
            }

        } else {
            this.editor.htmlInterface.htmlTopTools.hideTextEdit();
        }

        if (this.editor.handlesClickedObject) {
            this.editor.handlesClickedObject.onHandleUp(event, this.editor);
        } else if (this.editor.isClickedInsideObject) {


            // it can be selection if dragging did not take place
            if (!this.editor.didDrag) {

                if (this.editor.shortcuts.isCtrlPressed) {

                } else if (!this.editor.selectionRectangle) {
                    this.editor.deselectAllObjects();
                    //lets add the object to the selection
                    this.editor.addObjectToSelection(this.editor.clickedObject);

                }


            } else {



                var batch = new CommandBatch();
                for (var i = 0; i < this.editor.selectedObjects.length; i++) {
                    var so = this.editor.selectedObjects[i];
                    var x = so.position.x;
                    var y = so.position.y;
                    so.position = so.originalPosition;

                    var mc = new CommandMove(so, x, y);
                    batch.add(mc);
                }
                this.editor.commands.add(batch);
            }
        } else {

            if (!this.editor.isSelectionStarted) {

                //this.editor.checkPointInChildren(this.editor.activeLayer.children, event);

                // this.editor.deselectAllObjects();
            }

        }

        this.editor.selectionRectangle = null;

        this.editor.propertiesBinder.bindSelected();

        this.editor.lastCickTime = app.pixi.ticker.lastTime;



    };
    
    ModeSelect.prototype.onModeStart = function () {
        
    };
    
    ModeSelect.prototype.onModeEnd = function () {
        
    };

    window.ModeSelect = ModeSelect;

}(window));