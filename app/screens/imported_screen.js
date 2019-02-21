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
        
        
        
//        thepath = this.findById('level-1-1');


    };
    
    ImportedScreen.prototype.onMouseDown = function (event,sender) {
        log("down")
    };
    
    ImportedScreen.prototype.onMouseMove = function (event,sender) {
        log("move")
    };
    
    ImportedScreen.prototype.onMouseUp = function (event,sender) {
        log("up")
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

    window.ImportedScreen = ImportedScreen; // make it available in the main scope

}(window));