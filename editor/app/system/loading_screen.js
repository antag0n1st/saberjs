(function (window, undefined) {

    function LoadingScreen() {
        this.initialize();
    }

    LoadingScreen.prototype = new HScreen();
    LoadingScreen.prototype.screen_initialize = LoadingScreen.prototype.initialize;
    LoadingScreen.prototype.initialize = function () {
        
        this.screen_initialize();

        this.background = new Sprite('white');
        this.background.stretch(app.width, app.height);
        this.addChild(this.background);

        this.logo = new Sprite('favicon');//Put logo image here
        this.logo.centered();
        this.addChild(this.logo);

        this.isAnimating = true;

        this.loadingBar = new LoadingBar({
            backgroundWidth: 800,
            backgroundHeight: 50,
            backgroundTint: 0x555555,

            foregroundWidth: 800,
            foregroundHeight: 50,
            foregroundTint: 0xaaaaaa,

            offsetX: 0,
            offsetY: 0,

            isAnimated: false,
            animationSpeed: 0,
            showPercent: true
        });
        this.addChild(this.loadingBar);

        this.lastLoadedCount = 0;

        this.setPositions();

    };

    LoadingScreen.prototype.logoAnimation = function () {
        var that = this;
        new TweenPop(this.logo, 1.05, null, 1200, function () {
            that.logoAnimation();
        }).run('logoAnimation');
    };

    LoadingScreen.prototype.setPositions = function () {

        var mid_x = app.width / 2;
        var height = app.height;
        
       // log(Math.round(mid_x))
        
        

        this.logo.position.set(mid_x, height * 0.45);
        this.loadingBar.position.set(mid_x , height * 0.65); // 300 is half the loading bar width

        this.background.position.set(-10, -10);
        this.background.width = app.width * 1.2;
        this.background.height = app.height * 1.2;

    };

    LoadingScreen.prototype.onUpdate = function (dt) {

        var to_load = ContentManager.countToLoad;
        var loaded = ContentManager.countLoaded;

        var loading = loaded / to_load;
        loading = (loading <= 0) ? 0.01 : loading;
        loading = (to_load === 0) ? 1 : loading;

        if (to_load && loaded && this.lastLoadedCount != loaded) {
            this.lastLoadedCount = loaded;
            this.loadingBar.setPercent(loading);
        }

    };

    LoadingScreen.prototype.onResize = function () {
        this.setPositions();
    };

    LoadingScreen.prototype.onHide = function () {
        Actions.stopByTag('logoAnimation');
    };

    window.LoadingScreen = LoadingScreen;

}(window));