(function (window, undefined) {


    function ModeLines(editor) {
        this.initialize(editor);
    }

    ModeLines.prototype.initialize = function (editor) {
        this.editor = editor;


        this.linePoints = [];

        this.line = null;

        this.linePosition = new V();

        this.lastPosition = new V();

        this.ghostPoint = null;
        this.lastGPP = new V();

    };

    ModeLines.prototype.onMouseDown = function (event) {

        this.lastPosition.copy(event.point);

        // add ghost point
        if (this.linePoints.length) {
            this.linePoints;

            this.ghostPoint = this.addPoint(event);
            this.lastGPP.copy(this.ghostPoint.position);

            var point = this.ghostPoint;
            this.line.points.push(point);
            this.line.addChild(point);
            this.line.rebuildLine();
        }
    };

    ModeLines.prototype.onMouseMove = function (event) {

        if (this.linePoints.length > 1) {



            this.ghostPoint.x = this.lastGPP.x - (this.lastPosition.x - event.point.x);
            this.ghostPoint.y = this.lastGPP.y - (this.lastPosition.y - event.point.y);

            if (this.editor.shortcuts.isXPressed) {
                this.ghostPoint.position.y = this.linePoints[this.linePoints.length - 2].y;
            } else if (this.editor.shortcuts.isZPressed) {
                this.ghostPoint.position.x = this.linePoints[this.linePoints.length - 2].x;
            }
        }

    };

    ModeLines.prototype.onMouseUp = function (event, sender) {

        if (this.linePoints.length > 1) {
            // the ghost point will act as the final point
            return;
        }

        this.addPoint(event);

        this.createLine();

    };

    ModeLines.prototype.addPoint = function (event) {
        var activeLayer = this.editor.activeLayer;

        var cp = new V().copy(activeLayer.getGlobalPosition());
        var p = V.substruction(event.point, cp);
        p.scale(1 / activeLayer.scale.x);

        var gp = new GenericPoint();
        gp.graphics = this.editor.graphics;
        gp.position.set(p.x, p.y);

        if (this.linePoints.length && this.editor.shortcuts.isXPressed) {
            gp.position.y = this.linePoints[this.linePoints.length - 1].y;
        } else if (this.linePoints.length && this.editor.shortcuts.isZPressed) {
            gp.position.x = this.linePoints[this.linePoints.length - 1].x;
        }

        gp.build();
        this.linePoints.push(gp);

        return gp;
    };

    ModeLines.prototype.createLine = function () {

        if (this.line === null) {

            this.line = new LineObject();
            this.line.graphics = this.editor.graphics;
            this.line.build();
            this.editor.activeLayer.addChild(this.line);

            var point = this.linePoints[this.linePoints.length - 1];
            this.linePosition.copy(point);

        }

        var point = this.linePoints[this.linePoints.length - 1];
        this.line.points.push(point);
        this.line.addChild(point);
        this.line.rebuildLine();

    };

    ModeLines.prototype.onModeStart = function () {

        //TODO if there is a selected object , then brake it down for editing

    };

    ModeLines.prototype.onModeEnd = function () {

        if (this.line) {
            for (var i = 0; i < this.line.points.length; i++) {
                var p = this.line.points[i];
                p.position.x -= this.linePosition.x;
                p.position.y -= this.linePosition.y;
            }

            this.line.position.set(this.linePosition.x, this.linePosition.y);
        }

        if (this.linePoints.length === 1) {
            this.line.removeFromParent();
        }

        this.line = null;
        this.linePoints = [];

    };

    window.ModeLines = ModeLines;

}(window));