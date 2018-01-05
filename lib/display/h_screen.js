(function (window, undefined) {

    function HScreen() {
        this.initialize();
    }

    HScreen.prototype = Object.create(PIXI.Container.prototype);
    HScreen.prototype.constructor = HScreen;

    HScreen.prototype.initialize = function () {

        PIXI.Container.call(this);
        this.enableSensor();
        this._touchables = [];
        this.isPaused = false;

        if (typeof app !== "undefined") {
            this.setSensorSize(app.width, app.height);
            
            this._background = new Sprite('white');
            this._background.zIndex = -1;
            this._background.visible = false;
            this._background.stretch(app.width,app.height);
            this.addChild(this._background);
        }

    };

    HScreen.prototype.setBackgroundColor = function (color) {
        if(color){
            this._background.tint = convertColor(color);
            this._background.visible = true;
        } else {
            this._background.visible = false;
        }        
    };

    HScreen.prototype.activateTouchables = function () {
        app.input.add(this._touchables);
    };

    HScreen.prototype.deactivateTouchables = function () {
        app.input.remove(this._touchables);
    };

    HScreen.prototype.addTouchable = function (touchable) {
        app.input.add(touchable);
        this._touchables.push(touchable);
    };

    HScreen.prototype.removeTouchable = function (touchable) {
        app.input.remove(touchable);

        var ind = this._touchables.indexOf(touchable);
        if (ind !== -1) {
            this._touchables.splice(ind, 1);
        }

    };

    HScreen.prototype.onShow = function () {
        // triggered after the animation ends
    };
    
    HScreen.prototype.onHide = function () {
        // triggered before the animation starts
    };
    
    HScreen.prototype.onBeforeShow = function () {
        // triggered before the animation starts
    };

    HScreen.prototype.onAfterHide = function () {
        // triggered after the animation ends
    };

    HScreen.prototype.onAnimationEnd = function () {
        //TODO remove this one
    };

    HScreen.prototype.update = function (dt) {

    };

    HScreen.prototype.postUpdate = function (dt) {

    };

    HScreen.prototype.updateChildren = function (dt, children) {

        Math.insertionSort(children, function (a, b) {
            return a.zIndex > b.zIndex;
        });

        var i = children.length;

        while (i--) {
            var child = children[i];
            child.update(dt);
            if (child) {
                this.updateChildren(dt, child.children);
            }
            child.postUpdate(dt);
        }

    };

    HScreen.prototype.onVisibilityChange = function (isVisible) {

    };

    HScreen.prototype.onResize = function (width, height) {
        this.setSensorSize(width, height);
    };
    
    HScreen.prototype.onDestroy = function () {
        // triggered when the screen is no more used
    };

    window.HScreen = HScreen;

}(window));