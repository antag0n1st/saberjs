(function (window, undefined) {

    /**
     * 
     * OPTIONS: 
     * - tint
     * - size (int)
     * - restore - default true
     * - speed - default 1000 
     * - jump - false
     * - tag
     * - animated - true
     * - animation
     * 
     */


    Spinner.ANIMATION_DOTS = 0;
    Spinner.ANIMATION_SQUARE = 1;

    function Spinner(replaceObject, options, animation) {
        this.initialize(replaceObject, options, animation);
    }

    Spinner.prototype = Object.create(PIXI.Container.prototype);
    Spinner.prototype.constructor = Spinner;


    Spinner.prototype.initialize = function (replaceObject, options, animation) {

        PIXI.Container.call(this);

        this.speed = options.speed || 1000;
        this.restore = (options.restore === undefined) ? true : options.restore;
        this.size = options.size || 30;
        this.jumpHeight = (options.jump === undefined) ? 20 : options.jump;
        this.animated = (options.animated === undefined) ? true : options.animated;
        this.animationType = options.animation || Spinner.ANIMATION_DOTS;
        this.tint = options.color || 0x3464eb;

        this.replaceObject = replaceObject;

        if (this.replaceObject) {
            this.x = this.replaceObject.x;
            this.y = this.replaceObject.y;
        }



        this.animation = null;
        if (animation) {
            this.animation = animation.bind(this);
        }
        this.replaceInitialScale = 1;
        this.tag = 'spinner-animation-'+PIXI.utils.uid();

        this.isRunning = false;




    };

    Spinner.prototype.createSquare = function () {
        var square = new Sprite('white');
        square.stretch(this.size, this.size);
        square.tint = this.tint;
        square.centered();
        this.addChild(square);
        return square;
    };

    Spinner.prototype.animate = function () {

        if (this.replaceObject) {
            this.replaceObject.parent.addChild(this);
            this.replaceInitialScale = this.replaceObject.scale.x;
        }

        if (this.animated) {

            if (this.replaceObject) {

                new TweenScale(this.replaceObject, 0.2, null, 60, function () {
                    this.object.visible = false;
                }).run(this.tag);
            }

            this.scale.set(0);
            new TweenScale(this, 1, null, 60).delay(30).run(this.tag);

        } else {
            if (this.replaceObject) {
                this.replaceObject.visible = false;
            }
        }



        if (this.animation) {
            this.animation(this.tag);
        } else if (this.animationType === Spinner.ANIMATION_SQUARE) {
            this.animateSquare();
            if (this.jump) {
                this.jump(this, this.jumpHeight);
            }
        } else if (this.animationType === Spinner.ANIMATION_DOTS) {
            this.animateDots();
        }



        return this;

    };

    Spinner.prototype.animateSquare = function () {

        this.background = this.createSquare();
        new TweenRotate(this, 1, null, this.speed).run(this.tag);

        return this;

    };

    Spinner.prototype.animateDots = function () {

        var dot1 = this.createSquare();
        var dot2 = this.createSquare();
        var dot3 = this.createSquare();

        dot1.x = -this.size * 2;
        dot3.x = this.size * 2;

        dot1.alpha = 0;
        dot2.alpha = 0;
        dot3.alpha = 0;

        var _this = this;

        _this.jump(dot1, _this.jumpHeight);

        new TweenIdle(100, function () {
            _this.jump(dot2, _this.jumpHeight);
        }).run(this.tag);

        new TweenIdle(200, function () {
            _this.jump(dot3, _this.jumpHeight);
        }).run(this.tag);

        new TweenAlpha(dot1, 1, null, 100).delay(0).run(this.tag);
        new TweenAlpha(dot2, 1, null, 100).delay(100).run(this.tag);
        new TweenAlpha(dot3, 1, null, 100).delay(200).run(this.tag);


        return this;

    };

    Spinner.prototype.jump = function (object, height) {
        var easing = new Easing(Easing.EASE_OUT_BOUNCE);
        var _this = this;
        var sy = object.y;
        new TweenMoveTo(object, new V(object.x, sy - height), new Bezier(.24, .81, .54, 1), 200, function () {
            new TweenMoveTo(this.object, new V(this.object.x, sy), easing, 400, function () {
                _this.jump(this.object, height);
            }).run(this.tag);
        }).delay(300).run(this.tag);

        return this;
    };

    Spinner.prototype.start = function () {
        return this.run();
    };

    Spinner.prototype.run = function () {
        Spinner.spinners.push(this);

        if (this.replaceObject) {
            this.replaceObject.isTouchable = false;
        }

        this.animate();


        this.isRunning = true;

        return this;
    };

    Spinner.prototype.stop = function () {

        this.isRunning = false;
        

        if (this.restore && this.replaceObject) {
          
            this.replaceObject.visible = true;
            if (this.replaceObject) {
                this.replaceObject.isTouchable = true;
            }

            if (this.animated) {
                new TweenScale(this.replaceObject, this.replaceInitialScale, null, 60).run();
            }
        }

        if (this.animated) {
            new TweenAlpha(this, 0, null, 30, function () {
                this.object.removeFromParent();
            }).run();
        } else {
            this.removeFromParent();
        }

        Spinner.spinners.removeElement(this);

        Actions.stopByTag(this.tag);

        return this;

    };

    ////////////////////////////////////////////////////////////////////////////

    Spinner.spinners = [];

    Spinner.create = function (options, animation) {

        var spinner = new Spinner(null, options || {}, animation);
        return spinner;

    };

    Spinner.replace = function (replaceObject, options, animation) {

        var spinner = new Spinner(replaceObject, options || {}, animation);
        spinner.run();
        return spinner;

    };

    Spinner.stop = function () {
                
        for (var i = Spinner.spinners.length - 1; i >= 0; i--) {
            var spinner = Spinner.spinners[i];
            spinner.stop();
        }
        Spinner.spinners = [];
    };

    window.Spinner = Spinner;

}(window));