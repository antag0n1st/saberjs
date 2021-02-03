(function (window, app , sharedObject, undefined) {

    function TweenInfinity( callback) {
        this.initialize( callback);
    }
    TweenInfinity.prototype = new Tween();
    TweenInfinity.prototype.parentInitialize = TweenInfinity.prototype.initialize;
    TweenInfinity.prototype.initialize = function ( callback) {

        this.parentInitialize(null, null, null, 0, callback);

        this.applyValues();
    };

    TweenInfinity.prototype.applyValues = function () {

    };

    TweenInfinity.prototype.step = function (dt) {

        this.timePassed += dt;

        this.callback.call(this.context, dt , this.timePassed);

    };

    window.TweenInfinity = TweenInfinity;

}(window , app , sharedObject));