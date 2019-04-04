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

    HNavigator.prototype.initialize = function (app) {

        this.app = app;

        this.screens = [];
        this.currentScreen = null;
        this.newScreen = null;
        this.transitionCallback = null;
        this.isTransitioning = false;
        this.transitionScreen = null;

        // queue the screens to transition
        this.queue = [];

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
            this.queue.push({
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

        var dur = (typeof (duration) === 'undefined') ? 200 : duration;
        var anim = (typeof (animationType) === 'undefined') ? HNavigator.ANIMATION_TYPE_ALPHA : animationType;

        this.transitionCallback = transitionCallback;
        this.transitionScreen = transitionScreen ? transitionScreen : null;

        this.screens.push(screen);

        if (this.currentScreen) {

            this.newScreen = screen;

            this.currentScreen.onHide();
            this.currentScreen.deactivateTouchables();

            this.app.stage.addChild(this.newScreen);
            this.newScreen.onBeforeShow();

            this.setAnimation(anim, dur, HNavigator.ANIMATION_DIRECTION_LEFT, this.onTransitionFinished);

        } else {

            this.currentScreen = screen;

            this.app.stage.addChild(this.currentScreen);
            this.currentScreen.onBeforeShow();
            // no animation here
            this.currentScreen.onShow();

            this.isTransitioning = false;

            if (this.transitionCallback) {
                this.transitionCallback();
            }

            this.processQueue();

        }
    };

    HNavigator.prototype.processQueue = function () {
        if (this.queue.length > 0) {
            var d = this.queue.shift();
            if (d.method === 'add') {
                this.add(d.screen, d.duration, d.animationType, d.transitionCallback, d.transitionScreen);
            } else if (d.method === 'goBack') {
                this.goBack(d.duration, d.animationType, d.transitionCallback);
            }
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

            this.newScreen.position.set(0, 0);
            this.newScreen.alpha = 1;
            callback.call(app.navigator);
        }

    };

    //////////////////// ANIMATIONS ////////////////////////////////////

    HNavigator.prototype.animationScreen = function (duration, callback) {

        this.transitionScreen.zIndex = 2;
        this.currentScreen.zIndex = 1;
        this.newScreen.zIndex = 0;

        this.currentScreen.position.set(0, 0);
        this.newScreen.position.set(0, 0);
        this.transitionScreen.position.set(0, 0);

        this.transitionScreen.onShow(); // it will add it to the stage
        this.app.stage.addChild(this.transitionScreen);

        timeout(function () {
            this.newScreen.zIndex = 1;
            this.currentScreen.zIndex = 0;
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

        this.newScreen.alpha = 0;
        this.currentScreen.alpha = 1;
        this.newScreen.position.set(0, 0);

        var tween_old = new TweenAlpha(this.currentScreen, 0, null, duration / 2 - gap / 2);
        var tween_new = new TweenAlpha(this.newScreen, 1, null, duration / 2 - gap / 2, function () {
            callback.call(app.navigator);
        });

        tween_old.run();
        timeout(function () {
            tween_new.run();
        }, duration / 2 + gap / 2);

    };

    HNavigator.prototype.animationFadeIn = function (duration, callback) {

        this.currentScreen.zIndex = 0;
        this.newScreen.zIndex = 1;

        this.newScreen.alpha = 0;
        var tween_old = new TweenAlpha(this.currentScreen, 0, null, duration);
        var tween_new = new TweenAlpha(this.newScreen, 1, null, duration, function () {
            callback.call(app.navigator);
        });

        tween_old.run();
        tween_new.run();
    };

    HNavigator.prototype.animationFadeOut = function (duration, callback) {

        this.currentScreen.zIndex = 1;
        this.newScreen.zIndex = 0;
        this.newScreen.alpha = 1;
        //this.currentScreen.alpha = 0;

        var t = new TweenAlpha(this.currentScreen, 0, new Bezier(.72, .08, .91, .68), duration, function () {
            callback.call(app.navigator);
        });

        t.run();
    };

    HNavigator.prototype.animationAlpha = function (duration, callback) {

        this.currentScreen.zIndex = 0;
        this.newScreen.zIndex = 1;

        var f1 = this.newScreen.filters || [];
        var f2 = this.currentScreen.filters || [];

        var alphaFilter1 = new PIXI.filters.AlphaFilter(0);
        f1.push(alphaFilter1);
        this.newScreen.filters = f1;

        var alphaFilter2 = new PIXI.filters.AlphaFilter(1);
        f2.push(alphaFilter2);
        this.currentScreen.filters = f2;

        var s1 = this.newScreen;
        var s2 = this.currentScreen;

        this.newScreen.filterArea = new PIXI.Rectangle(0, 0, app.width, app.height);
        this.currentScreen.filterArea = new PIXI.Rectangle(0, 0, app.width, app.height);

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

        this.currentScreen.zIndex = 0;
        this.newScreen.zIndex = 1;
        this.newScreen.alpha = 1;

        this.newScreen.position.set(this.app.width, 0);
        var tween_old = new TweenMoveTo(this.currentScreen, new V(-this.app.width, 0), null, duration);
        var tween_new = new TweenMoveTo(this.newScreen, new V(0, 0), null, duration, function () {
            callback.call(app.navigator);
        });

        tween_old.run();
        tween_new.run();
    };


    HNavigator.prototype.animationSlideOver = function (duration, direction, callback) {

        this.currentScreen.zIndex = 0;
        this.newScreen.zIndex = 1;
        this.newScreen.alpha = 1;

        this.newScreen.position.set(this.app.width, 0);
        var tween_old = new TweenMoveTo(this.currentScreen, new V(0, 0), null, 0);
        var tween_new = new TweenMoveTo(this.newScreen, new V(0, 0), null, duration, function () {
            callback.call(app.navigator);
        });

        tween_old.run();
        tween_new.run();
    };

    HNavigator.prototype.animationDelayedRemoval = function (duration, callback) {

        this.currentScreen.zIndex = 0;
        this.newScreen.zIndex = 1;

        this.newScreen.position.set(0, 0);
        timeout(function () {
            callback.call(app.navigator);
        }, duration);

    };

    ////////////////////////////////////// METHODS 



    HNavigator.prototype.goBack = function (duration, animationType, transitionCallback) {

        if (this.isTransitioning) {

            this.queue.push({
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


        if (this.screens.length > 1) {
            this.newScreen = this.screens[this.screens.length - 2];

            this.currentScreen.onHide();
            this.currentScreen.deactivateTouchables();

            this.app.stage.addChild(this.newScreen);
            this.newScreen.onBeforeShow();

            this.screens.pop(); // remove the last one

            this.setAnimation(anim, dur, HNavigator.ANIMATION_DIRECTION_RIGHT, this.onTransitionFinished);

        } else {
            // can't go back any more 
            this.isTransitioning = false;

        }



    };



    HNavigator.prototype.goToRootCallback = function () {
        this.currentScreen.removeFromParent();
        this.currentScreen.onDestroy();
        this.currentScreen.deactivateTouchables();
        this.currentScreen = this.newScreen;

        // remove all except the first
        for (var i = this.screens.length - 1; i > 0; i--) {
            this.screens.splice(i, 1);
        }

        this.newScreen = null;
        this.isTransitioning = false;

        if (this.transitionCallback) {
            this.transitionCallback();
            this.transitionCallback = null;
        }

    };

    HNavigator.prototype.goToIndexCallback = function () {
        this.currentScreen.removeFromParent();
        this.currentScreen.onDestroy();
        this.currentScreen.deactivateTouchables();
        this.currentScreen = this.newScreen;

        // remove all to the new screen
        for (var i = this.screens.length - 1; i >= 0; i--) {
            var screen = this.screens[i];
            if (screen.id === this.newScreen.id) {
                break;
            }
            this.screens.splice(i, 1);
        }

        this.newScreen = null;
        this.isTransitioning = false;

        if (this.transitionCallback) {
            this.transitionCallback();
            this.transitionCallback = null;
        }


    };

    HNavigator.prototype.setCurrentAsRoot = function () {

        var ind = this.screens.indexOf(this.currentScreen);

        for (var i = 0; i < this.screens.length; i++) {
            if (i !== ind) { // do not call destroy to the current screen
                this.screens[i].onDestroy();
                this.screens[i].deactivateTouchables();
            }
        }

        this.screens = [];
        this.newScreen = null;
        this.screens.push(this.currentScreen);
    };

    // display the current screen whitout a queue in the navigator
    HNavigator.prototype.justDisplay = function (screen) {

        if (this.isTransitioning) {
            return false;
        }

        this.isTransitioning = true;

        this.newScreen = screen;
        screen.onShow();
        this.app.stage.addChild(screen);
        this.onTransitionFinished();
    };

    HNavigator.prototype.goToRoot = function (duration, animationType, transitionCallback) {

        if (this.isTransitioning) {
            return false;
        }

        this.isTransitioning = true;

        if (this.screens.length) {

            this.transitionCallback = transitionCallback;
            var dur = (typeof (duration) === 'undefined') ? 200 : duration;

            this.newScreen = this.screens[0];
            this.currentScreen.onHide();
            this.app.stage.removeChild(this.currentScreen);
            this.newScreen.onShow();
            this.app.stage.addChild(this.newScreen);
            this.setAnimation(animationType, dur, HNavigator.ANIMATION_DIRECTION_LEFT, this.goToRootCallback);

        }

    };

    HNavigator.prototype.setCurrentAtIndex = function (index) {

        var ind = this.screens.indexOf(this.currentScreen);

        for (var i = 0; i < this.screens.length; i++) {
            if (i !== ind && i >= index) { // do not call destroy to the current screen
                this.screens[i].onDestroy();
                this.screens[i].deactivateTouchables();
            }
        }

        this.screens = this.screens.slice(0, index);
        this.newScreen = null;
        this.screens.push(this.currentScreen);
    };


    HNavigator.prototype.goToIndex = function (index, duration, animationType, transitionCallback) {

        if (this.isTransitioning) {
            return false;
        }

        this.isTransitioning = true;

        if (this.screens.length) {

            this.transitionCallback = transitionCallback;
            var dur = (typeof (duration) === 'undefined') ? 200 : duration;

            this.newScreen = this.screens[index];
            this.currentScreen.onHide();
            this.app.stage.removeChild(this.currentScreen);
            this.newScreen.onShow();
            this.app.stage.addChild(this.newScreen);
            this.setAnimation(animationType, dur, HNavigator.ANIMATION_DIRECTION_LEFT, this.goToIndexCallback);

        }

    };

    HNavigator.prototype.removePrevious = function () {
        if (this.screens.length >= 2) {
            var ind = this.screens.length - 2;
            var screen = this.screens[ind];
            this.screens.splice(ind, 1);
            screen.onDestroy();
            screen.deactivateTouchables();
        }
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

        if (this.currentScreen !== null && !this.currentScreen.isPaused) {
            this.currentScreen.onUpdate(dt);
            this.currentScreen.updateChildren(dt, this.currentScreen.children);
            this.currentScreen.postUpdate(dt);
        }

        if (this.newScreen !== null) {
            if (!this.newScreen.isPaused) {
                this.newScreen.onUpdate(dt);
                this.newScreen.updateChildren(dt, this.newScreen.children);
                this.newScreen.postUpdate(dt);
            }
        }

    };

    // calbacks

    HNavigator.prototype.onTransitionFinished = function () {


        this.currentScreen.removeFromParent();
        this.currentScreen.onAfterHide();

        this.currentScreen = this.newScreen;

        this.currentScreen.onShow();
        this.currentScreen.activateTouchables();
        this.newScreen = null;

        this.isTransitioning = false;

        if (this.transitionCallback) {
            this.transitionCallback();
            this.transitionCallback = null;
        }

        this.processQueue();

    };

    window.HNavigator = HNavigator;

}(window));