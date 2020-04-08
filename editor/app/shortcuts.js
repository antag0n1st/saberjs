(function (window, undefined) {


    function Shortcuts(editor) {
        this.initialize(editor);
    }


    Shortcuts.prototype.initialize = function (editor) {

        this.editor = editor;

        this.kibo = new Kibo();

        this.isSpacePressed = false;
        this.isCtrlPressed = false;
        this.isShiftPressed = false;
        this.isAltPressed = false;
        this.isZPressed = false;
        this.isXPressed = false;

        var that = this;
        this.kibo.up('ctrl z', function () {

            if (editor.isInputActive()) {
                return false;
            }

            editor.commands.undo();
            editor.deselectAllObjects();
        });

        this.kibo.up('ctrl y', function () {

            if (editor.isInputActive()) {
                return false;
            }

            editor.commands.redo();
            editor.deselectAllObjects();
        });

        this.kibo.up('delete', function () {

            if (editor.isInputActive()) {
                return false;
            }

            that.onDelete();
        });
        
        this.kibo.down('backspace', function () {
            
            if (editor.isInputActive()) {
                return true;
            }
            
            return false;
            
//            if(editor.selectedObjects.length && editor.isInputActive()){
//                return true;
//            }
//            
//            if(editor.selectedObjects.length && !editor.isInputActive()){
//                return false;
//            }
//            
//            if(editor.selectedObjects.length <= 0){
//                return false;
//            }
            
        });

        this.kibo.up('backspace', function (event) {

            if (editor.isInputActive()) {
                return false;
            }

            that.onDelete();
            
            
            event.preventDefault();
            event.stopPropagation();
            
        });

        this.kibo.down('space', function () {
            that.isSpacePressed = true;
            app.input.setCursor('pointer');
        });

        this.kibo.up('space', function () {
            that.isSpacePressed = false;
            app.input.restoreCursor();
        });

        this.kibo.down('ctrl', function () {
            that.isCtrlPressed = true;
            return false;
        });

        this.kibo.up('ctrl', function () {
            that.isCtrlPressed = false;
            return false;
        });

        this.kibo.down('alt', function () {
            that.isAltPressed = true;
        });

        this.kibo.up('alt', function () {
            that.isAltPressed = false;
        });

        this.kibo.down('shift', function () {
            that.isShiftPressed = true;
        });

        this.kibo.up('shift', function () {
            that.isShiftPressed = false;
        });

        this.kibo.down('left', function () {
            if (!editor.isInputActive()) {
                that.moveSelectionBy(new V(-1, 0));
            }

        });

        this.kibo.down('right', function () {
            if (!editor.isInputActive()) {
                that.moveSelectionBy(new V(1, 0));
            }

        });

        this.kibo.down('up', function () {
            if (!editor.isInputActive()) {
                that.moveSelectionBy(new V(0, -1));
            }

        });

        this.kibo.down('down', function () {
            if (!editor.isInputActive()) {
                that.moveSelectionBy(new V(0, 1));
            }

        });

        this.kibo.down('ctrl c', function () {
            if (!editor.isInputActive()) {
                editor.copySelection();
                return false;
            }
        });

        this.kibo.down('ctrl v', function () {
            if (!editor.isInputActive()) {
                editor.paste();
                return false;
            }
        });

        this.kibo.down('ctrl s', function () {
            if (!editor.isInputActive()) {
                editor.htmlInterface.htmlTopTools.onSaveBtn();
              //  editor.htmlInterface.saveCurrentContent();
                return false;
            }
        });

        this.kibo.down('ctrl up', function () {
            editor.htmlInterface.htmlTopTools.moveItemsUp();
            return false;
        });

        this.kibo.down('ctrl down', function () {
            editor.htmlInterface.htmlTopTools.moveItemsDown();
            return false;
        });

        this.kibo.down('esc', function () {
            that.onEsc();
        });

        this.kibo.down('x', function () {
            that.isXPressed = true;
        });

        this.kibo.down('z', function () {
            that.isZPressed = true;
        });

        this.kibo.up('x', function () {
            that.isXPressed = false;
        });

        this.kibo.up('z', function () {
            that.isZPressed = false;
        });
        
      

        this.kibo.down('any number', function (e) {
            if (!editor.isInputActive()) {
                var tab = that.editor.htmlInterface.tabs[parseInt(e.key) - 1];
                if (tab) {
                    that.editor.htmlInterface.activateTab(tab);
                }
            }

        });
        

    };

    Shortcuts.prototype.moveSelectionBy = function (dragBy) {

        if (this.editor.selectedObjects.length) {
            var batch = new CommandBatch();

            for (var i = 0; i < this.editor.selectedObjects.length; i++) {
                var object = this.editor.selectedObjects[i];

                var x = object.position.x + dragBy.x;
                var y = object.position.y + dragBy.y;

                var mc = new CommandMove(object, x, y);
                batch.add(mc);

            }

            this.editor.commands.add(batch);
        }



    };

    Shortcuts.prototype.onDelete = function () {

        var batch = new CommandBatch();
        for (var i = 0; i < this.editor.selectedObjects.length; i++) {
            var so = this.editor.selectedObjects[i];
            var command = new CommandDelete(so, this.editor);
            batch.add(command);

        }

        this.editor.commands.add(batch);

        this.editor.deselectAllObjects();

        this.editor.htmlInterface.tree.build();

    };

    Shortcuts.prototype.onEsc = function () {
        
        this.editor.deselectAllObjects();
        this.editor.htmlInterface.htmlTopTools.hideTextEdit();
        this.editor.setMode(MainScreen.MODE_SELECT);

        this.editor.htmlInterface.contextMenu.close();
        this.editor.htmlInterface.contextMenu.closeImageBrowser();

        $(".color-pickers").colorpicker('hide');
        
        if(this.editor._onEsc){
            this.editor._onEsc();
        };

    };

    window.Shortcuts = Shortcuts;

}(window));