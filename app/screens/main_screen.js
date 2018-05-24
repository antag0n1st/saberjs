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

        var guiBtn = new Button('GUI', Style.DEFAULT_BUTTON);
        guiBtn.onMouseUp = function () {
            var screen = new GuiScreen();
            app.navigator.add(screen, 200);
            Sounds.click.play();
        };
        guiBtn.position.set(app.width / 2, 300);
        this.addChild(guiBtn);
        this.addTouchable(guiBtn);


        ////////////////

        var tweenBtn = new Button('Tweens', Style.DEFAULT_BUTTON);
        tweenBtn.onMouseUp = function () {
            var screen = new TweenScreen();
            app.navigator.add(screen, 200);
            Sounds.click.play();
        };
        tweenBtn.position.set(app.width / 2, 400);
        this.addChild(tweenBtn);
        this.addTouchable(tweenBtn);
        
        var gooeyBtn = new Button('Gooey', Style.DEFAULT_BUTTON);
        gooeyBtn.onMouseUp = function () {
            var screen = new GooeyScreen();
            app.navigator.add(screen, 200);
            Sounds.click.play();
        };
        gooeyBtn.position.set(app.width / 2, 500);
        this.addChild(gooeyBtn);
        this.addTouchable(gooeyBtn);


    };

    /**
     * The desc
     * @param Number someData 
     */
    MainScreen.prototype.onShow = function (someData) {

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