(function (window, undefined) {

    function AnimationPlayHead(panel) {
        this.initialize(panel);
    }

    AnimationPlayHead.prototype = new Sprite();
    AnimationPlayHead.prototype.spriteInitialize = AnimationPlayHead.prototype.initialize;
    //DELEGATE
    // onPlayHeadMove(percent,x)
    AnimationPlayHead.prototype.initialize = function (panel) {

        this.spriteInitialize('_play_head');
        this.centered();
        this.enableSensor();

        this.panel = panel;

        this.percent = 0;
        this.timelineLength = 0;
        this.lastX = 0;
        this.lastP = new V();

        this.delegate = null;

    };

    AnimationPlayHead.prototype.onMouseDown = function (event, sender) {
        this.lastX = this.x;
        this.lastP.x = event.point.x;
    };

    AnimationPlayHead.prototype.onMouseMove = function (event, sender) {
        var x = this.lastX + event.point.x - this.lastP.x;

        // var duration = this.panel.animator.animation.duration;

        var factor = this.panel.factor;

        var oneSec = 1000 * factor;


        // snap
        var step = oneSec / this.panel.FPS;
        x = Math.round(x / step) * step;

        x = Math.clamp(x, 0, this.timelineLength);
        this.x = x;
        this.percent = x / this.timelineLength;

        if (this.delegate && this.delegate.onPlayHeadMove) {
            this.delegate.onPlayHeadMove(this.percent, this.x);
        }

    };

    AnimationPlayHead.prototype.onMouseUp = function (event, sender) {

    };

    window.AnimationPlayHead = AnimationPlayHead;

}(window));