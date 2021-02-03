(function (window, app , sharedObject, undefined) {

    function TweenSquashy(object, scale, bezier, duration, callback) {
        this.initialize(object, scale, bezier, duration, callback);
    }
    TweenSquashy.prototype = new Tween();
    TweenSquashy.prototype.parentInitialize = TweenSquashy.prototype.initialize;
    TweenSquashy.prototype.initialize = function (object, to, bezier, duration, callback) {

        bezier = bezier ? bezier : new Bezier(.34,-0.14,.48,.98); // set a default bezier

        this.parentInitialize(object, to, bezier, duration, callback);

        this.duration = duration;
     
        this.applyValues();
    };
    
     TweenSquashy.prototype.applyValues = function () {
        this.startScale_x = this.object.scale.x;
        this.startScale_y = this.object.scale.y;
    };

    TweenSquashy.prototype.step = function (dt) {

        this.timePassed = this.timePassed + dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;

        var bstep = this.bezier ? this.bezier.get(s) : s;
        
        var ds = bstep - s; // strech for the difference of the variation of the curve

        this.object.scale.x = this.startScale_x + this.to * ds;
        this.object.scale.y = this.startScale_y - this.to * ds;

        if (s === 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenSquashy = TweenSquashy;

}(window , app , sharedObject));