(function (window, undefined) {

    function LoadingScreen() {
        this.initialize();
    }

    LoadingScreen.prototype = new HScreen();
    LoadingScreen.prototype.screen_initialize = LoadingScreen.prototype.initialize;
    LoadingScreen.prototype.initialize = function () {
        this.screen_initialize();

        this.background = new Sprite('white');
        this.background.stretch(app.width,app.height);
        this.background.visible = true;
        this.addChild(this.background);

        this.logo = new Sprite(null);//Put logo image here
        this.logo.centered();
        
        this.addChild(this.logo);

        this.isAnimating = true;

        this.loadingBar = new LoadingBar({
            background: 'white',
            backgroundIsSliced: true,
            backgroundWidth: 800,
            backgroundHeight: 40,
            backgroundPadding: '1 1 1 1',
            backgroundTint: 0x555555,

            foreground: 'white',
            foregroundIsSliced: true,
            foregroundWidth: 800,
            foregroundHeight: 40,
            foregroundPadding: '1 1 1 1',
            foregroundTint: 0xc5c8f3,

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

    LoadingScreen.prototype.setPositions = function () {

        var mid_x = app.width / 2;
        var height = app.height;

        this.logo.position.set(mid_x ,  height * 0.45);
        this.loadingBar.position.set(mid_x , height * 0.75); // 300 is half the loading bar width

        this.background.position.set(-10,-10);
        this.background.width = app.width * 1.2;
        this.background.height = app.height * 1.2;
        
    };

    LoadingScreen.prototype.onUpdate = function (dt) {

        var to_load = ContentManager.countToLoad;
        var loaded = ContentManager.countLoaded;
        
        var loading = loaded / to_load;
        loading = (loading <= 0) ? 0.01 : loading;
        loading = (to_load === 0) ? 1 : loading;

        if (loaded && this.lastLoadedCount != loaded) {          
            this.lastLoadedCount = loaded;
            this.loadingBar.setPercent(loading);
        }

    };

    LoadingScreen.prototype.onResize = function () {
        this.setPositions();
    };

    window.LoadingScreen = LoadingScreen;

}(window));