(function (window, undefined) {

    function TweenScreen() {
        this.initialize();
    }

    TweenScreen.prototype = new HScreen();
    TweenScreen.prototype.screenInitialize = TweenScreen.prototype.initialize;

    TweenScreen.prototype.initialize = function () {
        this.screenInitialize();

        this.setBackgroundColor("#ffffff");

        var backBtn = new Button('Back', Style.DEFAULT_BUTTON);
        backBtn.onMouseDown = function () {
            Sounds.click.play();
            app.navigator.goBack();
        };
        backBtn.position.set(100 + (backBtn.background.width / 2), 50);
        this.addChild(backBtn);
        this.addTouchable(backBtn);

        this.object = null;

        this.prep();

        var functions = [
            {
                text: "Pop",
                fnt: this.pop
            },
            {
                text: "Move To",
                fnt: this.bounce
            },
            {
                text: "Squash",
                fnt: this.squash
            },
            {
                text: "Blink",
                fnt: this.blink
            },
            {
                text: "Shake",
                fnt: this.shake
            },
            {
                text: "Pulsate",
                fnt: this.pulsate
            },
            {
                text: "Sq/Stretch",
                fnt: this.ss
            },
            {
                text: "back-forth",
                fnt: this.backForth
            },
            {
                text: "rotate",
                fnt: this.rotate
            },
            {
                text: "rotate to",
                fnt: this.rotateTo
            },
            {
                text: "float",
                fnt: this.float
            }
        ];

        for (var i = 0; i < functions.length; i++) {
            this.createButton(functions[i].text, functions[i].fnt, 200, 200 + i * 80);
        }

        ///////////////////

        var that = this;

        this.object2 = new Sprite('item1');
        this.object2.position.set(app.width / 2 + 400, 500);
        this.object2.centered();
        this.addChild(this.object2);

        this.sequence = new Sequencer(this);

        var thread1 = this.sequence.addThread([
            new TweenMoveTo(this.object2, new V(app.width / 2 + 500, 600), new Bezier(.24, .73, .58, .98), 500).name('one'),
            new TweenScale(this.object2, 1.5, new Bezier(.56, .11, .33, 1.32), 600).name('two'),
            [
                new TweenIdle(800).name('pause'),
                new TweenMoveTo(this.object2, new V(app.width / 2 + 550, 550), new Bezier(.59, .13, .51, .89), 600)
            ],
            new TweenMoveTo(this.object2, new V(app.width / 2 + 400, 500), null, 400).name('tree'),
            [
                new TweenScale(this.object2, 1, new Bezier(.16, .31, .47, .98), 400).name('four')
            ]
        ]);

        this.sequence.addThread([
            new TweenAlpha(this.object2, 0.5, null, 800),
            new TweenIdle(500),
            new TweenAlpha(this.object2, 1, null, 400),
        ]);


        var sequencerRunBtn = new Button('Sequence', Style.DEFAULT_BUTTON);
        sequencerRunBtn.onMouseDown = function () {

            that.sequence.stop();

            that.object2.position.set(app.width / 2 + 400, 500);
            that.object2.alpha = 1;
            that.object2.scale.set(1);
            that.object2.rotation = 0;

            that.sequence.reset();
            that.sequence.run();
            
            Sounds.click.play();
        };
        sequencerRunBtn.position.set(app.width - 200, 50);
        this.addChild(sequencerRunBtn);
        this.addTouchable(sequencerRunBtn);

    };

    // sequencer delegate
    TweenScreen.prototype.onSequencerStarted = function (sequencer) {
        Actions.stopByTag('_rotate');
        new TweenRotateTo(this.object2, Math.degreesToRadians(360), null, sequencer.threads[0].duration, function (o) {
            o.rotation = 0;
        }).run('_rotate');
    };

    // sequencer delegate
    TweenScreen.prototype.onTweenStarted = function (tween, name, tag, sequencer) {

    };

    // sequencer delegate
    TweenScreen.prototype.onTweenEnded = function (tween, name, tag, sequencer) {

    };

    TweenScreen.prototype.float = function () {

        this.prep();
        new TweenFloat(this.object, 10, null, 1600).run('tween');

    };

    TweenScreen.prototype.rotateTo = function () {

        this.prep();
        var bezier = new Easing(Easing.EASE_IN_OUT_ELASTIC);
        bezier.elasticity = 9;
        new TweenRotateTo(this.object, Math.degreesToRadians(360), bezier, 2600).run('tween');

    };

    TweenScreen.prototype.rotate = function () {

        this.prep();
        new TweenRotate(this.object, 1, null, 1800).repeat(2).run('tween');

    };

    TweenScreen.prototype.backForth = function () {

        this.prep();
        new TweenBackForth(this.object, new V(100, 0), null, 600).repeat(2).run('tween');

    };

    TweenScreen.prototype.ss = function () {

        this.prep();
        new TweenSquashStretch(this.object, 1.2, null, 400).repeat(2).run('tween');

    };

    TweenScreen.prototype.pulsate = function () {

        this.prep();
        new TweenPulsate(this.object, 1.2, null, 300).repeat(2).run('tween');

    };

    TweenScreen.prototype.shake = function () {

        this.prep();
        new TweenShakeX(this.object, 5, 50, null, 300).run('tween');

    };

    TweenScreen.prototype.blink = function () {

        this.prep();
        new TweenBlink(this.object, 0.5, null, 600).repeat(2).run('tween');

    };

    TweenScreen.prototype.squash = function () {

        this.prep();
        new TweenSquashy(this.object, 2, null, 400).run('tween');

    };

    TweenScreen.prototype.bounce = function () {

        this.prep();

        var bounce = new Easing(Easing.EASE_OUT_BOUNCE);
        new TweenMoveTo(this.object, new V(app.width / 2, 800), bounce, 1000).delay(300).run('tween');

    };

    TweenScreen.prototype.pop = function () {

        this.prep();
        var tween = new TweenPop(this.object, 1.2, new Bezier(.09, .71, .69, 1.21), 800).elsticity(6).nonBounce(0.3);
        tween.run('tween');

    };

    ////////////////////////////////////////////////////////////

    TweenScreen.prototype.createButton = function (text, fnt, x, y) {
        var btn = new Button('Back', Style.DEFAULT_BUTTON);
        btn.label.txt = text;
        btn.onMouseDown = (function(){
            Sounds.click.play();
            fnt.call(this);
        }).bind(this); 
        btn.position.set(x, y);
        this.addChild(btn);
        this.addTouchable(btn);
    };

    TweenScreen.prototype.prep = function () {
        if (this.object) {
            this.object.removeFromParent();
           
        }
      
         Actions.stopByTag('tween');

        this.object = new Sprite('item2');
        this.object.position.set(app.width / 2, 500);
        this.object.centered();
        this.addChild(this.object);
    };

    TweenScreen.prototype.onHide = function () {
        Actions.stopByTag('tween');
    };


    window.TweenScreen = TweenScreen; // make it available in the main scope

}(window));