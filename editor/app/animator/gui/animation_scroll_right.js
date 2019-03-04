(function (window, undefined) {

    function AnimationScrollRight(panel) {
        this.initialize(panel);
    }

    AnimationScrollRight.prototype = Object.create(PIXI.Container.prototype);
    AnimationScrollRight.prototype.constructor = AnimationScrollRight;

    //DELEGATE
    // - onRightScrollMove
    AnimationScrollRight.prototype.initialize = function (panel) {
        PIXI.Container.call(this);

        this.panel = panel;
        this.delegate = null;

        this.totalLength = 0;
        this.contentLength = 0;

        this.pad = new Sprite('white');
        this.pad.tint = 0x999999;
        this.pad.enableSensor();
        this.addChild(this.pad);

        this.pad.onMouseDown = this.onPadDown.bind(this);
        this.pad.onMouseMove = this.onPadMove.bind(this);
        this.pad.onMouseUp = this.onPadUp.bind(this);

        this.percent = 0;
        this.lastY = 0;
        this.lastP = new V();

    };

    AnimationScrollRight.prototype.build = function () {
        var height = this.panel.panelHeight;

        this.pad.width = this.panel.rightScrollWidth;
        var h = (this.totalLength / this.contentLength) * height;

        this.pad.height = h;
        if (h >= height) {
            this.pad.visible = false;
            this.pad.height = 1;
        } else {
            this.pad.visible = true;
        }

    };

    AnimationScrollRight.prototype.setPercent = function (percent) {

        var h = this.panel.panelHeight - this.pad.height;    
        var y = this.percent * h;
        this.pad.y = y;
        this.percent = percent;

    };

    AnimationScrollRight.prototype.onPadDown = function (event, sender) {
        this.lastY = this.pad.y;
        this.lastP.y = event.point.y;
    };

    AnimationScrollRight.prototype.onPadMove = function (event, sender) {
        this.pad.y = this.lastY + event.point.y - this.lastP.y;
        var h = this.panel.panelHeight - this.pad.height;
        var y = Math.clamp(this.pad.y, 0, h);
        this.pad.y = y;
        this.percent = y / h;

        if (this.delegate && this.delegate.onRightScrollMove) {
            this.delegate.onRightScrollMove(this.percent);
        }
    };

    AnimationScrollRight.prototype.onPadUp = function (event, sender) {

    };

    window.AnimationScrollRight = AnimationScrollRight; // make it available in the main scope

}(window));