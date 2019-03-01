(function (window, undefined) {

    function AnimationPanel() {
        this.initialize();
    }

    AnimationPanel.prototype = Object.create(PIXI.Container.prototype);
    AnimationPanel.prototype.constructor = AnimationPanel;


    AnimationPanel.prototype.initialize = function () {

        PIXI.Container.call(this);

        this.panelHeight = 360;
        this.panelTopHeight = 60;
        this.panelLeftWidth = 400;
        this.isOn = false;

        this.backgroundColor = 0xf5fae4;
        this.panelBorderColor = 0x8d8d8d;

        this.controlPanel = new AnimationControlPanel(this);
        this.addChild(this.controlPanel);

        this.playbar = new AnimationPlaybar(this);
        this.addChild(this.playbar);

        this.setSensorSize(app.width, this.panelHeight);


    };

    AnimationPanel.prototype.drawRect = function (x, y, width, height, color, alpha) {

        var rect = new Sprite('white');
        rect.width = width;
        rect.height = height;
        rect.tint = color;
        rect.position.set(x, y);
        rect.alpha = alpha || 1;
        this.addChild(rect);

        return rect; // so that I might change the tint

    };

    AnimationPanel.prototype.build = function () {

        // draw the panel
        this.drawRect(0, -1, app.width, 2, this.panelBorderColor);
        this.drawRect(0, 0, app.width, this.panelHeight, this.backgroundColor);
        this.drawRect(this.panelLeftWidth + 1, 0, 1, this.panelHeight, this.panelBorderColor);

        this.controlPanel.build();
        this.playbar.build();

    };

    AnimationPanel.prototype.show = function (actor) {

        this.animator = new Animator(actor);

        this.isTouchable = true;
        Actions.stopByTag('animator_show');
        new TweenAlpha(this, 1, null, 200, function () {

        }).run('animator_show');

        this.build();

        this.isOn = true;

    };

    AnimationPanel.prototype.hide = function () {

        this.isTouchable = false;
        Actions.stopByTag('animator_show');
        new TweenAlpha(this, 0, null, 200, function () {

        }).run('animator_show');

        this.isOn = false;

    };

    AnimationPanel.prototype.onMouseDown = function (event, sender) {

    };


    window.AnimationPanel = AnimationPanel; // make it available in the main scope

}(window));