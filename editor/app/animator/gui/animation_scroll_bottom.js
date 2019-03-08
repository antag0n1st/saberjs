(function (window, undefined) {

    function AnimationScrollBottom(panel) {
        this.initialize(panel);
    }

    AnimationScrollBottom.prototype = Object.create(PIXI.Container.prototype);
    AnimationScrollBottom.prototype.constructor = AnimationScrollBottom;

    //DELEGATE
    // - onBottomScrollMove
    AnimationScrollBottom.prototype.initialize = function (panel) {
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
        this.lastX = 0;
        this.lastP = new V();

    };

    AnimationScrollBottom.prototype.build = function () {

        var width = this.panel.panelRightWidth; //

        this.pad.height = this.panel.panelBottomHeight;

        var w = (this.totalLength / this.contentLength) * width;


        this.pad.width = w;
        if (w >= width) {
            this.pad.visible = false;
            this.pad.width = 1;
        } else {
            this.pad.visible = true;
        }
    };

    AnimationScrollBottom.prototype.setPercent = function (percent) {
        
        var w = this.panel.panelRightWidth - this.pad.width;
        var x = percent * w;
        this.pad.x = x;
        this.percent = percent;
        
        log(w)

//        var h = this.panel.panelHeight - this.pad.height;    
//        var y = this.percent * h;
//        this.pad.y = y;
//        this.percent = percent;

    };

    AnimationScrollBottom.prototype.onPadDown = function (event, sender) {

        this.lastX = this.pad.x;
        this.lastP.x = event.point.x;

    };

    AnimationScrollBottom.prototype.onPadMove = function (event, sender) {

        this.pad.x = this.lastX - (-event.point.x + this.lastP.x);
        var w = this.panel.panelRightWidth - this.pad.width;
        var x = Math.clamp(this.pad.x, 0, w);
        this.pad.x = x;
        this.percent = x / w;

        if (this.delegate && this.delegate.onBottomScrollMove) {
            this.delegate.onBottomScrollMove(this.percent);
        }

    };

    AnimationScrollBottom.prototype.onPadUp = function (event, sender) {

    };

    window.AnimationScrollBottom = AnimationScrollBottom; // make it available in the main scope

}(window));