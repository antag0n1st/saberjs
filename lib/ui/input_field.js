(function (window, undefined) {

    function InputField(style, type, mode, keyboard, delegate) {
        this.initialize(style, type, mode, keyboard, delegate);
    }

    InputField.TYPE_ALL = 0; // includes symbols
    InputField.TYPE_ALPHA_NUMERIC = 1; // just numbers and letters
    InputField.TYPE_NUMERIC = 2;// just numbers
    InputField.TYPE_ALPHABETIC = 3; // just letters
    InputField.TYPE_DECIMAL = 4; // numbers and some symbols
    InputField.TYPE_NUMERIC_SYMBOLS = 5;
    InputField.TYPE_EMAIL = 6;

    InputField.MODE_STANDARD = 0; // shifts the letters to the left
    InputField.MODE_CENTER = 1; // it writes in the center

    InputField.prototype = new Sprite();
    InputField.prototype.spriteInitialize = InputField.prototype.initialize;

    // DELEGATE
    // onStreamChanged(text,input_field)
    InputField.prototype.initialize = function (style, type, mode, keyboard, delegate) {

        this.spriteInitialize(); // your image name
        
        this.delegate = delegate;
        
        this.keyboard = null;
        this.setKeyboard(keyboard);
        
        this.offsetX = 0;

        this.type = type || InputField.TYPE_ALL;
        this.mode = mode || InputField.MODE_STANDARD;
        this.hasNext = false; // it will enable the keyboard to show next button instead of dissmis

        this.isFocused = false;
        this.priority = 10;

        this.stream = ""; // this is the internal text

        this.doneText = null;

        this.placeholder = '';
        this.tabIndex = 0;
        
        this.scrollToY = 0;

        // styling options
        this.padding = 20;
        this.fontSize = style ? style.fontSize : 30;
    
        this.cursorColor = 0xffffff;
        this.originalColor = style ? style.fill : '#000000';
        this.placeholderColor = style ? (style.placeholderColor || "#bbbbbb") : "#bbbbbb";

        this.backgroundImageName = style ? style.background : 'button';
        this.backgroundPadding = style ? style.backgroundPadding || '10' : '20';


        this.anchor.set(0.5, 0.5);



        this.background = new NineSlice(this.backgroundImageName, this.backgroundPadding)
        this.addChild(this.background);


        this.label = new Label(style);
        this.addChild(this.label);

        this.cursor = new Sprite('white');
        // this.cursor.zIndex = 2;
        this.cursor.tint = this.cursorColor;
        this.cursor.anchor.set(0.5, 0.5);
        this.addChild(this.cursor);

        this.setText('');

        this.blink = new TweenBlink(this.cursor, 0, null, 400);

       

        this.blur();

    };

    InputField.prototype.setKeyboard = function (keyboard) {
        this.keyboard = keyboard;
        if (keyboard) {
            // 
            this.keyboard.subscribe(this);
        }
    };

    InputField.prototype.setSize = function (width, height) {
        // Sprite.prototype.setSize.call(this, width, height);
        this._width = width;
        this._height = height;

        this.setSensorSize(width, height);

        if (this.label) {
            this.build();
        }

    };
    
    InputField.prototype.setFontSize = function(fontSize){
        this.label.style.fontSize = this.fontSize = fontSize;
    };

    InputField.prototype.build = function () {

        var width = this._width;
        var height = this._height;


        this.cursor.tint = this.cursorColor;
        this.label.style.fontSize = this.fontSize ? this.fontSize : Math.round((height * 0.7));

        if (this.mode === InputField.MODE_CENTER) {
            this.label.anchor.set(0.5, 0.5);
            this.label.position.set(0, 0);
        } else if (this.mode === InputField.MODE_STANDARD) {
            this.label.anchor.set(0, 0.5);
            this.label.position.set(-width / 2 + this.padding + this.offsetX, 0);
        }


        this.background.setSize(width, height);

        this.cursor.stretch(2, height - this.padding * 2);
    };

    InputField.prototype.onKeyboardChange = function (stream) {
        if (this.isFocused) {
           
            // this.keyboard.setDoneText(this.doneText || null);
            this.setStream(stream);
        }
    };

    InputField.prototype.onMouseDown = function (event, sender) {
        event.stopPropagation();
    };

    InputField.prototype.onMouseUp = function (event, sender) {
        this.focus();
    };

    InputField.prototype.onFocus = function (input_label) {

    };

    InputField.prototype.onBlur = function (input_label) {

    };

    InputField.prototype.focus = function () {

        if (document.activeElement) {
            document.activeElement.blur();
        }
        window.focus();

        if (this.isFocused) {
            return;
        }

        this.onFocus(this);

        this.blink.run();
        this.isFocused = true;
        
        this.keyboard.hasNext = this.hasNext;

        if (app.device.isTouch) {
            this.keyboard.setDoneText(this.doneText);
            this.keyboard.requestShow(this.type);
        }

        this.keyboard.kiboRegister();
        this.keyboard.kiboSetType(this.type);

        if (this.label.txt === this.placeholder) {
            this.setText('');
            this.label.style.fill = this.originalColor;
        }

        this.keyboard.stream = this.stream;
        this.keyboard.limit = this.limit;
        

    };

    InputField.prototype.blur = function () {

        this.blink.stop();
        this.cursor.alpha = 0;
        this.isFocused = false;

        if (this.keyboard) {
            this.keyboard.kiboUnregister();

            if (app.device.isTouch) {
                this.keyboard.requestHide();
            }

        }

        if (this.label.txt.trim() === '') {
            
            if(this.placeholder){
                this.setText(this.placeholder);
                this.label.style.fill = this.placeholderColor;
            } else {
                this.label.style.fill = this.originalColor;
            }
            
        } else if(this.label.txt.trim() !== this.placeholder){
            this.label.style.fill = this.originalColor;
        }
        
        this.onBlur(this);

    };

    InputField.prototype.setLimit = function (limit) {
        this.limit = limit;
        this.keyboard.limit = limit;
    };

    InputField.prototype.setStream = function (stream, should_delegate) {
        
        var _prevStream = this.stream;
        
        this.stream = this.keyboard.stream = stream;

        should_delegate = (typeof should_delegate === "undefined") ? true : should_delegate;

        if (this.delegate && this.delegate.on_stream_change) {
            var r = this.delegate.on_stream_change(stream, this);
            if (r !== false) {
                this.setText(r);
            }
        } else {
            this.setText(stream);
        }

        if (this.stream === this.placeholder) {
            this.label.style.fill = this.placeholderColor;
        } else {
            this.label.style.fill = this.originalColor;
        }
        
        if (this.delegate && this.delegate.onStreamChanged && should_delegate) {
            this.delegate.onStreamChanged(stream, _prevStream , this);
        }

    };

    InputField.prototype.setText = function (text) {

        var width = this._width;

        this.label.txt = text;

        var p = this.label.position;

        if (this.mode === InputField.MODE_CENTER) {

            if (this.label.txt === "") {
                this.cursor.position.set(0, 0);
            } else {
                this.cursor.position.set(this.label.width / 2 + 5, 0);
            }

            this.label.position.set(0, 0);

        } else if (this.mode === InputField.MODE_STANDARD) {
            if (this.label.txt === "") {
                this.cursor.position.set(p.x + 5, 0);
            } else {
                this.cursor.position.set(p.x + this.label.width + 5, 0);
            }

            this.label.position.set(-width / 2 + this.padding + this.offsetX, 0);
        }


        if (this.label.width >= (this._width - this.padding * 2 - this.offsetX) && this._width !== 1) {

            if (!this.label.mask) {
                this.setMask();
            }

            if (this.mode === InputField.MODE_CENTER) {

            } else if (this.mode === InputField.MODE_STANDARD) {
                var dx = this.label.width - (width - this.padding * 2);
                this.label.position.set(-width / 2 + this.padding - dx , 0);
            }

            //  this.setMask();

            this.cursor.position.set(width / 2 - this.padding, 0);

        } else if (this.label.mask) {
            this.label.mask.removeFromParent();
            this.label.mask = null;
        }
        
        this.label.style.fill = this.originalColor;
        
//        if(text === "" && this.placeholder && !this.isFocused){
//            this.label.txt = this.placeholder;
//            this.label.style.fill = this.placeholderColor;
//        }

    };

    InputField.prototype.setMask = function () {

        var mask = this.label.mask;

        if (!mask && this._width && this._height) {

            mask = new PIXI.Graphics();
            this.addChild(mask);



            mask.clear();
            mask.beginFill();
            mask.drawRect(-this._width / 2 + this.padding + this.offsetX, -this._height / 2, this._width - this.padding * 2 - this.offsetX, this._height);
            mask.endFill();

            this.label.mask = mask;
        }

    };

    InputField.prototype.getText = function () {
        if (this.label.txt === this.placeholder) {
            return "";
        } else {
            return this.label.txt;
        }
    };

    InputField.prototype.getStream = function () {
        return this.stream;
    };

    InputField.prototype.setPlaceholder = function (text,color) {
        this.placeholder = text;
        this.setText(text);
        this.label.style.fill = color || this.placeholderColor;        
        if(color){
            this.placeholderColor = color;
        }
    };
    
    InputField.prototype.onEnter = function(input){
        // can be overwritten
        
    };

    InputField.prototype.onUpdate = function (dt) {
       // Sprite.prototype.update.call(this, dt);

    };

    window.InputField = InputField;

}(window));