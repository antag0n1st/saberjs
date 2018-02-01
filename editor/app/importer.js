(function (window, undefined) {


    function Importer(editor) {
        this.initialize(editor);
    }
    //Importer.prototype = new ParentClassName();
    //Importer.prototype.parentInitialize = Importer.prototype.initialize;
    Importer.prototype.initialize = function (editor) {
        // this.parentInitialize();

        this.editor = editor;
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
        document.getElementById('exportFileName').value = '';

        // this.editor.setDefaultLayer();

        this.editor.moveScreenTo(new V());

        this.editor.constraints.clear();

    };

    Importer.prototype.import = function (data) {

        this.clearStage();

        if (data && data.objects && data.objects.length) {

            this.importObjects(data.objects);

        }

        document.getElementById('exportFileName').value = data.fileName;

        this.editor.moveScreenTo(data.screenPosition);

        this.editor.constraints.clear();
        this.editor.constraints._import();
        this.editor.constraints.rebuildDependencyTree();
        this.editor.constraints.applyValues();

        this.editor.setDefaultLayer();

    };

    Importer.prototype.importObjects = function (objects, contentLayer) {

        var batch = new CommandBatch();

        contentLayer = (contentLayer === undefined) ? this.editor.content : contentLayer;
        
        var importedObjects = [];

        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            var object = new window[o.type]();
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

        //this.editor.commands.add(batch);

    };

    Importer.prototype.importChildren = function (parent, children, batch) {
        var unwrappedObjects = [];
        for (var i = 0; i < children.length; i++) {
            var o = children[i];

            var object = new window[o.type]();
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
        data.screenPosition = {
            x: this.editor._screenPosition.x,
            y: this.editor._screenPosition.y
        };
        data.fileName = document.getElementById('exportFileName').value;

        return data;

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