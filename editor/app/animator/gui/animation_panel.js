(function (window, undefined) {

    function AnimationPanel(editor) {
        this.initialize(editor);
    }

    AnimationPanel.prototype = new AnimationGUI();
    AnimationPanel.prototype.guiInitialize = AnimationPanel.prototype.initialize;

    AnimationPanel.prototype.initialize = function (editor) {

        this.guiInitialize.call(this);

        this.animator = null;
        this.editor = editor;

        this.zoomLevel = 1;
        this.factor = 0.6 * this.zoomLevel;
        this.FPS = 30;


        this.keyframes = [];
        this.controls = [];
        this.clickedControl = null;

        this.panelPadding = 30;
        this.rightScrollWidth = 30;
        this.panelBottomHeight = 30;

        this.panelHeight = 360;
        this.panelTopHeight = 50;
        this.panelLeftWidth = 400;

        this.panelRightWidth = app.width - this.panelLeftWidth - 3 - this.panelPadding - this.rightScrollWidth; // its the separators
        this.isOn = false;

        this.backgroundColor = 0xf5fae4;
        this.panelBorderColor = 0x8d8d8d;

        //TODO figure out when to build , what to build

        ////////////////

        this.drawRect(0, -1, app.width, 2, this.panelBorderColor);
        this.drawRect(0, 0, app.width, this.panelHeight, this.backgroundColor);
        this.drawRect(this.panelLeftWidth + 1, 0, 1, this.panelHeight, this.panelBorderColor);
        this.drawRect(this.panelLeftWidth + 1 + this.panelPadding, this.panelHeight - this.panelBottomHeight, this.panelRightWidth, 1, this.panelBorderColor);

        /////////////////////

        this.leftPanel = new AnimationPanelLeft(this);
        this.leftPanel.y = this.panelTopHeight + 1;
        this.addChild(this.leftPanel);

        this.rightPanel = new AnimationPanelRight(this);
        this.rightPanel.y = this.panelTopHeight + 1;
        this.rightPanel.x = this.panelLeftWidth + 2 + this.panelPadding;
        this.addChild(this.rightPanel);

        this.controlPanel = new AnimationControlPanel(this);
        this.addChild(this.controlPanel);

        this.scrollRight = new AnimationScrollRight(this);
        this.scrollRight.position.set(app.width - this.rightScrollWidth, 0); // , this.rightScrollWidth , this.panelHeight
        this.scrollRight.delegate = this;
        this.addChild(this.scrollRight);



        this.playbar = new AnimationPlaybar(this);
        this.playbar.position.set(this.panelLeftWidth + 2 + this.panelPadding, 0);
        this.playbar.playHead.delegate = this;
        this.addChild(this.playbar);

        this.scrollBottom = new AnimationScrollBottom(this);
        this.scrollBottom.position.x = this.panelLeftWidth + 2 + this.panelPadding;
        this.scrollBottom.position.y = this.panelHeight - this.panelBottomHeight;
        this.scrollBottom.delegate = this;
        this.addChild(this.scrollBottom);

        this.controls.push(this.playbar.playHead);
        this.controls.push(this.scrollRight.pad);
        this.controls.push(this.scrollBottom.pad);

        this.setSensorSize(app.width, this.panelHeight);
    };

    AnimationPanel.prototype.onRightScrollMove = function (percent) {
        this.leftPanel.scroll(percent);
        this.rightPanel.scrollY(percent);
    };

    AnimationPanel.prototype.onBottomScrollMove = function (percent) {
        this.rightPanel.scrollX(percent);
    };

    AnimationPanel.prototype.onScroll = function (direction) {

        if (this.editor.shortcuts.isCtrlPressed) {

            this.zoomLevel += direction * 0.1;
            this.zoomLevel = Math.clamp(this.zoomLevel, 0.1, 3);
            
            this.factor = 0.5 * this.zoomLevel;

            this.rightPanel.zoomLevel = this.zoomLevel;
            this.rightPanel.build();
            this.scrollBottom.totalLength = this.panelRightWidth;
            this.scrollBottom.contentLength = this.rightPanel.cellWidth;
            this.scrollBottom.build();

            return;
        }

        var that = this;

        var start = this.scrollRight.percent;

        Actions.stopByTag('smooth_time_table_scroll');

        new Stepper(function (step) {
            var percent = start + direction * step * 0.25;
            percent = Math.clamp(percent, 0, 1);
            that.scrollRight.setPercent(percent);
            that.leftPanel.scroll(percent);
            that.rightPanel.scrollY(percent);

        }, 100).run('smooth_time_table_scroll');

    };

    AnimationPanel.prototype.build = function () {

        this.leftPanel.build();
        this.rightPanel.build();

        this.scrollRight.totalLength = this.leftPanel.panelHeight;
        this.scrollRight.contentLength = this.leftPanel.contentLength;

        this.scrollRight.build();

        this.scrollBottom.totalLength = this.panelRightWidth;
        this.scrollBottom.contentLength = this.rightPanel.cellWidth;

        this.scrollBottom.build();

    };

    AnimationPanel.prototype.show = function (actor) {

        this.animator = new Animator(actor);
        // the animator will hold all the info

        this.build();

        this.isTouchable = true;
        Actions.stopByTag('animator_show');

        new TweenAlpha(this, 1, null, 200, function () {

        }).run('animator_show');

        this.isOn = true;

    };

    AnimationPanel.prototype.hide = function () {

        this.isTouchable = false;
        Actions.stopByTag('animator_show');

        new TweenAlpha(this, 0, null, 200, function () {
            // this.object.removeChildren();
        }).run('animator_show');

        this.isOn = false;

    };

    AnimationPanel.prototype.onMouseDown = function (event, sender) {
        // step 1 check for the contols

        this.clickedControl = null;

        for (var i = 0; i < this.controls.length; i++) {
            var c = this.controls[i];
            var s = c.getSensor();
            if (SAT.pointInPolygon(event.point, s)) {
                this.clickedControl = c;
                this.clickedControl.onMouseDown(event, sender);
                break;
            }
        }

    };

    AnimationPanel.prototype.onMouseMove = function (event, sender) {
        if (this.clickedControl) {
            this.clickedControl.onMouseMove(event, sender);
        }
    };

    AnimationPanel.prototype.onMouseUp = function (event, sender) {
        if (this.clickedControl) {
            this.clickedControl.onMouseUp(event, sender);
        }

        this.clickedControl = null;
    };

    AnimationPanel.prototype.onPlayHeadMove = function (percent, x) {

    };

    window.AnimationPanel = AnimationPanel; // make it available in the main scope

}(window));