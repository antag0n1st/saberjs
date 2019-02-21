(function (window, undefined) {


    function IKSystem(x, y) {
        this.initialize(x, y);
    }

    IKSystem.prototype.initialize = function (x, y) {

        this.x = x;
        this.y = y;
        this.arms = [];
        this.lastArm = null;
    };

    IKSystem.prototype.addArm = function (length) {
        
        var arm = new Arm(0, 0, length, 0);
        
        if (this.lastArm) {
            arm.x = this.lastArm.getEndX();
            arm.y = this.lastArm.getEndY();
            arm.parent = this.lastArm;
        } else {
            arm.x = this.x;
            arm.y = this.y;
        }
        
        this.arms.push(arm);
        this.lastArm = arm;
        
    };

    IKSystem.prototype.render = function (context) {
        for (var i = 0; i < this.arms.length; i++) {
            this.arms[i].render(context);
        }
    };

    IKSystem.prototype.drag = function (x, y) {
        this.lastArm.drag(x, y);
    };

    window.IKSystem = IKSystem;

}(window));