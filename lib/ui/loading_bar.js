(function (window, undefined) {

    function LoadingBar(foreground, background, padding) {
        this.initialize(foreground, background, padding);
    }

    LoadingBar.prototype = new Sprite();
    LoadingBar.prototype.spriteInitialize = LoadingBar.prototype.initialize;

    LoadingBar.prototype.initialize = function (foreground, background, padding) {

        foreground = foreground ? foreground : '_loading_bar_fg';
        background = background ? background : '_loading_bar_bg';

        this.spriteInitialize(null); // your image name

        this.padding = padding === undefined ? 3 : padding;

        this.percentage = 0;

        this.toPercentage = 1;
        this.isAnimating = false;

        this.background = new Sprite(background);
        this.addChild(this.background);
        this.setSensorSize(this.background.width, this.background.height);

        this.foreground = new Sprite(null);
        this.foreground.position.set(this.padding, this.padding);
        this.addChild(this.foreground);
        this.forgrounds = [];

        this.leftX = -this._width / 2 - 100; // ????? why 100

        this.totalWidth = 0;
        this.segmentWidth = 0;

        for (var i = 0; i < 28; i++) {
            var f = new Sprite(foreground);
            f.anchor.set(0.5, 0.5);
            this.totalWidth += f.width;
            this.foreground.addChild(f);
            var x = this.leftX + f.width * i;

            f.position.set(x, f.height / 2);
            this.forgrounds.push(f);
            this.segmentWidth = f.width;
        }



        var mask = new PIXI.Graphics();
        this.maskPadding = this.padding;
        this.speed = -0.05;
        this.maskWidth = this._width - this.maskPadding * 2;
        this.maskHeight = this._height;
        this.foreground.mask = mask;
        this.foreground.addChild(mask);


        this.timeout = 0;
        this.duration = 300; // the speed at which the bar is animating changes

        this.xScale = 1;
        this.yScale = 1;

        this.isAutoHiding = false;
        // this.set_alpha(0);

        this.looper = new Looper([
            {name: 'fade_in', duration: 100},
            {name: 'still', duration: 800},
            {name: 'fade_out', duration: 200},
            {name: 'end', duration: 100}
        ], true);

        this.looper.isFinished = true; // to prevent it from running

    };

    LoadingBar.prototype.setBarScale = function (x, y) {
        this.xScale = x;
        this.yScale = y;

        this.scale.x = x;
        this.scale.y = y;
    };

    LoadingBar.prototype.setPercent = function (percent, animated) {

        this.isAnimating = animated ? true : false;

        if (!this.isAnimating) {
            this.percentage = percent;
            this.drawMask(percent);
        } else {
            this.toPercentage = percent;
        }

        this.timeout = this.duration;

        if (this.isAutoHiding) {
            this.looper.restart();
        }

    };

    LoadingBar.prototype.onUpdate = function (dt) {

        for (var i = 0; i < this.forgrounds.length; i++) {

            var f = this.forgrounds[i];
            var speed = dt * this.speed;
            var p = f.position;

            var x = p.x - speed;

            if (x < this.leftX) {
                var dx = this.leftX - x;
                x = this.leftX + this.totalWidth - dx;
            } else if (x > this.totalWidth + this.leftX) {
                var dx = (this.totalWidth + this.leftX) - x;
                x = this.leftX - dx;
            }

            f.position.set(x, p.y);
        }


        if (this.isAnimating && this.timeout > 0) {

            this.timeout -= dt;

            var p = (this.duration - this.timeout) / this.duration;
            var d = this.toPercentage - this.percentage;

            this.drawMask(this.percentage + d * p);

            if (this.timeout <= 0) {
                this.isAnimating = false;
                this.percentage = this.toPercentage;
            }
        }

        if (this.isAutoHiding) {

            if (!this.looper.isFinished) {

                this.looper.update(dt);

                var event = this.looper.get();

                if (event.name === 'fade_in') {
                    this.alpha = event.percent;
                } else if (event.name === 'still') {
                    if (event.isFirstTime) {
                        this.alpha = 1;
                    }
                } else if (event.name === 'fade_out') {
                    this.alpha = 1 - event.percent;
                }

                if (event.name === 'end') {
                    if (event.isFirstTime) {
                        this.alpha = 0;
                    }
                }
            }

        }
    };

    LoadingBar.prototype.drawMask = function (percent) {
        var mask = this.foreground.mask;

        this.percentage = Math.clamp(percent, 0, 1);

        if (mask) {
            mask.clear();
            mask.beginFill(0xffffff, 1);
            mask.drawRect(0, 0, this.maskWidth * this.percentage, this.maskHeight);
            mask.endFill();
        }
    };

    window.LoadingBar = LoadingBar;

}(window));