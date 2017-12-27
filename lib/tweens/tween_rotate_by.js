(function (window, undefined) {

    function TweenRotateBy(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }

    TweenRotateBy.prototype = new Tween();
    TweenRotateBy.prototype.parentInitialize = TweenRotateBy.prototype.initialize;

    TweenRotateBy.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);
        this.applyValues();
    };

    TweenRotateBy.prototype.applyValues = function () {
        this.startAngle = this.object.rotation;
    };

    TweenRotateBy.prototype.step = function (dt) {

        this.timePassed += dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var bstep = this.bezier ? this.bezier.get(s) : s;

        this.object.rotation = this.startAngle + bstep * this.to;

        if (s === 1.0 && this.ticks > 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenRotateBy = TweenRotateBy;

}(window));