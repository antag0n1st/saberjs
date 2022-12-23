(function (window, undefined) {

    function ImageObject(name) {
        this.initialize(name);
    }

    ImageObject.prototype = new Entity();
    ImageObject.prototype.entityInitialize = ImageObject.prototype.initialize;
    
    ImageObject.prototype.initialize = function (name) {

        this.entityInitialize(name);
        this.type = 'ImageObject';
        this.centered();

        this.hasImage = true;
        this.canTransform = true;

    };

//    ImageObject.prototype._onStretchStarted = function (handleID) {
//        
//        this._initialStretchSize = (handleID === Entity.HANDLE_TOP || handleID === Entity.HANDLE_BOTTOM) ? this.height : this.width;
//       
//    };
//
//    ImageObject.prototype._onStretch = function (amount, handleID) {
//        
//        var a = this._initialStretchSize + amount * 2;
//
//        if (handleID === Entity.HANDLE_TOP || handleID === Entity.HANDLE_BOTTOM) {
//            this.height = a;
//        } else {
//            this.width = a;
//        }
//
//        this.updateFrame();
//    };

    ImageObject.prototype.build = function (data) {

        if (data) {
            
            this.setBasicData(data);
            this.setTexture(data.imageName);

            if (this._importMap) {
                this._importMap(data);
            }

        }

        this.enableSensor();
        this.createFrame(20, 16);
        this.updateFrame();

        this.deselect();

    };


    ImageObject.prototype.onUpdate = function (dt) {
        Entity.prototype.onUpdate.call(this, dt);

    };

    ImageObject.prototype.export = function () {

        var o = this.basicExport();
        o.imageName = this.imageName;

        if (this._exportMap) {
            o = this._exportMap(o);
        }

        return o;

    };

    ImageObject.prototype._setImage = function (name) {

        var sx = this.scale.x;
        var sy = this.scale.y;

        var texture = PIXI.utils.TextureCache[name];
        this.setTexture(name);

        this.width = texture.width;
        this.height = texture.height;

//            if (this.updateSize) {
//                this.scale.set(sx, sy);
//                this.updateSize();
//            } else {

        this.setSensorSize(this.width, this.height);

        this._sensorTranslationX = 0;
        this._sensorTranslationY = 0;
        this._sensorTranslationScaleX = sx;
        this._sensorTranslationScaleY = sy;
        this._sensorRotation = 0;
        this.updateFrame();

        this.scale.set(sx, sy);

        //  }

        this.updateFrame();



    };

    window.ImageObject = ImageObject;

}(window));