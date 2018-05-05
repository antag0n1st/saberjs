var V = SAT.V;

// define vector methods

V.prototype.setLength = function (length) {
    var angle = this.getAngle();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
    return this;
};

V.prototype.getLength = function () {
    return Math.sqrt(this.len2());
};

V.prototype.setAngle = function (angle) {
    var length = this.len();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
    return this;
};

V.prototype.getAngle = function () {
    return Math.atan2(this.y, this.x);
};

V.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
};

V.addition = function (v1, v2) {
    return new V(v1.x + v2.x, v1.y + v2.y);
};

V.substruction = function (v1, v2) {
    return new V(v1.x - v2.x, v1.y - v2.y);
};

///////////////// Observable Vector

(function (window, undefined) {


    function ObservableVector(x, y, callback, context) {
        this.initialize(x, y, callback, context);
    }
    ObservableVector.prototype = new V();

    ObservableVector.prototype.initialize = function (x, y, callback, context) {

        this._x = x;
        this._y = y;

        this.callback = callback || function () {};
        this.context = context || this;

        this.originalX = x;
        this.originalY = y;

        this.index = -1;

    };

    ObservableVector.prototype.set = function (x, y) {
        var _x = x || 0;
        var _y = y || (y !== 0 ? _x : 0);

        if (this._x !== _x || this._y !== _y) {
            this._x = _x;
            this._y = _y;
            this.callback.call(this.context, this);
        }
    };

    Object.defineProperty(ObservableVector.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            var _x = this._x;
            this._x = value;
            if (_x !== value) {
                this.callback.call(this.context, this);
            }
        }
    });

    Object.defineProperty(ObservableVector.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            var _y = this._y;
            this._y = value;
            if (_y !== value) {
                this.callback.call(this.context, this);
            }
        }
    });

    window.ObservableVector = ObservableVector;

}(window));

var OV = ObservableVector;

///////////////////////////////////////////////////////////
// polygon scale

