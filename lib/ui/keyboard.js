(function (window, app , sharedObject, undefined) {

    function Keyboard(delegate, orientation, type) {
        this.initialize(delegate, orientation, type);
    }

    Keyboard.prototype = new Sprite();
    Keyboard.prototype.spriteInitialize = Keyboard.prototype.initialize;


    Keyboard.VERTICAL = 0;
    Keyboard.HORIZONTAL = 1;
    // DELEGATE
    // - onKeyboardShow
    // - onKeyboardHide
    // - onKeyboardShowRequest
    // - onKeyboardHideRequest
    Keyboard.prototype.initialize = function (delegate, orientation, type) {

        this.spriteInitialize(); // your image name

        this.type = type;
        this.delegate = delegate;

        this.priority = 99;
        this.orientation = orientation;
        this.openPosition = new V();

        this.deleteMainTimer = null;
        this.deleteIntervalTimer = null;

        this.limit = 0;
        this.stream = '';

        this.hasNext = false;

        this.subscribers = [];

        this.mainSymbols = [];
        this.is2ndSymbols = false;

        this.showRequest = false;
        this.hideRequest = false;
        this.toType = type;


        this.numberOfRows = -1;
        this.cellWidth = app.width / 10;
        this.cellHeight = this.cellWidth * 1.5;

        this.fontSize = null;
        this.keySpacingX = Config.keyboardSpacingX || (this.cellWidth * 0.08);
        this.keySpacingY = Config.keyboardSpacingY || (this.cellHeight * 0.12);


        this.raisedBed = (Config.hasRaisedBed === undefined) ? null : Config.hasRaisedBed;

        this.doneText = Config.keyboardDoneText || 'Done';
        this.nextText = Config.keyboardNextText || 'Next';

        this.isVibrating = (Config.keyboardVibrate === undefined) ? true : Config.keyboardVibrate;

        this.previewKeyOffsetY = this.cellHeight / 2;

        this.capitalizeKey = null;

        this.colors = {
            layoutBackground: 0xeaebef,
            specialKeys: {
                background: 0xd9dce5,
                text: 0x000000,
                backgorundPressed: 0x0079f7,
                textPressed: 0xffffff,
                dropShadow: 0x555555
            },
            keys: {
                background: 0xffffff,
                text: 0x000000,
                backgorundPressed: 0xeeeeee,
                textPressed: 0x000000,
                dropShadow: 0x888888
            },
            done: {
                background: 0x0079f7,
                text: 0xffffff,
                backgorundPressed: 0xeeeeee,
                textPressed: 0x000000,
                dropShadow: 0x999999
            },
            preview: {
                background: 0xffffff,
                text: 0x555555,
            },
            capitalize: {
                background: 0x0079f7,
                text: 0xffffff,
                backgorundPressed: 0x0079f7,
                textPressed: 0xffffff,
                dropShadow: 0x555555
            }

        };

        if (Config.keyboardColors) {
            // overwrite the colors 

        }

        this.digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        this.symbolsGeneric = ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'];
        this.symbolsMore = ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'];
        this.symbolsInterpunkt = ['.', ',', '?', '!', '\''];
        this.symbolsMath = ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='];
        // - / : ; ( ) P & @ " - generic
        // _ \ | ~ < > E $ Y ** - more '>', '<', '{', '}', '|', '£', '•'
        // [ ] { } # % ^ * + =



        this.alphabets = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm']
        ];

        this.firstPage = this.alphabets;
        this.secondPage = [
            this.digits,
            this.symbolsGeneric,
            this.symbolsInterpunkt
        ];
        this.thirdPage = [
            this.symbolsMath,
            this.symbolsMore,
            this.symbolsInterpunkt
        ];

        this.buttons = [];

        this.background = null;

        this.isCapital = false;
        this.isShown = false;
        this.isSymbol = false;
        this.showCapitalize = true;
        this.showSymbols = true;
        this.showDot = true;
        this.isPermaCapital = false;

        this.preview = this.createButton('', 100, 100, 0, 0, this.colors.preview);
        this.preview.visible = false;
        this.preview.zIndex = 1;

        this.addChild(this.preview);

        this.visible = false;
        this.hide();

        this.position.set(0, app.height);

        this.kibo = new Kibo(window.document, this);

        this.kiboUnregister();

        this.zIndex = 100;

        this.permaCapitalTimer = 0;

        // lets set the font here

//        PIXI.BitmapFont.from("TitleFont", {
//  fill: "#333333",
//  fontSize: 40,
//  fontWeight: 'bold',
//});
//        

    };

    Keyboard.prototype.setDoneText = function (text) {
        if (text !== null) {
            this.doneText = text;
            this.nextText = text;
        } else {
            this.doneText = Config.keyboardDoneText || 'Done';
            this.nextText = Config.keyboardNextText || 'Next';
        }
    };

    Keyboard.prototype.kiboSetType = function (type) {

        this.type = type;

        this.kibo.unregisterAll();

        var conf = this.getConfByType(this.type);


        this.kibo.down(conf, this.kiboDown);
        this.kibo.down('backspace', this.kiboDownBackspace);
        this.kibo.down('tab', this.kiboTab);
        this.kibo.down('shift tab', this.kiboShiftTab);
        this.kibo.down('esc', this.kiboEsc);
        this.kibo.down('enter', this.kiboEnter);

    };

    Keyboard.prototype.kiboDown = function (data) {

        if (this.limit > 0 && this.limit <= this.stream.length) {
            return;
        }
        this.stream += data.key;

        this.onChange(this.stream);

        return false;
    };

    Keyboard.prototype.kiboDownBackspace = function (data) {

        this.stream = this.stream.slice(0, -1);

        this.onChange(this.stream);

        return false;
    };

    Keyboard.prototype.kiboRegister = function () {
        Kibo.registerEvent(this.kibo.element, 'keydown', this.kibo.downHandler);
        Kibo.registerEvent(this.kibo.element, 'keyup', this.kibo.upHandler);

    };

    Keyboard.prototype.kiboUnregister = function () {
        Kibo.unregisterEvent(this.kibo.element, 'keydown', this.kibo.downHandler);
        Kibo.unregisterEvent(this.kibo.element, 'keyup', this.kibo.upHandler);
    };

    Keyboard.prototype.getConfByType = function (type) {

        if (type === InputField.TYPE_ALL) {
            return ['any letter', 'any number', 'space', 'any symbols'];
        } else if (type === InputField.TYPE_ALPHABETIC) {
            return ['any letter', 'space'];
        } else if (type === InputField.TYPE_ALPHA_NUMERIC) {
            return ['any number', 'any letter', 'space'];
        } else if (type === InputField.TYPE_DECIMAL) {
            return ['any number', 'any decimals'];
        } else if (type === InputField.TYPE_NUMERIC) {
            return ['any number'];
        } else if (type === InputField.TYPE_NUMERIC_SYMBOLS) {
            return ['any number', 'any symbols'];
        } else {
            return ['any letter', 'any number', 'space', 'any symbols'];
        }
        // 

    };

    Keyboard.prototype.loadKeyboardSymbols = function () {

        var type = this.type;

        this.isSymbol = false;
        this.showDot = false;

        this.secondPage = [
            this.digits,
            this.symbolsGeneric,
            this.symbolsInterpunkt
        ];

        if (type === InputField.TYPE_NUMERIC) {

            this.firstPage = [
                [',', '7', '8', '9'],
                ['.', '4', '5', '6'],
                ['0', '1', '2', '3']
            ];
            this.showSymbols = false;
            this.showCapitalize = false;

        } else if (type === InputField.TYPE_ALPHABETIC) {

            this.firstPage = this.alphabets;
            this.showSymbols = false;
            this.showCapitalize = true;

        } else if (type === InputField.TYPE_ALPHA_NUMERIC) {

            this.firstPage = [
                this.digits,
                this.alphabets[0],
                this.alphabets[1],
                this.alphabets[2]
            ];
            this.showSymbols = true;
            this.showCapitalize = true;

        } else if (type === InputField.TYPE_DECIMAL) {

            this.firstPage = [
                this.digits,
                this.symbolsMath.slice(0, 7)
            ];
            this.showSymbols = false;
            this.showCapitalize = false;

        } else if (type === InputField.TYPE_ALL) {

            this.firstPage = this.alphabets;
            this.showSymbols = true;
            this.showCapitalize = true;
            this.showDot = false;

        } else if (type === InputField.TYPE_NUMERIC_SYMBOLS) {

            this.firstPage = [
                [',', '7', '8', '9'],
                ['.', '4', '5', '6'],
                ['0', '1', '2', '3']
            ];
            this.secondPage = [
                this.symbolsMath,
                this.symbolsGeneric,
                this.symbolsInterpunkt
            ];
            this.showSymbols = true;
            this.showCapitalize = false;


        } else if (type === InputField.TYPE_EMAIL) {

            this.firstPage = this.alphabets;
            this.showSymbols = true;
            this.showCapitalize = true;
            this.showDot = true;

        }

        this.mainSymbols = this.firstPage;

    };

    Keyboard.prototype.switchSymbols = function () {

        this.is2ndSymbols = false;

        app.input.remove(this.buttons);

        this.isSymbol = !this.isSymbol;

        if (this.isSymbol) {
            this.mainSymbols = this.secondPage;
        } else {
            this.mainSymbols = this.firstPage;
        }

        this.layout();

        this.position.set(this.openPosition.x, this.openPosition.y);

        app.input.add(this.buttons);

        if (!this.isSymbol) {
            this.setCapital(this.isCapital);
        }

    };

    Keyboard.prototype.switchSymbolsPage = function () {
        app.input.remove(this.buttons);

        if (this.is2ndSymbols) {
            this.mainSymbols = this.secondPage;
        } else {
            this.mainSymbols = this.thirdPage;
        }

        this.is2ndSymbols = !this.is2ndSymbols;

        this.layout();

        this.position.set(this.openPosition.x, this.openPosition.y);

        app.input.add(this.buttons);
    };


    Keyboard.prototype.switchCapitalize = function () {

        if (this.isSymbol) {
            this.switchSymbolsPage();
        } else {
            this.isCapital = !this.isCapital;
            this.setCapital(this.isCapital);
            this.capitalizeKey.colors = this.isCapital ? this.colors.capitalize : this.colors.specialKeys;
            this.capitalizeKey.setReleased();

            if (!this.isCapital) {
                this.isPermaCapital = false;
            }
        }

    };

    Keyboard.prototype.setCapital = function (isCapital) {
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            if (!button.isSpecial) {
                if (isCapital) {
                    //                   
                    var capital = button.label.txt.toString().charAt(0).toUpperCase();
                    button.label.txt = capital;
                    button.symbol = capital;
                } else {
                    var lower = button.label.txt.toString().charAt(0).toLowerCase();
                    button.label.txt = lower;
                    button.symbol = lower;
                }
            }
        }
    };


    Keyboard.prototype.subscribe = function (label) {
        this.subscribers.push(label);
    };

    Keyboard.prototype.unsubscribe = function (label) {
        this.subscribers.removeElement(label);
    };

    Keyboard.prototype.getSize = function () {
        return {width: this._width, height: this._height};
    };

    Keyboard.prototype.recalculateSize = function () {

        var fontFactor = 1;
        var factor = 1.5;
        var aspectRatio = app.width / app.height;

        if (aspectRatio < 1) {

            this.cellWidth = app.width / 10;
            this.cellHeight = this.cellWidth * 1.5; //    / (aspectRatio / 0.5 );
            this.fontSize = Config.keyboardFontSize || (this.cellHeight * 0.4 * fontFactor);

            this.keySpacingX = Config.keyboardSpacingX || (this.cellWidth * 0.08);
            this.keySpacingY = Config.keyboardSpacingY || (this.cellHeight * 0.12);

        } else {
            // horizontal
            this.cellWidth = app.width / 10;
            this.cellHeight = this.cellWidth * 0.8;
            this.fontSize = Config.keyboardFontSize || (this.cellHeight * 0.4);

            this.keySpacingX = Config.keyboardSpacingX || (this.cellWidth * 0.08);
            this.keySpacingY = Config.keyboardSpacingY || (this.cellHeight * 0.08);

            factor = 1.2;
        }


        this.preview.label.style.fontSize = Math.round(this.fontSize * factor * 1.5);
        this.preview.setSize(this.cellWidth * factor, this.cellHeight * factor);

        this.numberOfRows = this.mainSymbols.length + 2;

        this.numberOfRows -= 1;

        var raising = 0;

        if (this.raisedBed === null) {
            // auto
            if (aspectRatio < 0.5) {
                raising = -(this.cellHeight * 0.7);
            }

        } else if (this.raisedBed) {
            raising = -(this.cellHeight * 0.7);
        }

        this.setSensorSize(app.width, this.cellHeight * this.numberOfRows - raising);

    };

    Keyboard.prototype.backgroundSetup = function () {

        if (this.background) {
            this.background.removeFromParent();
        }

        this.background = new Sprite('white');
        this.addChild(this.background);

        this.background.tint = this.colors.layoutBackground;
        this.background.width = this._width;
        this.background.height = this._height + 500;

    };

    Keyboard.prototype.layoutSymbols = function (symbols, cellWidth, cellHeight) {

        var y_offset = this.cellHeight / 2;


        for (var j = 0; j < symbols.length; j++) {
            var characters = symbols[j];
            var x_offset = (app.width - characters.length * cellWidth) / 2;


            for (var i = 0; i < characters.length; i++) {
                var character = characters[i];

                if (character === "space") {

                } else {
                    var button = this.createButton(character, cellWidth, cellHeight, this.keySpacingX, this.keySpacingY, this.colors.keys);
                    button.x = i * cellWidth + x_offset + cellWidth / 2;
                    button.y = y_offset + cellHeight * j;
                }

                this.addChild(button);
                this.buttons.push(button);
            }
        }
    };

    Keyboard.prototype.layoutSetup = function () {

        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            button.removeFromParent();
        }

        this.buttons = [];

        var cellWidth = this.cellWidth;
        var cellHeight = this.cellHeight;

        this.layoutSymbols(this.mainSymbols, cellWidth, cellHeight);

        /// pre calculate values here

        var spaceWidth = cellWidth * 5; // + this.keySpacingX * 4 - this.keySpacingX * 2;
        var spaceX = app.width / 2;

        if (this.showDot) {
            spaceWidth -= cellWidth * 2;
            spaceX -= cellWidth;
        }

        var doneWidth = (app.width - app.width / 2) / 2 - this.keySpacingX;
        var doneX = app.width - doneWidth / 2 - this.keySpacingX;

        var symbolsWidth = (app.width - app.width / 2) / 2 - this.keySpacingX * 2;

        // if email layout , space will be different

        var capIcon = new Sprite('keyboard_capitalize');
        capIcon.tint = this.colors.specialKeys.text;
        capIcon.fitTo(cellWidth * 0.5, cellHeight * 0.5);
        capIcon.anchor.set(0.5);

        var symbolsIcon = new Sprite('keyboard_symbols');
        symbolsIcon.tint = this.colors.specialKeys.text;
        symbolsIcon.fitTo(cellWidth * 0.5, cellHeight * 0.5);
        symbolsIcon.anchor.set(0.5);

        var capitalizeColor = this.colors.specialKeys;

        if (!this.isSymbol && this.isCapital) {
            capitalizeColor = this.colors.capitalize;
        }

        var capitalize = this.createButton(this.isSymbol ? symbolsIcon : capIcon, cellWidth * 1.3, cellHeight, this.keySpacingX, this.keySpacingY, capitalizeColor);
        capitalize.symbol = 'capitalize';
        capitalize.anchor.set(0.5, 0.5);
        capitalize.label.txt = '';
        capitalize.isSpecial = true;

        this.capitalizeKey = capitalize;


        if (this.isSymbol) {
            symbolsIcon = 'abc';
        } else {
            symbolsIcon = '123';
        }

        var symbolsButton = this.createButton(this.isSymbol ? 'abc' : '123', symbolsWidth, cellHeight, this.keySpacingX, this.keySpacingY, this.colors.specialKeys, true);

        symbolsButton.symbol = 'keyboard_symbols';
        symbolsButton.anchor.set(0.5, 0.5);

        var space = this.createButton(null, spaceWidth, cellHeight, this.keySpacingX, this.keySpacingY, this.colors.keys, true);
        space.symbol = 'space';
        space.anchor.set(0.5, 0.5);
        space.label.txt = 'space';
        this.addChild(space);

        var at = null;
        var dot = null;

        if (this.showDot) {

            var at = this.createButton('@', cellWidth, cellHeight, this.keySpacingX, this.keySpacingY, this.colors.keys);
            at.anchor.set(0.5, 0.5);
            this.addChild(at);

            var dot = this.createButton('.', cellWidth, cellHeight, this.keySpacingX, this.keySpacingY, this.colors.keys);
            dot.anchor.set(0.5, 0.5);
            this.addChild(dot);

            this.buttons.push(at);
            this.buttons.push(dot);
        }

        var backIcon = new Sprite('keyboard_backspace');
        backIcon.fitTo(cellWidth * 0.5, cellHeight * 0.5);
        backIcon.tint = this.colors.specialKeys.text;
        backIcon.anchor.set(0.5);
        var backspace = this.createButton(backIcon, cellWidth * 1.3, cellHeight, this.keySpacingX, this.keySpacingY, this.colors.specialKeys, true);

        backspace.symbol = 'backspace';
        backspace.anchor.set(0.5, 0.5);
        backspace.label.txt = '';
        this.addChild(backspace);

        var doneButton = this.createButton(this.hasNext ? this.nextText : this.doneText, doneWidth, cellHeight, this.keySpacingX, this.keySpacingY, this.colors.done, true);

        doneButton.symbol = 'done';
        doneButton.anchor.set(0.5, 0.5);
        this.addChild(doneButton);

        this.buttons.push(space);
        this.buttons.push(backspace);
        this.buttons.push(doneButton);

        if (this.showCapitalize) {
            this.buttons.push(capitalize);
            this.addChild(capitalize);
        }

        if (this.showSymbols) {
            this.buttons.push(symbolsButton);
            this.addChild(symbolsButton);
        }

        capitalize.position.set(capitalize._width / 2 + this.keySpacingX, cellHeight * (this.numberOfRows - 2) + cellHeight / 2);

        symbolsButton.position.set(symbolsWidth / 2 + this.keySpacingX, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);

        backspace.position.set(app.width - backspace._width / 2 - this.keySpacingX, cellHeight * (this.numberOfRows - 2) + cellHeight / 2);

        space.position.set(spaceX, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);
        doneButton.position.set(doneX, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);
        if (at) {
            at.position.set(doneX - doneWidth / 2 - cellWidth / 2, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);
        }

        if (dot) {
            dot.position.set(doneX - doneWidth / 2 - cellWidth / 2 - cellWidth, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);

        }

    };

    Keyboard.prototype.createButton = function (symbol, width, height, spacingX, spacingY, colors, isSpecial) {

        spacingX = spacingX || 0;
        spacingY = spacingY || 0;

        var button = new NineSlice('keyboard-key', '15');
        button.colors = colors || this.colors.keys;
        button.isSpecial = isSpecial || false;
        button.setSize(width - spacingX * 2, height - spacingY * 2);

        if (width && height) {
            button.setSensorSize(width, height);
        }

        if (this.colors.keys.dropShadow !== null) {
            button.tint = this.colors.keys.dropShadow;
        }




        var foreground = new NineSlice('keyboard-key', '15');
        foreground.setSize(width - spacingX * 2, height - spacingY * 2);
        foreground.tint = this.colors.keys.background;
        foreground.y = -1;
        button.foreground = foreground;
        button.addChild(foreground);



        var isString = ((typeof symbol) === "string");

        button.label = new Label({
            fontSize: this.fontSize * (isSpecial ? 0.7 : 1),
            fontFamily: Config.keyboardFont || 'Arial'
        });
        button.label.anchor.set(0.5);
        button.addChild(button.label);

        if (isString) {
            button.label.txt = symbol;
            button.symbol = symbol;
        } else if (symbol) {
            // lets add the image
            button.icon = symbol;
            button.addChild(symbol);
            button.label.txt = '';
        }

        if (colors && colors.dropShadow === undefined) {
            button.tint = this.colors.keys.backgorundPressed;
            button.label.zIndex = 2;
            button.foreground.removeFromParent();
            return button;

        }

        button.priority = 100;
        button.onMouseUp = Keyboard.prototype.keyMouseUp.bind(this);
        button.onMouseDown = Keyboard.prototype.keyMouseDown.bind(this);
        button.onMouseCancel = Keyboard.prototype.keyMouseCancel.bind(this);


        button.setColors = function (textColor, backgroundColor) {
            if (this.icon) {
                this.icon.tint = textColor;
            } else {
                this.label.style.fill = textColor;
            }
            this.foreground.tint = backgroundColor;
        }.bind(button);

        button.setPressed = function () {
            this.setColors(this.colors.textPressed, this.colors.backgorundPressed);
        }.bind(button);

        button.setReleased = function () {
            this.setColors(this.colors.text, this.colors.background);
        }.bind(button);

        button.setReleased();




        return button;
    };

    Keyboard.prototype.onChange = function (stream) {


        for (var i = 0; i < this.subscribers.length; i++) {
            var s = this.subscribers[i];
            if (s.onKeyboardChange) {
                s.onKeyboardChange(stream);
            }
        }

        // 

    };


    Keyboard.prototype.onType = function (letter, stream) {

    };

    Keyboard.prototype.onBackspace = function (stream) {

    };

    Keyboard.prototype.keyMouseCancel = function (event, object) {
        this.preview.visible = false;
        object.setReleased();

        if (this.deleteMainTimer) {
            clearTimeout(this.deleteMainTimer);
        }

        if (this.deleteIntervalTimer) {
            clearInterval(this.deleteIntervalTimer);
        }

    };

    Keyboard.prototype.keyMouseDown = function (event, object) {

        this.isKeyDown = true;

        if (this.deleteMainTimer) {
            clearTimeout(this.deleteMainTimer);
        }

        if (this.deleteIntervalTimer) {
            clearInterval(this.deleteIntervalTimer);
        }

        this.permaCapitalTimer = 1000;

        event.stopPropagation();

        object.setPressed();

        if (!object.isSpecial) {

            this.preview.visible = true;
            var p = object.position;
            this.preview.label.txt = object.symbol;
            var x = p.x;

            var w = this.preview._width;
            if (x - w / 2 < 0) {
                x += (w / 2 - x)
            } else if (x + w / 2 > app.width) {
                x -= (x + w / 2) - app.width;
            }

            this.preview.position.set(x, p.y - this.cellHeight / 2 - this.preview._height / 2 + this.keySpacingY);

        } else {

            if (object.symbol === 'backspace') {
                var _this = this;
                this.deleteMainTimer = setTimeout(function () {

                    _this.deleteIntervalTimer = setInterval(function () {
                        if (_this.stream) {
                            _this.stream = _this.stream.slice(0, -1);
                            _this.onBackspace(_this.stream);
                            _this.onChange(_this.stream);
                        } else {
                            clearInterval(_this.deleteIntervalTimer);
                        }
                    }, 60);



                }, 600);
            } else if (object.symbol === 'capitalize') {
                this.switchCapitalize();
            } else if (object.symbol === 'keyboard_symbols') {
                this.switchSymbols();
            }

        }

        if (this.isVibrating && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(20);
        }

    };



    Keyboard.prototype.keyMouseUp = function (event, object) {

        this.isKeyDown = false;

        if (this.deleteMainTimer) {
            clearTimeout(this.deleteMainTimer);
        }

        if (this.deleteIntervalTimer) {
            clearInterval(this.deleteIntervalTimer);
        }

        event.stopPropagation();

        object.setReleased();



        this.preview.visible = false;

        if (this.limit && this.limit <= this.stream.length && (!object.isSpecial || object.symbol === 'space')) {
            return;
        }



        if (object.isSpecial) {
            if (object.symbol === 'backspace') {
                this.stream = this.stream.slice(0, -1);
                this.onBackspace(this.stream);
                this.onChange(this.stream);
            } else if (object.symbol === 'space') {
                this.stream += ' ';
                this.onType(' ', this.stream);
                this.onChange(this.stream);
            } else if (object.symbol === 'done') {
                if (this.hasNext) {
                    this.delegate.onTab(); //TODO This is a hack - fix it
                } else {

                    if (this.delegate && this.delegate.onKeyboardDone) {
                        this.delegate.onKeyboardDone();
                    }

                    this.hide(true);
                }
            }
        } else {
            this.stream += object.symbol;
            this.onType(object.symbol, this.stream);
            this.onChange(this.stream);
        }

    };

    Keyboard.prototype.positionSetup = function () {

        var y = app.height - this._height; // + raising;
        this.openPosition.x = 0;
        this.openPosition.y = y;

    };

    Keyboard.prototype.layout = function () {

        if (this.orientation === Keyboard.VERTICAL) {

        } else if (this.orientation === Keyboard.VERTICAL) {

        }

        //TODO fix this , cos we gonna do the horizontal for now
        this.recalculateSize();

        this.backgroundSetup();
        this.layoutSetup();
        this.positionSetup();

    };



    Keyboard.prototype.show = function (type) {

        if (!this.isShown) {
            Actions.stopByTag('keyboard_animation');
        }

        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            app.input.remove(button);
        }
        app.input.remove(this);

        this.kiboSetType(type);
        this.loadKeyboardSymbols();

        // layout the keyboard
        this.layout();



        app.input.add(this.buttons);
        app.input.add(this);

        if (this.isShown) {
            var t = new TweenMoveTo(this, this.openPosition, null, 100);
            t.run('keyboard_animation');
        } else {
            var t = new TweenMoveTo(this, this.openPosition, null, 200);
            t.run('keyboard_animation');
        }



        if (this.delegate.onKeyboardShow) {
            this.delegate.onKeyboardShow();
        }

        this.visible = true;




        // }



        this.isShown = true;

    };

    Keyboard.prototype.hide = function (force_hide) {

        if (!this.isShown) {
            return false;
        }
        Actions.stopByTag('keyboard_animation');
        this.isShown = false;


        if (force_hide) {
            for (var i = 0; i < this.subscribers.length; i++) { // if something is in focus
                var s = this.subscribers[i];
                if (force_hide && s.isFocused) {
                    s.blur();
                }
            }
        }

        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            app.input.remove(button);
        }
        app.input.remove(this);

        var t = new TweenMoveTo(this, new V(0, app.height), null, 200, function (o) {
            o.visible = false;
        });
        t.run('keyboard_animation');

        if (this.delegate.onKeyboardHide) {
            this.delegate.onKeyboardHide();
        }

    };

    Keyboard.prototype.onMouseDown = function (event, object) {
        event.stopPropagation();
    };

    Keyboard.prototype.onMouseUp = function (event, object) {
        event.stopPropagation();
    };

    Keyboard.prototype.kiboTab = function () {
        this.delegate.onTab();
        return false;
    };

    Keyboard.prototype.kiboShiftTab = function () {
        this.delegate.onShiftTab();
        return false;
    };

    Keyboard.prototype.kiboEsc = function () {
        this.delegate.onEsc();
        return false;
    };

    Keyboard.prototype.kiboEnter = function () {
        this.delegate.onEnter();
        return false;
    };

    Keyboard.prototype.processQueue = function (dt) {

        if (this.showRequest) {
            this.showRequest = false;
            this.show(this.toType);
        } else if (this.hideRequest) {
            this.hideRequest = false;
            this.hide();
        }

        this.permaCapitalTimer -= dt;

        if (this.permaCapitalTimer <= 0 && this.isCapital && this.isKeyDown) {
            this.isPermaCapital = true;
        }

    };

    Keyboard.prototype.requestShow = function (type) {
        this.toType = type;
        this.showRequest = true;
        this.hideRequest = false;
    };

    Keyboard.prototype.requestHide = function () {
        this.hideRequest = true;
        this.showRequest = false;
    };

    window.Keyboard = Keyboard;

}(window , app , sharedObject));