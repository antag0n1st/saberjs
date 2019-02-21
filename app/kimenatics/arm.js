(function (window, undefined) {


    function Arm(x, y, length, angle) {
        this.initialize(x, y, length, angle);
    }
    
    Arm.prototype.initialize = function (x, y, length, angle) {
      
        this.x = x;
        this.y = y;
        this.length = length || 100;
        this.angle = angle;
        this.parent = null;

    };

    Arm.prototype.getEndX = function () {
        return this.x + Math.cos(this.angle) * this.length;
    };

    Arm.prototype.getEndY = function () {
        return this.y + Math.sin(this.angle) * this.length;
    };

    Arm.prototype.render = function (graphics) {
        
        
        graphics.lineStyle(5, 0xFF00FF, 1);
        
     //   graphics.beginPath();
        graphics.moveTo(this.x, this.y);
        graphics.lineTo(this.getEndX(), this.getEndY());
     //   graphics.stroke();
        
    };

    Arm.prototype.pointAt = function (x, y) {
        var dx = x - this.x,
                dy = y - this.y;
        this.angle = Math.atan2(dy, dx);
    };

    Arm.prototype.drag = function (x, y) {
        this.pointAt(x, y);
        this.x = x - Math.cos(this.angle) * this.length;
        this.y = y - Math.sin(this.angle) * this.length;
        if (this.parent) {
            this.parent.drag(this.x, this.y);
        }
    };

    window.Arm = Arm;

}(window));