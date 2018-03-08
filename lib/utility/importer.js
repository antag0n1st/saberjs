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

        this.objects = null;

    };

    Importer.prototype.dataToObject = function (data) {

        var object = this.unwrapObject(data, null);

        if (data.children.length) {
            this.importChildren(object, data.children);
        }

        return object;
    };

    Importer.prototype.findDataById = function (id, children) {
        children = children || this.objects;

        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c.id === id) {
                return c;
            }
            var object = this.findDataById(id, c.children);
            if (object) {
                return object;
            }
        }

        return null;
    };

    Importer.prototype.findDataByType = function (type, children, result) {
        children = children || this.objects;
        result = result || [];
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c.type === type) {
                result.push(c);
            }
            this.findDataByType(type, c.children, result);
        }

        return result.length ? result : null;
    };

    Importer.prototype.findDataByTag = function (tag, children, result) {
        children = children || this.objects;
        result = result || [];
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c.tag == tag) {
                result.push(c);
            }
            this.findDataByTag(tag, c.children, result);
        }

        return result.length ? result : null;
    };

    Importer.prototype.findDataByMethod = function (compareMethod, children, result) {
        children = children || this.objects;
        result = result || [];
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (compareMethod(c)) {
                result.push(c);
            }
            this.findDataByMethod(compareMethod, c.children, result);
        }

        return result.length ? result : null;
    };

    Importer.prototype.importObjects = function (objects, content) {

        this.content = content;
        this.objects = objects;

        for (var i = 0; i < objects.length; i++) {

            var data = objects[i];

            var object = this.unwrapObject(data, content);

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

        // on import

        this.propagateImport(this.content.children);

    };

    Importer.prototype.propagateImport = function (children) {

        for (var i = children.length - 1; i >= 0; i--) {
            var c = children[i];
            if (c.onImport) {
                c.onImport();
            }
            this.propagateImport(c.children);
        }

    };

    Importer.prototype.importChildren = function (parent, children) {

        var unwrappedObjects = [];
        for (var i = 0; i < children.length; i++) {
            var data = children[i];

            var object = this.unwrapObject(data, parent);

            if (object) {
                if (object instanceof InputField) {
                    this.addInputToParent(object, parent)
                }

                parent.addChild(object);

                if (data.children.length) {
                    this.importChildren(object, data.children);
                }

                unwrappedObjects.push(object);
            }

        }
        return unwrappedObjects;

    };

    Importer.prototype.addInputToParent = function (input, parent) {
        if (parent instanceof InputContent) {
            parent.addInput(input);
        } else if (parent.parent) {
            this.addInputToParent(input, parent.parent);
        }
    };

    Importer.prototype.unwrapObject = function (data, parent) {

        var object = null;

        if (data.properties && data.properties.isCustomSensor) {
            this.setCustomSensor(data, parent);
            return null;
        } else if (data.className) {

            if (data.className === "CustomSensor" || data.className === "CustomBounds") {
                this.setCustomSensor(data, parent);
                return null;
            } else if (window[data.className]) {
                object = new window[data.className]();
            } else {
                console.warn('Class: "' + data.className + '" is not defined!');
                return new Sprite();
            }

            if (object.setData) {
                object.setData(data,this.extract,this);
            }
            object.enableSensor();

        } else if (data.type === "ImageObject") {

            object = new Sprite(data.imageName);
            object.enableSensor();

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
            var type = data.properties.isNineSlice ? Button.TYPE_NINE_SLICE : Button.TYPE_NORMAL;
            object = new Button(data.txt, style, type);

            if (data.properties.isNineSlice) {
                object.background.setSize(data.properties.width, data.properties.height);
            }

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

        } else if (data.type === "InputObject") {

            var style = data.style;
            style.background = data.backgroundName;

            object = new InputField(style, InputField.TYPE_ALL);
            object.setSize(data.properties.width, data.properties.height);
            object.hasNext = data.properties.hasNext;
            if (data.properties.hasPlaceholder) {
                object.setPlaceholder(data.txt);
            }

        } else if (data.type === "GenericObject") {

            object = new Sprite();
            object.enableSensor();

        } else if (data.type === "ContainerObject") {

            object = new Sprite();
            object.enableSensor();

        } else if (data.type === "PolygonObject") {

            object = new Sprite();
            object.enableSensor();

            var points = [];
            for (var i = 0; i < data.points.length; i++) {
                var p = new V().copy(data.points[i]);
                points.push(p);
            }

            var polygon = new SAT.Polygon(new V(), points);
            object.enableSensor(); //TODO maybe enable sensor can take an argument
            object.setCustomSensor(polygon);

        } else if (data.type === "GenericPoint") {

            object = new Sprite();
            object.enableSensor();

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
        object.visible = (data.visible === undefined) ? true : data.visible;
        object.id = data.id;
        object.tint = data.tint || 0xffffff;


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
    
    Importer.prototype.extract = function (key, data) {

        if (data.properties && data.properties._custom) {
            for (var i = 0; i < data.properties._custom.length; i++) {
                var d = data.properties._custom[i];
                if(d.key === key){
                    return d.value;
                }
            }
        }
        
        return null;

    };

    Importer.prototype.setCustomSensor = function (data, parent) {

        parent.enableSensor();
        parent.getSensor();

        var points = [];
        var position = data.position;
        for (var i = 0; i < data.points.length; i++) {

            var p = new V().copy(data.points[i]);
            p.x += parent._width * parent.anchor.x + position.x;
            p.y += parent._height * parent.anchor.y + position.y;

            points.push(p);
        }

        var polygon = new SAT.Polygon(new V().copy(data.position), points);
        parent.setCustomSensor(polygon);

    };


    window.Importer = Importer;

}(window));