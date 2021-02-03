(function (window, app , sharedObject, undefined) {

    function TweenTime(to, bezier, duration, callback) {
        this.initialize(to, bezier, duration, callback);
    }

    TweenTime.prototype = new Tween();
    TweenTime.prototype.parentInitialize = TweenTime.prototype.initialize;

    TweenTime.prototype.initialize = function (to, bezier, duration, callback) {

        this.parentInitialize(null, null, bezier, duration, callback);

        this.start_value = Config.slow_motion_factor;
        this.difference = to - this.start_value;
        this.timePassed = 0;
        this.ticks = 0;
    };

    TweenTime.prototype.step = function (dt) {

        this.timePassed = this.timePassed + Ticker.step;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var bstep = this.bezier ? this.bezier.get(s) : s;


        Config.slow_motion_factor = this.start_value + bstep * this.difference;

        if (s === 1.0 && this.ticks > 1) {
            this.callback(this.object);
            this.stop();
        }

    };

    window.TweenTime = TweenTime;

}(window , app , sharedObject));