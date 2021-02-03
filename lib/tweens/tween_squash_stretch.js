(function (window, app , sharedObject, undefined) {

    function TweenSquashStretch(object, scale, bezier, duration, callback) {
        this.initialize(object, scale, bezier, duration, callback);
    }
    TweenSquashStretch.prototype = new Tween();
    TweenSquashStretch.prototype.parentInitialize = TweenSquashStretch.prototype.initialize;
    TweenSquashStretch.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);

        this.toX = to;
        this.toY = 1 + (1 - to);

        this.startScale = new V().copy(object.scale);


        this._repeat = 0; // repeat forever
    };

    TweenSquashStretch.prototype.step = function (dt) {

        this.timePassed = this.timePassed + dt;


        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;


        var scaleX = 1;
        var scaleY = 1;

        if (s < 0.5) {
            var percent = s / 0.5;
            var bstep = this.bezier ? this.bezier.get(percent) : percent;

            scaleX = this.startScale.x + (this.toX - this.startScale.x) * bstep;
            scaleY = this.startScale.y + (this.toY - this.startScale.y) * bstep;

        } else {
            var percent = (s - 0.5) / 0.5;
            var bstep = this.bezier ? this.bezier.get(percent) : percent;

            scaleX = this.toX - (this.toX - this.startScale.x) * bstep;
            scaleY = this.toY - (this.toY - this.startScale.y) * bstep;

        }

        this.object.scale.set(scaleX, scaleY);


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

    window.TweenSquashStretch = TweenSquashStretch;

}(window , app , sharedObject));