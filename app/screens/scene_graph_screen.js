(function (window, undefined) {

    function SceneGraphScreen() {
        this.initialize();
    }

    SceneGraphScreen.prototype = new HScreen();
    SceneGraphScreen.prototype.screenInitialize = SceneGraphScreen.prototype.initialize;

    SceneGraphScreen.prototype.initialize = function () {

        this.screenInitialize();

        this.content = new Sprite();
        this.addChild(this.content);



        this.item1 = new Sprite('item1');
        this.item1.position.set(400, 300);

        this.item1.priority = 2;

        this.item1.enableSensor();


        this.item1.onMouseDown = function (event) {
            event.stopPropagation();
            log("item1");
        };


        this.content.addChild(this.item1);

        this.item2 = new Sprite('item2');
        this.item2.position.set(300, 300);

        this.item2.enableSensor();



        this.item2.priority = 2;
        this.item2.onMouseDown = function (event) {
            event.stopPropagation();
            log("item2");
        };
        this.item1.addChild(this.item2);


        this.elements = [];

        this.elements.push(this.item1);
        this.elements.push(this.item2);


        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);

        this.addTouchable(this);
        this.addTouchable(this.item1);
        this.addTouchable(this.item2);
        
        this.item1.pivot.set(50,50);
        
        
        
        /////////////////////////////////////////////////
        
         return;


        new TweenScale(this.item1, 0.8, null, 3000).delay().run();

        this.item1.rotation = Math.degreesToRadians(10);

        this.item1.pivot.set(0,0);
        this.item1.anchor.set(0.5, 0.5);

        this.item2.getSensor();

        var delay = 1000;
        
       

        timeout(function () {
            this.item2.anchor.set(1, 0);
        }, delay, this);

        timeout(function () {
            this.item2.scale.set(1.6);
        }, delay * 2, this);

        timeout(function () {
            this.item2.anchor.set(0.5, 0.5);
        }, delay * 3, this);

        timeout(function () {
            this.content.scale.set(1.6);
        }, delay * 4, this);

        timeout(function () {
            this.item2.scale.set(1);
            this.content.scale.set(1);
            this.item2.anchor.set(0.5, 0.5);
        }, delay * 5, this);

    };

    SceneGraphScreen.prototype.onUpdate = function (dt) {
        
       

       // this.item1.rotation += 0.0001 * dt;


        this.graphics.clear();

        for (var i = 0; i < this.elements.length; i++) {
            var item = this.elements[i];

            var s = item.getSensor();

            var p = s.pos;
            var points = s.points;

            this.graphics.lineWidth = 2;
            this.graphics.lineColor = 0xffffff;

            this.graphics.beginFill(0xFF3300, 0);
            this.graphics.lineStyle(4, 0xffd900, 1);

            this.graphics.drawCircle(p.x, p.y, 2);

            for (var j = 0; j < points.length; j++) {
                // var point = points[j];
                this.graphics.moveTo(p.x + points[j].x, p.y + points[j].y);

                if (j === points.length - 1) {
                    this.graphics.lineTo(p.x + points[0].x, p.y + points[0].y);
                } else {
                    this.graphics.lineTo(p.x + points[j + 1].x, p.y + points[j + 1].y);
                }


            }

            this.graphics.endFill();


        }


    };

    SceneGraphScreen.prototype.onShow = function () {

    };

    SceneGraphScreen.prototype.onHide = function () {

    };

    SceneGraphScreen.prototype.onNote = function (name, data, sender) {

    };

    SceneGraphScreen.prototype.onResize = function () {

    };

    SceneGraphScreen.prototype.onMouseDown = function (event, element) {

    };

    SceneGraphScreen.prototype.onMouseMove = function (event, element) {

    };

    SceneGraphScreen.prototype.onMouseUp = function (event, element) {
        log("screen up")
    };

    SceneGraphScreen.prototype.onMouseCancel = function (element) {

    };

    SceneGraphScreen.prototype.onRightMouseDown = function (event) {
        log("right down")
    };

    SceneGraphScreen.prototype.onRightMouseMove = function (event) {
        log("right move")
    };

    SceneGraphScreen.prototype.onRightMouseUp = function (event) {
        log("right Up")
    };

    SceneGraphScreen.prototype.onDestroy = function () {

    };

    window.SceneGraphScreen = SceneGraphScreen; // make it available in the main scope

}(window));