(function (window, undefined) {

    function Tween() {
        this.initialize();
    }
    //Tween.prototype = new ParentClassName();
    //Tween.prototype.parentInitialize = Tween.prototype.initialize;    
    Tween.prototype.initialize = function (object, to, bezier, duration, callback, context) {
        // this.parentInitialize();

        this.object = object;
        this.to = to;
        this.bezier = bezier;
        this.duration = duration;
        this.callback = callback || function () {};
        this._cycleCallback = function () {};
        this.context = context || this;

        this.timePassed = 0;
        this.ticks = 0;
        this.isFinished = false;
        this._delay = 0;
        this._name = '';
        this.tag = 0;

        this._repeat = 1; // it will run only once , 0 means it will run forever (if repeatable at all)
        this._cycles = 0; // the number of cycles done
    };

    Tween.prototype.cycleCallback = function (callback, context) {
     
        this.context = context || this;
       
        this._cycleCallback = callback;
        return this;
    };

    Tween.prototype.repeat = function (repetitions) {
        this._repeat = repetitions;
        return this;
    };

    Tween.prototype.name = function (name) {
        this._name = name;
        return this;
    };

    Tween.prototype.delay = function (delay) {
        this._delay = delay || 100;
        return this;
    };

    Tween.prototype.start = function (tag) {
        return this.run(tag);
    };

    Tween.prototype.run = function (tag) {

        this.tag = tag;
        this.isFinished = false;

        if (this._delay) {
            timeout(function () {
                Actions.add(this);
            }, this._delay, this, this.tag);
        } else {
            Actions.add(this);
        }

        return this;

    };

    Tween.prototype.stop = function (stopWithCallback) {
        Actions.remove(this);
        this.timePassed = 0;
        this.ticks = 0;
        this.isFinished = true;
        
        if(stopWithCallback){
            this.invokeCallback();
        }

        return this;
    };

    Tween.prototype.pause = function () {
        this.isPaused = true;

        return this;
    };

    Tween.prototype.resume = function () {
        this.isPaused = false;

        return this;
    };

    Tween.prototype.invokeCallback = function () {

        this.onCallbackInvoked(this.object, this, this.tag);
       
        this.callback.call(this.context, this.object);

    };

    // sequencer methods

    Tween.prototype.onCallbackInvoked = function (object, tween, tag) {
        // this will be overwriten by the sequencer
    };

    Tween.prototype.applyValues = function () {
        // overwrite this function aplay the values of the object
    };
    
    Tween.prototype.onEmmitted = function () {
        // overwrite this function 
    };
    
    

    window.Tween = Tween;

}(window));