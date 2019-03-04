(function (window, undefined) {

    function AnimationPlayHead() {
        this.initialize();
    }

    AnimationPlayHead.prototype = new Sprite();
    AnimationPlayHead.prototype.spriteInitialize = AnimationPlayHead.prototype.initialize;
    //DELEGATE
    // onPlayHeadMove(percent,x)
    AnimationPlayHead.prototype.initialize = function () {

        this.spriteInitialize('_play_head');
        this.centered();
        this.enableSensor();

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
        this.x = this.lastX + event.point.x - this.lastP.x;

        var x = Math.clamp(this.x, 0, this.timelineLength);
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