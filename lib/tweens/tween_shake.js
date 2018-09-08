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

        this.shakeAccumulation = new V();

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
            move.setLength( Math.randomInt(this.magnitude / 3 , this.magnitude * bstep ) );
            move.setAngle(Math.degreesToRadians(angle));
            
            while(V.addition(move,this.shakeAccumulation).getLength() > this.magnitude*bstep ){
                var angle = Math.randomInt(0, 360);
                move.setLength( Math.randomInt(this.magnitude / 3 , this.magnitude * bstep ) );
                move.setAngle(Math.degreesToRadians(angle));
            }
            
            this.shakeAccumulation.add(move);
            
            this.object.x += move.x;
            this.object.y += move.y;

        }

        if (s === 1.0 && this.ticks > 1) {
            this.object.x -= this.shakeAccumulation.x;
            this.object.y -= this.shakeAccumulation.y;
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenShake = TweenShake;

}(window));