(function (window, undefined) {

    function AnimationScrollBottom() {
        this.initialize();
    }

    AnimationScrollBottom.prototype = Object.create(PIXI.Container.prototype);
    AnimationScrollBottom.prototype.constructor = AnimationScrollBottom;


    AnimationScrollBottom.prototype.initialize = function () {
        PIXI.Container.call(this);

    };


    window.AnimationScrollBottom = AnimationScrollBottom; // make it available in the main scope

}(window));