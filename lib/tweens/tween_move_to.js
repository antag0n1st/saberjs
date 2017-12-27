(function (window, undefined) {

    function TweenMoveTo(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }
    TweenMoveTo.prototype = new Tween();
    TweenMoveTo.prototype.parentInitialize = TweenMoveTo.prototype.initialize;
    TweenMoveTo.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);

        this.applyValues();
        
    };

    TweenMoveTo.prototype.applyValues = function () {

        var p = this.object.position;
        this.startPosition = new V(p.x, p.y);

        this.distanceX = this.to.x - p.x;
        this.distanceY = this.to.y - p.y;
    };

    TweenMoveTo.prototype.step = function (dt) {

        this.timePassed += dt;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var bstep = this.bezier ? this.bezier.get(s) : s;

        this.object.position.set(this.startPosition.x + this.distanceX * bstep, this.startPosition.y + this.distanceY * bstep);

        if (s === 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenMoveTo = TweenMoveTo;

}(window));