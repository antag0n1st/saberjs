(function (window, undefined) {


    function ModePolygon(editor) {
        this.initialize(editor);
    }

    ModePolygon.prototype.initialize = function (editor) {
        this.editor = editor;

        this.polygonPoints = [];

        this.polygon = null;

        this.polygonPosition = new V();


    };

    ModePolygon.prototype.onMouseDown = function () {

    };

    ModePolygon.prototype.onMouseMove = function () {

    };

    ModePolygon.prototype.onMouseUp = function (event, sender) {

        var activeLayer = this.editor.activeLayer;

        var cp = new V().copy(activeLayer.getGlobalPosition());
        var p = V.substruction(event.point, cp);
        p.scale(1 / activeLayer.scale.x);

        var gp = new GenericPoint();
        gp.graphics = this.editor.graphics;
        gp.position.set(p.x, p.y);
        gp.build();
        this.polygonPoints.push(gp);

        this.createPolygon();

    };

    ModePolygon.prototype.createPolygon = function () {

        if (this.polygon === null) {

            this.polygon = new PolygonObject();
            this.polygon.graphics = this.editor.graphics;
            this.polygon.build();
            this.editor.activeLayer.addChild(this.polygon);

            var point = this.polygonPoints[this.polygonPoints.length - 1];
            this.polygonPosition.copy(point);

        }

        var point = this.polygonPoints[this.polygonPoints.length - 1];
        this.polygon.points.push(point);
        this.polygon.addChild(point);
        this.polygon.rebuildPolygon();

    };

    ModePolygon.prototype.onModeStart = function () {

    };

    ModePolygon.prototype.onModeEnd = function () {

        if (this.polygon) {
            for (var i = 0; i < this.polygon.points.length; i++) {
                var p = this.polygon.points[i];
                p.position.x -= this.polygonPosition.x;
                p.position.y -= this.polygonPosition.y;
            }

            this.polygon.position.set(this.polygonPosition.x, this.polygonPosition.y);
        }

        if(this.polygonPoints.length === 1){
            this.polygon.removeFromParent();
        }

        this.polygon = null;
        this.polygonPoints = [];
    };

    window.ModePolygon = ModePolygon;

}(window));