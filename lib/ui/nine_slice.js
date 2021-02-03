(function (window, app , sharedObject, undefined) {

    function NineSlice(name, padding, width, height) {
        this.initialize(name, padding, width, height);
    }

    NineSlice.prototype = new Sprite();
    NineSlice.prototype.spriteInitialize = NineSlice.prototype.initialize;
    NineSlice.prototype.initialize = function (name, padding, width, height) {

        this.backgroundParts = [];
        this.spriteInitialize(null);


        this.imageName = name;
        this.padding = padding;
        this._width = width;
        this._height = height;
        this.anchor.set(0.5, 0.5);
        this.setSize(width, height);


    };

    NineSlice.prototype.setSize = function (width, height) {

        this._width = width || 2;
        this._height = height || 2;

        this.sensor = null;
        this.setSensorSize(this._width, this._height);

        this.buildBackground();

    };

    NineSlice.prototype.buildBackground = function () {

        if (!this.imageName) {
            return;
        }

        var width = this._width || 2;
        var height = this._height || 2;

        var pad = this.padding.toString().split(' ');
        
       

        var _top = Number(pad[0]) || 0;
        var _right = Number(pad[1]) || _top;
        var _bottom = Number(pad[2]) || _right;
        var _left = Number(pad[3]) || _bottom;


        var center = new Sprite(this.imageName);
        
        // check it is possible to set the padding
        if (_top + _bottom > center.height || _left + _right > center.width) {
            console.warn("Invalid Padding for Nine Slice");
            return;
        }
        
        // clear it

        for (var i = 0; i < this.backgroundParts.length; i++) {
            var bp = this.backgroundParts[i];
            bp.removeFromParent();
        }
        this.backgroundParts = [];

        // continue

        center.texture = center.texture.clone();
        var f = center.texture.frame;
        center.texture.frame = new PIXI.Rectangle(f.x + _left, f.y + _top, f.width - _left - _right, f.height - _top - _bottom);
        center.position.set(_left - width / 2, _top - height / 2);
        center.stretch(width - _left - _right, height - _top - _bottom);
        this.addChild(center);
        this.backgroundParts.push(center);

        // set the top first
        var top = new Sprite(this.imageName);
        top.texture = top.texture.clone();

        var f = top.texture.frame;
        var frame = new PIXI.Rectangle(f.x + _left, f.y, Math.abs(f.width - _left - _right), _top);
        top.texture.frame = frame;
        top.stretch(width - _left - _right, _top);
        top.position.set(_left - width / 2, -height / 2);
        this.addChild(top);
        this.backgroundParts.push(top);


        var top_left = new Sprite(this.imageName);
        top_left.texture = top_left.texture.clone();
        var f = top_left.texture.frame;
        top_left.texture.frame = new PIXI.Rectangle(f.x, f.y, _left, _top);
        top_left.position.set(-width / 2, -height / 2);
        this.addChild(top_left);
        this.backgroundParts.push(top_left);


        var top_right = new Sprite(this.imageName);
        top_right.texture = top_right.texture.clone();
        var f = top_right.texture.frame;
        top_right.texture.frame = new PIXI.Rectangle(f.x + f.width - _right, f.y, _right, _top);
        top_right.position.set(width / 2 - _right, -height / 2);
        this.addChild(top_right);
        this.backgroundParts.push(top_right);

        var right = new Sprite(this.imageName);
        right.texture = right.texture.clone();
        var f = right.texture.frame;
        right.texture.frame = new PIXI.Rectangle(f.x + f.width - _right, f.y + _top, _right, f.height - _top - _bottom);

        right.position.set(width / 2 - _right, -height / 2 + _top);
        right.stretch(_right, height - _top - _bottom);
        this.addChild(right);
        this.backgroundParts.push(right);

        var bottom_right = new Sprite(this.imageName);
        bottom_right.texture = bottom_right.texture.clone();
        var f = bottom_right.texture.frame;
        bottom_right.texture.frame = new PIXI.Rectangle(f.x + f.width - _right, f.y + f.height - _bottom, _right, _bottom);

        bottom_right.position.set(width / 2 - _right, height / 2 - _bottom);
        this.addChild(bottom_right);
        this.backgroundParts.push(bottom_right);

        var bottom = new Sprite(this.imageName);
        bottom.texture = bottom.texture.clone();
        var f = bottom.texture.frame;
        bottom.texture.frame = new PIXI.Rectangle(f.x + _right, f.y + f.height - _bottom, f.width - _left - _right, _bottom);
        bottom.position.set(-width / 2 + _left, height / 2 - _bottom);
        bottom.stretch(width - _left - _right, _bottom);
        this.addChild(bottom);
        this.backgroundParts.push(bottom);

        var bottom_left = new Sprite(this.imageName);
        bottom_left.texture = bottom_left.texture.clone();
        var f = bottom_left.texture.frame;
        bottom_left.texture.frame = new PIXI.Rectangle(f.x, f.y + f.height - _bottom, _left, _bottom);
        bottom_left.position.set(-width / 2, height / 2 - _bottom);
        this.addChild(bottom_left);
        this.backgroundParts.push(bottom_left);


        var left = new Sprite(this.imageName);
        left.texture = left.texture.clone();
        var f = left.texture.frame;
        left.texture.frame = new PIXI.Rectangle(f.x, f.y + _top, _left, f.height - _top - _bottom);
        left.position.set(-width / 2, -height / 2 + _top);
        left.stretch(_left, height - _top - _bottom);
        this.addChild(left);
        this.backgroundParts.push(left);

        for (var i = 0; i < this.backgroundParts.length; i++) {
            this.backgroundParts[i].tint = this.tint;
        }

    };

    Object.defineProperty(NineSlice.prototype, "tint", {
        get: function () {
            return this._tint;
        },
        set: function (value) {
            this._tint = value;
            for (var i = 0; i < this.backgroundParts.length; i++) {
                this.backgroundParts[i].tint = value;
            }
        }
    });

    Object.defineProperty(NineSlice.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
            this.setSize(this._width, this._height);
        }
    });

    Object.defineProperty(NineSlice.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (value) {
            this._height = value;
            this.setSize(this._width, this._height);
        }
    });

    window.NineSlice = NineSlice;

}(window , app , sharedObject));