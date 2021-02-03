(function (window, app , sharedObject, undefined) {

    function Popup(delegate) {
        this.initialize(delegate);
    }

    Popup.prototype = new Sprite();
    Popup.prototype.spriteInitialize = Popup.prototype.initialize;


    Popup.prototype.initialize = function (delegate) {

        this.spriteInitialize(null); // your image name


        this.setSensorSize(app.width, app.height);
        this.anchor.set(0.5, 0.5);
        this.position.set(app.width / 2, app.height / 2);

        this.delegate = delegate;
        this.visible = false;

        this.priority = 1000;


        this.background = new Sprite(null);
        this.background.anchor.set(0.5, 0.5);
        this.background.zIndex = -1;
        this.addChild(this.background);


    };

    Popup.prototype.onMouseDown = function (event, sender) {
        event.stopPropagation();
    };

    Popup.prototype.show = function (instant) {

        this.delegate.addChild(this);

        this.visible = true;

        if (instant) {
            this.alpha = 1;
            this.scale.set(1);
        } else {

            this.background.alpha = 0;
            this.background.scale.set(0.2);

            new TweenAlpha(this.background, 1, null, 200).run();
            new TweenScale(this.background, 1, new Bezier(.18, .66, .64, 1.23), 200).run();

        }

        app.input.add(this);

    };

    Popup.prototype.hide = function (animated) {
        
        if (animated) {

            var b = new Bezier(.44, -0.51, .76, .36);

            var t = new TweenAlpha(this, 0, null, 300);
            t.run();

            var t2 = new TweenScale(this, 0.5, b, 300, function (object) {
                object.removeFromParent();
            });
            t2.run();
            
        } else {
            this.removeFromParent();
        }

        app.input.remove(this);
    };

    window.Popup = Popup;

}(window , app , sharedObject));