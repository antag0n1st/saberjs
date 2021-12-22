(function (window, app , sharedObject, undefined) {

    function TweenTimer(callback, duration, context) {
        this.initialize(callback, duration, context);
    }
    TweenTimer.prototype = new Tween();
    TweenTimer.prototype.parentInitialize = TweenTimer.prototype.initialize;
    TweenTimer.prototype.initialize = function (callback, duration, context) {
        this.parentInitialize(null, null, null, duration, callback, context);
    };

    TweenTimer.prototype.step = function (dt) {

        this.timePassed = this.timePassed + dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        if (s === 1.0 && this.ticks > 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenTimer = TweenTimer;

}(window , app , sharedObject));