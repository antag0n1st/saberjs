(function (window, undefined) {

    function GooeyScreen() {
        this.initialize();
    }

    GooeyScreen.prototype = new HScreen();
    GooeyScreen.prototype.screenInitialize = GooeyScreen.prototype.initialize;


    GooeyScreen.prototype.initialize = function () {
        this.screenInitialize();

//        this.sample = new Sprite('sample');
//        this.addChild(this.sample);

        var stage = new PIXI.Container();
        this.addChild(stage);



//        var particleCon = new PIXI.ParticleContainer(500, {
//            scale: true,
//            position: true,
//            rotation: false,
//            uvs: false,
//            alpha: false
//        });
//        stage.addChild(particleCon);


        for (var i = 0; i < 50; i++) {
            var goo = new Goo();
            goo.velocity.setLength(Math.randomFloat(0, 0.2));
            goo.velocity.setAngle(Math.degreesToRadians(Math.randomInt(0, 360)));
            goo.anchor.set(0.5);
            goo.position.set(Math.randomInt(0, app.width), Math.randomInt(0, app.height))
            stage.addChild(goo);
        }

        var thresholdFilter = new ThresholdFilter("#ff0000");
        thresholdFilter.threshold = 0.3;
        stage.filters = [thresholdFilter]; //blurFilter
        stage.filterArea = new PIXI.Rectangle(0, 0, app.width, app.height);




        var guide = new Sprite('blur-guide');
        guide.x = app.width;
        stage.addChild(guide);

        var wall = new Sprite('white');
        wall.stretch(app.width, app.height);
        wall.x = guide.x + guide.width;

        stage.addChild(wall);

        this.addTouchable(this);

        this.guide = guide;
        this.wall = wall;


//       


//        stage.mask = this.sample;

        this.stage = stage;

    };

    GooeyScreen.prototype.postUpdate = function (event, sender) {
        //this.stage.cacheAsBitmap = true;
    };

    GooeyScreen.prototype.onUpdate = function (event, sender) {
        //this.stage.cacheAsBitmap = false;
    };

    GooeyScreen.prototype.onMouseDown = function (event, sender) {
        
//        this.stage.mask = this.sample;
        
//        this.stage.cacheAsBitmap = true;
//         this.sample.mask = this.stage;
    };

    GooeyScreen.prototype.onMouseMove = function (event, sender) {


        var guide = this.guide;


        var wall = this.wall;

        guide.x = event.point.x - 50;

        wall.x = guide.x + guide.width;

    };

    window.GooeyScreen = GooeyScreen; // make it available in the main scope

}(window));