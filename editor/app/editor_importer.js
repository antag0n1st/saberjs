(function (window, undefined) {


    function EditorImporter(editor) {
        this.initialize(editor);
    }
    //EditorImporter.prototype = new ParentClassName();
    //EditorImporter.prototype.parentInitialize = EditorImporter.prototype.initialize;
    EditorImporter.prototype.initialize = function (editor) {
        // this.parentInitialize();

        this.editor = editor;

        this.data = null;
        this.fileName = '';
    };

    EditorImporter.prototype.clearStage = function () {

        var layers = this.editor.content.children;

        for (var i = layers.length - 1; i >= 0; i--) {
            var layer = layers[i];
            layer.removeFromParent();
        }

        this.editor.deselectAllObjects();
        this.editor.selectedObjects = [];
        this.editor.activeLayer = null;

        this.editor.moveScreenTo(new V());

        this.editor.constraints.clear();

        this.data = null;
        this.fileName = '';

    };

    EditorImporter.prototype.import = function (data) {

        this.clearStage();

        if (data && data.objects && data.objects.length) {

            this.importObjects(data.objects);

        }

        this.editor.moveScreenTo(data.screenPosition);

        this.editor.constraints.clear();
        this.editor.constraints._import();
        this.editor.constraints.rebuildDependencyTree();
        this.editor.constraints.applyValues();

        this.editor.setDefaultLayer();

        this.data = data;
        this.fileName = data.fileName;
        this.layoutType = data.layoutType;
        this.editor.previewScreenName = data.previewScreenName || '';

    };

    EditorImporter.prototype.importObjects = function (objects, contentLayer) {

        var batch = new CommandBatch();

        contentLayer = (contentLayer === undefined) ? this.editor.content : contentLayer;

        var importedObjects = [];

        // this will import the layers

        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];

            var object = new window[o.type]();
         
            object.graphics = this.editor.graphics;
            object.build(o);

            var command = new CommandAdd(object, contentLayer, this.editor);
            batch.add(command);

            if (o.children && o.children.length) {
                this.importChildren(object, o.children, batch)
            }

            importedObjects.push(object);

        }

        batch.execute();

        this.propagateImport(contentLayer.children)

        return importedObjects;

    };

    EditorImporter.prototype.propagateImport = function (children) {

        for (var i = children.length - 1; i >= 0; i--) {
            var c = children[i];
            if (c.onImport) {
                c.onImport();
            }

            if (c.onImportFinished) {
                c.onImportFinished();
            }
            this.propagateImport(c.children);
        }

    };

    EditorImporter.prototype.importChildren = function (parent, children, batch) {
        var unwrappedObjects = [];



        for (var i = 0; i < children.length; i++) {
            var o = children[i];

            if (o.imageName && !PIXI.utils.TextureCache[o.imageName]) {
                o.imageName = '_missing_image';
            }

            if (o.backgroundName && !PIXI.utils.TextureCache[o.backgroundName]) {
                o.backgroundName = '_missing_image';
            }

            if (window[o.type]) {
                var object = new window[o.type]();
              
                object.graphics = this.editor.graphics;
                object.build(o);

                var command = new CommandAdd(object, parent, this.editor);
                batch.add(command);

                if (o.children && o.children.length) {
                    this.importChildren(object, o.children, batch);
                }

                unwrappedObjects.push(object);
            } else {
                console.warn("There is a missing object type: " + o.type + ' name: ' + o.name);
            }


            if (o.type === "ViewComponentObject") {

                //TODO import the menu content

                if (o.properties.view_name) {
                    if (ContentManager.jsons[o.properties.view_name]) {
                        var toImport = ContentManager.jsons[o.properties.view_name];
                        this.importChildren(object, toImport.objects, batch);
                    } else {
                        console.warn("I can't find a view by the name: "+o.properties.view_name);
                    }
                } else {
                    console.warn("You need to define a view name for the ViewComponent");
                }




            }


        }
        return unwrappedObjects;
    };

    EditorImporter.prototype.export = function () {

        var data = {};

        data.objects = this.exportObjects();

        if (this.hasMissingImage(data.objects)) {
            return false;
        }

        data.screenPosition = {
            x: Math.roundDecimal(this.editor._screenPosition.x,2),
            y: Math.roundDecimal(this.editor._screenPosition.y,2)
        };
        data.fileName = this.fileName;

        return data;

    };

    EditorImporter.prototype.hasMissingImage = function (objects) {
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            if (object.imageName === "_missing_image") {
                return true;
            }
            if (object.children) {
                var has = this.hasMissingImage(object.children);
                if (has) {
                    return true;
                }
            }


        }

        return false;
    };

    EditorImporter.prototype.exportObjects = function () {

        var exportedObjects = [];

        for (var i = 0; i < this.editor.content.children.length; i++) {
            var layer = this.editor.content.children[i];
            exportedObjects.push(layer.export());
        }

        return exportedObjects;

    };

    window.EditorImporter = EditorImporter;

}(window));