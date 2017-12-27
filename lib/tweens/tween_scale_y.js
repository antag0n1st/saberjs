(function (window, undefined) {

    function TweenScaleY(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }

    TweenScaleY.prototype = new Tween();
    TweenScaleY.prototype.parentInitialize = TweenScaleY.prototype.initialize;

    TweenScaleY.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);
        this.applyValues();
        
    };

    TweenScaleY.prototype.applyValues = function () {
        this.startScale = this.object.scale.y;
        this.difference = this.to - this.startScale;
    };

    TweenScaleY.prototype.step = function (dt) {

        this.timePassed = this.timePassed + dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var bstep = this.bezier ? this.bezier.get(s) : s;

        this.object.scale.y = this.startScale + bstep * this.difference;

        if (s === 1.0 && this.ticks > 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenScaleY = TweenScaleY;

}(window));