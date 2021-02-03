(function (window, app , sharedObject, undefined) {

    function TweenScale(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }

    TweenScale.prototype = new Tween();
    TweenScale.prototype.parentInitialize = TweenScale.prototype.initialize;

    TweenScale.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);

        this.applyValues();

    };

    TweenScale.prototype.applyValues = function () {
        this.startScale = this.object.scale.x;
        this.difference = this.to - this.startScale;

    };

    TweenScale.prototype.step = function (dt) {

        this.timePassed = this.timePassed + dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var bstep = this.bezier ? this.bezier.get(s) : s;

        this.object.scale.set(this.startScale + bstep * this.difference);

        if (s === 1.0 && this.ticks > 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenScale = TweenScale;

}(window , app , sharedObject));