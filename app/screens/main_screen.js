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

        var label = new Label(Style.DEFAULT_LABEL);
        label.txt = "Happy Coding !";
        label.centered();
        label.x = app.width/2;
        label.y = app.height/2;
        this.addChild(label);



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