(function (window, undefined) {

    function PathObject() {
        this.initialize();
    }

    PathObject.prototype = new Entity();
    PathObject.prototype.entityInitialize = PathObject.prototype.initialize;

    PathObject.prototype.initialize = function () {
        this.entityInitialize(null);

        this.canExportChildren = false;

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
                let p = data.points[i];
                let point = this.addPoint(p.x, p.y, this.lastPoint);
                if (p.properties) {
                    point.properties = p.properties;
                    if (p.id !== undefined) {
                        point.id = p.id;
                    }
                    point.className = p.className;
                }
            }

            for (var i = 0; i < this.points.length; i++) {
                let point = this.points[i];
                let p = data.points[i];
                // adjust handles here
                for (var j = 0; j < p.handles.length; j++) {
                    let h = p.handles[j];
                    let handle = point.handles[j];
                    handle.visible = h.isVisible;
                    handle.isTouchable = h.isVisible;

                    handle._x = h.x;
                    handle._y = h.y;

                    handle.transform.position.x = h.x;
                    handle.transform.position._y = h.y;

                    if (h.id !== undefined) {
                        handle.id = h.id;
                    }

                    if (h.properties) {
                        handle.properties = h.properties;
                    }

                    handle.className = h.className;
                }
            }

            this.position.set(data.position.x, data.position.y);

            if (data.id !== undefined) {
                this.id = data.id;
            }

            this.className = data.className;
            this.visible = (data.visible !== undefined) ? data.visible : true;
        }

        this.enableSensor();
        this.renderMe();
    };

    PathObject.prototype.export = function () {
        var o = this.basicExport();
        o.points = [];

        console.warn("TODO also save the IDs , and other properties that a point might have");

        for (var i = 0; i < this.points.length; i++) {
            var p = this.points[i];
            let ex = p.export();


            var point = {
                x: p.x,
                y: p.y,
                handles: [],
                id: ex.id,
                className: ex.className,
                properties: ex.properties
            };

            o.points.push(point);

            for (var j = 0; j < p.handles.length; j++) {
                var h = p.handles[j];
                let ex = h.export();
                point.handles.push({
                    x: h.x,
                    y: h.y,
                    isVisible: h.visible,
                    id: ex.id,
                    className: ex.className,
                    properties: ex.properties
                });
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
        graphics.lineStyle(2, 0x1c19e8, 1);


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

    PathObject.prototype.onMouseDown = function (event, sender) {

        this.selectedHandle = null;

        if (this.isCtrl) {

            for (var i = 0; i < this.points.length; i++) {
                var point = this.points[i];
                if (point._check(event.point)) {
                    // lets create a point here

                    for (var j = 0; j < point.handles.length; j++) {
                        var handle = point.handles[j];
                        if (!handle.visible) {
                            handle.visible = true;
                            handle.isTouchable = true;
                            this.selectedHandle = handle;

                            app.screen.deselectAllObjects();
                            app.screen.addObjectToSelection(handle);

                            event.stopPropagation();
                            return false;
                        }
                    }
                } else {
                    for (var j = 0; j < point.handles.length; j++) {
                        var handle = point.handles[j];
                        if (handle._check(event.point)) {
                            // prevent this from going on
                            this.selectedHandle = handle;
                            return;
                        }
                    }
                }



            }

            if (this.insertPoint(event.point)) {
                return;
            }
        }

        if (this.isAlt) {
            for (var i = 0; i < this.points.length; i++) {
                var point = this.points[i];

                if (point._check(event.point)) {
                    this.removePoint(point);
                    break;
                }

                if (point.handles) {
                    for (var j = 0; j < point.handles.length; j++) {
                        var handle = point.handles[j];
                        if (handle._check(event.point)) {
                            var bp = handle.basePoint;
                            handle._x = bp.x;
                            handle._y = bp.y;

                            handle.transform.position.x = bp.x;
                            handle.transform.position.y = bp.y;

                            handle.isTouchable = false;
                            handle.visible = false;

                            this.renderMe();
                            break;

                        }
                    }
                }

            }
        }
    };

    PathObject.prototype.insertPoint = function (point) {
        const p = this.toLocal(point);
        let smallestDistance = Number.MAX_SAFE_INTEGER;
        let line = null;
        let index = null;

        for (var i = 0; i < this.curves.length; i++) {
            var curve = this.curves[i];
            const distance = this.getDistanceFromLine(p, curve.a, curve.d);
            if (distance < smallestDistance) {
                smallestDistance = distance;
                line = curve;
                index = i;
            }
        }

        if (smallestDistance < 100) {

            var o = this.export();
            o.points.splice(index + 1, 0, {
                x: p.x,
                y: p.y,
                handles: [
                    {
                        x: p.x,
                        y: p.y,
                        isVisible: false
                    },
                    {
                        x: p.x,
                        y: p.y,
                        isVisible: false
                    }
                ]
            });

            var contentLayer = this.parent;
            var io = app.screen.importer.importObjects([o], contentLayer);

            this.removeFromParent();
        }

    };

    PathObject.prototype.distanceAB = function (a, b) {
        let xs = b.x - a.x;
        let ys = b.y - a.y;
        return Math.sqrt(xs * xs + ys * ys);
    };

    PathObject.prototype.getDistanceFromLine = function (p, a, b) {
        const normalPoint = this.getNormalFromLine(p, a, b);
        return this.distanceAB(p, normalPoint);
    };

    PathObject.prototype.getNormalFromLine = function (p, a, b) {
        const atob = {x: b.x - a.x, y: b.y - a.y};
        const atop = {x: p.x - a.x, y: p.y - a.y};
        const len = atob.x * atob.x + atob.y * atob.y;
        let dot = atop.x * atob.x + atop.y * atob.y;
        const t = Math.min(1, Math.max(0, dot / len));

        dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

        return {
            x: a.x + atob.x * t,
            y: a.y + atob.y * t,
        };
    };

    PathObject.prototype.onMouseMove = function (event, element) {
        if (this.selectedHandle) {

            event.stopPropagation();

            var point = this.toLocal(event.point); // V.substruction(event.point, this.getGlobalPosition());

            this.selectedHandle.x = point.x;
            this.selectedHandle.y = point.y;
            this.renderMe();
        }
    };

    PathObject.prototype.onHandleMove = function (point, dx, dy) {

        if (!point.basePoint) {
            // this is a point 
            // also move the handles in the same direction

            for (var i = 0; i < point.handles.length; i++) {
                var handle = point.handles[i];

                handle._x += dx;
                handle._y += dy;

                handle.transform.position.x += dx;
                handle.transform.position.y += dy;
            }
        } else {
            // its a handle
            if (this.isCtrl && !this.isAlt) {
                // move the other handle in oposite direction

                for (var i = 0; i < point.basePoint.handles.length; i++) {
                    var hp = point.basePoint.handles[i];
                    if (hp.index !== point.index) {

                        if (hp.isTouchable) {
                            var distance = Math.getDistance(hp, point.basePoint);
                            var angle = Math.getAngle(point, point.basePoint);
                            var np = new V();
                            np.setLength(distance);
                            np.setAngle(angle);
                            np = V.addition(point.basePoint, np);

                            hp._x = np.x;
                            hp._y = np.y;

                            hp.transform.position.x = np.x;
                            hp.transform.position.y = np.y;
                        }

                    }
                }
            }
        }

        for (var i = 0; i < point.curves.length; i++) {
            var curve = point.curves[i];
            curve.update();
        }

        this.renderMe();
    };

    PathObject.prototype.renderMeHandles = function (graphics) {

        for (var j = 0; j < this.points.length; j++) {
            var p = this.points[j];
            p.draw();

            if (p.handles) {
                for (var i = 0; i < p.handles.length; i++) {
                    var handle = p.handles[i];
                    handle.draw();
                }
            }
        }
    };

    PathObject.prototype.onUpdate = function () {

    };

    PathObject.prototype.addPoint = function (x, y, lastPoint) {

        var point = new ObservableGenericPoint(x, y, this.onHandleMove.bind(this));
        point.delegate = this;

        point.graphics = this.myGraphics;
        point.basePoint = null;
        point.handles = [];
        point.curves = [];
        point.build();
        point.sensor.pos.enabled = true;

        this.points.push(point);
        this.addChild(point);

        if (lastPoint) {

            var a2 = new ObservableGenericPoint(lastPoint.x, lastPoint.y, this.onHandleMove.bind(this));
            var a3 = new ObservableGenericPoint(point.x, point.y, this.onHandleMove.bind(this));
            var curve = new BEZIER.Bezier(lastPoint, a2, a3, point);
            this.curves.push(curve);

            a2.isTouchable = false;
            a2.visible = false;

            a3.isTouchable = false;
            a3.visible = false;

            a2.delegate = this;
            a3.delegate = this;

            a2.graphics = this.myGraphics;
            a3.graphics = this.myGraphics;

            a2.index = 0;
            a3.index = 1;

            a2.build();
            a3.build();

            a2.sensor.pos.enabled = false;
            a3.sensor.pos.enabled = false;

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

            this.addChild(a2);
            this.addChild(a3);

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

        return point;

    };

    PathObject.prototype.onPointSelected = function (point) {
        this.renderMe();
    };

    PathObject.prototype.onPointDeselected = function (point) {
        this.renderMe();
    };

    PathObject.prototype._checkPolygon = function (polygon) {

        var pos = new V().copy(this.getGlobalPosition());

        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];
            s.pos.copy(pos);

            if (SAT.testPolygonPolygon(polygon, s)) {
                return true;
            }
        }

        return false;

    };

    PathObject.prototype._checkPoint = function (point) {

        var pos = new V().copy(this.getGlobalPosition());

        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];

            s.pos.copy(pos);

            var distance = -1;

            var pt1 = new V().copy(s.pos).add(s.points[0]);
            var pt2 = new V().copy(s.pos).add(s.points[1]);

            distance = Math.getDistanceFromLine(point, pt1, pt2);

            if (distance < 20) {
                return true;
            }
        }

        return false;
    };

    PathObject.prototype.removePoint = function (pointToRemove) {

        if (this.curves.length < 2) {
            console.log("cant remove that");
            return;
        }

        var point = null;

        var o = this.export();

        for (var i = 0; i < o.points.length; i++) {
            point = o.points[i];
            if (point.x === pointToRemove.x && point.y === pointToRemove.y) {
                break;
            }
        }

        o.points.removeElement(point);

        var contentLayer = this.parent;
        var io = app.screen.importer.importObjects([o], contentLayer);

        this.removeFromParent();

    };

    window.PathObject = PathObject; // make it available in the main scope

}(window));