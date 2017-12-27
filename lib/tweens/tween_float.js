(function (window, undefined) {

    function TweenFloat(object, magnitude, bezier, duration, callback) {
        this.initialize(object, magnitude, bezier, duration, callback);
    }
    TweenFloat.prototype = new Tween();
    TweenFloat.prototype.parentInitialize = TweenFloat.prototype.initialize;
    TweenFloat.prototype.initialize = function (object, magnitude, bezier, duration, callback) {


        this.parentInitialize(object, magnitude, bezier, duration, callback);

        this.magnitude = magnitude;

        this._repeat = 0;

        this.applyValues();
    };

    TweenFloat.prototype.applyValues = function () {

        var p = this.object.position;
        this.startPosition = new V(p.x, p.y);
    };

    TweenFloat.prototype.step = function (dt) {


        this.timePassed += dt;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;
        var bs = this.bezier ? this.bezier.get(s) : s;

        // do the float here
        var y = Math.sin(6.283184 * bs) * this.magnitude;
        this.object.position.y = y + this.startPosition.y;

        if (s === 1) {
            this._cycles++;

            this._cycleCallback.call(this.context, this._cycles);         

            if (this._cycles === this._repeat) {
                this.object.position.y = this.startPosition.y;
                this.invokeCallback();
                this.stop();
            }
            this.timePassed -= this.duration;
        }

    };

    window.TweenFloat = TweenFloat;

}(window));