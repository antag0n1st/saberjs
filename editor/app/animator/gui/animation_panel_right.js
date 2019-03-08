(function (window, undefined) {

    function AnimationPanelRight(panel) {
        this.initialize(panel);
    }

    AnimationPanelRight.prototype = new AnimationGUI();
    AnimationPanelRight.prototype.guiInitialize = AnimationPanelRight.prototype.initialize;


    AnimationPanelRight.prototype.initialize = function (panel) {

        this.guiInitialize();
        this.panel = panel;




        var w = this.panel.panelRightWidth;
        var h = this.panel.panelHeight - panel.panelBottomHeight - panel.panelTopHeight - 2;

        this.drawRect(0, 0, w, h, 0xf5e0f9);

        this.content = new PIXI.Container();
        this.addChild(this.content);

        this.cellWidth = 0; /// to be calculated
        this.cellHeight = 50;

        this.mask = new PIXI.Graphics();
        this.mask.clear();
        this.mask.beginFill();
        this.mask.drawRect(0, 0, this.panel.panelRightWidth, h);
        this.mask.endFill();
        this.addChild(this.mask);

        this.contentLength = 0;
        this.panelHeight = h;

    };

    AnimationPanelRight.prototype.build = function () {

        this.content.removeChildren();

        var duration = this.panel.animator.animation.duration;

        var factor = 0.2;

        var oneSec = 1000 * factor;

        var secs = Math.floor(duration / 1000);


        this.cellWidth = duration * factor;


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

            for (var j = 1; j < secs; j++) {
                var label = new Label(Style.DEFAULT_LABEL);
                label.txt = "" + j;
                label.style.fill = 0xffffff;
                label.style.fontFamily = 'Arial';
                label.style.fontSize = 22;
                label.anchor.set(0.5, 0.5);
                label.position.set(j * oneSec, rect.y + this.cellHeight / 2);
                this.content.addChild(label);

            }



        }

        this.contentLength = this.content.getBounds().height;

    };

    AnimationPanelRight.prototype.scrollY = function (percent) {

        this.content.y = -(this.contentLength - this.panelHeight) * percent;

    };

    AnimationPanelRight.prototype.scrollX = function (percent) {

        this.content.x = -(this.cellWidth - this.panel.panelRightWidth) * percent;

        // this.content.y = -(this.contentLength - this.panelHeight) * percent;

    };

    window.AnimationPanelRight = AnimationPanelRight; // make it available in the main scope

}(window));