(function (window, undefined) {


    function ModeBezier(editor) {
        this.initialize(editor);
    }

    ModeBezier.prototype.initialize = function (editor) {
        this.editor = editor;

        this.path = null;

        this.pathPosition = new V();


    };


    ModeBezier.prototype.onMouseDown = function (event, sender) {

    };

    ModeBezier.prototype.onMouseMove = function (event, sender) {

    };

    ModeBezier.prototype.onMouseUp = function (event, sender) {

        var activeLayer = this.editor.activeLayer;

        var cp = new V().copy(activeLayer.getGlobalPosition());
        var p = V.substruction(event.point, cp);
        p.scale(1 / activeLayer.scale.x);


        if (!this.path) {
            this.path = new PathObject();
            this.path.position.set(p.x, p.y);
            this.pathPosition.set(p.x, p.y);
            activeLayer.addChild(this.path);
            this.path.build();

        }

        // TODO check if any modification keys are pressed , CTRL or SHIFT or ALT

        this.path.addPoint(p.x - this.pathPosition.x, p.y - this.pathPosition.y, this.path.lastPoint);


    };

    ModeBezier.prototype.onModeStart = function () {

    };

    ModeBezier.prototype.onModeEnd = function () {

        if (this.path && this.path.points.length === 1) {
            this.path.removeFromParent();
        }

        this.path = null;

        this.pathPosition = new V();
    };

    window.ModeBezier = ModeBezier;

}(window));