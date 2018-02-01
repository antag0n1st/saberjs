(function (window, undefined) {

    function TweenShake(object, magnitude, frequency, bezier, duration, callback) {
        this.initialize(object, magnitude, frequency, bezier, duration, callback);
    }

    TweenShake.prototype = new Tween();
    TweenShake.prototype.parentInitialize = TweenShake.prototype.initialize;

    TweenShake.prototype.initialize = function (object, magnitude, frequency, bezier, duration, callback) {

        this.parentInitialize(object, null, bezier, duration, callback);

        this.magnitude = magnitude;
        this.frequency = frequency ? frequency : 25 / 1000;


        this.applyValues();


    };

    TweenShake.prototype.applyValues = function () {
        this.startPoint = new V().copy(this.object.position);
        this.shakes = 0;
    };

    TweenShake.prototype.step = function (dt) {

        this.timePassed += dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var f = Math.round(this.frequency * this.timePassed) - this.shakes;

        if (f > 0) {
            this.shakes += f;

            var bstep = this.bezier ? this.bezier.get(s) : 1;

            var angle = Math.randomInt(0, 360);
            var move = new V();
            move.setLength(this.magnitude * bstep);
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

    window.TweenShake = TweenShake;

}(window));