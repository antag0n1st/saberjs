(function (window, undefined) {

    function HEvent(x, y, type, idx) {
        this.initialize(x, y, type, idx);
    }

    HEvent.UP = 0;
    HEvent.DOWN = 1;
    HEvent.MOVE = 2;
    HEvent.CANCEL = 4;
    HEvent.UNKNOWN = -1;

    //HEvent.prototype = new ParentClassName();
    //HEvent.prototype.parentInitialize = HEvent.prototype.initialize;    
    HEvent.prototype.initialize = function (x, y, type, idx) {
        // this.parentInitialize();
        this.propagate = true;
        this.isCanceled = false;
        this.point = new V(x || 0, y || 0);
        this.type = type;
        this.idx = idx;
    };

    HEvent.prototype.stopPropagation = function () {
        this.propagate = false;
    };

    HEvent.prototype.cancel = function () {
        this.isCanceled = true;
    };

    window.HEvent = HEvent;

}(window));