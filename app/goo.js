(function (window, undefined) {

    function Goo() {
        this.initialize();
    }

    Goo.prototype = new Sprite();
    Goo.prototype.spriteInitialize = Goo.prototype.initialize;
    Goo.prototype.initialize = function () {

        this.spriteInitialize('circle-blur');
        
        this.velocity = new V();

    };

    Goo.prototype.onUpdate = function (dt) {
        // you could also use postUpdate method

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;

    };

    Goo.prototype.setData = function (data, extract, importer) {
        // invoked when the object is created while importing to stage
        // extract(key, data) - used get the data set using custom properties in the editor
        // this.setTexture(data.imageName);
    };

    Goo.prototype.onImport = function (data) {
        // invoked once the object is placed at the scene
    };

    window.Goo = Goo;

}(window));