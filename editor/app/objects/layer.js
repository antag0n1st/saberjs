(function (window, undefined) {

    function Layer() {
        this.initialize();
    }

    Layer.prototype = new Entity();
    Layer.prototype.entityInitialize = Layer.prototype.initialize;
    Layer.prototype.initialize = function () {

        this.entityInitialize(null);

        this.name = '';
        this.factor = 1;
        this.index = 0;
        this.type = 'Layer';
        this.isActive = false; // if it is focused ( can edit its children in the editor)

        this.canResize = false;
        this.hasFrame = false;
        
        this.isInputContent = false;
      
        
    };

    Layer.prototype.build = function (data) {
        
        if (data) {
            this.setBasicData(data);
            
            this.name = data.name;
            this.factor = Number(data.factor);
            this.isActive = data.isActive ? true : false;
            this.isInputContent = data.isInputContent ? true : false;
            
        }
        
        this.enableSensor();        

    };

    Layer.prototype.onUpdate = function (dt) {

    };

    Layer.prototype.export = function () {

        var o = this.basicExport();
        o.name = this.name;
        o.factor = this.factor;
        o.isActive = this.isActive;
        o.isInputContent = this.isInputContent;
        
        delete o.scale;
        delete o.position;
        
        return o;

    };
        

    window.Layer = Layer;

}(window));