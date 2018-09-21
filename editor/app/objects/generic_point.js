(function (window, undefined) {

    function GenericPoint() {
        this.initialize();
    }

    GenericPoint.prototype = new Entity();
    GenericPoint.prototype.entityInitialize = GenericPoint.prototype.initialize;
    GenericPoint.prototype.initialize = function () {

        this.entityInitialize(null);
        this.type = 'GenericPoint';
        this.centered();

        this.graphics = null;

        this.imageName = ''; // in order to prevent showing into the layer tree view

        this.delegate = null;

    };

    GenericPoint.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
        }

        this.enableSensor();

        this.setSensorSize(30, 30);

        this.canResize = false;
        this.hasFrame = false;

        this.deselect();

        var that = this;

        this.position.cb = function () {
            this._localID++;
            if(that.delegate && that.delegate.onPointChange){
                that.delegate.onPointChange(that);
            }
        };

    };


    GenericPoint.prototype.onUpdate = function (dt) {

        if (!this.visible || !this.parent.visible) {
            return;
        }

        var graphics = this.graphics;

        var p = this.getGlobalPosition();

        var fillColor = 0x2d31e6;
        var strokeColor = 0xffffff;
        var alpha = 0.6;

        if (this.isSelected) {
            strokeColor = 0xadaee8;
            alpha = 0.9;
        }

        graphics.lineStyle(2, strokeColor, 1);
        graphics.beginFill(fillColor, alpha);

        graphics.drawCircle(p.x, p.y, 15);
        graphics.endFill();

    };
    
    GenericPoint.prototype._onDelete = function () {
        if(this.delegate && this.delegate.onPointChange){
                this.delegate.onPointDelete(this);
            }
    };

    GenericPoint.prototype.export = function () {

        var o = this.basicExport();

        return o;

    };

    window.GenericPoint = GenericPoint;

}(window));