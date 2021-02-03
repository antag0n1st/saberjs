(function (window, app , sharedObject, undefined) {

    function Stepper(stepCallback, duration, data, bezier, callback, context) {
        this.initialize(stepCallback, duration, data, bezier, callback, context);
    }
    Stepper.prototype = new Tween();
    Stepper.prototype.parentInitialize = Stepper.prototype.initialize;
    Stepper.prototype.initialize = function (stepCallback, duration, data, bezier, callback, context) {
        this.parentInitialize(data, null, bezier, duration, callback, context);
        this.stepCallback = stepCallback;
    };

    Stepper.prototype.step = function (dt) {

        this.timePassed = this.timePassed + dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;
        var bstep = this.bezier ? this.bezier.get(s) : s;

        if (s === 1.0 && this.ticks > 1) {
            this.stepCallback.call(this.context, bstep, this.object, dt);
            this.invokeCallback();
            this.stop();
        } else {
            this.stepCallback.call(this.context, bstep, this.object, dt);
        }

    };

    window.Stepper = Stepper;

}(window , app , sharedObject));