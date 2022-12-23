(function (window, undefined) {


    function CommandUpdatePoints(object, toPoints) {
        this.initialize(object, toPoints);
    }

    CommandUpdatePoints.prototype.initialize = function (object, toPoints) {

        this.object = object;
        this.initialPoints = object.initialPoints.slice();
        this.finalPoints = object.toPoints(object.finalPoints);
        this.toPoints = toPoints.slice();
        this.isExecuted = false;

    };

    CommandUpdatePoints.prototype.execute = function () {
        if (!this.isExecuted) {
            
            this.object.initialPoints = this.toPoints;            
            this.object.rebuildMesh(this.object.meshName, this.toPoints);
            setTimeout(() => {
                this.object.renderPoints();
            }, 200);

            this.isExecuted = true;
        }
    };

    CommandUpdatePoints.prototype.undo = function () {
        if (this.isExecuted) {
            this.object.initialPoints = this.initialPoints;
            this.object.rebuildMesh(this.object.meshName, this.initialPoints);
            this.object.movePointsTo(this.finalPoints);
            
            setTimeout(() => {
                this.object.renderPoints();
            }, 200);

            this.isExecuted = false;
        }
    };

    window.CommandUpdatePoints = CommandUpdatePoints;

}(window));