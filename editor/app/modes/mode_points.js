(function (window, undefined) {


    function ModePoints(editor) {
        this.initialize(editor);
    }

    ModePoints.prototype.initialize = function (editor) {
        this.editor = editor;





    };

    ModePoints.prototype.onMouseDown = function () {

    };

    ModePoints.prototype.onMouseMove = function () {

    };

    ModePoints.prototype.onMouseUp = function (event, sender) {


         var activeLayer = this.editor.activeLayer;

        var cp = new V().copy(activeLayer.getGlobalPosition());
        var p = V.substruction(event.point, cp);
        p.scale(1 / activeLayer.scale.x);

        var gp = new GenericPoint();
        gp.graphics = this.editor.graphics;
        gp.position.set(p.x, p.y);
        gp.build();
        
        activeLayer.addChild(gp);
        
       // this.polygonPoints.push(gp);

    };



    ModePoints.prototype.onModeStart = function () {

    };

    ModePoints.prototype.onModeEnd = function () {

    };

    window.ModePoints = ModePoints;

}(window));