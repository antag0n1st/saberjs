(function (window, app , sharedObject, undefined) {

    function TweenIdle(duration, callback) {
        this.initialize(duration, callback);
    }
    TweenIdle.prototype = new Tween();
    TweenIdle.prototype.parentInitialize = TweenIdle.prototype.initialize;
    TweenIdle.prototype.initialize = function (duration, callback) {

        this.parentInitialize(null, null, null, duration, callback);

        this.applyValues();
    };

    TweenIdle.prototype.applyValues = function () {

    };

    TweenIdle.prototype.step = function (dt) {

        this.timePassed += dt;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        if (s === 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenIdle = TweenIdle;

}(window , app , sharedObject));