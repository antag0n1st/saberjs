(function (window, undefined) {

    function ObservableGenericPoint(x, y, callback) {
        this.initialize(x, y, callback);
    }

    ObservableGenericPoint.prototype = new Entity();
    ObservableGenericPoint.prototype.entityInitialize = ObservableGenericPoint.prototype.initialize;
    ObservableGenericPoint.prototype.initialize = function (x, y, callback) {

        this.entityInitialize(null);
        this.type = 'ObservableGenericPoint';
        this.centered();
        
        this.index = 0;

        this.callback = callback || function () {};
        this._x = x || 0;
        this._y = y || 0;

        this.transform.position.x = this._x;
        this.transform.position.y = this._y;

        this.graphics = null;

        this.imageName = ''; // in order to prevent showing into the layer tree view

        this.delegate = null;

        this.canResize = false;
        this.hasFrame = false;

    };

    ObservableGenericPoint.prototype.toData = function () {
        return {x: this.x, y: this.y , index: this.index};
    };

    ObservableGenericPoint.prototype._onSelect = function (data) {
        if (this.delegate && this.delegate.onPointSelected) {
            this.delegate.onPointSelected(this);
        }
        //this.draw();
    };

    ObservableGenericPoint.prototype._onDeselect = function (data) {
        if (this.delegate && this.delegate.onPointDeselected) {
            this.delegate.onPointDeselected(this);
        }
    };

    ObservableGenericPoint.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
        }

        this.enableSensor(this);

        this.setSensorSize(20, 20);

        this.canResize = false;
        this.hasFrame = false;

        this.deselect();

        var that = this;

        this.position.cb = function () {
            this._localID++;
            if (that.delegate && that.delegate.onPointChange) {
                that.delegate.onPointChange(that);
            }
        };

    };


    ObservableGenericPoint.prototype.onUpdate = function (dt) {

        return;

        if (!this.visible || !this.parent.visible) {
            return;
        }

        this.draw();

    };

    ObservableGenericPoint.prototype.draw = function (zoomLevel = 0) {

        if (!this.visible) {
            return;
        }

        var p = this.position;

        var fillColor = 0x2d31e6;
        var strokeColor = 0xffffff;
        var alpha = 0.6;

        if (this.isSelected) {
            strokeColor = 0xadaee8;
            alpha = 0.9;
        }

        var zl = Math.clamp(1 - zoomLevel, 0.7, 1.5);

        this.graphics.lineStyle(2, strokeColor, 1);
        this.graphics.beginFill(fillColor, alpha);
        this.graphics.drawCircle(p.x, p.y, 10 * zl);
        this.graphics.endFill();
    };

    ObservableGenericPoint.prototype._onDelete = function () {
        if (this.delegate && this.delegate.onPointDelete) {
            this.delegate.onPointDelete(this);
        }
    };

    ObservableGenericPoint.prototype.export = function () {

        var o = this.basicExport();

        return o;

    };

    ObservableGenericPoint.prototype.copy = function (toCopy) {
        this.set(toCopy.x, toCopy.y);
    };
    
    ObservableGenericPoint.prototype.setNoCallback = function (x, y) {
        var _x = x || 0;
        var _y = y || (y !== 0 ? _x : 0);

        if (this._x !== _x || this._y !== _y) {
            this._x = _x;
            this._y = _y;
            this.transform.position.x = this._x;
            this.transform.position.y = this._y;
        }
    };

    ObservableGenericPoint.prototype.set = function (x, y) {

        var dx = x - this._x;
        var dy = y - this._y;

        var _x = x || 0;
        var _y = y || (y !== 0 ? _x : 0);

        if (this._x !== _x || this._y !== _y) {
            this._x = _x;
            this._y = _y;

            this.transform.position.x = this._x;
            this.transform.position.y = this._y;

            this.callback(this, dx, dy);
        }
    };

    Object.defineProperty(ObservableGenericPoint.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            var dx = value - this._x;

            var _x = this._x;
            this._x = value;
            this.transform.position.x = this._x;
            if (_x !== value) {
                this.callback(this, dx, 0);
            }
        }
    });

    Object.defineProperty(ObservableGenericPoint.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            var dy = value - this._y;

            var _y = this._y;
            this._y = value;
            this.transform.position.y = this._y;
            if (_y !== value) {
                this.callback(this, 0, dy);
            }
        }
    });

    window.ObservableGenericPoint = ObservableGenericPoint;

}(window));