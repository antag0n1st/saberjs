(function (window, undefined) {

    function SpineScreen() {
        this.initialize();
    }

    SpineScreen.prototype = new HScreen();
    SpineScreen.prototype.screenInitialize = SpineScreen.prototype.initialize;


    SpineScreen.prototype.initialize = function () {
        this.screenInitialize();
        this.TYPE = SpineScreen.TYPE;
        
        this.character = new SpineAnimation('character');
        this.character.play('idle');
        this.addChild(this.character);

        this.character.position.set(app.width / 2, app.height - 300);


    };

    SpineScreen.prototype.onUpdate = function (dt) {
        HScreen.prototype.update.call(this);


    };

    SpineScreen.prototype.onShow = function () {
        HScreen.prototype.onShow.call(this);

    };

    SpineScreen.prototype.onHide = function () {
        HScreen.prototype.onHide.call(this);

    };

    SpineScreen.prototype.onMouseDown = function (event, sender) {

    };

    SpineScreen.prototype.onMouseMove = function (event, sender) {

    };

    SpineScreen.prototype.onMouseUp = function (event, sender) {

    };

    SpineScreen.prototype.onMouseCancel = function (event, sender) {

    };

    SpineScreen.prototype.onRightMouseDown = function (event, sender) {

    };

    SpineScreen.prototype.onRightMouseMove = function (event, sender) {

    };

    SpineScreen.prototype.onRightMouseUp = function (event, sender) {

    };

    SpineScreen.prototype.onNote = function (name, data, sender) {

    };

    SpineScreen.prototype.onResize = function () {

    };

    SpineScreen.prototype.destroy = function () {

    };

    window.SpineScreen = SpineScreen; // make it available in the main scope

}(window));