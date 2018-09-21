(function (window, undefined) {

    function SpineAnimation(name) {
        this.initialize(name);
    }

    SpineAnimation.prototype = Object.create(PIXI.spine.Spine.prototype);

    SpineAnimation.prototype.constructor = SpineAnimation;
    SpineAnimation.prototype.initialize = function (name) {

        if (!ContentManager.spine[name]) {
            throw 'Non Existing Spine Skeleton - ' + name;
        }

        PIXI.spine.Spine.call(this, ContentManager.spine[name].spineData);

        this.skeleton.setToSetupPose();
        this.update(0);
      //  this.autoUpdate = false;
      //  this.state.timeScale = 0.001;

        this.state.onEvent = this.onEvent.bind(this);

        this.callback = null;

        this.animationScale = 1;

    };

    SpineAnimation.prototype.onEvent = function (i, event) {

    };

    SpineAnimation.prototype.play = function (animationName, isFlipped, isLoop, callback) {

        isLoop = (typeof isLoop == "undefined") ? true : isLoop;
        isFlipped = isFlipped || false;


        this.callback = callback || function () {
        };

        this.state.setAnimation(0, animationName, isLoop);
        this.skeleton.flipX = isFlipped;

        var that = this;

        if (callback) {
            this.state.clearListeners();
            this.state.addListener({
                complete: function (track, event) {
                    that.callback();
                }
            });
        }

    };

    SpineAnimation.prototype.setScale = function (scale) {
        this.animationScale = scale;

        var b = this.spineData.findBone('root');
        b.scaleX = scale;
        b.scaleY = scale;

    };

    SpineAnimation.prototype.getBoundingBoxByName = function (slotName, boxName, boneName) {

        var bounding_box = this.skeleton.getAttachmentBySlotName(slotName, boxName);
        var vertices = [];
        var pos = this.bounds.pos;
        var bone = this.skeleton.findBone(boneName);

        bounding_box.computeWorldVertices(pos.x, pos.y, bone, vertices);

        var v = [];
        var point0 = new V();

        for (var i = 0; i < vertices.length; i++) {

            if (i % 2 === 1) {
                var point = new V(vertices[i - 1], vertices[i]);

                if (i === 1) {
                    point0.copy(point);
                }

                point.sub(point0);

                v.push(point);
            }
        }

        return new SAT.Polygon(new V().copy(point0), v);
    };


    window.SpineAnimation = SpineAnimation;

}(window));