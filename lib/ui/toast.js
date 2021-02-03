(function (window, app , sharedObject, undefined) {

    function Toast(message, type, settings) {
        this.initialize(message, type, settings);
    }

    Toast.SUCCESS = 0;
    Toast.WARRNING = 1;
    Toast.ERROR = 2;

    Toast.prototype = Object.create(PIXI.Container.prototype);
    Toast.prototype.constructor = Toast;


    Toast.prototype.initialize = function (message, type, settings) {

        PIXI.Container.call(this);

        this.message = message;
        this.type = type;

        // pre calculate font size
        var factor = 100;
        this.fontSize = (app.width <  app.height) ? app.width/app.height * factor : app.height / app.width * factor*2;

        this.textureName = Config.TOAST_TEXTURE || 'white';
        this.fontName = Config.TOAST_FONT_NAME || 'arial';
        this.fontSize = Config.TOAST_FONT_SIZE || this.fontSize;
        this.padding = Config.TOAST_PADDING || 25;
        this.backgroundAlpha = Config.TOAST_ALPHA || 0.95;
        this.duration = 3000;

        this.animation = null;


        switch (type) {
            case Toast.SUCCESS:
                this.backColor = Config.TOAST_SUCCESS_BACK_COLOR || 0x16b86c;
                this.textColor = Config.TOAST_SUCCESS_TEXT_COLOR || 0xffffff;
                break;
            case Toast.WARRNING:
                this.backColor = Config.TOAST_WARRNING_BACK_COLOR || 0xf7a736;
                this.textColor = Config.TOAST_WARRNING_TEXT_COLOR || 0xffffff;
                break;
            case Toast.ERROR:
                this.backColor = Config.TOAST_ERROR_BACK_COLOR || 0xcf1d1d;
                this.textColor = Config.TOAST_ERROR_TEXT_COLOR || 0xffffff;
                break;
            default:
                this.backColor = Config.TOAST_SUCCESS_BACK_COLOR || 0x16b86c;
                this.textColor = Config.TOAST_SUCCESS_TEXT_COLOR || 0xffffff;
                break;
        }

        if (settings) {
            this.duration = settings.duration || this.duration;
            this.backgroundAlpha = settings.alpha || this.backgroundAlpha;
            this.fontSize = settings.fontSize || this.fontSize;
        }

        this.zIndex = 1000;

        this.build();



    };

    Toast.prototype.build = function () {

        var background = null;

        if (this.textureName === "white") {
            background = new Sprite('white');
            background.setSize = function (width, height) {
                this.stretch(width, height);
            }.bind(background);
        } else {
            background = new NineSlice(this.textureName, '20');

        }

        this.addChild(background);

        var width = 0;
        var padding = this.padding;


        // vertical
        var width = app.width;
        width = Math.clamp(width, 200, 1600);


        var label = new Label();
        label.style.fontFamily = this.fontName;
        label.style.fontSize = this.fontSize;
        label.style.fill = this.textColor;
        label.style.wordWrap = true;
        label.style.wordWrapWidth = width - padding * 2;
        label.txt = this.message;
        label.anchor.set(0, 0);
        label.x = padding;
        label.y = padding;
        this.addChild(label);

        this._height = label.height + padding * 2;
        this._width = width;

        background.setSize(Math.max(width, label.width), this._height);
        background.alpha = this.backgroundAlpha;
        background.tint = this.backColor;

        if (this.textureName !== "white") {
            background.x = background._width / 2;
            background.y = background._height / 2;
        }

        this.sensor = null;
        this.setSensorSize(this._width, this._height);


    };

    Toast.prototype.onMouseDown = function (event, sender) {
        this.animation.pause();
    };

    Toast.prototype.onMouseUp = function (event, sender) {
        this.visible = false;
        this.isTouchable = false;
    };

    Toast.prototype.onMouseCancel = function (event, sender) {
        this.visible = false;
        this.isTouchable = false;
    };

    //////////////////////////////

    Toast.success = function () {
        var toast = new Toast(arguments[0], Toast.SUCCESS, arguments[1]);
        Toast.animate(toast);
    };

    Toast.warrning = function () {
        var toast = new Toast(arguments[0], Toast.WARRNING, arguments[1]);
        Toast.animate(toast);
    };

    Toast.error = function () {
        var toast = new Toast(arguments[0], Toast.ERROR, arguments[1]);
        Toast.animate(toast);
    };

    Toast.animate = function (toast) {

        app.stage.addChild(toast);

        toast.x = (app.width - toast._width)/2;

        toast.y = -50;
        toast.alpha = 0;

        app.input.add(toast);
        //app.input.wisperListeners.push(toast);


        toast.animation = new Sequencer();
        toast.animation.addThread([
            new TweenGeneric(toast, {y: 0, alpha: 1}, null, 200),
            new TweenIdle(toast.duration),
            new TweenGeneric(toast, {y: -50, alpha: 0}, null, 200, function () {
                toast.removeFromParent();
                app.input.remove(toast);
                //app.input.wisperListeners.removeElement(toast);
            })
        ]);

        toast.animation.run();

    };


    window.Toast = Toast; // make it available in the main scope

}(window , app , sharedObject));