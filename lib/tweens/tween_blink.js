(function (window, app , sharedObject, undefined) {

    function TweenBlink(object, to, bezier, duration, callback, context) {
        this.initialize(object, to, bezier, duration, callback, context);
    }
    TweenBlink.prototype = new Tween();
    TweenBlink.prototype.parentInitialize = TweenBlink.prototype.initialize;
    TweenBlink.prototype.initialize = function (object, to, bezier, duration, callback, context) {

        bezier = bezier ? bezier : new Bezier(.26, .66, .32, 1.01);

        this.parentInitialize(object, to, bezier, duration, callback, context);

        this._originalAlpha = object.alpha;
        this.startAlpha = object.alpha;
        this.difference = to - this.startAlpha;

        this._repeat = 0;
    };

    TweenBlink.prototype.step = function (dt) {

        this.timePassed += dt;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var newAlpha = 0;

        if (s < 0.5) {
            var percent = s / 0.5;
            var bstep = this.bezier ? this.bezier.get(percent) : percent;

            newAlpha = this.startAlpha + (this.to - this._originalAlpha) * bstep;
        } else {
            var percent = (s - 0.5) / 0.5;
            var bstep = this.bezier ? this.bezier.get(percent) : percent;

            newAlpha = this.to - (this.to - this._originalAlpha) * bstep;
        }

        this.object.alpha = newAlpha;


        if (s === 1) {
            this._cycles++;
            
            this._cycleCallback.call(this.context,this._cycles);
            
            if (this._cycles === this._repeat) {
                this.invokeCallback();
                this.stop();
            }
            this.timePassed -= this.duration;
        }

    };

    window.TweenBlink = TweenBlink;

}(window , app , sharedObject));