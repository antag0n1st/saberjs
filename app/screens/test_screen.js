(function (window, undefined) {

    function TestScreen() {
        this.initialize();
    }

    TestScreen.prototype = new HScreen();
    TestScreen.prototype.screen_initialize = TestScreen.prototype.initialize;


    TestScreen.prototype.initialize = function () {

        this.screen_initialize();

        this.setBackgroundColor('#d8a60f');

        ////////////////////

        this.content = new Layer();
        this.addChild(this.content);
        this.importer = new Importer(this);
        this.importer.importObjects(ContentManager.jsons.test_screen.objects, this.content);
        
    };

    TestScreen.prototype.onUpdate = function (dt) {

    };

    TestScreen.prototype.onShow = function () {

    };

    TestScreen.prototype.onHide = function () {

    };

    TestScreen.prototype.onMouseDown = function (event, element) {

    };

    TestScreen.prototype.onMouseMove = function (event, element) {

    };

    TestScreen.prototype.onMouseUp = function (event, element) {

    };

    TestScreen.prototype.onMouseCancel = function (element) {

    };

    TestScreen.prototype.onRightMouseDown = function (event) {

    };

    TestScreen.prototype.onRightMouseMove = function (event) {

    };

    TestScreen.prototype.onRightMouseUp = function (event) {

    };

    TestScreen.prototype.onNote = function (name, data, sender) {

    };

    TestScreen.prototype.onResize = function () {

    };

    TestScreen.prototype.destroy = function () {

    };

    // Keyboard delegates

    TestScreen.prototype.onKeyboardStream = function (stream, prevStream, inputField) {

    };

    TestScreen.prototype.onKeyboardDone = function () {

    };

    TestScreen.prototype.onKeyboardActivated = function () {

    };

    TestScreen.prototype.onKeyboardDismissed = function () {

    };

    TestScreen.prototype.onKeyboardInputFocus = function (inputField) {

    };

    TestScreen.prototype.onKeyboardInputBlur = function (inputField) {

    };

    window.TestScreen = TestScreen; 

}(window));