(function (window, undefined) {

    function AnimationPanelLeft(panel) {
        this.initialize(panel);
    }

    AnimationPanelLeft.prototype = new AnimationGUI();
    AnimationPanelLeft.prototype.guiInitialize = AnimationPanelLeft.prototype.initialize;


    AnimationPanelLeft.prototype.initialize = function (panel) {

        this.guiInitialize();
        this.panel = panel;

        var w = this.panel.panelLeftWidth;
        var h = this.panel.panelHeight - panel.panelBottomHeight - panel.panelTopHeight - 2;

        this.drawRect(0, 0, w, h, 0xf5e0f9);

        this.content = new PIXI.Container();
        this.addChild(this.content);

        this.cellWidth = w;
        this.cellHeight = 50;

        this.mask = new PIXI.Graphics();
        this.mask.clear();
        this.mask.beginFill();
        this.mask.drawRect(0, 0, w, h);
        this.mask.endFill();
        this.addChild(this.mask);

        this.contentLength = 0;
        this.panelHeight = h;

    };

    AnimationPanelLeft.prototype.build = function () {

        this.content.removeChildren();

        var threads = this.panel.animator.animation.threads;
        var padding = 2;

        for (var i = 0; i < threads.length; i++) {
            var thread = threads[i];

            var rect = new Sprite('white');
            rect.width = this.cellWidth;
            rect.height = this.cellHeight;
            rect.tint = 0x42f477;
            rect.position.set(0, i * this.cellHeight + padding * i + padding);
            this.content.addChild(rect);

            var label = new Label(Style.DEFAULT_LABEL);
            label.txt = "property - " + thread.id;
            label.style.fill = 0xffffff;
            label.style.fontFamily = 'Arial';
            label.style.fontSize = 22;
            label.anchor.set(0, 0.5);
            label.position.set(10, rect.y + this.cellHeight / 2);
            this.content.addChild(label);

        }

        this.contentLength = this.content.getBounds().height;

    };

    AnimationPanelLeft.prototype.scroll = function (percent) {

        this.content.y = -(this.contentLength - this.panelHeight) * percent;

    };

    window.AnimationPanelLeft = AnimationPanelLeft; // make it available in the main scope

}(window));