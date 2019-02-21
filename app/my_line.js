(function (window, undefined) {

    function MyLine() {
        this.initialize();
    }

    MyLine.prototype = new Sprite();
    MyLine.prototype.spriteInitialize = MyLine.prototype.initialize;
    MyLine.prototype.initialize = function () {

        this.spriteInitialize();

    };

    MyLine.prototype.onUpdate = function (dt) {

    };

    MyLine.prototype.setData = function (data, extract, importer) {
        // invoked when the object is created while importing to stage
        // extract(key, data) - used get the data set using custom properties in the editor
        // this.setTexture(data.imageName);
        //log(data);
       
    };

    MyLine.prototype.onImport = function () {
        // invoked once the object is placed at the scene
        // log(this._properties)
    };

    window.MyLine = MyLine;

}(window));