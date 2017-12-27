(function (window, undefined) {

    function NineSlice(name, padding, width, height) {
        this.initialize(name, padding, width, height);
    }

    NineSlice.prototype = new Sprite();
    NineSlice.prototype.spriteInitialize = NineSlice.prototype.initialize;
    NineSlice.prototype.initialize = function (name, padding, width, height) {


        this.spriteInitialize(null);

        this.backgroundParts = [];
        this.imageName = name;
        this.padding = padding;
        this._width = width;
        this._height = height;
        this.anchor.set(0.5,0.5);
        this.setSize(width, height);


    };

    NineSlice.prototype.setSize = function (width, height) {
        this._width = width;
        this._height = height;
        
        this.setSensorSize(width,height);

        this.buildBackground();
    };

    NineSlice.prototype.buildBackground = function () {

        var width = this._width;
        var height = this._height;

        for (var i = 0; i < this.backgroundParts.length; i++) {
            var bp = this.backgroundParts[i];
            bp.removeFromParent();
        }
        this.backgroundParts = [];

        var pad = this.padding.split(' ');

        var _top = Number(pad[0]) || 0;
        var _right = Number(pad[1]) || _top;
        var _bottom = Number(pad[2]) || _right;
        var _left = Number(pad[3]) || _bottom;


        var center = new Sprite(this.imageName);
        center.texture = center.texture.clone();
        var f = center.texture.frame;
        center.texture.frame = new PIXI.Rectangle(f.x + _left, f.y + _top, f.width - _left - _right, f.height - _top - _bottom);
        center.anchor.set(0.5, 0.5);
        center.position.set(0, 0);
        center.stretch(width - _left - _right, height - _top - _bottom);
        this.addChild(center);
        this.backgroundParts.push(center);

        // set the top first
        var top = new Sprite(this.imageName);
        top.texture = top.texture.clone();
        var f = top.texture.frame;
        top.texture.frame = new PIXI.Rectangle(f.x + _left, f.y, f.width - _left - _right, _top);
        top.anchor.set(0.5, 0.5);
        top.stretch(width - _left - _right, _top);
        top.position.set(0, -height / 2 + _top / 2);
        this.addChild(top);
        this.backgroundParts.push(top);

        var top_left = new Sprite(this.imageName);
        top_left.texture = top_left.texture.clone();
        var f = top_left.texture.frame;
        top_left.texture.frame = new PIXI.Rectangle(f.x, f.y, _left, _top);
        top_left.anchor.set(0.5, 0.5);
        top_left.position.set(-width / 2 + _left / 2, -height / 2 + _top / 2);
        this.addChild(top_left);
        this.backgroundParts.push(top_left);

        var top_right = new Sprite(this.imageName);
        top_right.texture = top_right.texture.clone();
        var f = top_right.texture.frame;
        top_right.texture.frame = new PIXI.Rectangle(f.x + f.width - _right, f.y, _right, _top);
        top_right.anchor.set(0.5, 0.5);
        top_right.position.set(+width / 2 - _right / 2, -height / 2 + _top / 2);
        this.addChild(top_right);
        this.backgroundParts.push(top_right);

        var right = new Sprite(this.imageName);
        right.texture = right.texture.clone();
        var f = right.texture.frame;
        right.texture.frame = new PIXI.Rectangle(f.x + f.width - _right, f.y + _top, _right, f.height - _top - _bottom);
        right.anchor.set(0.5, 0.5);
        right.position.set(+width / 2 - _right / 2, 0);
        right.stretch(_right, height - _top - _bottom);
        this.addChild(right);
        this.backgroundParts.push(right);

        var bottom_right = new Sprite(this.imageName);
        bottom_right.texture = bottom_right.texture.clone();
        var f = bottom_right.texture.frame;
        bottom_right.texture.frame = new PIXI.Rectangle(f.x + f.width - _right, f.y + f.height - _bottom, _right, _bottom);
        bottom_right.anchor.set(0.5, 0.5);
        bottom_right.position.set(+width / 2 - _right / 2, height / 2 - _top / 2);
        this.addChild(bottom_right);
        this.backgroundParts.push(bottom_right);

        var bottom = new Sprite(this.imageName);
        bottom.texture = bottom.texture.clone();
        var f = bottom.texture.frame;
        bottom.texture.frame = new PIXI.Rectangle(f.x + _right, f.y + f.height - _bottom, f.width - _left - _right, _bottom);
        bottom.anchor.set(0.5, 0.5);
        bottom.position.set(0, height / 2 - _top / 2);
        bottom.stretch(width - _left - _right, _bottom);
        this.addChild(bottom);
        this.backgroundParts.push(bottom);

        var bottom_left = new Sprite(this.imageName);
        bottom_left.texture = bottom_left.texture.clone();
        var f = bottom_left.texture.frame;
        bottom_left.texture.frame = new PIXI.Rectangle(f.x, f.y + f.height - _bottom, _left, _bottom);
        bottom_left.anchor.set(0.5, 0.5);
        bottom_left.position.set(-width / 2 + _left / 2, height / 2 - _top / 2);
        this.addChild(bottom_left);
        this.backgroundParts.push(bottom_left);


        var left = new Sprite(this.imageName);
        left.texture = left.texture.clone();
        var f = left.texture.frame;
        left.texture.frame = new PIXI.Rectangle(f.x, f.y + _top, _left, f.height - _top - _bottom);
        left.anchor.set(0.5, 0.5);
        left.position.set(-width / 2 + _left / 2, 0);
        left.stretch(_left, height - _top - _bottom);
        this.addChild(left);
        this.backgroundParts.push(left);

    };

    NineSlice.prototype.update = function (dt) {


    };

    window.NineSlice = NineSlice;

}(window));