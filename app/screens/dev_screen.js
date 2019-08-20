(function (window, undefined) {

    function DevScreen() {
        this.initialize();
    }

    DevScreen.prototype = new HScreen();
    DevScreen.prototype.screenInitialize = DevScreen.prototype.initialize;

    DevScreen.prototype.initialize = function () {
        this.screenInitialize();



        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                
                var w = 200;
                var h = 130;
                var ss = 20;

                var s = new Sprite('white');
                s.centered();
                s.width = w + 20;
                s.height = h + 20;
                s.tint = 0xffffff;
                s.position.set( w/2 + j * app.width / 10, h/2 + i * app.height / 10);
                s.x += Math.randomInt(-ss,ss);
                s.y += Math.randomInt(-ss,ss);
                s.rotation = Math.degreesToRadians(Math.randomInt(-30, 30));
                this.addChild(s);
                
                var s2 = new Sprite('white');
                s2.centered();
                s2.width = w;
                s2.height = h;
                s2.tint = 0x4287f5;
                s2.position.copy(s);
                s2.rotation = s.rotation;
                this.addChild(s2);

            }
        }

//        this.content = new Layer();
//        this.addChild(this.content);        
//        this.importer = new Importer(this);
//        this.importer.importObjects(ContentManager.jsons.main_screen.objects, this.content);

    };

    DevScreen.prototype.onUpdate = function (dt) {

    };

    DevScreen.prototype.onShow = function () {


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