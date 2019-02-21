(function (window, undefined) {

    function PathObject() {
        this.initialize();
    }

    PathObject.prototype = new Entity();
    PathObject.prototype.entityInitialize = PathObject.prototype.initialize;

    PathObject.prototype.initialize = function () {
        this.entityInitialize(null);

        this.myGraphics = new PIXI.Graphics();
        this.addChild(this.myGraphics);

        this.selectedHandle = null;
        this.lastPoint = null; // last added point

        this.points = [];
        this.curves = [];
        this.sensors = [];

        this.curve = new BEZIER.PolyBezier();

        // this.renderMe();

        this.isAlt = false;
        this.isCtrl = false;

        this.type = 'PathObject';

    };

    PathObject.prototype.build = function (data) {
        this.canResize = false;
        this.hasFrame = false;


        if (data) {

            for (var i = 0; i < data.points.length; i++) {

                var point = new OV(data.points[i].x, data.points[i].y);
                this.addPoint(point, this.lastPoint);

            }

            for (var i = 0; i < data.points.length; i++) {
                var iPoint = data.points[i];
                var point = this.points[i];

                if (iPoint.handles) {
                    for (var j = 0; j < iPoint.handles.length; j++) {
                        var h = iPoint.handles[j];
                        var handle = point.handles[j];

                        if (h.x !== handle.sensor.pos.x || h.y !== handle.sensor.pos.y) {
                            handle.sensor.pos.x = h.x;
                            handle.sensor.pos.y = h.y;
                            handle.enabled = true;
                        }

                    }
                }

            }

            this.position.set(data.position.x, data.position.y);

            this.id = data.id;
            this.className = data.className;
            this.visible = data.visible;

        }
        
        

        this.enableSensor();

        this.renderMe();
    };

    PathObject.prototype.export = function () {

        var o = this.basicExport();
        o.points = [];

        for (var i = 0; i < this.points.length; i++) {
            var p = this.points[i];

            var point = {
                x: p.x,
                y: p.y,
                handles: []
            };

            o.points.push(point);

            for (var j = 0; j < p.handles.length; j++) {
                var h = p.handles[j];
                point.handles.push({x: h.x, y: h.y});
            }
        }

        return o;

    };

    PathObject.prototype.get = function (t) {

        var totalLength = this.curve.length();
        var x = Math.lerp(t, 0, totalLength);

        var xx = x;

        var c = null;

        for (var i = 0; i < this.curves.length; i++) {

            c = this.curves[i];
            var len = c.length();
            xx -= len;

            if (xx <= 0) {
                var percent = 1 - (Math.abs(xx) / len);
                return c.getEqual(percent);
            }

        }

        return c.get(1);

    };

    PathObject.prototype.animate = function (time, callback, context) {

        time = time || 2000;

        new Stepper(function (step, data, dt) {
            var p = path.get(step);

            this.renderMe();

            this.myGraphics.clear();


            this.myGraphics.lineStyle(2, 0x000000, 1);
            this.myGraphics.beginFill(0xffffff, 0.5);

            this.myGraphics.drawCircle(p.x, p.y, 10);

            this.myGraphics.endFill();

        }, time, null, null, function () {
            if (callback) {
                callback.call(context, this);
            }
        }, this).run();

    };



    PathObject.prototype.createSensor = function (point, enabled) {

        point.callback = this.onHandleMove;
        point.context = this;
        point.index = this.sensors.length;

        var circle = new SAT.Circle(point, 20);
        circle.pos.enabled = enabled;
        this.sensors.push(circle);

        return circle;
    };

    PathObject.prototype.renderMe = function () {
        this.myGraphics.clear();

        for (var i = 0; i < this.curves.length; i++) {
            var curve = this.curves[i];
            this.renderMePathObject(curve, this.myGraphics);
        }

        this.renderMeHandles(this.myGraphics);
    };


    PathObject.prototype.renderMePathObject = function (bezier, graphics) {

        graphics.beginFill(0xffffff, 0);
        graphics.lineStyle(4, 0x1c19e8, 1);


        var p = bezier.points[0];
        graphics.moveTo(p.x, p.y);
        graphics.lineTo(p.x, p.y);

        var steps = 50;

        for (var i = 1; i < steps; i++) {

            var point = bezier.get(i / steps);

            graphics.lineTo(point.x, point.y);
        }

        var p = bezier.get(1);
        graphics.lineTo(p.x, p.y);

        // let renderMe the handles now

        graphics.lineStyle(1, 0x222222, 1);
        var points = bezier.points;
        graphics.moveTo(points[0].x, points[0].y);
        graphics.lineTo(points[1].x, points[1].y);

        graphics.moveTo(points[2].x, points[2].y);
        graphics.lineTo(points[3].x, points[3].y);


        graphics.endFill();

    };



    PathObject.prototype.moveHandleTo = function (point) {
        if (this.selectedHandle) {
            this.selectedHandle.pos.x = point.x;
            this.selectedHandle.pos.y = point.y;
        }
        this.renderMe();
    };

    PathObject.prototype.onMouseDown = function (event, sender) {
               
        this.selectedHandle = null;

        var point = V.substruction(event.point, this.getGlobalPosition());
        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];

            if (this.isAlt && !this.isCtrl) {

                if (s.pos.basePoint && SAT.pointInCircle(point, s)) {

                    s.pos.set(s.pos.basePoint.x, s.pos.basePoint.y);
                    s.pos.enabled = false;
                    this.renderMe();
                } else if (SAT.pointInCircle(point, s)) {

                    this.removePoint(s);
                }

            } else if (this.isCtrl) {
                if (SAT.pointInCircle(point, s)) {
                    this.selectedHandle = s;
                    s.pos.enabled = true;
                    break;
                }
            } else {
                if (s.pos.enabled && SAT.pointInCircle(point, s)) {
                    this.selectedHandle = s;
                    break;
                }
            }
        }

        return this.selectedHandle;
    };

    PathObject.prototype.onMouseMove = function (event, element) {
        if (this.selectedHandle) {
            var point = V.substruction(event.point, this.getGlobalPosition());
            this.moveHandleTo(point);

            return true;
        }

        return false;
    };

    PathObject.prototype.onHandleMove = function (point) {

        if (point.basePoint) {

            if (!this.isCtrl && !this.isAlt) {
                for (var i = 0; i < point.basePoint.handles.length; i++) {
                    var hp = point.basePoint.handles[i];
                    if (hp.index !== point.index) {
                        var distance = Math.getDistance(hp, point.basePoint);
                        var angle = Math.getAngle(point, point.basePoint);
                        var np = new V();
                        np.setLength(distance);
                        np.setAngle(angle);
                        np = V.addition(point.basePoint, np);
                        hp._x = np.x;
                        hp._y = np.y;
                    }
                }
            }

        } else {
            for (var i = 0; i < point.handles.length; i++) {
                var handle = point.handles[i];
                if (!handle.sensor.pos.enabled) {
                    handle._x = point.x;
                    handle._y = point.y;
                }
            }
        }

        for (var i = 0; i < point.curves.length; i++) {
            var curve = point.curves[i];
            curve.update();
        }


    };

    PathObject.prototype.renderMeHandles = function (graphics) {

        graphics.lineStyle(2, 0x000000, 1);
        graphics.beginFill(0xffffff, 0.5);

        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];

            var inPoints = false;
            for (var j = 0; j < this.points.length; j++) {
                var p = this.points[j];
                if (p.x === s.pos.x && p.y === s.pos.y) {
                    inPoints = true;
                    break;
                }
            }

            var radius = 20;

            if (inPoints) {
                graphics.beginFill(0xffffff, 0.5);
            } else {
                graphics.beginFill(0xe4e81b, 0.6);
                radius = 16;
            }

            graphics.drawCircle(s.pos.x, s.pos.y, radius);

            graphics.endFill();
        }


    };

    PathObject.prototype.onUpdate = function () {
       
    };

    PathObject.prototype.addPoint = function (point, lastPoint) {

        point.basePoint = null;
        point.handles = [];
        point.curves = [];
        point.callback = this.onHandleMove;
        point.context = this;
        point.sensor = this.createSensor(point, true);

        this.points.push(point);

        if (lastPoint) {

            var a2 = new OV(lastPoint.x, lastPoint.y);
            var a3 = new OV(point.x, point.y);
            var curve = new BEZIER.Bezier(lastPoint, a2, a3, point);
            this.curves.push(curve);

            a2.sensor = this.createSensor(a2, false);
            a3.sensor = this.createSensor(a3, false);

            a2.basePoint = lastPoint;
            a3.basePoint = point;

            a2.curves = [];
            a3.curves = [];

            point.curves.push(curve);
            lastPoint.curves.push(curve);
            a2.curves.push(curve);
            a3.curves.push(curve);

            a2.handles = [];
            a3.handles = [];

            lastPoint.handles.push(a2);

            point.handles.push(a3);

            a2.callback = this.onHandleMove;
            a2.context = this;

            a3.callback = this.onHandleMove;
            a3.context = this;

            Math.bubbleSort(this.sensors, function (a, b) {
                if (a.pos.enabled && !b.pos.enabled) {
                    return true;
                }
                return false;
            });

            this.curve.addCurve(curve);

        }

        this.lastPoint = point;

        this.renderMe();

    };

    PathObject.prototype.removePoint = function (sensor) {

        if (sensor.pos.curves.length === 2) {

            var point = null;

            var o = this.export();

            for (var i = 0; i < o.points.length; i++) {
                point = o.points[i];
                if (point.x === sensor.pos.x && point.y === sensor.pos.y) {
                    break;
                }
            }


            o.points.removeElement(point);

            var contentLayer = this.parent;
            var io = app.navigator.currentScreen.importer.importObjects([o], contentLayer);

            this.removeFromParent();

        }

    };

    window.PathObject = PathObject; // make it available in the main scope

}(window));