(function (window, undefined) {

    function ImportedScreen() {
        this.initialize();
    }

    ImportedScreen.prototype = new HScreen();
    ImportedScreen.prototype.screenInitialize = ImportedScreen.prototype.initialize;


    ImportedScreen.prototype.initialize = function () {
        this.screenInitialize();
        this.TYPE = ImportedScreen.TYPE;

        this.importer = new Importer(this);

        this.content = new Layer();
        this.addChild(this.content);

        this._screenPosition = new V();

        this.importer.importObjects(ContentManager.jsons.stage.objects, this.content);

        this.moveScreenTo(ContentManager.jsons.stage.screenPosition);

        var btn = this.findById('myButton');

        btn.onMouseUp = function () {
            Sounds.click.play();
        };
        
        var r = this.findByTag(1);
        log(r);

        

    };

    ImportedScreen.prototype.moveScreenTo = function (p) {

        var dp = V.substruction(p, this._screenPosition);
        this._screenPosition.copy(p);
       
        // adjust the layers acording to their factor

        for (var i = 0; i < this.content.children.length; i++) {
            var layer = this.content.children[i];
            var np = new V().copy(dp).scale(layer.factor * layer.scale.x);
          
            this.adjustLayerPosition(layer, np);
        }


    };

    ImportedScreen.prototype.adjustLayerPosition = function (layer, np) {
        layer.position.x += np.x;
        layer.position.y += np.y;
    };

    ImportedScreen.prototype.update = function (dt) {
        HScreen.prototype.update.call(this);

    };

    ImportedScreen.prototype.onShow = function () {
        HScreen.prototype.onShow.call(this);

    };

    ImportedScreen.prototype.onHide = function () {
        HScreen.prototype.onHide.call(this);

    };

    ImportedScreen.prototype.onMouseDown = function (event, sender) {

    };

    ImportedScreen.prototype.onMouseMove = function (event, sender) {

    };

    ImportedScreen.prototype.onMouseUp = function (event, sender) {

    };

    ImportedScreen.prototype.onMouseCancel = function (event, sender) {

    };

    ImportedScreen.prototype.onRightMouseDown = function (event, sender) {

    };

    ImportedScreen.prototype.onRightMouseMove = function (event, sender) {

    };

    ImportedScreen.prototype.onRightMouseUp = function (event, sender) {

    };

    ImportedScreen.prototype.onNote = function (name, data, sender) {

    };

    ImportedScreen.prototype.onResize = function () {

    };

    ImportedScreen.prototype.destroy = function () {

    };

    window.ImportedScreen = ImportedScreen; // make it available in the main scope

}(window));