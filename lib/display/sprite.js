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

    Sprite.prototype.fitTo = function (width, height, scaleUp) {

        var w = this.width;
        var h = this.height;
        scaleUp = (scaleUp === undefined) ? false : scaleUp;

        if (w > h) {

            if (!scaleUp && w > width) {
                return;
            }
            var scale = width / w;
            this.scale.set(scale);

        } else {
            if (!scaleUp && h > height) {
                return;
            }
            var scale = height / h;
            this.scale.set(scale);
        }

    };

//
//    Sprite.prototype.scale_to_fill = function (width, height) {
//        this.scale.x = 1;
//        this.scale.y = 1;
//
//        var HRatio = height / this.height;
//        var WRatio = width / this.width;
//
//        this.scale.set(Math.max(HRatio, WRatio));
//    };
//
//    Sprite.prototype.fit_to = function (width, height) {
//        this.scale.x = 1;
//        this.scale.y = 1;
//
//        var min = Math.max(this.width, this.height);
//        var s = Math.min(width, height) / min;
//        this.scale.set(s);
//    };
//
//    Sprite.prototype.set_flipped = function(is_flipped){
//        this.is_flipped = is_flipped;
//        var param = is_flipped ? -1 : 1;
//        this.scale.x = Math.abs(this.scale.x)*param;
//    };
//    Sprite.prototype.set_size = function(){
//       
//    };


    window.Sprite = Sprite;

}(window));