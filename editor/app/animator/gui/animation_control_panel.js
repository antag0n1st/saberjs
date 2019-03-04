(function (window, undefined) {

    function AnimationControlPanel(panel) {
        this.initialize(panel);
    }

    AnimationControlPanel.prototype = new AnimationGUI();
    AnimationControlPanel.prototype.guiInitialize = AnimationControlPanel.prototype.initialize;


    AnimationControlPanel.prototype.initialize = function (panel) {
        this.guiInitialize();

        this.panel = panel;

        this.drawRect(0, 0, 400, this.panel.panelTopHeight, 0xffffff);
        this.drawRect(0, this.panel.panelTopHeight + 1, 400, 1, this.panel.panelBorderColor);

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