(function (window, app , sharedObject, undefined) {

    function Layer() {
        this.initialize();
    }

    Layer.prototype = Object.create(PIXI.Container.prototype);
    Layer.prototype.constructor = Layer;

    Layer.prototype.initialize = function () {

        PIXI.Container.call(this);
        this.enableSensor();
        this.setSensorSize(app.width, app.height);


    };


    window.Layer = Layer;

}(window , app , sharedObject));