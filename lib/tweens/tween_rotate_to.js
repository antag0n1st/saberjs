(function (window, undefined) {

    function TweenRotateTo(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }

    TweenRotateTo.prototype = new Tween();
    TweenRotateTo.prototype.parentInitialize = TweenRotateTo.prototype.initialize;

    TweenRotateTo.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);
        this.applyValues();
    };

    TweenRotateTo.prototype.applyValues = function () {
        this.startAngle = this.object.rotation;
        this.diffrenece = this.to - this.object.rotation;
    };

    TweenRotateTo.prototype.step = function (dt) {

        this.timePassed += dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var bstep = this.bezier ? this.bezier.get(s) : s;

        this.object.rotation = this.startAngle + bstep * this.diffrenece;

        if (s === 1.0 && this.ticks > 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenRotateTo = TweenRotateTo;

}(window));