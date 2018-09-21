(function (window) {
    //main class
    function App() {
        this.initialize();
    }

    App.prototype.initialize = function () {

        this.width = 0; // it will have the interval width of the application screen
        this.height = 0; //it will have the interval height of the application screen

        this.canvasWidth = 0;
        this.canvasHeight = 0;

        this.windowWidth = 0;
        this.windowHeight = 0;

        this.device = new Device(this);

        if (Config.window_mode_mobile !== null && (this.device.isMobile.phone || this.device.isMobile.tablet)) {
            Config.window_mode = Config.window_mode_mobile;
            this.device.calculateSizes();
        }

        var useCanvas = false;

        if (this.device.isIE) {
            useCanvas = true;
        }

        var settings = {
            clearBeforeRender: Config.should_clear_stage,
            preserveDrawingBuffer: false,
            resolution: 1,
            width: this.width,
            height: this.height,
            backgroundColor: Config.background_color ? Config.background_color : null,
            transparent: Config.background_color ? false : true,
            forceCanvas: useCanvas
        };

        this.pixi = new PIXI.Application(settings);

        this.layoutCanvas();

        this.pixi.ticker.add(this.tick, this);

        this.stage = this.pixi.stage;
        this.screen = this.pixi.screen; // width and height
        this.loader = this.pixi.loader;

        this.input = new Input(this, this.pixi.renderer.view);

        this.navigator = new HNavigator(this);

        this.initialLoad(function () {

            this.loadAssets();

            ContentManager.downloadResources(function () {

                app.navigator.currentScreen.loadingBar.setPercent(1, true);
                if (window[Config.initialScreen]) {
                    var screen = applyToConstructor(window[Config.initialScreen], Config.initialScreenArgs);
                    app.navigator.add(screen);
                } else {
                    throw Config.initialScreen + ' - is not Defined';
                }

                if (Config.rotation_mode) { // this means its bigger then 0 ( zero is allow)
                    this.rotate_layer = new RotateLayer();
                }

                this.checkRotation();

            }, this);


        });

        if (Config.debug) {
            this.debugLayer = new PIXI.Graphics();
            this.debugLayer.zIndex = 100;
            this.stage.addChild(this.debugLayer);
        }

        Visibility.change(function (e, state) {
            app.handleVisibility(state === "visible");
        });



    };

    App.prototype.initialLoad = function (callback) {

        ContentManager.addImage('_loading_bar_bg', 'initial/_loading_bar_bg.png');
        ContentManager.addImage('_loading_bar_fg', 'initial/_loading_bar_fg.png');
        ContentManager.addImage('white', 'initial/white.png');
        ContentManager.addImage('black', 'initial/black.png');
        ContentManager.addImage('rotate_device_to_landscape', 'initial/rotate_device_to_landscape.png');
        ContentManager.addImage('rotate_device_to_portrait', 'initial/rotate_device_to_portrait.png');

        ContentManager.downloadResources(function () {
            var screen = new LoadingScreen();
            app.navigator.add(screen);

            if (callback) {
                callback.call(this);
            }
            callback = null;

        }, this);

    };

    App.prototype.layoutCanvas = function () {
        document.body.appendChild(this.pixi.view);

        if (Config.window_mode !== Config.MODE_NONE) {
            this.pixi.view.style.width = this.canvasWidth + "px";
            this.pixi.view.style.height = this.canvasHeight + "px";
        }

        if (Config.window_mode === Config.MODE_CENTERED) {
            this.adjustCanvasPositionCentered(this.pixi.view);
        } else if (Config.window_mode === Config.MODE_PADDING) {
            this.adjustCanvasPositionPadding(this.pixi.view);
        }
    };

    App.prototype.debugStage = function (children) {

        children = children || this.stage.children;

        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            this.drawItem(c, this.debugLayer);
            if (c.children) {
                this.debugStage(c.children);
            }
        }
    };

    App.prototype.drawItem = function (item, graphics) {

        var s = item.getSensor();

        if (!s) {
            return;
        }

        if (s instanceof SAT.Circle) {

            var p = s.pos;
            graphics.beginFill(0x000000, 0.3);
            graphics.lineStyle(2, 0x000000);
            graphics.drawCircle(p.x, p.y, s.r);
            graphics.endFill();

        } else {
            var p = s.pos;
            var points = s.points;

            graphics.beginFill(0x000000);
            graphics.lineStyle(1, 0x000000);

            graphics.drawCircle(p.x, p.y, 2);

            for (var j = 0; j < points.length; j++) {
                graphics.moveTo(p.x + points[j].x, p.y + points[j].y);
                if (j === points.length - 1) {
                    graphics.lineTo(p.x + points[0].x, p.y + points[0].y);
                } else {
                    graphics.lineTo(p.x + points[j + 1].x, p.y + points[j + 1].y);
                }
            }

            graphics.endFill();
        }

    };

    App.prototype.tick = function (deltaTime) {

        // elapsedMS
        // deltaTime
        // FPS
        // lastTime

        var step = this.pixi.ticker.elapsedMS;
        step = step > 50 ? 50 : step;

        Actions.update(step); // update tweens

        this.navigator.update(step); // update the sceen and its objects

        if (Config.debug) {
            this.debugLayer.clear();
            this.debugStage();
        }


    };

    App.prototype.adjustCanvasPositionCentered = function (canvas) {

        var x = this.windowWidth - this.canvasWidth;
        var y = this.windowHeight - this.canvasHeight;

        canvas.style.marginLeft = Math.ceil(x / 2) + "px";
        canvas.style.marginTop = Math.ceil(y / 2) + "px";

    };

    App.prototype.adjustCanvasPositionPadding = function (canvas) {

        var canvasPadding = Config.canvas_padding.split(' ');

        canvas.style.marginLeft = Math.ceil(canvasPadding[3]) + "px";
        canvas.style.marginTop = Math.ceil(canvasPadding[0]) + "px";

    };


    App.prototype.handleVisibility = function (isVisible) {

        if (app.navigator.currentScreen) {
            app.navigator.currentScreen.onVisibilityChange(isVisible);
        }

        if (isVisible) {
            if (Config.is_sound_on) {
                Howler.mute(false);
            }
        } else {
            Howler.mute(true);
        }

    };

    App.prototype.resize = function () {

        this.device.calculateSizes();

        this.pixi.view.style.width = Math.ceil(this.canvasWidth) + "px";
        this.pixi.view.style.height = Math.ceil(this.canvasHeight) + "px";
        this.pixi.renderer.resize(this.width, this.height);



        if (Config.window_mode === Config.MODE_CENTERED) {
            this.adjustCanvasPositionCentered(this.pixi.view);
        } else if (Config.window_mode === Config.MODE_PADDING) {
            this.adjustCanvasPositionPadding(this.pixi.view);
        }

        this.input.recalucateOffset();

        for (var i = 0; i < this.navigator.screens.length; i++) {
            var screen = this.navigator.screens[i];
            // screen.set_size(this.width, this.height);
            screen._onResize(this.width, this.height);
        }

//TODO implement the rotate layer
        if (this.rotate_layer) {
            this.checkRotation();
            this.rotate_layer.onResize();
        }

    };

    App.prototype.checkRotation = function () {
        if (Config.rotation_mode === Config.ROTATION_MODE_HORIZONTAL) {

            if (app.windowWidth < app.windowHeight) {
                this.showRotateDevice();
            } else {
                this.hideRotateDevice();
            }

        } else if (Config.rotation_mode === Config.ROTATION_MODE_VERTICAL) {

            if (app.windowWidth > app.windowHeight) {
                this.showRotateDevice();
            } else {
                this.hideRotateDevice();
            }

        }
    };

    App.prototype.showRotateDevice = function () {

        if (!this.isRotationLayerShown) {

            this.isRotationLayerShown = true;
            this.stage.addChild(this.rotate_layer);
            this.navigator.currentScreen.isPaused = true;
            this.input.isBlocked = true;
            Actions.pause();
            if (Config.is_sound_on) {
                Howler.mute(true);
            }
        }

    };

    App.prototype.hideRotateDevice = function () {
        if (this.isRotationLayerShown) {

            this.isRotationLayerShown = false;
            this.rotate_layer.removeFromParent();
            this.navigator.currentScreen.isPaused = false;
            this.input.isBlocked = false;
            Actions.resume();
            if (Config.is_sound_on) {
                Howler.mute(false);
            }
        }
    };

    window.App = App;

}(window));
