(function (window) {
    //main class
    function App() {
        
    }

    App.initialize = function () {
        
        
         app.addToLoader = function (resources) {

        for (var i = 0; i < resources.length; i++) {
            var resource = resources[i];

            if (resource.children) {
                app.addToLoader(resource.children);
            } else if (resource.url) {
                if (!resource.frame) {
                    ContentManager.addImage(resource.name, ContentManager.baseURL + resource.url);
                }

            }

        }

    };

    app.initialLoad = function (callback) {

        ContentManager.addImage('_loading_bar_bg', 'initial/_loading_bar_bg.png');
        ContentManager.addImage('_loading_bar_fg', 'initial/_loading_bar_fg.png');

        ContentManager.downloadResources(function () {

            // PIXI.loader.resources._editor_config.data

            var screen = new LoadingScreen();
            app.navigator.add(screen);

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

    app.tick = function (deltaTime) {

        // elapsedMS
        // deltaTime
        // FPS
        // lastTime

        var step = app.pixi.ticker.elapsedMS;
        step = step > 50 ? 50 : step;

        Actions.update(step); // update tweens

        app.navigator.update(step); // update the sceen and its objects

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


    app.handleVisibility = function () {

    };

    app.resize = function () {

        app.device.calculateSizes();

        app.pixi.view.style.width = Math.ceil(app.canvasWidth) + "px";
        app.pixi.view.style.height = Math.ceil(app.canvasHeight) + "px";
        app.pixi.renderer.resize(app.width, app.height);

        if (Config.window_mode === Config.MODE_CENTERED) {
            app.adjustCanvasPositionCentered(app.pixi.view);
        } else if (Config.window_mode === Config.MODE_PADDING) {
            app.adjustCanvasPositionPadding(app.pixi.view);
        }

        app.navigator.onResizeScreens(app.width, app.height);

        app.adjustToolbars();

    };

    app.adjustToolbars = function () {
        var topToolbar = document.getElementById('topToolbar');
        var sideToolbar = document.getElementById('sideToolbar');
        var leftToolbar = document.getElementById('leftToolbar');

        topToolbar.style.visibility = 'visible';
        sideToolbar.style.visibility = 'visible';
        leftToolbar.style.visibility = 'visible';

        var canvasPadding = Config.canvas_padding.split(' ');

        topToolbar.style.width = (app.device.windowSize().width - canvasPadding[1]) + 'px';
        topToolbar.style.height = canvasPadding[0] + 'px';

        sideToolbar.style.width = canvasPadding[1] + 'px';
        sideToolbar.style.height = (app.device.windowSize().height) + 'px';

        leftToolbar.style.width = canvasPadding[3] + 'px';
        leftToolbar.style.height = (app.device.windowSize().height) + 'px';
    };

    app.checkRotation = function () {

    };

    app.showRotateDevice = function () {

    };

    app.hideRotateDevice = function () {

    };
        
        
        ////////////////////////////

        app.width = 0; // it will have the interval width of the application screen
        app.height = 0; //it will have the interval height of the application screen

        app.canvasWidth = 0;
        app.canvasHeight = 0;

        app.windowWidth = 0;
        app.windowHeight = 0;

        app.device = new Device(app);

        var settings = {
            clearBeforeRender: Config.should_clear_stage,
            preserveDrawingBuffer: true,
            resolution: 1,
            width: app.width,
            height: app.height,
            backgroundColor: Config.background_color
        };

        app.pixi = new PIXI.Application(settings);

        app.layoutCanvas();

        app.pixi.ticker.add(app.tick, app);

        app.stage = app.pixi.stage;
        app.screen = app.pixi.screen; // width and height
        app.loader = app.pixi.loader;

        app.input = new Input(app, app.pixi.renderer.view);

        app.navigator = new HNavigator(app);

        app.libraryImages = [];

        app.initialLoad(function () {

            app.loadAssets();

            if (app._loadExtraAssets) {
                app._loadExtraAssets();
            }

            ajaxGet(ContentManager.baseURL + 'app/php/fonts.php', function (response) {

                Fonts.fonts = [];

                for (var i = 0; i < response.length; i++) {
                    var font = response[i];

                    var junction_font = new FontFace(font.name, 'url(\'' + font.url + '\')');

                    junction_font.load().then(function (loaded_face) {
                        document.fonts.add(loaded_face);
                        Fonts.fonts.push(loaded_face);
                        // loaded_face holds the loaded FontFace

                    }).catch(function (error) {
                        // error occurred
                        console.log(error);
                    });

                }

                ajaxGet('app/php/library.php', function (resources) {

                    app.libraryImages = resources['structure'];

                    app.addToLoader(resources['structure']);

                    for (var i = 0; i < resources.atlases.length; i++) {
                        var url = resources.atlases[i];

                        url = ContentManager.baseURL + url;
                        ContentManager.loader.add(url, url);
                        ContentManager.countToLoad += 2;
                        ContentManager.isResourcesLoaded = false;

                        // ContentManager.addImage(resource.name, ContentManager.baseURL + resource.url);
                    }


                    ajaxGet(ContentManager.baseURL + 'app/php/json-files.php', function (response) {

                        for (var i = 0; i < response.length; i++) {
                            var r = response[i];
                            ContentManager.jsons[r.name] = r.content;
                        }

                        ContentManager.downloadResources(function () {

                            app.screen.loadingBar.setPercent(1, false);

                            var screen = applyToConstructor(window[Config.initialScreen], Config.initialScreenArgs);

                            timeout(function () {
                                app.navigator.add(screen);
                            }, 200);

                        }, app);
                    });




                });
            });




        });

        app.texturesBase64Cache = [];



    };

   

    window.App = App;

}(window));
