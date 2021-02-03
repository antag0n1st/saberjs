(function (window, app , sharedObject, undefined) {

    function Easing(type) {
        this.initialize(type);
    }

    Easing.EASE_IN_ELASTIC = 0;
    Easing.EASE_OUT_ELASTIC = 1;
    Easing.EASE_IN_OUT_ELASTIC = 2;
    Easing.EASE_IN_BOUNCE = 3;
    Easing.EASE_OUT_BOUNCE = 4;
    Easing.EASE_IN_OUT_BOUNCE = 5;

    Easing.prototype.initialize = function (type) {
        
        this.easingFunction = null;
        this.elasticity = 10;

        if (type === Easing.EASE_IN_BOUNCE) {
            this.easingFunction = this.easeInBounce;
        } else if (type === Easing.EASE_IN_ELASTIC) {
            this.easingFunction = this.easeInElastic;
        } else if (type === Easing.EASE_IN_OUT_BOUNCE) {
            this.easingFunction = this.easeInOutBounce;
        } else if (type === Easing.EASE_IN_OUT_ELASTIC) {
            this.easingFunction = this.easeInOutElastic;
        } else if (type === Easing.EASE_OUT_BOUNCE) {
            this.easingFunction = this.easeOutBounce;
        } else if (type === Easing.EASE_OUT_ELASTIC) {
            this.easingFunction = this.easeOutElastic;
        }

    };

    Easing.prototype.get = function (value) {
        return this.easingFunction(value, 0, 1, 1);
    };

    Easing.prototype.easeInElastic = function (time, begin, change, duration) {     
        var p = 0;
        var a = change;
        var s = 0;
        if (time === 0)
            return begin;
        if ((time /= duration) === 1)
            return begin + change;
        if (!p)
            p = duration * .3;
        if (a < Math.abs(change)) {
            a = change;
            s = p / 4;
        } else
            s = p / (2 * Math.PI) * Math.asin(change / a);
        return -(a * Math.pow(2, this.elasticity * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p)) + begin;
    };

    Easing.prototype.easeOutElastic = function (time, begin, change, duration) {
      
        var p = 0;
        var a = change;
        var s = 0;

        if (time === 0) {
            return begin;
        }

        if ((time /= duration) === 1) {
            return begin + change;
        }

        if (!p) {
            p = duration * .3;
        }

        if (a < Math.abs(change)) {
            a = change;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(change / a);
        }

        return a * Math.pow(2, -this.elasticity * time) * Math.sin((time * duration - s) * (2 * Math.PI) / p) + change + begin;
    };

    Easing.prototype.easeInOutElastic = function (time, begin, change, duration) {
        var s = 1.70158;
        var p = 0;
        var a = change;
        var s = 0;
        if (time === 0)
            return begin;
        if ((time /= duration / 2) === 2)
            return begin + change;
        if (!p)
            p = duration * (.3 * 1.5);
        if (a < Math.abs(change)) {
            a = change;
            s = p / 4;
        } else
            s = p / (2 * Math.PI) * Math.asin(change / a);
        if (time < 1)
            return -.5 * (a * Math.pow(2, this.elasticity * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p)) + begin;
        return a * Math.pow(2, -this.elasticity * (time -= 1)) * Math.sin((time * duration - s) * (2 * Math.PI) / p) * .5 + change + begin;
    };

    Easing.prototype.easeInBounce = function (time, begin, change, duration) {
        return change - this.easeOutBounce(duration - time, 0, change, duration) + begin;
    };

    Easing.prototype.easeOutBounce = function (time, begin, change, duration) {
        if ((time /= duration) < (1 / 2.75)) {
            return change * (7.5625 * time * time) + begin;
        } else if (time < (2 / 2.75)) {
            return change * (7.5625 * (time -= (1.5 / 2.75)) * time + .75) + begin;
        } else if (time < (2.5 / 2.75)) {
            return change * (7.5625 * (time -= (2.25 / 2.75)) * time + .9375) + begin;
        } else {
            return change * (7.5625 * (time -= (2.625 / 2.75)) * time + .984375) + begin;
        }
    };

    Easing.prototype.easeInOutBounce = function (time, begin, change, duration) {
        if (time < duration / 2)
            return this.easeInBounce(time * 2, 0, change, duration) * .5 + begin;
        return this.easeOutBounce(time * 2 - duration, 0, change, duration) * .5 + change * .5 + begin;
    };

    window.Easing = Easing;

}(window , app , sharedObject));