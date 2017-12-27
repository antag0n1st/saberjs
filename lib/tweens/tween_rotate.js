(function (window, undefined) {

    function TweenRotate(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }

    TweenRotate.prototype = new Tween();
    TweenRotate.prototype.parentInitialize = TweenRotate.prototype.initialize;

    TweenRotate.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);

        this.startAngle = object.rotation;
        //  this.timePassed = 0;
        //  this.ticks = 0;

        this._repeat = 0;
    };

    TweenRotate.prototype.step = function (dt) {

        this.timePassed += dt;

        var s = this.timePassed / this.duration;

        var bstep = this.bezier ? this.bezier.get(s) : s;
      
        this.object.rotation = this.startAngle + 2 * Math.PI * bstep * this.to;

        if (s >= 1) {
            this._cycles++;
           // this.object.rotation = this.startAngle;
            this._cycleCallback.call(this.context, this._cycles);

            if (this._cycles === this._repeat) {
                this.object.rotation = this.startAngle;
                this.invokeCallback();
                this.stop();
            }
            this.timePassed -= this.duration;
        }


//    if (s === 1.0) {
//
//        this.object.rotation = this.startAngle;
//        this.timePassed -= this.duration;
//        s = this.timePassed / this.duration;
//        s = (s >= 1) ? 1.0 : s;
//        bstep = bstep = this.bezier ? this.bezier.get(s) : s;
//        this.object.rotation = this.startAngle + 2 * Math.PI * bstep * this.to;
//       
//        this.callback(++this.ticks);
//
//    }

    };

    window.TweenRotate = TweenRotate;

}(window));