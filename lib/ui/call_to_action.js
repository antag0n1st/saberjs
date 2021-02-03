(function (window, app , sharedObject, undefined) {

    function CallToAction(message, acceptCallback, settings) {
        this.initialize(message, acceptCallback, settings);
    }

    CallToAction.SUCCESS = 0;
    CallToAction.WARRNING = 1;
    CallToAction.ERROR = 2;

    CallToAction.prototype = Object.create(PIXI.Container.prototype);
    CallToAction.prototype.constructor = CallToAction;


    CallToAction.prototype.initialize = function (message, acceptCallback, settings) {

        PIXI.Container.call(this);

        this.message = message;

        settings = settings || {};

        // pre calculate font size
        var factor = 100;
        this.fontSize = (app.width < app.height) ? app.width / app.height * factor : app.height / app.width * factor * 2;

        this.textureName = settings.texture || 'white';
        this.fontFamily = settings.fontFamily || 'Helvetica,San Fancisco,ArialHebrew-Bold';
        this.fontSize = settings.fontSize || this.fontSize;
        this.padding = settings.padding || 25;
        this.backgroundAlpha = settings.alpha || 0.95;
        this.duration = 3000;
        this.subTitle = settings.subTitle || '';
        this.yesText = settings.yesText || 'Yes';
        this.onDissmiss = settings.onDissmiss || null;
        this.buttonWidth = settings.buttonWidth || 200;

        this.acceptCallback = acceptCallback;

        this.animation = null;
        this.isVisible = false;


        this.backColor = settings.backColor || 0x4c4b63;
        this.textColor = settings.textColor || 0xffffff;


        if (settings) {
            this.duration = settings.duration || this.duration;
            this.backgroundAlpha = settings.alpha || this.backgroundAlpha;
            this.fontSize = settings.fontSize || this.fontSize;
        }

        this.zIndex = 1000;

        this.build();



    };

    CallToAction.prototype.build = function () {

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
        label.style.fontFamily = this.fontFamily;
        label.style.fontSize = this.fontSize;
        label.style.fill = this.textColor;
        label.style.wordWrap = true;
        label.style.wordWrapWidth = width - padding * 2 - this.buttonWidth;
        label.txt = this.message;
        label.anchor.set(0, 0);
        label.x = padding;
        label.y = padding;
        this.addChild(label);

        this.buttons = [];
        
        this.message = label;


        var buttonYes = new Button(this.yesText, {
            style: {
                fontSize: 30,
                fontFamily: this.fontFamily
            },
            properties: {"imageNormal": "white",
                "imageSelected": "white",
                "width": this.buttonWidth,
                "height": 80,
                "padding": '1',
                "isNineSlice": true,
                "backgroundColorNormal": "#16b86c",
                "backgroundColorDown": "#14a863",
                "backgroundColorHover": "#1fcf7d",
                "backgroundColorDisabled": "#DEDEDE",
                "textColorNormal": "#FFFFFF",
                "textColorDown": "#FFFFFF",
                "textColorHover": "#FFFFFF",
                "textColorDisabled": "#cccccc"
            }
        });
        buttonYes.name = this.yesText;
        buttonYes.onMouseDown = function (event, sender) {
            event.stopPropagation();
        };
        buttonYes.onMouseUp = function (event, sender) {
            this.onCallback(event, this);
        }.bind(this);
        buttonYes.x = width - 150;
        buttonYes.y = label.y + label.height / 2;
        buttonYes.priority = 1000;
        this.addChild(buttonYes);

        this.buttons.push(buttonYes);


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

    CallToAction.prototype.onCallback = function (event, sender) {

        this.hide();

        if (this.acceptCallback) {
            this.acceptCallback(event, sender);
        }

    };

    CallToAction.prototype.hide = function () {

        Actions.stopByTag('call-to-action-loop');

        this.removeFromParent();

        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            app.input.remove(button);
        }
        
        app.input.remove(this);

    };


    //////////////////////////////

    CallToAction.show = function (message, acceptCallback, options) {
        var toast = new CallToAction(message, acceptCallback, options);
        CallToAction.animate(toast);        
        return toast;
    };


    CallToAction.animate = function (toast) {

        app.stage.addChild(toast);

        toast.x = (app.width - toast._width) / 2;

        toast.y = app.height;
        toast.alpha = 0;

        for (var i = 0; i < toast.buttons.length; i++) {
            var button = toast.buttons[i];
            app.input.add(button);
        }

        toast.animation = new Sequencer();
        toast.animation.addThread([
            new TweenGeneric(toast, {y: app.height - toast._height, alpha: 1}, null, 200)
        ]);

        toast.animation.run();
        
        toast.isVisible = true;

        // set an infinite loop for the buttons

        new TweenInfinity(function (dt, totalTime) {
            for (var i = 0; i < toast.buttons.length; i++) {
                var button = toast.buttons[i];
                button.onUpdate(dt);
            }
        }).run('call-to-action-loop');

        toast.priority = 999;
        
        toast.onMouseDown = function (event, sender) {
            event.stopPropagation();
        };
        
        toast.onMouseUp = function (event, sender) {            
            toast.hide();
            if (toast.onDissmiss) {
                toast.onDissmiss();
            }
        };
        app.input.add(toast);

    };



    window.CallToAction = CallToAction; // make it available in the main scope

}(window , app , sharedObject));