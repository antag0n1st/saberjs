(function (window, undefined) {

    function PerspectiveScreen() {
        this.initialize();
    }

    PerspectiveScreen.prototype = new HScreen();
    PerspectiveScreen.prototype.screenInitialize = PerspectiveScreen.prototype.initialize;


    PerspectiveScreen.prototype.initialize = function () {
        this.screenInitialize();
        this.TYPE = PerspectiveScreen.TYPE;

        this.sky = new Sprite('sky');
        this.sky.stretch(app.width, app.height);
        this.addChild(this.sky);

        this.l1 = new PIXI.Container();
        this.l2 = new PIXI.Container();
        this.l3 = new PIXI.Container();

        // reverse them
        this.addChild(this.l3);
        this.addChild(this.l2);
        this.addChild(this.l1);


        for (var i = 0; i < 5; i++) {
            var m = this.makeMountain(i * 800, 0);
            this.l1.addChild(m);
        }

        for (var i = 0; i < 5; i++) {
            var m = this.makeMountain(i * 800, 0);
            this.l2.addChild(m);
        }

        for (var i = 0; i < 5; i++) {
            var m = this.makeMountain(i * 800, 0);
            this.l3.addChild(m);
        }

        this.l1.position.set(0, app.height - 480);
        this.l2.position.set(0, app.height - 600);
        this.l3.position.set(0, app.height - 720);

        f1 = new PIXI.filters.ColorMatrixFilter();

        this.l1.filters = [f1];

        sprite = new Sprite('cart');
        sprite.filters = [f1];
        sprite.centered();
        sprite.position.set(app.width / 2, app.height / 2);
        this.addChild(sprite);

//        this.setTint(0x7aa7ef,this.l1);
//        this.setTint(0x90b1e5,this.l2);
//        this.setTint(0xb5c7e2,this.l3);



    };

    PerspectiveScreen.prototype.setTint = function (tint, layer) {
        for (var i = 0; i < layer.children.length; i++) {
            var c = layer.children[i];
            c.tint = tint;
        }

    };

    PerspectiveScreen.prototype.makeMountain = function (x, y) {
        var m = new Sprite('mountin_' + Math.randomInt(1, 2));
        m.position.set(x, y);
        return m;

    };

    var count = 0;

    PerspectiveScreen.prototype.onUpdate = function (dt) {
        HScreen.prototype.update.call(this);
//        var bright = 1 + Math.sin(count);
//        f1.brightness(bright, false);
//
//        count += 0.01;
    };

    PerspectiveScreen.prototype.onShow = function () {
        HScreen.prototype.onShow.call(this);

    };

    PerspectiveScreen.prototype.onHide = function () {
        HScreen.prototype.onHide.call(this);

    };

    PerspectiveScreen.prototype.onMouseDown = function (event, sender) {

    };

    PerspectiveScreen.prototype.onMouseMove = function (event, sender) {

    };

    PerspectiveScreen.prototype.onMouseUp = function (event, sender) {

    };

    PerspectiveScreen.prototype.onMouseCancel = function (event, sender) {

    };

    PerspectiveScreen.prototype.onRightMouseDown = function (event, sender) {

    };

    PerspectiveScreen.prototype.onRightMouseMove = function (event, sender) {

    };

    PerspectiveScreen.prototype.onRightMouseUp = function (event, sender) {

    };

    PerspectiveScreen.prototype.onNote = function (name, data, sender) {

    };

    PerspectiveScreen.prototype.onResize = function () {

    };

    PerspectiveScreen.prototype.destroy = function () {

    };

    window.PerspectiveScreen = PerspectiveScreen; // make it available in the main scope

}(window));