(function (window, undefined) {

    function Path() {
        this.initialize();
    }

    Path.prototype = Object.create(PIXI.Container.prototype);
    Path.prototype.screenInitialize = Path;


    Path.prototype.initialize = function () {
        PIXI.Container.call(this);

        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.selectedHandle = null;
        this.lastPoint = null; // last added point

        this.points = [];
        this.curves = [];
        this.sensors = [];

        this.curve = new BEZIER.PolyBezier();

        this.render();

        this.isAlt = false;
        this.isCtrl = false;
        
//        this.callback = function(){};
//        this.context = this;


    };

    Path.prototype.get = function (t) {

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

    Path.prototype.animate = function (time,callback,context) {
        
        time = time || 2000;

        new Stepper(function (step, data, dt) {
            var p = path.get(step);

            this.render();
            
            this.graphics.clear();


            this.graphics.lineStyle(2, 0x000000, 1);
            this.graphics.beginFill(0xffffff, 0.5);

            this.graphics.drawCircle(p.x, p.y, 10);

            this.graphics.endFill();

        }, time, null, null, function(){
            if(callback){
                callback.call(context,this);
            }
        }, this).run();

    };

    Path.prototype.addPoint = function (point) {

        point.basePoint = null;
        point.handles = [];
        point.curves = [];
        point.callback = this.onHandleMove;
        point.context = this;
        point.sensor = this.createSensor(point, true);

        if (this.lastPoint) {

            var a2 = new OV(this.lastPoint.x, this.lastPoint.y);
            var a3 = new OV(point.x, point.y);
            var curve = new BEZIER.Bezier(this.lastPoint, a2, a3, point);
            this.curves.push(curve);

            a2.sensor = this.createSensor(a2, false);
            a3.sensor = this.createSensor(a3, false);

            a2.basePoint = this.lastPoint;
            a3.basePoint = point;
            
            a2.curves = [];
            a3.curves = [];

            point.curves.push(curve);
            this.lastPoint.curves.push(curve);
            a2.curves.push(curve);
            a3.curves.push(curve);

            a2.handles = [];
            a3.handles = [];

            this.lastPoint.handles.push(a2);
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

        this.render();

    };

    Path.prototype.createSensor = function (point, enabled) {

        point.callback = this.onHandleMove;
        point.context = this;
        point.index = this.sensors.length;

        var circle = new SAT.Circle(point, 20);
        circle.pos.enabled = enabled;
        this.sensors.push(circle);

        return circle;
    };

    Path.prototype.render = function () {
        this.graphics.clear();


        for (var i = 0; i < this.curves.length; i++) {
            var curve = this.curves[i];
            this.renderPath(curve, this.graphics);
        }

        this.renderHandles(this.graphics);
    };


    Path.prototype.renderPath = function (bezier, graphics) {

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

        // let render the handles now

        graphics.lineStyle(1, 0x42f4f1, 1);
        var points = bezier.points;
        graphics.moveTo(points[0].x, points[0].y);
        graphics.lineTo(points[1].x, points[1].y);

        graphics.moveTo(points[2].x, points[2].y);
        graphics.lineTo(points[3].x, points[3].y);


        graphics.endFill();

    };

    Path.prototype.renderHandles = function (graphics) {

        //  this.graphics.clear();

        graphics.lineStyle(2, 0x000000, 1);
        graphics.beginFill(0xffffff, 0.5);

        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];
            graphics.drawCircle(s.pos.x, s.pos.y, s.r);
        }

        graphics.endFill();
    };

    Path.prototype.moveHandleTo = function (point) {
        if (this.selectedHandle) {
            this.selectedHandle.pos.x = point.x;
            this.selectedHandle.pos.y = point.y;
        }
        this.render();
    };

    Path.prototype.onMouseDown = function (event, sender) {
        this.selectedHandle = null;



        var point = V.substruction(event.point, this.getGlobalPosition());
        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];

            if (this.isAlt && !this.isCtrl) {

                if (s.pos.basePoint && SAT.pointInCircle(point, s)) {

                    s.pos.set(s.pos.basePoint.x, s.pos.basePoint.y);
                    s.pos.enabled = false;
                    this.render();
                    break;
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
    };

    Path.prototype.onMouseMove = function (event, element) {
        if (this.selectedHandle) {
            var point = V.substruction(event.point, this.getGlobalPosition());
            this.moveHandleTo(point);
        }
    };

    Path.prototype.onHandleMove = function (point) {

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

    Path.prototype.update = function () {

    };

    window.Path = Path; // make it available in the main scope

}(window));