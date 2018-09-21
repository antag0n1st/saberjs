(function (window, undefined) {

    function PlaneScreen() {
        this.initialize();
    }

    PlaneScreen.prototype = new HScreen();
    PlaneScreen.prototype.screenInitialize = PlaneScreen.prototype.initialize;

    PlaneScreen.prototype.initialize = function () {
        this.screenInitialize();

        var points = [];

        for (var i = 0; i < 10; i++) {

            var w = Images.water.texture.width / 12;

            points.push(new OV(w + 10 + w * i, Images.water.texture.height/2));
        }

        this.plane = new Plane(Images.water.texture, points,12,2);

        this.plane.position.set(500, 300);
        this.addChild(this.plane);

        this.addTouchable(this);


        this.sensors = [];
        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.createHandles(this.plane);
       // this.renderHandles();

        this.selectedHandle = null;

        


    };

    PlaneScreen.prototype.renderHandles = function () {

        this.graphics.clear();

        this.graphics.lineStyle(2, 0x000000, 1);
        this.graphics.beginFill(0xffffff, 0.5);

        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];
            this.graphics.drawCircle(s.pos.x, s.pos.y, s.r);
        }

        this.graphics.endFill();
    };


    PlaneScreen.prototype.createHandles = function (plane) {

        var gp = plane.getGlobalPosition();

        for (var i = 0; i < plane.points.length; i++) {
            var p = plane.points[i];
            var np = new V().copy(p).add(gp);
            var circle = new SAT.Circle(np, 20);
            circle.index = i;
            this.sensors.push(circle);
        }


    };

    var count = 0;

    PlaneScreen.prototype.onUpdate = function (dt) {


        count += 0.003*dt;

        var points = this.plane.originalPoints;

        var w = Images.water.texture.width / 12;
        
        var ax = 5;
        var ay = 10;

        // make the snake
        for (var i = 0; i < points.length; i++) {
            points[i].y = Math.sin((i * 0.5) + count) * ay + Images.water.texture.height/2;
            points[i].x = i * w  + Math.cos((i * 0.3) + count) * ax + 70;
        }


    };

    PlaneScreen.prototype.onShow = function () {

    };

    PlaneScreen.prototype.onHide = function () {

    };

    PlaneScreen.prototype.onNote = function (name, data, sender) {

    };

    PlaneScreen.prototype.onResize = function () {

    };

    PlaneScreen.prototype.onMouseDown = function (event, element) {
        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];
            if (SAT.pointInCircle(event.point, s)) {
                this.selectedHandle = s;
                break;
            }
        }
    };

    PlaneScreen.prototype.onMouseMove = function (event, element) {
        if (this.selectedHandle) {
            this.moveHandleTo(event.point);
        }
    };

    PlaneScreen.prototype.onMouseUp = function (event, element) {

    };

    PlaneScreen.prototype.onMouseCancel = function (element) {

    };

    PlaneScreen.prototype.onRightMouseDown = function (event) {

    };

    PlaneScreen.prototype.moveHandleTo = function (point) {
        if (this.selectedHandle) {
            this.selectedHandle.pos.x = point.x;
            this.selectedHandle.pos.y = point.y;

            var gp = this.plane.getGlobalPosition();
            var x = point.x - gp.x;
            var y = point.y - gp.y;

            this.plane.points[this.selectedHandle.index].set(x, y);
        }
        this.renderHandles();
    };

    PlaneScreen.prototype.onDestroy = function () {

    };

    window.PlaneScreen = PlaneScreen; // make it available in the main scope

}(window));