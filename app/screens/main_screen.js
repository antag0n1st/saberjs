(function (window, undefined) {

    function MainScreen() {
        this.initialize();
    }

    MainScreen.prototype = new HScreen();
    MainScreen.prototype.screen_initialize = MainScreen.prototype.initialize;


    MainScreen.prototype.initialize = function () {

        this.screen_initialize();

        this.setBackgroundColor('#d8a60f');

        ////////////////////

        this.content = new Layer();
        this.addChild(this.content);
        this.importer = new Importer(this);
        this.importer.importObjects(ContentManager.jsons.example.objects, this.content);

//        const beatifulRect = new PIXI.Graphics();
//
//       // beatifulRect.lineTextureStyle(20, sprite.texture);
//        beatifulRect.beginFill(0xFF0000);
//        beatifulRect.drawRect(80, 350, 150, 150);
//        beatifulRect.endFill();
//
//        this.addChild(beatifulRect);


//        var semicircle = new PIXI.Graphics();
//
//        semicircle.position = {x: app.width / 2, y: 500};
//
//        this.addChild(semicircle);
//
//        new Stepper(function (percent) {
//            semicircle.clear();
//            semicircle.lineStyle(200, 0xffffff);
//            semicircle.arc(0, 0, 100, 0, 2 * Math.PI * percent); // cx, cy, radius, startAngle, endAngle
//        }, 2000).run();

    };
    
    // Keyboard delegates

    MainScreen.prototype.onKeyboardStream = function (stream, prevStream, inputField) {

    };

    MainScreen.prototype.onKeyboardDone = function () {

    };

    MainScreen.prototype.onKeyboardActivated = function () {

    };

    MainScreen.prototype.onKeyboardDismissed = function () {

    };

    MainScreen.prototype.onKeyboardInputFocus = function (inputField) {

    };

    MainScreen.prototype.onKeyboardInputBlur = function (inputField) {

    };

    /**
     * The desc
     * @param Number someData 
     */
    MainScreen.prototype.onShow = function (someData) {
        // Toast.error("Hi there This is my message to you");
    };

    MainScreen.prototype.onHide = function () {

    };

    MainScreen.prototype.onAfterHide = function () {

    };

    MainScreen.prototype.onBeforeShow = function () {

    };

    MainScreen.prototype.onNote = function (eventName, data, sender) {

    };

    MainScreen.prototype.onResize = function () {

    };


    window.MainScreen = MainScreen; // make it available in the main scope

}(window));