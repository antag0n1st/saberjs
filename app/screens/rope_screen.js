(function (window, undefined) {

    function RopeScreen() {
        this.initialize();
    }

    RopeScreen.prototype = new HScreen();
    RopeScreen.prototype.screenInitialize = RopeScreen.prototype.initialize;

    RopeScreen.prototype.initialize = function () {
        this.screenInitialize();
        
        var guiBtn = new Button('Animate', Style.DEFAULT_BUTTON);
        guiBtn.onMouseUp = this.onAnimate.bind(this);
        guiBtn.position.set(120, 60);
        this.addChild(guiBtn);
        this.addTouchable(guiBtn);


//        this.path = null;
//
//        this.points = [];
//        var total = 300;
//        var sn = 20;
//        var w = total / sn;
//        for (var i = 0; i < sn; i++) {
//            this.points.push(new PIXI.Point(i * w));
//        }
//
//        this.rope = new PIXI.mesh.Rope(Images.cart.texture, this.points);
//        this.rope.position.set(100, 300);
//        this.addChild(this.rope);

        // curve = new Bezier(.17,.67,.7,1.14);

//        curve = new BEZIER.Bezier(new V(),new V(200,100),new V(400,400),new V(300,150));
//        
//       
//        this.renderPath(curve,this.graphics);


        //  this.createPoints();

        //  poly = new BEZIER.PolyBezier(this.curves);

        this.addTouchable(this);
        //  this.render();

        this.paths = [];

        path = new Path();
        path.addPoint(new OV(100, 100));
        path.addPoint(new OV(300, 500));
        path.addPoint(new OV(500, 500));

        path.addPoint(new OV(800, 400));

        path.position.set(200, 200);
        this.addChild(path);

        this.paths.push(path);

        this.kibo = new Kibo();

        var that = this;
        this.kibo.down('alt', function () {
            for (var i = 0; i < that.paths.length; i++) {
                var path = that.paths[i];
                path.isAlt = true;
            }
        });
        this.kibo.up('alt', function () {
            for (var i = 0; i < that.paths.length; i++) {
                var path = that.paths[i];
                path.isAlt = false;
            }
        });

        this.kibo.down('ctrl', function () {
            for (var i = 0; i < that.paths.length; i++) {
                var path = that.paths[i];
                path.isCtrl = true;
            }
        });
        this.kibo.up('ctrl', function () {           
            for (var i = 0; i < that.paths.length; i++) {
                var path = that.paths[i];
                path.isCtrl = false;
            }
        });

    };

    RopeScreen.prototype.onAnimate = function () {
       path.animate(1200,function(path){
           path.render();
       },this);
    };


    RopeScreen.prototype.onMouseDown = function (event, sender) {
        for (var i = 0; i < this.paths.length; i++) {
            var path = this.paths[i];
            path.onMouseDown(event, sender);
        }
    };

    RopeScreen.prototype.onMouseMove = function (event, sender) {
        for (var i = 0; i < this.paths.length; i++) {
            var path = this.paths[i];
            path.onMouseMove(event, sender);
        }
    };

    RopeScreen.prototype.onMouseUp = function (event, sender) {
        for (var i = 0; i < this.paths.length; i++) {
            var path = this.paths[i];
            path.onMouseUp(event, sender);
        }
    };

    RopeScreen.prototype.onMouseCancel = function (event, sender) {

    };


    RopeScreen.prototype.createPoints = function () {

//        var a1 = new OV(38, 238);
//        var a2 = new OV(436, 172);
//        var a3 = new OV(407, 546);
//        var a4 = new OV(545, 670);
//
//        curve1 = new BEZIER.Bezier(a1, a2, a3, a4);
//
//        var b2 = new OV(770, 876);
//        var b3 = new OV(1568, 633);
//        var b4 = new OV(1522, 126);
//
//        var curve2 = new BEZIER.Bezier(a4, b2, b3, b4);
//
//        var points = [
//            a1, a2, a3, a4, b2, b3, b4
//        ];
//
//        this.curves = [
//            curve1, curve2
//        ];
//
//        // connect the dots
//
//        a2.basePoint = a1;
//        a2.curve = curve1;
//        a3.basePoint = a4;
//        a3.curve = curve1;
//
//        b2.basePoint = a4;
//        b2.curve = curve2;
//        b3.basePoint = b4;
//        b3.curve = curve2;
//
//        a1.handles = [a2];
//        a4.handles = [a3, b2];
//        b4.handles = [b3];
//
//
//        for (var i = 0; i < points.length; i++) {
//            var p = points[i];
//            p.callback = this.onHandleMove;
//            p.context = this;
//            p.index = i;
//
//            var circle = new SAT.Circle(p, 20);
//            this.sensors.push(circle);
//        }


    };


    window.RopeScreen = RopeScreen; // make it available in the main scope

}(window));