(function (window, undefined) {

    function LoadingBar(options) {
        this.initialize(options);
    }

    LoadingBar.prototype = new Sprite();
    LoadingBar.prototype.spriteInitialize = LoadingBar.prototype.initialize;

//{
//    background: 'white',
//    backgroundIsSliced: true,
//    backgroundWidth: 500,
//    backgroundHeight: 80,
//    backgroundPadding: '1 1 1 1',
//    backgroundTint : 0x555555,
//    foreground: 'white',
//    foregroundIsSliced: true,
//    foregroundWidth: 500,
//    foregroundHeight: 80,
//    foregroundPadding: '1 1 1 1',
//    foregroundTint: 0xffffff,
//    offsetX: 0,
//    offsetY: 0,
//    isAnimated: false,
//    animationSpeed: 0,
//    showPercent : false
//}

    LoadingBar.prototype.initialize = function (options) {

        var background = (options.background !== undefined) ? options.background : 'white';
        this.backgroundIsSliced = (options.backgroundIsSliced !== undefined) ? options.backgroundIsSliced : true;
        this.backgroundWidth = (options.backgroundWidth !== undefined) ? options.backgroundWidth : 500;
        this.backgroundHeight = (options.backgroundHeight !== undefined) ? options.backgroundHeight : 80;
        this.backgroundPadding = (options.backgroundPadding !== undefined) ? options.backgroundPadding : '1 1 1 1';
        this.backgroundTint = (options.backgroundTint !== undefined) ? options.backgroundTint : 0xffffff;

        var foreground = (options.foreground !== undefined) ? options.foreground : 'white';
        this.foregroundIsSliced = (options.foregroundIsSliced !== undefined) ? options.foregroundIsSliced : true;
        this.foregroundWidth = (options.foregroundWidth !== undefined) ? options.foregroundWidth : 500;
        this.foregroundHeight = (options.foregroundHeight !== undefined) ? options.foregroundHeight : 80;
        this.foregroundPadding = (options.foregroundPadding !== undefined) ? options.foregroundPadding : '1 1 1 1';
        this.foregroundTint = (options.foregroundTint !== undefined) ? options.foregroundTint : 0xffffff;

        this.offsetX = (options.offsetX !== undefined) ? options.offsetX : 0;
        this.offsetY = (options.offsetY !== undefined) ? options.offsetY : 0;
        this.isAnimated = (options.isAnimated !== undefined) ? options.isAnimated : false;
        this.duration = (options.animationSpeed !== undefined) ? options.animationSpeed : 300;
        this.showPercent = (options.showPercent !== undefined) ? options.showPercent : false;

        this.textColor = (options.textColor !== undefined) ? options.textColor : null;

        this.spriteInitialize(null);

        if (this.backgroundIsSliced) {
            this.background = new NineSlice(background, this.backgroundPadding, this.backgroundWidth, this.backgroundHeight);
        } else {

            this.background = new Sprite(background);

            if (options.backgroundWidth === undefined) {
                this.backgroundWidth = this.background.width;
            } else {
                this.background.width = this.backgroundWidth;
            }

            if (options.backgroundHeight === undefined) {
                this.backgroundHeight = this.background.height;
            } else {
                this.background.height = this.backgroundHeight;
            }

            this.background.centered();
        }

        this.addChild(this.background);

        if (this.foregroundIsSliced) {
            this.foreground = new NineSlice(foreground, this.foregroundPadding, this.foregroundWidth, this.foregroundHeight);
        } else {

            this.foreground = new Sprite(foreground);

            if (options.foregroundWidth === undefined) {
                this.foregroundWidth = this.foreground.width;
            } else {
                this.foreground.width = this.foregroundWidth;
            }

            if (options.foregroundHeight === undefined) {
                this.foregroundHeight = this.foreground.height;
            } else {
                this.foreground.height = this.foregroundHeight;
            }

            this.foreground.centered();
        }

        this.addChild(this.foreground);

        if (this.showPercent) {
            this.percentLabel = new Label({
                fontSize: Math.round(this.foregroundHeight * 0.7),
                fontFamily: 'Impact,Arial Black ,Arial Rounded MT Bold'
            });
            this.percentLabel.centered();
            this.percentLabel.txt = '0%';
            if (this.textColor === null) {
                this.percentLabel.style.fill = this.foregroundTint;
            } else {
                this.percentLabel.style.fill = this.textColor;
            }
            this.addChild(this.percentLabel);
        }

        this.background.tint = this.backgroundTint;
        this.foreground.tint = this.foregroundTint;

        this.foreground.x = this.offsetX;
        this.foreground.y = this.offsetY;

        this.percentage = 0;
        this.toPercentage = 1;
        this.isAnimating = false;

        var mask = new PIXI.Graphics();
        this.foreground.mask = mask;
        this.foreground.addChild(mask);

        this.centered();

        this.setSensorSize(this.backgroundWidth, this.backgroundHeight);

    };

    LoadingBar.prototype.setPercent = function (percent, animated) {

        this.timeout = this.duration;

        this.isAnimating = (animated === undefined) ? this.isAnimated : animated;
        if (!this.isAnimating) {
            this.percentage = percent;
            this.drawMask(percent);
        } else {
            this.toPercentage = percent;
        }

    };

    LoadingBar.prototype.onUpdate = function (dt) {

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

    };

    LoadingBar.prototype.drawMask = function (percent) {

        var mask = this.foreground.mask;
        this.percentage = Math.clamp(percent, 0, 1);
        var x = -this.foregroundWidth * this.anchor.x - this.offsetX * this.anchor.x;
        var y = -this.foregroundHeight * this.anchor.y - this.offsetY * this.anchor.y;

        if (mask) {
            mask.clear();
            mask.beginFill(0xffffff, 1);
            mask.drawRect(x, y, this.foregroundWidth * this.percentage, this.foregroundHeight);
            mask.endFill();
        }

        if (this.showPercent) {
            var _percent = Math.round(percent * 100);
            this.percentLabel.txt = _percent + '%';
            if (_percent > 50) {
                if (this.textColor === null) {
                    this.percentLabel.style.fill = this.backgroundTint;
                }

            } else {
                if (this.textColor === null) {
                    this.percentLabel.style.fill = this.foregroundTint;
                }
            }
        }

    };

    window.LoadingBar = LoadingBar;

}(window));