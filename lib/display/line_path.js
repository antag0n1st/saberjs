(function (window, undefined) {

    function LinePath() {
        this.initialize();
    }

    LinePath.prototype = Object.create(PIXI.Sprite.prototype);
    LinePath.prototype.constructor = LinePath;
    LinePath.prototype.initialize = function () {

         PIXI.Sprite.call(this);
         
         this.points = [];

    };

    LinePath.prototype.onUpdate = function (dt) {

    };

    LinePath.prototype.setData = function (data, extract, importer) {
        // invoked when the object is created while importing to stage
        // extract(key, data) - used get the data set using custom properties in the editor
        // this.setTexture(data.imageName);
    };

    LinePath.prototype.onImport = function () {
        // invoked once the object is placed at the scene
    };

    window.LinePath = LinePath;

}(window));