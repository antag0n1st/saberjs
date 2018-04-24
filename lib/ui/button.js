(function (window, undefined) {

    function Button(text, style, type) {
        this.initialize(text, style, type);
    }

    Button.prototype = new Sprite();
    Button.prototype.parentInitialize = Sprite.prototype.initialize;

    Button.TYPE_NORMAL = 0;
    Button.TYPE_NINE_SLICE = 1;

    Button.prototype.initialize = function (text, style, type) {

        style = style || {}; // to make sure it is initialized

        this.parentInitialize();

        this.type = type || 0;
        this.offsetX = style.offsetX || 0;
        this.offsetY = style.offsetY || 0;

        this._isTinted = false;
        
        this.background = new Sprite();

        this.anchor.set(0.5, 0.5);

        if (this.type === Button.TYPE_NORMAL) {

            this.imageNormal = style.imageNormal || null;
            this.imageSelected = style.imageSelected || null;

            this.background = new Sprite(this.imageNormal);
            this.background.centered();
            this.addChild(this.background);
            
            this.setSensorSize(this.background.width,this.background.height);
         
        } else if (type === Button.TYPE_NINE_SLICE) {
            this.background = new NineSlice(style.imageNormal, style.backgroundPadding || '15');
            this.addChild(this.background);
        }

        this.label = new Label(style);
        this.label.txt = text;
        this.label.anchor.set(0.5, 0.5);
        this.addChild(this.label);

        this.priority = 10; // listener priority

    };

    Object.defineProperty(Button.prototype, "txt", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this.label.txt = value;
        }
    });

    Object.defineProperty(Button.prototype, "imageNormal", {
        get: function () {
            return this._imageNormal;
        },
        set: function (value) {            
            this._imageNormal = value;
            if(this.type === Button.TYPE_NORMAL){
                this.background.setTexture(value);
                this.setSensorSize(this.background.width,this.background.height);
            }
        }
    });

    Object.defineProperty(Button.prototype, "imageSelected", {
        get: function () {
            return this._imageSelected;
        },
        set: function (value) {
            this._imageSelected = value;
        }
    });

    Button.prototype.update = function (dt) {
        
        if (this.type === Button.TYPE_NORMAL) {
            this.handleNormalType(dt);
        } else if (this.type === Button.TYPE_NINE_SLICE) {
            this.handleNineSlice(dt);
        }

        this.label.position.set(this.offsetX, this.offsetY);

    };

    Button.prototype.handleNormalType = function (dt) {
      
        if (this.isMouseDown) {

            if (this.imageSelected) {

                if (this.imageNormal === this.imageSelected) {
                    this.background.tint = 0xdddddd;
                } else if (this.imageName !== this.imageSelected) {
                    this.background.setTexture(this.imageSelected);
                }

            } else {
                this.background.tint = 0xdddddd;
            }

        } else {

            this.background.tint = 0xffffff;
          
            if (this.imageNormal && this.imageName !== this.imageNormal) {
                this.background.setTexture(this.imageNormal);
            }

        }
    };

    Button.prototype.handleNineSlice = function (dt) {
        if (this.isMouseDown && !this._isTinted) {
            for (var i = 0; i < this.background.backgroundParts.length; i++) {
                var sprite = this.background.backgroundParts[i];
                sprite.tint = 0xdddddd;
            }
            this._isTinted = true;
        } else if (!this.isMouseDown && this._isTinted) {
            for (var i = 0; i < this.background.backgroundParts.length; i++) {
                var sprite = this.background.backgroundParts[i];
                sprite.tint = 0xffffff;
            }
            this._isTinted = false;
        }
    };

    Button.prototype.onMouseMove = function (event) {
        if (!this._check(event.point)) {
            this.eventIdx = -1;
            this.isMouseDown = false;
            this.onMouseCancel(event, this);
        }
    };

    window.Button = Button;

}(window));
