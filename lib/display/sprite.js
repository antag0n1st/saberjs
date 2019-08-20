(function (window, undefined) {

    function Sprite(imageName) {
        this.initialize(imageName);
    }

    Sprite.prototype = Object.create(PIXI.Sprite.prototype);

    Sprite.prototype.constructor = Sprite;
    Sprite.prototype.initialize = function (imageName) {

        PIXI.Sprite.call(this, this.findTexture(imageName), true);
        this.imageName = imageName;

    };

    

    window.Sprite = Sprite;

}(window));