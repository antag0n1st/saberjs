(function (window, undefined) {

    function AnimationPlaybar(panel) {
        this.initialize(panel);
    }

    AnimationPlaybar.prototype = Object.create(PIXI.Container.prototype);
    AnimationPlaybar.prototype.constructor = AnimationPlaybar;


    AnimationPlaybar.prototype.initialize = function (panel) {
        PIXI.Container.call(this);

        this.panel = panel;

    };

    AnimationPlaybar.prototype.build = function () {

        this.panel.drawRect(0, 0, 400, 50, 0xffffff);
        this.panel.drawRect(0, 51, 400, 1, this.panel.panelBorderColor);

       

    };


    window.AnimationPlaybar = AnimationPlaybar; // make it available in the main scope

}(window));