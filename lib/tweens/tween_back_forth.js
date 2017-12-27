(function (window, undefined) {

    function TweenBackForth(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }
    TweenBackForth.prototype = new Tween();
    TweenBackForth.prototype.parentInitialize = TweenBackForth.prototype.initialize;
    TweenBackForth.prototype.initialize = function (object, to, bezier, duration, callback) {


        this.parentInitialize(object, to, bezier, duration, callback);
        this.half = new V().copy(to).scale(0.5);
        this.begin = new V().copy(object.position);
       
        this._repeat = 0;
    };

    TweenBackForth.prototype.step = function (dt) {


        this.timePassed += dt;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;
        //var bs = this.bezier ? this.bezier.get(s) : s;

        var p = new V();

        if (s < 0.25) {

            p.copy(this.half);
            p.scale(s / 0.25);
            p = V.addition(this.begin, p);

        } else if (s < 0.5) {
            p.copy(this.half);
            p.reverse();
            p.scale((s - 0.25) / 0.25);
            p = V.addition(this.begin, p);
            p.add(this.half);
        } else if (s < 0.75) {
            p.copy(this.half);
            p.reverse();
            p.scale((s - 0.5) / 0.25);
            p = V.addition(this.begin, p);
        } else {
            p.copy(this.half);
            p.scale((s - 0.75) / 0.25);
            p = V.addition(this.begin, p);
            p.sub(this.half);
        }

        this.object.position.set(p.x, p.y);

        if (s === 1) {
            this._cycles++;

            this._cycleCallback.call(this.context, this._cycles);

            if (this._cycles === this._repeat) {
                this.invokeCallback();
                this.stop();
            }
            this.timePassed -= this.duration;
        }


    };

    window.TweenBackForth = TweenBackForth;

}(window));