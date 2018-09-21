(function (window, undefined) {

    function DevScreen() {
        this.initialize();
    }

    DevScreen.prototype = new HScreen();
    DevScreen.prototype.screenInitialize = DevScreen.prototype.initialize;

    DevScreen.prototype.initialize = function () {
        this.screenInitialize();



//        this.content = new Layer();
//        this.addChild(this.content);        
//        this.importer = new Importer(this);
//        this.importer.importObjects(ContentManager.jsons.main_screen.objects, this.content);

    };

    DevScreen.prototype.onUpdate = function (dt) {

    };

    DevScreen.prototype.onShow = function () {
        var s = new Sprite('white');
        s.width = 200;
        s.height = 200;
        s.position.set(500, 500);

        this.addChild(s);

        new TweenGeneric(s, {x: 1000, y: 100, alpha: 0.5}, null, 300).run();
    };

    DevScreen.prototype.onHide = function () {

    };

    DevScreen.prototype.onMouseDown = function (event, element) {

    };

    DevScreen.prototype.onMouseMove = function (event, element) {

    };

    DevScreen.prototype.onMouseUp = function (event, element) {

    };

    DevScreen.prototype.onMouseCancel = function (element) {

    };

    DevScreen.prototype.onRightMouseDown = function (event) {

    };

    DevScreen.prototype.onRightMouseMove = function (event) {

    };

    DevScreen.prototype.onRightMouseUp = function (event) {

    };

    DevScreen.prototype.onNote = function (name, data, sender) {

    };

    DevScreen.prototype.onResize = function () {

    };

    DevScreen.prototype.destroy = function () {

    };

    window.DevScreen = DevScreen; // make it available in the main scope

}(window));