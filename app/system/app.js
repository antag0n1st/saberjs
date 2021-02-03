(function (window, app, sharedObject, undefined) {
    //main class
    function App() {

    }

    App.initialize = function () {
        
        /////// set prototype methods first

        app.initialLoad = function (callback) {

            ContentManager.addImage('logo', 'logo.png');
            ContentManager.addImage('rotate_device_to_landscape', 'initial/rotate_device_to_landscape.png');
            ContentManager.addImage('rotate_device_to_portrait', 'initial/rotate_device_to_portrait.png');

            ContentManager.downloadResources(function () {
                var screen = new LoadingScreen();
                app.navigator.add(screen, 1);

                if (callback) {
                    callback.call(app);
                }
                callback = null;

            }, app);

        };

        app.layoutCanvas = function () {
            document.body.appendChild(app.pixi.view);

            if (Config.window_mode !== Config.MODE_NONE) {
                app.pixi.view.style.width = app.canvasWidth + "px";
                app.pixi.view.style.height = app.canvasHeight + "px";
            }

            if (Config.window_mode === Config.MODE_CENTERED) {
                app.adjustCanvasPositionCentered(app.pixi.view);
            } else if (Config.window_mode === Config.MODE_PADDING) {
                app.adjustCanvasPositionPadding(app.pixi.view);
            }
        };

        app.debugStage = function (children) {

            children = children || app.stage.children;

            for (var i = 0; i < children.length; i++) {
                var c = children[i];
                app.drawItem(c, app.debugLayer);
                if (c.children) {
                    app.debugStage(c.children);
                }
            }
        };

        app.drawItem = function (item, graphics) {

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

        app.tick = function (deltaTime) {

            // elapsedMS
            // deltaTime
            // FPS
            // lastTime

            var step = app.pixi.ticker.elapsedMS;
            step = step > 50 ? 50 : step;

            Actions.update(step); // update tweens

            app.navigator.update(step); // update the sceen and its objects

            if (Config.debug) {
                app.debugLayer.clear();
                app.debugStage();
            }

        };

        app.adjustCanvasPositionCentered = function (canvas) {

            var x = app.windowWidth - app.canvasWidth;
            var y = app.windowHeight - app.canvasHeight;

            canvas.style.marginLeft = Math.ceil(x / 2) + "px";
            canvas.style.marginTop = Math.ceil(y / 2) + "px";

        };

        app.adjustCanvasPositionPadding = function (canvas) {

            var canvasPadding = Config.canvas_padding.split(' ');

            canvas.style.marginLeft = Math.ceil(canvasPadding[3]) + "px";
            canvas.style.marginTop = Math.ceil(canvasPadding[0]) + "px";

        };

        app.handleVisibility = function (isVisible) {

            app.navigator.onVisibilityChange(isVisible);

            if (isVisible) {
                if (Config.is_sound_on) {
                    Howler.mute(false);
                }
            } else {
                Howler.mute(true);
            }

        };

        app.resize = function (autoLayout) {

            var isAutoLayout = true;

            if (autoLayout === undefined) {
                isAutoLayout = Config.is_canvas_auto_layout;
            } else {
                isAutoLayout = autoLayout;
            }

            var ww = app.windowWidth;
            var wh = app.windowHeight;

            var wasLandscape = app.windowWidth > app.windowHeight;
            var isLandscape = app.windowWidth > app.windowHeight;

            app.device.calculateSizes();


            if (!app.device.isKeyboardTheSource) {
                isAutoLayout = true;

                if (app.device.isKeyboardUp) {

                    window.scrollTo(0, 0);

                    // lets check if it is a rotation

                    app.navigator.blurInputs();
                    app.device.isKeyboardUp = false;
                    app.device.isKeyboardTheSource = true;

                }
            }

            if (isAutoLayout) {
                app.pixi.view.style.width = Math.ceil(app.canvasWidth) + "px";
                app.pixi.view.style.height = Math.ceil(app.canvasHeight) + "px";
                app.pixi.renderer.resize(app.width, app.height);

                if (Config.window_mode === Config.MODE_CENTERED) {
                    app.adjustCanvasPositionCentered(app.pixi.view);
                } else if (Config.window_mode === Config.MODE_PADDING) {
                    app.adjustCanvasPositionPadding(app.pixi.view);
                }
            }

            app.input.recalucateOffset();

            app.navigator.onResizeScreens(app.width, app.height);

            if (isAutoLayout) {
                //TODO implement the rotate layer
                if (app.rotate_layer) {
                    app.checkRotation();
                    app.rotate_layer.onResize();
                }
            }

            app.device.isKeyboardTheSource = false;

        };

        app.checkRotation = function () {

            if (Config.window_mode === Config.MODE_CENTERED) {
                return false;
            }

            if (Config.rotation_mode === Config.ROTATION_MODE_HORIZONTAL) {

                if (app.windowWidth < app.windowHeight) {
                    app.showRotateDevice();
                } else {
                    app.hideRotateDevice();
                }

            } else if (Config.rotation_mode === Config.ROTATION_MODE_VERTICAL) {

                if (app.windowWidth > app.windowHeight) {
                    app.showRotateDevice();
                } else {
                    app.hideRotateDevice();
                }

            }

        };

        app.showRotateDevice = function () {

            if (!app.isRotationLayerShown) {

                app.isRotationLayerShown = true;
                app.stage.addChild(app.rotate_layer);
                app.navigator.pauseScreen(true);
                app.input.isBlocked = true;
                Actions.pause();
                if (Config.is_sound_on) {
                    Howler.mute(true);
                }
            }

        };

        app.hideRotateDevice = function () {
            if (app.isRotationLayerShown) {

                app.isRotationLayerShown = false;
                app.rotate_layer.removeFromParent();
                app.navigator.pauseScreen(false);
                app.input.isBlocked = false;
                Actions.resume();
                if (Config.is_sound_on) {
                    Howler.mute(false);
                }
            }
        };



        app.width = 0; // it will have the interval width of the application screen
        app.height = 0; //it will have the interval height of the application screen

        app.canvasWidth = 0;
        app.canvasHeight = 0;

        app.windowWidth = 0;
        app.windowHeight = 0;

        app.device = new Device(app);

        if (Config.window_mode_mobile !== null && (app.device.isMobile.phone || app.device.isMobile.tablet)) {
            Config.window_mode = Config.window_mode_mobile;
            app.device.calculateSizes();
        }

        var canvas = document.createElement('canvas');
        app.input = new Input(app, canvas);

        var settings = {
            resolution: 1,
            width: app.width,
            height: app.height,
            transparent: false,
            view: canvas,
            antialias: false,
            forceCanvas: false
        };

//        PIXI.settings.ROUND_PIXELS = true;
//        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        app.pixi = new PIXI.Application(settings);



        app.pixi.ticker.add(app.tick, app);

        app.stage = app.pixi.stage;
        app.loader = PIXI.Loader.shared;

        app.navigator = new HNavigator(app);

        app.initialLoad(function () {

            app.layoutCanvas();

            app.loadAssets();

            ContentManager.downloadResources(function () {

                if (window['_loadingBar']) {
                    _loadingBar.setPercent(1, false);
                } else {
                    return;
                }

                if (window[Config.initialScreen]) {
                    var screen = applyToConstructor(window[Config.initialScreen], Config.initialScreenArgs);
                    timeout(function () {
                        app.navigator.popAndGo(screen);
                    }, 60);
                } else {
                    throw Config.initialScreen + ' - is not Defined';
                }

                if (Config.rotation_mode) { // app means its bigger then 0 ( zero is allow)
                    app.rotate_layer = new RotateLayer();
                }

                app.checkRotation();

            }, app);

        });

        if (Config.debug) {
            app.debugLayer = new PIXI.Graphics();
            app.debugLayer.zIndex = 100;
            app.stage.addChild(app.debugLayer);
        }

        Visibility.change(function (e, state) {
            app.handleVisibility(state === "visible");
        });


        //////////////////////// 



        for (var i = 1; i < 15; i++) {
            timeout(function () {
                if (!app.device.isKeyboardUp) {
                    app.resize(true); // do it with auto layout
                }
            }, 100 * i);
        }

        // locker('app', app);

    };



    window['App'] = App;

    // 

}(window, app, sharedObject));
