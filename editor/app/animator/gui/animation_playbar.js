(function (window, undefined) {

    function AnimationPlaybar(panel) {
        this.initialize(panel);
    }

    AnimationPlaybar.prototype = new AnimationGUI();
    AnimationPlaybar.prototype.guiInitialize = AnimationPlaybar.prototype.initialize;

    AnimationPlaybar.prototype.initialize = function (panel) {

        this.guiInitialize(this);

        this.panel = panel;

        this.drawRect(0, 0, this.panel.panelRightWidth, this.panel.panelTopHeight, 0xffffff);
        this.drawRect(0, this.panel.panelTopHeight + 1, this.panel.panelRightWidth, 1, this.panel.panelBorderColor);
        this.drawRect(0, 0, 1, this.panel.panelHeight, this.panel.panelBorderColor);
        this.drawRect(this.panel.panelRightWidth, 0, 1, this.panel.panelHeight, this.panel.panelBorderColor);

        this.playHead = new AnimationPlayHead();
        this.playHead.y = 25;
        this.playHead.x = 50;
        this.playHead.timelineLength = this.panel.panelRightWidth;

        this.playLine = this.drawRect(0, 26, 1, this.panel.panelHeight - this.panel.panelBottomHeight - this.panel.panelTopHeight, 0x555555);
        this.playLine.removeFromParent();
        this.playHead.addChild(this.playLine);

        this.addChild(this.playHead);

    };

    AnimationPlaybar.prototype.setTimeline = function (percent) {

        this.playHead.x = this.playHead.timelineLength * percent;
        this.playHead.percent = percent; // x / this.timelineLength;
    };


    window.AnimationPlaybar = AnimationPlaybar; // make it available in the main scope

}(window));