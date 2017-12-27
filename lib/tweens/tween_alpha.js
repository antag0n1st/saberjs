(function (window, undefined) {

    function TweenAlpha(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }
    TweenAlpha.prototype = new Tween();
    TweenAlpha.prototype.parentInitialize = TweenAlpha.prototype.initialize;
    TweenAlpha.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);        
        this.timePassed = 0;
        
        this.applyValues();
    };

    TweenAlpha.prototype.applyValues = function () {
        this.startAlpha = this.object.alpha;
        this.difference = this.to - this.startAlpha;
    };

    TweenAlpha.prototype.step = function (dt) {

        this.timePassed += dt;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;
        
        var bstep = this.bezier ? this.bezier.get(s) : s;

        this.object.alpha = this.startAlpha + bstep * this.difference;

        if (s === 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenAlpha = TweenAlpha;

}(window));