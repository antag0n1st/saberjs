(function (window, undefined) {

    function TweenGeneric(object, to, bezier, duration, callback) {
        this.initialize(object, to, bezier, duration, callback);
    }
    TweenGeneric.prototype = new Tween();
    TweenGeneric.prototype.parentInitialize = TweenGeneric.prototype.initialize;
    TweenGeneric.prototype.initialize = function (object, to, bezier, duration, callback) {

        this.parentInitialize(object, to, bezier, duration, callback);
        this.timePassed = 0;

        this.applyValues();
    };

    TweenGeneric.prototype.applyValues = function () {
                
        this._properties = {};
        this._list = [];

        for (var property in this.to) {
            if (this.to.hasOwnProperty(property)) {
                var k = property;
                this._properties['start'+k] = this.object[k];
                this._properties['difference'+k] = this.to[k] - this.object[k];
                this._list.push(k);
            }
        }
        
    };

    TweenGeneric.prototype.step = function (dt) {

        this.timePassed += dt;

        var relativeStep = this.timePassed / this.duration;

        relativeStep = (relativeStep >= 1) ? 1.0 : relativeStep;

        var bstep = this.bezier ? this.bezier.get(relativeStep) : relativeStep;
        
        for (var i = 0; i < this._list.length; i++) {
            var pk = this._list[i];            
            this.object[pk] = this._properties['start'+pk] + bstep*this._properties['difference'+pk];
        }

        if (relativeStep === 1) {
            this.invokeCallback();
            this.stop();
        }

    };
    
    TweenGeneric.prototype.to = function(to,duration,bezier){
        
    };
    
    TweenGeneric.prototype.call = function(to,duration,bezier){
        
    };

    window.TweenGeneric = TweenGeneric;

}(window));