(function (window, undefined) {

    function Entity(name) {
        this.initialize(name);
    }

    Entity.prototype = new Sprite();
    Entity.prototype.spriteInitialize = Entity.prototype.initialize;

    Entity.HANDLE_TOP = 0;
    Entity.HANDLE_RIGHT = 1;
    Entity.HANDLE_BOTTOM = 2;
    Entity.HANDLE_LEFT = 3;

    Entity.prototype.initialize = function (name) {

        this.spriteInitialize(name);

        this.id = '_change_it_before_use-' + PIXI.utils.uid();
        this.name = '';
        this.mode = 'editor';

        this.isSelected = false;
        this.frameSensors = [];
        this.frameStretchSensors = [];

        this.rotationHandle = null;
        this.rotationHandleDistance = 40;

        this._snapAngles = [
            0,
            0.7853981633974483,
            1.5707963267948966,
            2.356194490192345,
            3.141592653589793,
            3.9269908169872414,
            4.71238898038469,
            5.497787143782138,
            6.283185307179586,
            -0.7853981633974483,
            -1.5707963267948966,
            -2.356194490192345,
            -3.141592653589793,
            -3.9269908169872414,
            -4.71238898038469,
            -5.497787143782138,
            -6.283185307179586
        ];

        this.padding = 0;

        this.originalPosition = new V();
        this.originalScale = new V();
        this.originalRotation = 0;

        this.initial_point = new V();

        this.shape = null;
        this.path = null;

        this.initialSize = 0; // for the resize handles
        this._initialStretch = 0; // for the stretch handles

        this.canResize = true; // resize handles
        this.canStretch = false; // width/height handles
        this.canSelect = true; // if the object can be selected
        this.canMove = true; // its possible to have a static non movable object
        this.canDelete = true; // if it can be deleted from the scene
        this.canExport = true; // if it can be exported ( the scene will be exported without this object )        
        this.hasFrame = true; // if the selection frame should be drawn
        this.hasLabel = false; // if it contains a label object
        this.hasRotationHandle = true; // if the rotation handle is drawn
        this.canPrefab = true; /// if the object can be saved as a Prefab
        this.canDrop = true; // if it can be moved inside an other object

        this._drawStretchRight = true;
        this._drawStretchTop = true;
        this._drawStretchLeft = false;
        this._drawStretchBottom = false;

        this.hasImage = false; // if the object has an image        
        this.canTransform = false; //TODO remove this from here this is for mymathcore

        //TODO remove this from here this is for mymathcore 
        this.isFlipped = false;
        this.isXOut = false;
        this._xOutElement = null;

        this.type = 'Entity';

        this.handleTypeTouched = '';
        this._handleID = 0;

        this.constraintX = null;
        this.constraintY = null;

        this.className = '';

        this.properties = {};
        this._data = null;

    };

    Entity.prototype.createFrame = function (padding, handleSize) {

        this.padding = padding;

        if (this.frameSensors.length) {
            this.frameSensors = [];
        }

        var circle1 = new SAT.Circle(new V(), handleSize);
        this.frameSensors.push(circle1);

        var circle2 = new SAT.Circle(new V(), handleSize);
        this.frameSensors.push(circle2);

        var circle3 = new SAT.Circle(new V(), handleSize);
        this.frameSensors.push(circle3);

        var circle4 = new SAT.Circle(new V(), handleSize);
        this.frameSensors.push(circle4);

        if (this.frameStretchSensors.length) {
            this.frameStretchSensors = [];
        }

        var shSize = 30;

        //TODO set strech frames

        var hand1 = new SAT.Box(new V(), shSize, shSize).toPolygon();
        hand1.translate(-shSize / 2, -shSize - 2);
        hand1.type = Entity.HANDLE_TOP;
        this.frameStretchSensors.push(hand1);

        var hand2 = new SAT.Box(new V(), shSize, shSize).toPolygon();
        hand2.translate(3, -shSize / 2);
        hand2.type = Entity.HANDLE_RIGHT;
        this.frameStretchSensors.push(hand2);

        var hand3 = new SAT.Box(new V(), shSize, shSize).toPolygon();
        hand3.translate(-shSize / 2, 2);
        hand3.type = Entity.HANDLE_BOTTOM;
        this.frameStretchSensors.push(hand3);

        var hand4 = new SAT.Box(new V(), shSize, shSize).toPolygon();
        hand4.translate(-shSize - 2, -shSize / 2);
        hand4.type = Entity.HANDLE_LEFT;
        this.frameStretchSensors.push(hand4);

        this.rotationHandle = new SAT.Circle(new V(), handleSize);

    };

    Entity.prototype.save = function () {
        this.originalPosition.copy(this.position);
        this.originalScale.copy(this.scale);
        this.originalRotation = this.rotation;
    };

    Entity.prototype.dragBy = function (position) {
        if (this.canMove) {
            var p = new V().copy(position);
            var angle = this.sumAllAngles();
            p.rotate(-angle + this.rotation);
            this.position.set(this.originalPosition.x + p.x, this.originalPosition.y + p.y);
        }
    };


    Entity.prototype.select = function () {
        this.isSelected = true;
        this.updateFrame();

        this._onSelect();
    };

    Entity.prototype.deselect = function () {
        this.isSelected = false;

        this._onDeselect();
    };

    Entity.prototype._onSelect = function () {

    };

    Entity.prototype._onDeselect = function () {

    };

    Entity.prototype.drawFrame = function (graphics) {

        if (!this.hasFrame) {
            return;
        }

        var p = this.getGlobalPosition();

        var rotation = this.sumAllAngles();

        // DRAW FRAME
        graphics.lineStyle(2, 0x000000, 1);
        graphics.beginFill(0xFF700B, 0);
        graphics.moveTo(p.x + this.frameSensors[0].pos.x, p.y + this.frameSensors[0].pos.y);
        for (var i = this.frameSensors.length - 1; i >= 0; i--) {
            var s = this.frameSensors[i];
            graphics.lineTo(p.x + s.pos.x, p.y + s.pos.y);
        }
        graphics.endFill();

        // DRAW RESIZE HANDLES
        if (this.canResize) {
            graphics.beginFill(0xFFFF0B, 1);
            for (var i = 0; i < this.frameSensors.length; i++) {

                var s = this.frameSensors[i];
                graphics.drawCircle(p.x + s.pos.x, p.y + s.pos.y, s.r);

            }
            graphics.drawCircle(p.x, p.y, 6);
            graphics.endFill();
        }

        if (this.hasRotationHandle) {
            // DRAW ROTATE HANDLE
            var rh = this.rotationHandle.pos;
            graphics.beginFill(0xFFFF0B, 1);

            var rhp = new V(p.x + rh.x, p.y + rh.y);

            var d = Math.getDistance(p, rhp) - this.rotationHandleDistance;

            var st = new V();
            st.setLength(d);
            st.setAngle(rotation + Math.degreesToRadians(90));

            graphics.moveTo(p.x + st.x, p.y + st.y);
            graphics.lineTo(rhp.x, rhp.y);

            graphics.drawCircle(p.x + rh.x, p.y + rh.y, this.rotationHandle.r);
            graphics.endFill();
        }

        if (this.canStretch) {

            graphics.lineStyle(2, 0x126c87, 0);
            graphics.beginFill(0xf4eb42, 0.9);

            for (var i = 0; i < this.frameStretchSensors.length; i++) {
                var r = this.frameStretchSensors[i];

                if ((r.type === Entity.HANDLE_TOP && this._drawStretchTop)
                        || (r.type === Entity.HANDLE_RIGHT && this._drawStretchRight)
                        || (r.type === Entity.HANDLE_BOTTOM && this._drawStretchBottom)
                        || (r.type === Entity.HANDLE_LEFT && this._drawStretchLeft)
                        ) {

                    this.drawStretchHandle(p, r, graphics);
                }

            }

            graphics.endFill();
        }

    };

    Entity.prototype.drawStretchHandle = function (p, r, graphics) {

        var path = [
            new PIXI.Point(p.x + r.pos.x + r.points[0].x, p.y + r.pos.y + r.points[0].y),
            new PIXI.Point(p.x + r.pos.x + r.points[1].x, p.y + r.pos.y + r.points[1].y),
            new PIXI.Point(p.x + r.pos.x + r.points[2].x, p.y + r.pos.y + r.points[2].y),
            new PIXI.Point(p.x + r.pos.x + r.points[3].x, p.y + r.pos.y + r.points[3].y)
        ];
        graphics.drawPolygon(path);
    };

    Entity.prototype.renderPolygon = function (polygon, graphics) {

        var points = polygon.points;
        var p = polygon.pos;

        graphics.moveTo(p.x + points[0].x, p.y + points[0].y);

        for (var i = points.length - 1; i >= 0; i--) {
            graphics.lineTo(p.x + points[i].x, p.y + points[i].y);
        }

    };

    Entity.prototype.updateFrame = function () {

        if (!this.hasFrame) {
            return false;
        }

        var sensor = this.getSensor();

        var pp = new V(); // padding point
        pp.setLength(this.padding);

        var rotation = this.sumAllAngles();

        for (var i = 0; i < this.frameSensors.length; i++) {

            if (i === 0) {
                pp.setAngle(rotation + Math.degreesToRadians(225));
            } else if (i === 1) {
                pp.setAngle(rotation + Math.degreesToRadians(315));
            } else if (i === 2) {
                pp.setAngle(rotation + Math.degreesToRadians(45));
            } else if (i === 3) {
                pp.setAngle(rotation + Math.degreesToRadians(135));
            }

            var cp = sensor.points[i]; // the points of the rectangle
            var s = this.frameSensors[i];
            s.pos.set(cp.x + pp.x, cp.y + pp.y);

        }

        for (var i = 0; i < this.frameStretchSensors.length; i++) {
            var stretchFrame = this.frameStretchSensors[i];
            stretchFrame.pos.set(cp.x + pp.x, cp.y + pp.y);

            var s1 = this.frameSensors[i];
            var s2 = this.frameSensors[i + 1] || this.frameSensors[0];

            var x = s1.pos.x - (s1.pos.x - s2.pos.x) / 2;
            var y = s1.pos.y - (s1.pos.y - s2.pos.y) / 2;
            stretchFrame.pos.set(x, y);


            var angle = Math.getAngle(s1.pos, s2.pos);

            if (stretchFrame.type === Entity.HANDLE_RIGHT) {
                angle += Math.degreesToRadians(-90);
            } else if (stretchFrame.type === Entity.HANDLE_BOTTOM) {
                angle += Math.degreesToRadians(-180);
            } else if (stretchFrame.type === Entity.HANDLE_LEFT) {
                angle += Math.degreesToRadians(-270);
            }

            stretchFrame.rotate(angle - stretchFrame._angle || 0);
            stretchFrame._angle = angle;
        }

        ///////////

        var rh = new V();
        var d = Math.getDistance(this.frameSensors[0].pos, this.frameSensors[3].pos) - this.scale.y * this._height * this.anchor.y;

        rh.setLength(d + this.rotationHandleDistance);
        rh.setAngle(rotation + Math.degreesToRadians(90));

        this.rotationHandle.pos.set(rh.x, rh.y);

    };

    Entity.prototype.checkHandles = function (point) {

        if (!this.hasFrame) {
            return false;
        }

        var globalP = this.getGlobalPosition();
        var p = V.substruction(point, globalP);

        if (this.canResize) {
            // check resize handles
            for (var i = 0; i < this.frameSensors.length; i++) {
                var handle = this.frameSensors[i];
                if (SAT.pointInCircle(p, handle)) {
                    this.handleTypeTouched = 'resize';
                    return true;
                }
            }
        }

        if (this.canStretch) {

            // check resize handles
            for (var i = 0; i < this.frameStretchSensors.length; i++) {

                var handle = this.frameStretchSensors[i];

                if ((handle.type === Entity.HANDLE_TOP && this._drawStretchTop)
                        || (handle.type === Entity.HANDLE_RIGHT && this._drawStretchRight)
                        || (handle.type === Entity.HANDLE_BOTTOM && this._drawStretchBottom)
                        || (handle.type === Entity.HANDLE_LEFT && this._drawStretchLeft)
                        ) {

                    if (SAT.pointInPolygon(p, handle)) {
                        this.handleTypeTouched = 'stretch';
                        this._handleID = handle.type;
                        return true;
                    }
                }

            }
        }

        if (this.hasRotationHandle) {
            if (SAT.pointInCircle(p, this.rotationHandle)) {
                this.handleTypeTouched = 'rotate';
                return true;
            }
        }

        return false;

    };

    Entity.prototype.onHandleDown = function (event, editor) {

        if (this.handleTypeTouched === 'resize') {
            this._downResize(event, editor);
        } else if (this.handleTypeTouched === "stretch") {

            if (this._handleID === Entity.HANDLE_RIGHT || this._handleID === Entity.HANDLE_LEFT) {
                this._initialStretch = event.point.x;
            } else {
                this._initialStretch = event.point.y;
            }

            if (this._onStretchStarted) {
                this._onStretchStarted(this._handleID, editor);
            }
        }

    };

    Entity.prototype._downResize = function (event, editor) {
        var w = this._width / 2;
        var h = this._height / 2;
        this.initialSize = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
    };

    Entity.prototype.onHandleMove = function (event, editor) {

        if (this.handleTypeTouched === 'rotate') {
            this._moveRotate(event, editor);
        } else if (this.handleTypeTouched === 'resize') {
            this._moveResize(event, editor);
        } else if (this.handleTypeTouched === "stretch") {

            if (this._handleID === Entity.HANDLE_TOP) {
                if (this._onStretch) {
                    var amount = this._initialStretch - event.point.y;
                    this._onStretch(amount, this._handleID, editor);
                }
            } else if (this._handleID === Entity.HANDLE_RIGHT) {
                if (this._onStretch) {
                    var amount = event.point.x - this._initialStretch;
                    this._onStretch(amount, this._handleID, editor);
                }
            } else if (this._handleID === Entity.HANDLE_LEFT) {
                if (this._onStretch) {
                    var amount = this._initialStretch - event.point.x;
                    this._onStretch(amount, this._handleID, editor);
                }
            } else if (this._handleID === Entity.HANDLE_BOTTOM) {
                if (this._onStretch) {
                    var amount = event.point.y - this._initialStretch;
                    this._onStretch(amount, this._handleID, editor);
                }
            }
        }

    };

    Entity.prototype._moveResize = function (event, editor) {
        var gp = this.getGlobalPosition();

        // find the center
        var o = this;
        gp.x += -o.anchor.x * o._width * o.scale.x + o._width / 2 * o.scale.x;
        gp.y += -o.anchor.y * o._height * o.scale.y + o._height / 2 * o.scale.y;

        // 20 is the padding
        var distance = Math.getDistance(event.point, gp) - 20;

        var scale = distance / this.initialSize;

        this.scale.set(scale, scale);
        this.updateFrame();
    };

    Entity.prototype._moveRotate = function (event, editor) {
        var gp = this.getGlobalPosition();

        var rotation = this.sumAllAngles();

        var r = Math.getAngle(event.point, gp) + Math.degreesToRadians(90) - rotation + this.rotation;



        r = this.snapTo(r, this._snapAngles, Math.degreesToRadians(5));

        this.rotation = r;
        this.updateFrame();
    };

    Entity.prototype.onHandleUp = function (event, editor) {

        if (this.handleTypeTouched === 'resize') {
            this._upResize(event, editor);
        } else if (this.handleTypeTouched === 'rotate') {
            this._upRotate(event, editor);
        }

    };

    Entity.prototype._upRotate = function (event, editor) {

        var nR = this.rotation;
        this.rotation = this.originalRotation;
        var command = new CommandProperty(this, 'rotation', nR, function () {
            this.updateFrame();
        }, this);
        editor.commands.add(command);
    };

    Entity.prototype._upResize = function (event, editor) {
        this.initialSize = null;

        var x = this.scale.x;
        var y = this.scale.y;

        this.scale.set(this.originalScale.x, this.originalScale.y);

        var command = new CommandScale(this, x, y);
        editor.commands.add(command);
    };

    Entity.prototype.snapTo = function (value, values, tolerance) {

        var angle = value;

        angle = value % 6.283185307179586;
        
        if(angle < 0 ){
            angle += 6.283185307179586;
        }

        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            if (angle < (v + tolerance) && angle > (v - tolerance)) {
                return v;
            }
        }

        return angle;
    };

    Entity.prototype.basicExport = function (o) {

        o = o || {};

        o.position = {
            x: Math.roundDecimal(this.position.x, 2),
            y: Math.roundDecimal(this.position.y, 2)
        };

        o.anchor = {
            x: Math.roundDecimal(this.anchor.x, 2),
            y: Math.roundDecimal(this.anchor.y, 2)
        };

        o.scale = {
            x: Math.roundDecimal(this.scale.x, 2),
            y: Math.roundDecimal(this.scale.y, 2)
        };

        o.rotation = Math.roundDecimal(this.rotation, 2);
        o.alpha = Math.roundDecimal(this.alpha, 2);
        o.tag = this.tag;
        o.zIndex = this.zIndex;
        o.children = [];
        o.type = this.type;
        o.id = this.id;
        o.className = this.className;
        o.visible = this.visible;
        o.tint = this.tint;
        o.name = this.name;
        o.isFlipped = this.isFlipped;
        o.isXOut = this.isXOut;

        if (!this.canSelect) {
            o.canSelect = false;
        }

        if (this.properties) {
            o.properties = this.properties;
        }

        if (this.constraintX) {
            o.constraintX = this.constraintX.value;
        }

        if (this.constraintY) {
            o.constraintY = this.constraintY.value;
        }

        for (var i = 0; i < this.children.length; i++) {
            var c = this.children[i];
            if (c.export && c.canExport) {
                o.children.push(c.export());
            }
        }

        return o;

    };

    Entity.prototype.setTexture = function (imageName) {

        if (imageName) {

            var o = this;

            if (this.foreground) {
                o = this.foreground;
            }

            o.imageName = imageName;

            if (this.isFlipped) {
                var t = this.createFlippedTexture(imageName);
                o.texture = t;
            } else {
                Sprite.prototype.setTexture.call(o, imageName);
            }

        }

    };

    Entity.prototype.createFlippedTexture = function (imageName) {

        if (PIXI.utils.TextureCache[imageName + '_systemFlippedImage_']) {
            return PIXI.utils.TextureCache[imageName + '_systemFlippedImage_'];
        }

        var s = new Sprite(imageName);
        var tx = s.texture;
        s.scale.x = -1;
        s.x = s.width;

        var renderTexture = PIXI.RenderTexture.create(tx.width, tx.height);
        app.pixi.renderer.render(s, renderTexture);

        var c = app.pixi.renderer.plugins.extract.canvas(renderTexture);

        var t = PIXI.Texture.fromCanvas(c);

        renderTexture.destroy(true);
        s.destroy();

        PIXI.utils.TextureCache[imageName + '_systemFlippedImage_'] = t;

        return t;
    };

    Entity.prototype.setBasicData = function (data) {

        this.position.set(data.position.x, data.position.y);
        this.anchor.set(data.anchor.x, data.anchor.y);
        this.scale.set(data.scale.x, data.scale.y);
        this.tag = data.tag;
        this.zIndex = data.zIndex;
        this.rotation = data.rotation;
        this.alpha = data.alpha;
        this.type = data.type;
        this.className = data.className || '';
        this.tint = parseInt(data.tint) || 0xffffff;
        this.visible = data.visible;
        this.name = data.name;
        this.canSelect = (data.canSelect === undefined) ? true : data.canSelect;
        this.isFlipped = (data.isFlipped === undefined) ? false : data.isFlipped;
        this.isXOut = (data.isXOut === undefined) ? false : data.isXOut;

        this.initial_point.copy(this.position);

        if (data.properties) {

            for (var key in data.properties) {
                if (data.properties.hasOwnProperty(key)) {
                    if (Number.isNaN(data.properties[key])) {
                        this.properties[key] = 0;
                    } else {
                        this.properties[key] = data.properties[key];
                    }

                }
            }

        }

        if (data.constraintX) {
            this.constraintX = new Constraint(this, 'x', data.constraintX);
        }

        if (data.constraintY) {
            this.constraintY = new Constraint(this, 'y', data.constraintY);
        }

        if (!data.id.startsWith('_change_it_before_use-') && data.id) {
            this.id = data.id.trim().toUpperCase();
        }

        this._data = data;

    };

    Entity.prototype._exportStyle = function () {

        var style = {};

        if (this.label) {
            style = {
                fill: this.label.style.fill,
                fontFamily: this.label.style.fontFamily,
                fontSize: this.label.style.fontSize,
                align: this.label.style.align,
                stroke: this.label.style.stroke,
                strokeThickness: this.label.style.strokeThickness,
                dropShadow: this.label.style.dropShadow,
                dropShadowDistance: this.label.style.dropShadowDistance,
                dropShadowAngle: this.label.style.dropShadowAngle,
                dropShadowColor: this.label.style.dropShadowColor,
                wordWrap: this.label.style.wordWrap,
                wordWrapWidth: this.label.style.wordWrapWidth,
                letterSpacing: this.label.style.letterSpacing,
                lineHeight: this.label.style.lineHeight,
                padding: this.label.style.padding
            };
        }

        return style;

    };

    Entity.prototype.onUpdate = function (dt) {
        this._resolvePropBind(dt);
    };

    Entity.prototype._propBindCalls = []; // shared object

    Entity.prototype._resolvePropBind = function () {
        if (this._propBindCalls.length > 0 && this.isSelected) {
            var editor = this._propBindCalls.pop();
            if (this._propBindCalls.length === 0) {
                this.bindProperties(editor);
            }
        }
    };

    Entity.prototype.bindCommonProperties = function (editor) {

    };

    Entity.prototype._delayedPropertiesBind = function (editor) {

        this._propBindCalls.push(editor);

    };

    Entity.prototype.bindProperties = function (editor) {


        var html = '';

        if (editorConfig.features.customProperties) {
            var method = '_changeCustomProperty';

            if (!this.properties) {
                this.properties = {};
            }

            if (!this.properties._custom) {
                this.properties._custom = [];
            }

            html += HtmlElements.createSection('Properties').html;

            for (var i = 0; i < this.properties._custom.length; i++) {
                var prop = this.properties._custom[i];
                var opt0 = {displayName: prop.key + ' ', name: prop.key, value: prop.value, method: method, class: 'big', buttonClass: 'btn-danger fa fa-trash', buttonAction: 'onCustomPropertyDelete'};
                html += HtmlElements.createInput(opt0).html;
            }

            var buttonOpt = {
                name: 'add-property',
                displayName: 'Add Property',
                class: 'btn-info big',
                icon: '',
                tooltip: '',
                method: 'addCustomProperty',
                style: ''
            };

            html += HtmlElements.createButton(buttonOpt).html;

            editor.htmlInterface.propertiesContent.innerHTML = html;
        }

        return html;

    };

    Entity.prototype.onCustomPropertyDelete = function (editor, property) {

        for (var i = 0; i < this.properties._custom.length; i++) {
            var prop = this.properties._custom[i];
            if (prop.key === property) {
                this.properties._custom.removeElement(prop);
                this.bindProperties(editor);
                break;
            }
        }

    };

    Entity.prototype.changeCustomProperty = function (editor, property, value, element, inputType, feedbackID) {

        for (var i = 0; i < this.properties._custom.length; i++) {
            var prop = this.properties._custom[i];
            if (prop.key === property) {

                prop.value = value;

                break;
            }
        }

    };

    Entity.prototype._onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {
        // it will be overwritten
        if (this.onPropertyChange) {
            this.onPropertyChange(editor, property, value, element, inputType, feedbackID);
        }

        if (this.constraintX || this.constraintY) {
            editor.constraints.applyValues();
        }

    };

    Entity.prototype.export = function () {
        throw "This object needs to write an Export method";
    };

    Entity.prototype.build = function () {
        throw "This object needs to write a build method";
    };

    Entity.prototype.setOutline = function (hasOutline, thickness, color) {

        if (hasOutline) {
            var filter = new PIXI.filters.OutlineFilter(thickness || 8, color || 0xFF0000, 0.5);
            this.filters = [filter];
            filter.padding = 20;
            this.cacheAsBitmap = true;
        } else {
            this.filters = [];
            this.cacheAsBitmap = false;
        }

    };

    Entity.prototype.setGlow = function (should_glow) {

        if (should_glow) {

            var glow = new PIXI.filters.GlowFilter(15, 5, 2, 0x19a852, 0.2);
            glow.padding = 20;
            var filters = [glow];
            this.filters = filters;

            // this.cacheAsBitmap = true;

        } else {
            // this.cacheAsBitmap = false;
            this.filters = [];
        }

    };

    Entity.prototype.onImportFinished = function () {

        if (this.isXOut) {
            var x = new XOut(this);
            this.addChild(x);
            this._xOutElement = x;
        }


    };

    Entity.prototype._updateAnchor = function () {

    };

    Entity.prototype._setImage = function (name) {
        console.warn('Implement _setImage for this object to set - ' + name);
    };

    window.Entity = Entity;

}(window));