(function (window, undefined) {


    function Importer(editor) {
        this.initialize(editor);
    }
    //Importer.prototype = new ParentClassName();
    //Importer.prototype.parentInitialize = Importer.prototype.initialize;
    Importer.prototype.initialize = function (editor) {
        // this.parentInitialize();

        this.editor = editor;

        this.data = null;
        this.fileName = '';
    };

    Importer.prototype.clearStage = function () {

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

    Importer.prototype.import = function (data) {

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

    };

    Importer.prototype.importObjects = function (objects, contentLayer) {

        var batch = new CommandBatch();

        contentLayer = (contentLayer === undefined) ? this.editor.content : contentLayer;

        var importedObjects = [];

        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];


            var object = new window[o.type]();
            object.graphics = this.editor.graphics;
            object.build(o);

            var command = new CommandAdd(object, contentLayer, this.editor);
            batch.add(command);

            if (o.children.length) {
                this.importChildren(object, o.children, batch)
            }

            importedObjects.push(object);

        }

        batch.execute();

        return importedObjects;

    };

    Importer.prototype.importChildren = function (parent, children, batch) {
        var unwrappedObjects = [];
        for (var i = 0; i < children.length; i++) {
            var o = children[i];

            if (o.imageName && !Images[o.imageName]) {
                o.imageName = '_missing_image';
            }
            
            if (o.backgroundName && !Images[o.backgroundName]) {
                o.backgroundName = '_missing_image';
            }

            var object = new window[o.type]();
            object.graphics = this.editor.graphics;
            object.build(o);

            var command = new CommandAdd(object, parent, this.editor);
            batch.add(command);

            if (o.children.length) {
                this.importChildren(object, o.children, batch);
            }

            unwrappedObjects.push(object);

        }
        return unwrappedObjects;
    };

    Importer.prototype.export = function () {

        var data = {};

        data.objects = this.exportObjects();
        
        if(this.hasMissingImage(data.objects)){
            return false;
        };
        
        data.screenPosition = {
            x: this.editor._screenPosition.x,
            y: this.editor._screenPosition.y
        };
        data.fileName = this.fileName;

        return data;

    };

    Importer.prototype.hasMissingImage = function (objects) {
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

    Importer.prototype.exportObjects = function () {

        var exportedObjects = [];

        for (var i = 0; i < this.editor.content.children.length; i++) {
            var layer = this.editor.content.children[i];
            exportedObjects.push(layer.export());
        }

        return exportedObjects;

    };

    window.Importer = Importer;

}(window));