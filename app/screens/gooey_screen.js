(function (window, undefined) {

    function GooeyScreen() {
        this.initialize();
    }

    GooeyScreen.prototype = new HScreen();
    GooeyScreen.prototype.screenInitialize = GooeyScreen.prototype.initialize;


    GooeyScreen.prototype.initialize = function () {
        this.screenInitialize();


        var backBtn = new Button('back', Style.DEFAULT_BUTTON);
        backBtn.setSensorSize(220, 100);
        backBtn.onMouseDown = function () {
            Sounds.click.play();
            app.navigator.goBack(300, HNavigator.ANIMATION_TYPE_ALPHA);
        };
        backBtn.position.set(100 + (backBtn.background.width / 2), 50);
        backBtn.zIndex = 10;
        this.addChild(backBtn);
        this.addTouchable(backBtn);


        var stage = new PIXI.Container();



        var particleCon = new PIXI.particles.ParticleContainer(500, {
            scale: true,
            position: true,
            rotation: false,
            uvs: false,
            alpha: false
        });
        stage.addChild(particleCon);


        for (var i = 0; i < 50; i++) {
            var goo = new Goo();
            goo.velocity.setLength(Math.randomFloat(0, 0.2));
            goo.velocity.setAngle(Math.degreesToRadians(Math.randomInt(0, 360)));
            goo.anchor.set(0.5);
            goo.position.set(Math.randomInt(0, app.width), Math.randomInt(0, app.height))
            particleCon.addChild(goo);
        }

        // (strength, quality, resolution, kernelSize)
        var blurFilter = new PIXI.filters.BlurFilter(20, 4, 0.25);
        blurFilter.autoFit = true;

        var thresholdFilter = new ThresholdFilter("#b9c530");
        thresholdFilter.threshold = 0.5;


        stage.filters = [blurFilter, thresholdFilter];
        stage.filterArea = new PIXI.Rectangle(0, 0, app.width, app.height);

        this.addChild(stage);

    };

    window.GooeyScreen = GooeyScreen; // make it available in the main scope

}(window));