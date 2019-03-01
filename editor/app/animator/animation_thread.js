(function (window, undefined) {


    function AnimationThread() {
        this.initialize();
    }
    
    AnimationThread.prototype.initialize = function () {
       
       this.target = null;
       this.property;

    };

    window.AnimationThread = AnimationThread;

}(window));