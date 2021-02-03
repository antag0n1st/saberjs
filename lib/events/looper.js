(function (window, app , sharedObject, undefined) {

    function Looper(queue, isSingleLoop, delay) {
        this.initialize(queue, isSingleLoop, delay);
    }
    //Looper.prototype = new ParentClassName();
    //Looper.prototype.parentInitialize = Looper.prototype.initialize;    
    Looper.prototype.initialize = function (queue, isSingleLoop, delay) {
        // this.parentInitialize();
        this.queue = [];
        this.numberOfEvents = 0;
        this.totalTime = 0;
        this.callback = function () {
        };
        this.isSingleLoop = isSingleLoop;
        this.currentTime = delay ? -delay : 0;
        this.currentEventName = "";
        this.previousEventName = null;
        this.currentPercent = 0;
        this.isFinished = false;
        this.delay = delay ? delay : 0;

        for (var i = 0; i < queue.length; i++) {

            var event = queue[i];
            if (typeof (event) === "function") {
                this.callback = event;
            } else {
                this.numberOfEvents++;
                this.totalTime += event.duration;
                this.queue.push(event);
            }

        }

    };
    
    Looper.prototype.step = function(dt){
        this.update(dt);
    };

    Looper.prototype.update = function (dt) {

        if (this.isFinished) {
            return false;
        }

        this.currentTime += dt;

        if (this.currentTime < 0) {
            if(this.previousEventName === null) {
               this.previousEventName = "";
            } else {
                this.previousEventName = this.currentEventName;
            }            
            this.currentEventName = "delay";
            this.currentPercent = (this.delay - Math.abs(this.currentTime)) / this.delay;
        }

        var time = 0;

        if (this.currentTime > this.totalTime) {

            if (this.isSingleLoop) {
                this.isFinished = true;
                this.callback();
                return;
            } else {
                this.currentTime -= this.totalTime;
                this.previousEventName = '';
                this.callback();
            }
        }

        for (var i = 0; i < this.queue.length; i++) {

            var event = this.queue[i];
            var t1 = time;
            time += event.duration;

            if (this.currentTime >= t1 && this.currentTime <= time) {
                this.previousEventName = this.currentEventName;
                this.currentEventName = event.name;
                var x = this.currentTime - t1;
                this.currentPercent = x / event.duration;
            }

        }

    };

    Looper.prototype.restart = function () {
        this.isFinished = false;
        this.currentTime = -this.delay;
        this.currentEventName = null;
        this.currentPercent = 0;
        this.previousEventName = null;
    };

    Looper.prototype.goToNext = function () {
        var time = 0;
        for (var i = 0; i < this.queue.length; i++) {

            var event = this.queue[i];
            var t1 = time;
            time += event.duration;

            if (this.currentTime >= t1 && this.currentTime <= time) {
                
                if (this.queue.length > i + 1) {
                    this.currentTime = time + 1;
                    this.currentPercent = 0;
                }
                break;
            }

        }
    };

    Looper.prototype.get = function () {
        return {
            name: this.currentEventName,
            percent: this.currentPercent,
            isFirstTime: (this.previousEventName !== this.currentEventName)
        };
    };

    window.Looper = Looper;

}(window , app , sharedObject));