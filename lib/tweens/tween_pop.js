(function (window, app , sharedObject, undefined) {

    function TweenPop(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }

    TweenPop.prototype = new Tween();
    TweenPop.prototype.parentInitialize = TweenPop.prototype.initialize;

    TweenPop.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);

        this.bezier2 = new Easing(Easing.EASE_OUT_ELASTIC);
              
        this.nonBouncePercent = 0.1;
        
        this.applyValues();
    };
    
    TweenPop.prototype.applyValues = function () {
        this.startScale = this.object.scale.x;       
        this.difference = this.startScale - this.to; 
    };
    
    TweenPop.prototype.nonBounce = function (nonBounce) {        
        this.nonBouncePercent = nonBounce;
        return this;
    };
    
    TweenPop.prototype.elsticity = function (elasticity) {
        
        this.bezier2.elsticity = elasticity;
        
        return this;
    };

    TweenPop.prototype.step = function (dt) {

        this.timePassed = this.timePassed + dt;
        this.ticks++;

        var s = this.timePassed / this.duration;

        s = (s >= 1) ? 1.0 : s;


        if (s <= this.nonBouncePercent) {

            var ss = s / this.nonBouncePercent;
            if(this.bezier){
               ss = this.bezier.get(s / this.nonBouncePercent);
            }
            this.object.scale.set(this.startScale + (this.to - this.startScale) * ss);
        } else {
            var ss = (s - this.nonBouncePercent) / (1 - this.nonBouncePercent);
            var bstep = this.bezier2.get(ss);
            this.object.scale.set(this.to + bstep * this.difference);
        }



        if (s === 1.0 && this.ticks > 1) {
            this.invokeCallback();
            this.stop();
        }

    };

    window.TweenPop = TweenPop;

}(window , app , sharedObject));