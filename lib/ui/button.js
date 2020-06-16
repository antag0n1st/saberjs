(function (window, undefined) {

    function Button(text, options) {
        this.initialize(text, options);
    }

    Button.prototype = new Sprite();
    Button.prototype.parentInitialize = Sprite.prototype.initialize;

    Button.TYPE_NORMAL = 0;
    Button.TYPE_NINE_SLICE = 1;

    Button.prototype.initialize = function (text, options) {

        options = options || {};

        this.parentInitialize();
        

        options.properties = options.properties || {};

        options.properties.backgroundColorNormal = options.properties.backgroundColorNormal ? options.properties.backgroundColorNormal : '#8AC6D0';
        options.properties.backgroundColorDown = options.properties.backgroundColorDown ? options.properties.backgroundColorDown : '#50A8B9';
        options.properties.backgroundColorHover = options.properties.backgroundColorHover ? options.properties.backgroundColorHover : '#C5E2E8';
        options.properties.backgroundColorDisabled = options.properties.backgroundColorDisabled ? options.properties.backgroundColorDisabled : "#bababa";
        options.properties.textColorNormal = options.properties.textColorNormal ? options.properties.textColorNormal : '#36213E';
        options.properties.textColorDown = options.properties.textColorDown ? options.properties.textColorDown : '#36213E';
        options.properties.textColorHover = options.properties.textColorHover ? options.properties.textColorHover : '#36213E';
        options.properties.textColorDisabled = options.properties.textColorDisabled ? options.properties.textColorDisabled : '#cccccc';
        options.properties.imageNormal = options.properties.imageNormal ? options.properties.imageNormal : 'white';
        options.properties.imageSelected = options.properties.imageSelected ? options.properties.imageSelected : 'white';
        options.properties.padding = options.properties.padding ? options.properties.padding : '1';
        options.properties.width = options.properties.width ? options.properties.width : 200;
        options.properties.height = options.properties.height ? options.properties.height : 80;
        options.properties.isNineSlice = (options.properties.isNineSlice !== undefined) ? options.properties.isNineSlice : true;
        
        this.properties = options.properties;

        this.type = (this.properties.isNineSlice === undefined || this.properties.isNineSlice === true) ? Button.TYPE_NINE_SLICE : Button.TYPE_NORMAL;
        this.offsetX = this.properties.offsetX || 0;
        this.offsetY = this.properties.offsetY || 0;

        this._isTinted = false;

        this.background = new Sprite();

        this.anchor.set(0.5, 0.5);

        this.label = new Label();
        this.label.txt = text;
        this.label.anchor.set(0.5, 0.5);

        this.label.rotation = this.properties.labelRotation || 0;

        if (this.type === Button.TYPE_NORMAL) {

            this.imageNormal = this.properties.imageNormal || null;
            this.imageSelected = this.properties.imageSelected || null;

            this.background = new Sprite(this.imageNormal);
            this.background.centered();
            this.addChild(this.background);

            this.setSensorSize(this.background.width, this.background.height);

        } else if (this.type === Button.TYPE_NINE_SLICE) {

            this.background = new NineSlice(this.properties.imageNormal, this.properties.padding || '10');

            this.background.setSize(this.properties.width || 200, this.properties.height || 80);
            this.addChild(this.background);
            this.background.tint = convertColor(this.properties.backgroundColorNormal);

            this.label.style.fill = this.properties.textColorNormal;

            this.setSensorSize(this.background.width, this.background.height);
        }

        this.addChild(this.label);

        this.priority = 10; // listener priority

        this.isHoverReactive = true;
        this.isHovered = false;


    };


    Button.prototype.onUpdate = function (dt) {

        if (!this.disabled) {
            if (this.type === Button.TYPE_NORMAL) {
                this.handleNormalType(dt);
            } else if (this.type === Button.TYPE_NINE_SLICE) {
                this.handleNineSlice(dt);
            }
        }


        this.label.position.set(this.offsetX, this.offsetY);

        if (this.isHoverReactive && !this.disabled) {
            if (this._check(app.input.point)) {
                this.onHoverIn();
            } else {
                this.onHoverOut();
            }
        }

    };

    Button.prototype.onHoverIn = function () {
        if (!this.isHovered) {

            if (this.type === Button.TYPE_NINE_SLICE) {
                this.background.tint = convertColor(this.properties.backgroundColorHover);
            }

            this.label.style.fill = this.properties.textColorHover;
            this.isHovered = true;
            app.input.setCursor('pointer');
        }
    };

    Button.prototype.onHoverOut = function () {
        if (this.isHovered) {
            if (this.type === Button.TYPE_NINE_SLICE) {
                this.background.tint = convertColor(this.properties.backgroundColorNormal);
            }
            this.label.style.fill = this.properties.textColorNormal;
            this.isHovered = false;
            app.input.setCursor('default');
        }
    };

    Button.prototype.handleNormalType = function (dt) {

        if (this.isMouseDown) {

            if (this.imageSelected) {

                if (this.imageNormal === this.imageSelected) {
                    this.background.tint = 0xdddddd;
                } else if (this.imageNormal !== this.imageSelected) {
                    this.background.setTexture(this.imageSelected);
                }

            } else {
                this.background.tint = 0xdddddd;
            }

        } else {

            this.background.tint = 0xffffff;

            if (this.imageNormal && this.imageNormal !== this.imageSelected) {
                this.background.setTexture(this.imageNormal);
            }

        }
    };

    Button.prototype.handleNineSlice = function (dt) {
        if (this.isMouseDown && !this._isTinted) {

            this.background.tint = convertColor(this.properties.backgroundColorDown);
            this.label.style.fill = this.properties.textColorDown;
            this._isTinted = true;

        } else if (!this.isMouseDown && this._isTinted) {
            this.background.tint = convertColor(this.properties.backgroundColorNormal);
            this.label.style.fill = this.properties.textColorNormal;
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

    Object.defineProperty(Button.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            if (value) {
                this.background.tint = convertColor(this.properties.backgroundColorDisabled);
                this.label.style.fill = this.properties.textColorDisabled;
                this.isTouchable = false;
                if (this.isHovered) {
                    app.input.restoreCursor();
                }
            } else {
                this.background.tint = convertColor(this.properties.backgroundColorNormal);
                this.label.style.fill = this.properties.textColorNormal;
                this.isTouchable = true;
            }
            this._disabled = value;
        }
    });


    Object.defineProperty(Button.prototype, "imageNormal", {
        get: function () {
            return this._imageNormal;
        },
        set: function (value) {
            this._imageNormal = value;
            if (this.type === Button.TYPE_NORMAL) {
                this.background.setTexture(value);
                this.setSensorSize(this.background.width, this.background.height);
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


    Object.defineProperty(Button.prototype, "txt", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
            this.label.txt = value;
        }
    });


    window.Button = Button;

}(window));
