(function (window, undefined) {

    function Timer(callback, duration, context) {
        this.initialize(callback, duration, context);
    }
    Timer.prototype = new Tween();
    Timer.prototype.parentInitialize = Timer.prototype.initialize;
    Timer.prototype.initialize = function (callback, duration, context) {
        this.parentInitialize(null, null, null, duration, callback, context);
    };

    Timer.prototype.step = function (dt) {

        this.timePassed = this.timePassed + dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        if (s === 1.0 && this.ticks > 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.Timer = Timer;

}(window));