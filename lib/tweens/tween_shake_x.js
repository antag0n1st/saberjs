(function (window, undefined) {

    function TweenShakeX(object, magnitude, frequency, bezier, duration, callback) {
        this.initialize(object, magnitude, frequency, bezier, duration, callback);
    }

    TweenShakeX.prototype = new Tween();
    TweenShakeX.prototype.parentInitialize = TweenShakeX.prototype.initialize;

    TweenShakeX.prototype.initialize = function (object, magnitude, frequency, bezier, duration, callback) {

        this.parentInitialize(object, null, bezier, duration, callback);

        this.magnitude = magnitude;
        this.frequency = frequency ? frequency : 25 / 1000;
        this.applyValues();
    };

    TweenShakeX.prototype.applyValues = function () {
        this.startPoint = new V().copy(this.object.position);
        this.shakes = 0;
        this.isLeft = false;
    };

    TweenShakeX.prototype.step = function (dt) {

        this.timePassed += dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var f = Math.round(this.frequency * this.timePassed) - this.shakes;

        if (f > 0) {
            this.shakes += f + 2000;

            // var bstep = this.bezier ? this.bezier.get(s) : 1;
            var angle = 0;
            if (this.isLeft) {
                angle = -180;
            }
            this.isLeft = !this.isLeft;

            var move = new V();
            move.setLength(this.magnitude);
            move.setAngle(Math.degreesToRadians(angle));

            var new_point = this.startPoint.clone();
            new_point.add(move);

            this.object.position.set(new_point.x, new_point.y);
        }

        if (s === 1.0 && this.ticks > 1) {
            this.object.position.set(this.startPoint.x, this.startPoint.y);
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenShakeX = TweenShakeX;

}(window));