(function(window,undefined){
    
    function TweenPulsate(object,scale,bezier,duration,callback){
        this.initialize(object,scale,bezier,duration,callback);
    }    
    TweenPulsate.prototype = new Tween();
    TweenPulsate.prototype.parentInitialize = TweenPulsate.prototype.initialize;    
    TweenPulsate.prototype.initialize = function(object,scale,bezier,duration,callback){        
    
        this.parentInitialize(object, scale, bezier, duration, callback);
        
     //   this.duration = duration/2; 
        
      //  this.initialDuration = duration;      
        this.startScale = object.scale.x;
     //   this.difference = scale;
     //   this.timePassed = 0;
      //  this.ticks = 0;
        
        this._repeat = 0;
    };
    
    TweenPulsate.prototype.step = function(dt){
        
        this.timePassed += dt;
        this.ticks++;
        
        var s = this.timePassed / this.duration;
        
        s = (s >= 1) ? 1.0 : s;
        
        var newScale = 0;

        if (s < 0.5) {
            var percent = s / 0.5;
            var bstep = this.bezier ? this.bezier.get(percent) : percent;

            newScale = this.startScale + (this.to - this.startScale) * bstep;
        } else {
            var percent = (s - 0.5) / 0.5;
            var bstep = this.bezier ? this.bezier.get(percent) : percent;

            newScale = this.to - (this.to - this.startScale) * bstep;
        }

        this.object.scale.set(newScale);
        
        
//        var bstep = this.bezier ? this.bezier.get(s) : s;
//        
//        this.object.scale.set(this.startScale + bstep*this.difference);
        
        if (s === 1) {
            this._cycles++;
            
            this._cycleCallback.call(this.context,this._cycles);
            
            if (this._cycles === this._repeat) {
                this.invokeCallback();
                this.stop();
            }
            this.timePassed -= this.duration;
        }
        
//        if(s===1.0 && this.ticks > 1){
//           
//            this.callback(this.ticks);
//            this.timePassed -= this.duration;
//            this.duration = this.initialDuration;
//            this.difference *= -1;
//            this.startScale = this.object.scale.x;
//            
//        }
        
    };
    
    window.TweenPulsate = TweenPulsate;
    
}(window));