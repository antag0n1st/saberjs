(function (window, undefined) {


    function Importer(screen) {
        this.initialize(screen);
    }
    //Importer.prototype = new ParentClassName();
    //Importer.prototype.parentInitialize = Importer.prototype.initialize;
    Importer.prototype.initialize = function (screen) {
        // this.parentInitialize();

        this.inputs = [];
        this.screen = screen;
        this.content = null;


    };


    Importer.prototype.importObjects = function (objects, content) {

        this.content = content;

        for (var i = 0; i < objects.length; i++) {

            var data = objects[i];

            var object = this.unwrapObject(data);

            if (object) {
                content.addChild(object);
            }

            if (data.children.length) {
                this.importChildren(object, data.children)
            }

        }

        this.screen.constraints.rebuildDependencyTree();
        this.screen.constraints.applyValues();

        for (var i = 0; i < this.inputs.length; i++) {
            this.screen.addTouchable(this.inputs[i]);
        }

        // this.editor.moveScreenTo(data.screenPosition);


    };

    Importer.prototype.importChildren = function (parent, children) {

        var unwrappedObjects = [];
        for (var i = 0; i < children.length; i++) {
            var data = children[i];

            var object = this.unwrapObject(data);

            parent.addChild(object);

            if (data.children.length) {
                this.importChildren(object, data.children);
            }

            unwrappedObjects.push(object);



        }
        return unwrappedObjects;

    };

    Importer.prototype.unwrapObject = function (data) {

        var object = null;

        if (data.type === "ImageObject") {

            object = new Sprite(data.imageName);

        } else if (data.type === "LabelObject") {
            var style = data.style;
            object = new Label(style);
            object.txt = data.txt;
        } else if (data.type === "ButtonObject") {

            var style = data.style;
            style.imageNormal = data.backgroundName;
            style.imageSelected = data.backgroundName;
            style.offsetX = data.properties.offsetX;
            style.offsetY = data.properties.offsetY;

            object = new Button(data.txt, style, Button.TYPE_NINE_SLICE);

            object.background.setSize(data.properties.width, data.properties.height);
            if (Math.round(data.properties.sensorWidth) === 0) {
                object.setSensorSize(data.properties.width, data.properties.height);
            } else {
                object.setSensorSize(data.properties.sensorWidth, data.properties.sensorHeight);
            }

            object.label.rotation = data.properties.labelRotation;

            this.inputs.push(object);
        } else if (data.type === "Layer") {

            if (data.isInputContent) {
                object = new InputContent(this.screen);
                this.inputs.push(object);
            } else {
                object = new Layer();
            }

            object.name = data.name;
            object.factor = Number(data.factor);

        }

        object.position.set(data.position.x, data.position.y);
        if (object.anchor) {
            object.anchor.set(data.anchor.x, data.anchor.y);
        }

        object.scale.set(data.scale.x, data.scale.y);
        object.tag = data.tag;
        object.zIndex = data.zIndex;
        object.rotation = data.rotation;
        object.alpha = data.alpha;
        object.id = data.id;


        if (data.constraintX) {
            object.constraintX = new Constraint(object, 'x', data.constraintX);
            this.screen.constraints.add(object.constraintX);
        }

        if (data.constraintY) {
            object.constraintY = new Constraint(object, 'y', data.constraintY);
            this.screen.constraints.add(object.constraintY);
        }

        return object;

    };


    window.Importer = Importer;

}(window));