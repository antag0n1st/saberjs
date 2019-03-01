(function (window, undefined) {

    function AnimationControlPanel(panel) {
        this.initialize(panel);
    }

    AnimationControlPanel.prototype = Object.create(PIXI.Container.prototype);
    AnimationControlPanel.prototype.constructor = AnimationControlPanel;

    AnimationControlPanel.prototype.initialize = function (panel) {
        PIXI.Container.call(this);

        this.panel = panel;

    };

    AnimationControlPanel.prototype.build = function () {

        this.panel.drawRect(0, 0, 400, 50, 0xffffff);
        this.panel.drawRect(0, 51, 400, 1, this.panel.panelBorderColor);
        
        this.showControls();

    };
    
    AnimationControlPanel.prototype.showControls = function () {
        
        //TODO build buttons here
        
        // animation duration
        // panel zoom level
        // play , stop
        // loop
        // create new animation
        // auto key on/off

    };

    window.AnimationControlPanel = AnimationControlPanel; // make it available in the main scope

}(window));