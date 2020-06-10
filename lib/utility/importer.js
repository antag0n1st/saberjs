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
        this.resolveConstraints = true;

        this.objects = null;

    };

    Importer.prototype.dataToObject = function (data) {

        var object = this.unwrapObject(data, null);

        if (data.children && data.children.length) {
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

    Importer.prototype.findDataByClassName = function (className, children, result) {
        children = children || this.objects;
        result = result || [];
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c.className === className) {
                result.push(c);
            }
            this.findDataByClassName(className, c.children, result);
        }

        return result.length ? result : null;
    };

    Importer.prototype.findDataByTag = function (tag, children, result) {

        children = children || this.objects;
        result = result || [];
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c.tag === tag) {
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

            if (data.children && data.children.length) {
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

            if (c.onImportFinished) {
                c.onImportFinished();
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

                if (data.type === "ViewComponentObject") {
                    if (data.properties.view_name) {
                        if (ContentManager.jsons[data.properties.view_name]) {
                            var toImport = ContentManager.jsons[data.properties.view_name];

                            // lets avoid collision on layer names
                            for (var j = 0; j < toImport.objects.length; j++) {
                                var _l = toImport.objects[j];
                                _l.name = 'view' + _l.name;
                            }

                            this.importChildren(object, toImport.objects);
                        }
                    }
                }

                if (data.children && data.children.length) {
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
                object.mode = 'app';
            } else {
                console.warn('Class: "' + data.className + '" is not defined!');
                return new Sprite();
            }

            if (object.setData) {
                object.setData(data, this.extract, this);
            }
            object.enableSensor();

        } else if (data.type === "ImageObject" && !this._customImport) {

            object = new Sprite(data.imageName);
            object.enableSensor();

        } else if (data.type === "LabelObject") {
            
            var style = {};
            this.applyValues(style ,_label_style_defaults );
            this.applyValues(style ,data.style || {} );
            object = new Label(style);
            object.txt = data.txt;
            
        } else if (data.type === "ButtonObject") {

            var props = {};            
            this.applyValues(props , _button_properties_defaults);
            this.applyValues(props , data.properties || {});

            var style = {};
            this.applyValues(style ,_label_style_defaults );
            this.applyValues(style ,data.style || {} );
            
            style.imageNormal = props.backgroundName;
            style.imageSelected = props.backgroundName;
            style.offsetX = props.offsetX;
            style.offsetY = props.offsetY;
            var type = props.isNineSlice ? Button.TYPE_NINE_SLICE : Button.TYPE_NORMAL;

            style.backgroundPadding = props.padding;

            object = new Button(data.txt, style, type, props);

            if (props.isNineSlice) {
                object.background.setSize(props.width, props.height);
            }

            if (Math.round(props.sensorWidth) === 0) {
                object.setSensorSize(props.width, props.height);
            } else {
                object.setSensorSize(props.sensorWidth, props.sensorHeight);
            }

            object.label.rotation = props.labelRotation;

            this.inputs.push(object);

            // bind events
            var events = ['onMouseDown', 'onMouseMove', 'onMouseUp', 'onMouseCancel'];

            for (var i = 0; i < events.length; i++) {
                var eventName = events[i];

                if (props[eventName]) {
                    if (this.screen[props[eventName]]) {
                        object[eventName] = this.screen[props[eventName]].bind(this.screen);
                    } else if (props[eventName].startsWith('fn ') || props[eventName].startsWith('fn:')) {
                        var fnCode = props[eventName].substring(3);
                        object[eventName] = function (event, sender) {
                            try {
                                "use strict";
                                eval(fnCode);
                            } catch (e) {
                                console.error("You have defined an invalid function code!");
                                console.error(e);
                            }
                        }.bind(this.screen);
                    } else {
                        console.warn("undeclared method:" + props[eventName] + ' from imported button')
                    }
                }
            }


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
            
            var props = {};            
            this.applyValues(props , _input_properties_defaults);
            this.applyValues(props , data.properties || {});

            var style = {};
            this.applyValues(style ,_label_style_defaults );
            this.applyValues(style ,data.style || {} );

            style.background = data.backgroundName;

            object = new InputField(style, parseInt(props.input_type) || InputField.TYPE_ALL);
            object.setSize(props.width, props.height);
            object.hasNext = props.hasNext;
            object.doneText = props.doneText || null;
            object.scrollToY = props.scrollTo || 0;
            if (props.hasPlaceholder) {
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

        } else if (data.type === "PathObject") {

            object = new PolyBezier();
            object.build(data);

        } else if (data.type === "NineSliceObject") {

            var props = {};            
            this.applyValues(props , _nineslice_properties_defaults);
            this.applyValues(props , data.properties || {});
            
            object = new NineSlice(props.backgroundName, props.padding.toString(), props.width, props.height);
            object.tint = convertColor(props.tintColor);

        } else if (data.type === "TilingSpriteObject") {

            var props = {};            
            this.applyValues(props , _tilingsprite_properties_defaults);
            this.applyValues(props , data.properties || {});

            var texture = Sprite.prototype.findTexture.call(this, props.backgroundName)

            object = new PIXI.TilingSprite(texture);
            object.width = props.width;
            object.height = props.height;

            object.tilePosition.set(props.tilePositionX, props.tilePositionY);
            object.tileScale.set(props.tileScaleX, props.tileScaleY);

        } else if (this._customImport) {
            object = this._customImport(data);
        }

        if (!object) {
            object = new Sprite();
            object.enableSensor();
        }
        
        if(data.position){
            object.position.set(data.position.x, data.position.y);
        }
        
        if (data.anchor) {
            object.anchor.set(data.anchor.x, data.anchor.y);
        } else {
            object.anchor.set(0.5,0.5);
        }
        
        if(data.scale){
            object.scale.set(data.scale.x, data.scale.y);
        }

        if(data.tag){
            object.tag = data.tag;
        }
        if(data.zIndex){
            object.zIndex = data.zIndex;
        }
        
        if(data.rotation){
             object.rotation = data.rotation;
        }
        
        if(data.alpha !== undefined){
            object.alpha = data.alpha;
        }
        
        object.visible = (data.visible === undefined) ? true : data.visible;
        
        if(data.id !== undefined){
            object.id = data.id;
             object.id = object.id.toLowerCase();
        } else {
            object.id = PIXI.utils.uid();
        } 

        if (data.type !== "NineSliceObject") {
            object.tint = data.tint || 0xffffff;
        }


        if (data.properties && data.properties._custom) {
            object._properties = data.properties._custom;
        }

        if (this.resolveConstraints) {
            if (data.constraintX) {
                object.constraintX = new Constraint(object, 'x', data.constraintX);
                this.screen.constraints.add(object.constraintX);
            }

            if (data.constraintY) {
                object.constraintY = new Constraint(object, 'y', data.constraintY);
                this.screen.constraints.add(object.constraintY);
            }

            if (data.constraintWidth) {
                object.constraintWidth = new Constraint(object, 'width', data.constraintWidth);
                this.screen.constraints.add(object.constraintWidth);
            }

            if (data.constraintHeight) {
                object.constraintHeight = new Constraint(object, 'height', data.constraintHeight);
                this.screen.constraints.add(object.constraintHeight);
            }

            if (data.constraintFit) {
                object.constraintFit = new ConstraintMethod(object, 'fitTo', data.constraintFit);
                this.screen.constraints.add(object.constraintFit);
            }

            if (data.constraintFill) {
                object.constraintFill = new ConstraintMethod(object, 'fillOut', data.constraintFill);
                this.screen.constraints.add(object.constraintFill);
            }
        }



        if (this._customBuild) {
            this._customBuild(object, data);
        }


        return object;

    };

    Importer.prototype.extract = function (key, data) {

        if (data.properties && data.properties._custom) {
            for (var i = 0; i < data.properties._custom.length; i++) {
                var d = data.properties._custom[i];
                if (d.key === key) {
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

    Importer.prototype.applyValues = function (object, values) {
      
      for (var prop in values) {
            if (Object.prototype.hasOwnProperty.call(values, prop)) {
                var defaultValue = values[prop];
                object[prop] = defaultValue;
            }
        }

    };
    

    window.Importer = Importer;

}(window));