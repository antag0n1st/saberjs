(function (window, undefined) {

    function AnimationGUI() {
        this.initialize();
    }

    AnimationGUI.prototype = Object.create(PIXI.Container.prototype);
    AnimationGUI.prototype.constructor = AnimationGUI;

    AnimationGUI.prototype.initialize = function () {
        PIXI.Container.call(this);

    };
    
     AnimationGUI.prototype.drawRect = function (x, y, width, height, color, alpha) {

        var rect = new Sprite('white');
        rect.width = width;
        rect.height = height;
        rect.tint = color;
        rect.position.set(x, y);
        rect.alpha = alpha || 1;
        this.addChild(rect);

        return rect; // so that I might change the tint

    };

    window.AnimationGUI = AnimationGUI; // make it available in the main scope

}(window));