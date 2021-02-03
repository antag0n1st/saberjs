(function (window, undefined) {

    function HNavigator(app) {
        this.initialize(app);
    }

    HNavigator.ANIMATION_TYPE_SLIDE = 0;
    HNavigator.ANIMATION_TYPE_SLIDEOVER = 1;
    HNavigator.ANIMATION_TYPE_FADEIN = 2;
    HNavigator.ANIMATION_TYPE_FADE_TO_BLACK = 3;
    HNavigator.ANIMATION_TYPE_DELAYED_REMOVAL = 4;
    HNavigator.ANIMATION_TYPE_SCREEN = 5;
    HNavigator.ANIMATION_TYPE_FADEOUT = 6;
    HNavigator.ANIMATION_TYPE_ALPHA = 7;

    HNavigator.ANIMATION_DIRECTION_LEFT = 0;
    HNavigator.ANIMATION_DIRECTION_RIGHT = 1;
    HNavigator.ANIMATION_DIRECTION_UP = 2;
    HNavigator.ANIMATION_DIRECTION_DOWN = 3;

    var screens = [];
    var currentScreen = null;
    var newScreen = null;
    var queue = [];
    
    HNavigator.prototype.initialize = function (app) {

        this.app = app;

        currentScreen = null;
        newScreen = null;
        this.transitionCallback = null;
        this.isTransitioning = false;
        this.transitionScreen = null;

        // queue the screens to transition
        queue = [];
        
        //-START-EXPOSURE-1
        Object.defineProperty(app, 'screen', { get: function() { return currentScreen; } });
        //-END-EXPOSURE-1
        
    };

    /**
     * Adds a new screen
     * 
     * @param {type} screen
     * @param {type} animationType
     * @param {type} duration
     * @param {type} transitionCallback
     * @returns {undefined}
     */
    HNavigator.prototype.add = function (screen, duration, animationType, transitionCallback, transitionScreen) {

        if (this.isTransitioning) {
            queue.push({
                method: 'add',
                screen: screen,
                duration: duration,
                animationType: animationType,
                transitionCallback: transitionCallback,
                transitionScreen: transitionScreen
            });
            return false;
        }

        this.isTransitioning = true;

        var dur = (typeof (duration) === 'undefined') ? 1 : duration;
        var anim = (typeof (animationType) === 'undefined') ? HNavigator.ANIMATION_TYPE_ALPHA : animationType;

        this.transitionCallback = transitionCallback;
        this.transitionScreen = transitionScreen ? transitionScreen : null;

        screens.push(screen);

        if (currentScreen) {

            newScreen = screen;

            currentScreen.onHide();
            currentScreen.deactivateTouchables();

            this.app.stage.addChild(newScreen);
            newScreen.onBeforeShow();

            this.setAnimation(anim, dur, HNavigator.ANIMATION_DIRECTION_LEFT, this.onTransitionFinished);

        } else {

            currentScreen = screen;

            this.app.stage.addChild(currentScreen);
            currentScreen.onBeforeShow();
            // no animation here
            currentScreen.onShow();

            this.isTransitioning = false;

            if (this.transitionCallback) {
                this.transitionCallback();
            }

            this.processQueue();

        }

        app.input.restoreCursor();
    };

    HNavigator.prototype.processQueue = function () {
        if (queue.length > 0) {
            var d = queue.shift();
            if (d.method === 'add') {
                this.add(d.screen, d.duration, d.animationType, d.transitionCallback, d.transitionScreen);
            } else if (d.method === 'goBack') {
                this.goBack(d.duration, d.animationType, d.transitionCallback);
            }
            // because a new screen can be added before the cursor is resolved on a button

        }
    };

    HNavigator.prototype.setAnimation = function (animationType, duration, direction, callback) {

        if (animationType === HNavigator.ANIMATION_TYPE_FADEIN) {

            this.animationFadeIn(duration, callback);

        } else if (animationType === HNavigator.ANIMATION_TYPE_SLIDE) {

            this.animationSlide(duration, direction, callback);

        } else if (animationType === HNavigator.ANIMATION_TYPE_SLIDEOVER) {

            this.animationSlideOver(duration, direction, callback);

        } else if (animationType === HNavigator.ANIMATION_TYPE_DELAYED_REMOVAL) {

            this.animationDelayedRemoval(duration, callback);

        } else if (animationType === HNavigator.ANIMATION_TYPE_FADE_TO_BLACK) {

            this.animationFadeToBlack(duration, callback);

        } else if (animationType === HNavigator.ANIMATION_TYPE_SCREEN) {

            this.animationScreen(duration, callback);

        } else if (animationType === HNavigator.ANIMATION_TYPE_FADEOUT) {

            this.animationFadeOut(duration, callback);

        } else if (animationType === HNavigator.ANIMATION_TYPE_ALPHA) {

            this.animationAlpha(duration, callback);

        } else {

            newScreen.position.set(0, 0);
            newScreen.alpha = 1;
            callback.call(app.navigator);
        }

    };

    //////////////////// ANIMATIONS ////////////////////////////////////

    HNavigator.prototype.animationScreen = function (duration, callback) {

        this.transitionScreen.zIndex = 2;
        currentScreen.zIndex = 1;
        newScreen.zIndex = 0;

        currentScreen.position.set(0, 0);
        newScreen.position.set(0, 0);
        this.transitionScreen.position.set(0, 0);

        this.transitionScreen.onShow(); // it will add it to the stage
        this.app.stage.addChild(this.transitionScreen);

        timeout(function () {
            newScreen.zIndex = 1;
            currentScreen.zIndex = 0;
        }, duration / 2, this);

        timeout(function () {
            callback.call(app.navigator);
            this.transitionScreen.onHide();
            this.app.stage.removeChild(this.transitionScreen);
            this.transitionScreen.removeFromParent();
            this.transitionScreen = null;
        }, duration, this);
    };

    HNavigator.prototype.animationFadeToBlack = function (duration, callback) {

        var gap = duration / 3;

        newScreen.alpha = 0;
        currentScreen.alpha = 1;
        newScreen.position.set(0, 0);

        var tween_old = new TweenAlpha(currentScreen, 0, null, duration / 2 - gap / 2);
        var tween_new = new TweenAlpha(newScreen, 1, null, duration / 2 - gap / 2, function () {
            callback.call(app.navigator);
        });

        tween_old.run();
        timeout(function () {
            tween_new.run();
        }, duration / 2 + gap / 2);

    };

    HNavigator.prototype.animationFadeIn = function (duration, callback) {

        currentScreen.zIndex = 0;
        newScreen.zIndex = 1;

        newScreen.alpha = 0;
        var tween_old = new TweenAlpha(currentScreen, 0, null, duration);
        var tween_new = new TweenAlpha(newScreen, 1, null, duration, function () {
            callback.call(app.navigator);
        });

        tween_old.run();
        tween_new.run();
    };

    HNavigator.prototype.animationFadeOut = function (duration, callback) {

        currentScreen.zIndex = 1;
        newScreen.zIndex = 0;
        newScreen.alpha = 1;
        //currentScreen.alpha = 0;

        var t = new TweenAlpha(currentScreen, 0, new Bezier(.72, .08, .91, .68), duration, function () {
            callback.call(app.navigator);
        });

        t.run();
    };

    HNavigator.prototype.animationAlpha = function (duration, callback) {

        currentScreen.zIndex = 0;
        newScreen.zIndex = 1;

        var f1 = newScreen.filters || [];
        var f2 = currentScreen.filters || [];

        var alphaFilter1 = new PIXI.filters.AlphaFilter(0);
        f1.push(alphaFilter1);
        newScreen.filters = f1;

        var alphaFilter2 = new PIXI.filters.AlphaFilter(1);
        f2.push(alphaFilter2);
        currentScreen.filters = f2;

        var s1 = newScreen;
        var s2 = currentScreen;

        newScreen.filterArea = new PIXI.Rectangle(0, 0, app.width, app.height);
        currentScreen.filterArea = new PIXI.Rectangle(0, 0, app.width, app.height);

        var tween_old = new TweenAlpha(alphaFilter2, 0, null, duration);

        var tween_new = new TweenAlpha(alphaFilter1, 1, null, duration, function () {
            callback.call(app.navigator);
            f1.removeElement(alphaFilter1);
            f2.removeElement(alphaFilter2);
            s1.filters = f1;
            s2.filters = f2;
        });

        tween_old.run();
        tween_new.run();

    };

    HNavigator.prototype.animationSlide = function (duration, direction, callback) {

        currentScreen.zIndex = 0;
        newScreen.zIndex = 1;
        newScreen.alpha = 1;

        newScreen.position.set(this.app.width, 0);
        var tween_old = new TweenMoveTo(currentScreen, new V(-this.app.width, 0), null, duration);
        var tween_new = new TweenMoveTo(newScreen, new V(0, 0), null, duration, function () {
            callback.call(app.navigator);
        });

        tween_old.run();
        tween_new.run();
    };


    HNavigator.prototype.animationSlideOver = function (duration, direction, callback) {

        currentScreen.zIndex = 0;
        newScreen.zIndex = 1;
        newScreen.alpha = 1;

        newScreen.position.set(this.app.width, 0);
        var tween_old = new TweenMoveTo(currentScreen, new V(0, 0), null, 0);
        var tween_new = new TweenMoveTo(newScreen, new V(0, 0), null, duration, function () {
            callback.call(app.navigator);
        });

        tween_old.run();
        tween_new.run();
    };

    HNavigator.prototype.animationDelayedRemoval = function (duration, callback) {

        currentScreen.zIndex = 0;
        newScreen.zIndex = 1;

        newScreen.position.set(0, 0);
        timeout(function () {
            callback.call(app.navigator);
        }, duration);

    };

    ////////////////////////////////////// METHODS 



    HNavigator.prototype.goBack = function (duration, animationType, transitionCallback) {

        if (this.isTransitioning) {

            queue.push({
                method: 'goBack',
                duration: duration,
                animationType: animationType,
                transitionCallback: transitionCallback
            });

            return false;
        }

        this.isTransitioning = true;

        this.transitionCallback = transitionCallback;

        var dur = (typeof (duration) === 'undefined') ? 200 : duration;
        var anim = (typeof (animationType) === 'undefined') ? HNavigator.ANIMATION_TYPE_ALPHA : animationType;


        if (screens.length > 1) {
            newScreen = screens[screens.length - 2];

            currentScreen.onHide();
            currentScreen.deactivateTouchables();

            this.app.stage.addChild(newScreen);
            newScreen.onBeforeShow();

            screens.pop(); // remove the last one

            this.setAnimation(anim, dur, HNavigator.ANIMATION_DIRECTION_RIGHT, this.onTransitionFinished);

        } else {
            // can't go back any more 
            this.isTransitioning = false;

        }

        app.input.restoreCursor();

    };



    HNavigator.prototype.goToRootCallback = function () {

        currentScreen.removeFromParent();
        currentScreen.onAfterHide();
        currentScreen.onDestroy();
        currentScreen.deactivateTouchables();

        currentScreen = newScreen;
        currentScreen.onShow();
        currentScreen.activateTouchables();

        // remove all except the first
        for (var i = screens.length - 1; i > 0; i--) {
            screens.splice(i, 1);
        }

        newScreen = null;
        this.isTransitioning = false;

        if (this.transitionCallback) {
            this.transitionCallback();
            this.transitionCallback = null;
        }

        this.processQueue();


    };

    HNavigator.prototype.goToIndexCallback = function () {
        currentScreen.removeFromParent();
        currentScreen.onDestroy();
        currentScreen.deactivateTouchables();
        currentScreen = newScreen;

        // remove all to the new screen
        for (var i = screens.length - 1; i >= 0; i--) {
            var screen = screens[i];
            if (screen === newScreen) {
                break;
            }
            screens.splice(i, 1);
        }

        newScreen = null;
        this.isTransitioning = false;

        if (this.transitionCallback) {
            this.transitionCallback();
            this.transitionCallback = null;
        }


    };

    HNavigator.prototype.setCurrentAsRoot = function () {

        var ind = screens.indexOf(currentScreen);

        for (var i = 0; i < screens.length; i++) {
            if (i !== ind) { // do not call destroy to the current screen
                screens[i].onDestroy();
                screens[i].deactivateTouchables();
            }
        }

        screens = [];
        newScreen = null;
        screens.push(currentScreen);
    };

    // display the current screen whitout a queue in the navigator
    HNavigator.prototype.justDisplay = function (screen) {

        if (this.isTransitioning) {
            return false;
        }

        this.isTransitioning = true;

        newScreen = screen;
        screen.onShow();
        this.app.stage.addChild(screen);
        this.onTransitionFinished();
    };

    HNavigator.prototype.goToRoot = function (duration, animationType, transitionCallback) {

        if (this.isTransitioning) {
            return false;
        }

        this.isTransitioning = true;

        if (screens.length) {

            this.transitionCallback = transitionCallback;
            var dur = (typeof (duration) === 'undefined') ? 200 : duration;

            newScreen = screens[0];
            currentScreen.onHide();
            this.app.stage.removeChild(currentScreen);
            newScreen.onShow();
            this.app.stage.addChild(newScreen);
            this.setAnimation(animationType, dur, HNavigator.ANIMATION_DIRECTION_LEFT, this.goToRootCallback);

        }

    };

    HNavigator.prototype.setCurrentAtIndex = function (index) {

        var ind = screens.indexOf(currentScreen);

        for (var i = 0; i < screens.length; i++) {
            if (i !== ind && i >= index) { // do not call destroy to the current screen                
                screens[i].deactivateTouchables();
                screens[i].onDestroy();
            }
        }

        screens = screens.slice(0, index);
        newScreen = null;
        screens.push(currentScreen);
    };


    HNavigator.prototype.goToIndex = function (index, duration, animationType, transitionCallback) {

        if (this.isTransitioning) {
            return false;
        }

        this.isTransitioning = true;

        if (screens.length) {

            this.transitionCallback = transitionCallback;
            var dur = (typeof (duration) === 'undefined') ? 200 : duration;

            newScreen = screens[index];
            currentScreen.onHide();
            this.app.stage.removeChild(currentScreen);
            newScreen.onShow();
            this.app.stage.addChild(newScreen);
            this.setAnimation(animationType, dur, HNavigator.ANIMATION_DIRECTION_LEFT, this.goToIndexCallback);

        }

    };

    HNavigator.prototype.removePrevious = function () {
        if (screens.length >= 2) {
            var ind = screens.length - 2;
            var screen = screens[ind];
            screens.splice(ind, 1);
            screen.onDestroy();
            screen.deactivateTouchables();
        }
    };

    HNavigator.prototype.popAndGo = function (screen, duration, animationType, _transitionCallback, transitionScreen) {
        var _this = this;
        this.add(screen, duration, animationType, function () {
            _this.removePrevious();
            if (_transitionCallback) {
                _transitionCallback();
            }
        }, transitionScreen);
    };

    HNavigator.prototype.update = function (dt) {

        dt = dt * Config.slow_motion_factor;

        Math.insertionSort(this.app.stage.children, function (a, b) {
            return a.zIndex > b.zIndex;
        });

        if (this.transitionScreen !== null && !this.transitionScreen.isPaused) {
            this.transitionScreen.onUpdate(dt);
            this.transitionScreen.updateChildren(dt, this.transitionScreen.children);
            this.transitionScreen.postUpdate(dt);
        }

        if (currentScreen !== null && !currentScreen.isPaused) {
            currentScreen.onUpdate(dt);
            currentScreen.updateChildren(dt, currentScreen.children);
            currentScreen.postUpdate(dt);
        }

        if (newScreen !== null) {
            if (!newScreen.isPaused) {
                newScreen.onUpdate(dt);
                newScreen.updateChildren(dt, newScreen.children);
                newScreen.postUpdate(dt);
            }
        }

    };

    // calbacks

    HNavigator.prototype.onTransitionFinished = function () {


        currentScreen.removeFromParent();
        currentScreen.onAfterHide();

        currentScreen = newScreen;

        currentScreen.onShow();
        currentScreen.activateTouchables();
        newScreen = null;

        this.isTransitioning = false;

        if (this.transitionCallback) {
            this.transitionCallback();
            this.transitionCallback = null;
        }

        this.processQueue();

    };


    HNavigator.prototype.onResizeScreens = function (width , height) {
        for (var i = 0; i < screens.length; i++) {
            var screen = screens[i];
            // screen.set_size(this.width, this.height);
            screen._onResize(width, height);
        }
    };

    HNavigator.prototype.onVisibilityChange = function (isVisible) {
        if (currentScreen) {
            currentScreen.onVisibilityChange(isVisible);
        }
    };

    HNavigator.prototype.blurInputs = function () {

        if (currentScreen) {
            for (var i = 0; i < currentScreen.inputs.length; i++) {
                var inputField = currentScreen.inputs[i];
                inputField.blur();
            }
        }
    };

    HNavigator.prototype.pauseScreen = function (pause) {
        if (currentScreen) {
            currentScreen.isPaused = pause;
        }
    };

    window.HNavigator = HNavigator;

}(window));