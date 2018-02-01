(function (window, undefined) {

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
    Keyboard.prototype.initialize = function (delegate, orientation, type) {

        this.spriteInitialize(); // your image name


        this.type = type;
        this.delegate = delegate;

        this.priority = 99;
        this.orientation = orientation;
        this.fontSize = 60;
        this.openPosition = new V();

        this.limit = 0;
        this.stream = '';
        
        this.hasNext = false;

        this.subscribers = [];

        this.mainSymbols = [];
        this.topSymbols = [];

        this.digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        this.symbols = ['+', '-', '/', '*', '=', '<', '>', '.', ',', '%'];
        this.alphabets = [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm']
        ];

        this.buttons = [];

        this.background = null;

        this.isCapital = false;
        this.isShown = false;
        this.isSymbol = false;
        this.showCapitalize = true;
        this.showSymbols = true;
        this.showDot = true;

        this.numberOfRows = -1;
        this.cellWidth = app.width / 10;
        this.cellHeight = 120;

        this.preview = new Button();
        this.preview.imageNormal = 'keyboard_preview_key';
        this.preview.label.style.fontSize = Math.round(this.fontSize * 3);
        this.preview.offsetY = -20;
        this.preview.label.style.fill = '#bbbbbb';
        this.preview.visible = false;
        this.preview.zIndex = 1;
        this.addChild(this.preview);

        this.visible = false;
        this.hide();

        this.position.set(0, app.height);

        this.kibo = new Kibo(window.document, this);

        this.kiboUnregister();
        
        this.zIndex = 100;

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

        if (type === InputField.TYPE_NUMERIC) {

            this.topSymbols = this.digits;
            this.mainSymbols = [];
            this.showSymbols = false;
            this.showCapitalize = false;
            this.showDot = false;

        } else if (type === InputField.TYPE_ALPHABETIC) {

            this.topSymbols = [];
            this.mainSymbols = this.alphabets;
            this.showSymbols = false;
            this.showCapitalize = true;
            this.showDot = false;

        } else if (type === InputField.TYPE_ALPHA_NUMERIC) {

            this.topSymbols = this.digits;
            this.mainSymbols = this.alphabets;
            this.showSymbols = false;
            this.showCapitalize = true;
            this.showDot = false;

        } else if (type === InputField.TYPE_DECIMAL) {

            this.topSymbols = this.digits;
            this.mainSymbols = [];
            this.showSymbols = false;
            this.showCapitalize = false;
            this.showDot = true;

        } else if (type === InputField.TYPE_ALL) {

            this.topSymbols = this.digits;
            this.mainSymbols = this.alphabets;
            this.showSymbols = true;
            this.showCapitalize = true;
            this.showDot = false;
        } else if (type === InputField.TYPE_NUMERIC_SYMBOLS) {

            this.topSymbols = this.digits;
            this.mainSymbols = [];
            this.showSymbols = true;
            this.showCapitalize = false;
            this.showDot = false;
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

        this.numberOfRows = this.mainSymbols.length + 2;

        if (this.topSymbols.length === 0) {
            this.numberOfRows -= 1;
        }

        this.setSensorSize(app.width, this.cellHeight * this.numberOfRows);
    };

    Keyboard.prototype.backgroundSetup = function () {

        if (this.backgorund) {
            this.backgorund.removeFromParent();
        }

        this.backgorund = new PIXI.Graphics();
        this.addChild(this.backgorund);

        this.backgorund.beginFill(0x111111, 1);
        this.backgorund.drawRect(0, 0, this._width, this._height + 500); // + 500 , in order to look nice when transitioning between different kinds of keyboards (different keyboard height)
        this.backgorund.endFill();

    };

    Keyboard.prototype.layoutSetup = function () {

        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            button.removeFromParent();
        }

        this.buttons = [];

        var cellWidth = this.cellWidth;
        var cellHeight = this.cellHeight;

        var x_offset = (app.width - this.topSymbols.length * cellWidth) / 2;

        for (var i = 0; i < this.topSymbols.length; i++) {
            var digit = this.topSymbols[i];
            var button = this.createButton(digit, cellWidth, cellHeight);
            button.position.set(x_offset + i * cellWidth + cellWidth / 2, cellHeight / 2);
            this.addChild(button);
            this.buttons.push(button);
        }

        var y_offset =  this.topSymbols.length ? (this.cellHeight * 1.5) : this.cellHeight/2;

        for (var j = 0; j < this.mainSymbols.length; j++) {
            var characters = this.mainSymbols[j];
            x_offset = (app.width - characters.length * cellWidth) / 2;

            for (var i = 0; i < characters.length; i++) {
                var character = characters[i];
                var button = this.createButton(character, cellWidth, cellHeight);

                button.position.set(i * cellWidth + x_offset + cellWidth / 2, y_offset + cellHeight * j);
                this.addChild(button);
                this.buttons.push(button);
            }
        }

        var capitalize = this.createButton('capitalize');
        capitalize.imageNormal = 'keyboard_capitalize';
        capitalize.anchor.set(0.5, 0.5);
        capitalize.label.txt = '';
        capitalize.isSpecial = true;

        var symbolsButton = this.createButton('keyboard_symbols');
        symbolsButton.imageNormal = 'keyboard_symbols';
        symbolsButton.anchor.set(0.5, 0.5);
        symbolsButton.label.txt = '';
        symbolsButton.isSpecial = true;

        var space = this.createButton('space');
        space.imageNormal = 'keyboard_space';
        space.anchor.set(0.5, 0.5);
        space.label.txt = '';
        space.isSpecial = true;        
        this.addChild(space);
        
        var backspace = this.createButton('backspace');
        backspace.imageNormal = 'keyboard_backspace';
        backspace.anchor.set(0.5, 0.5);
        backspace.label.txt = '';
        backspace.isSpecial = true;
        this.addChild(backspace);

        var doneButton = this.createButton('done');
        
        if(this.hasNext){
            doneButton.imageNormal = 'keyboard_next';
        } else {
            doneButton.imageNormal = 'keyboard_close';
        }
        
        doneButton.anchor.set(0.5, 0.5);
        doneButton.label.txt = '';
        doneButton.isSpecial = true;
        this.addChild(doneButton);

        var dotButton = this.createButton('.', cellWidth, cellHeight);

        if (this.showDot) {
            this.addChild(dotButton);
            this.buttons.push(dotButton);
        }

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

        var padding = 20;

        capitalize.position.set(cellWidth / 2 + padding, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);

        if (this.showCapitalize) {
            symbolsButton.position.set(cellWidth / 2 + padding * 2 + cellWidth, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);
        } else {
            symbolsButton.position.set(cellWidth / 2 + padding, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);
        }

        backspace.position.set(app.width - cellWidth / 2 - padding * 2 - cellWidth, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);
        space.position.set(app.width / 2, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);
        doneButton.position.set(app.width - cellWidth / 2 - padding, cellHeight * (this.numberOfRows - 1) + cellHeight / 2);
        dotButton.position.set(app.width - padding * 3 - cellWidth * 2.5, cellHeight * (this.numberOfRows - 1)+ cellHeight / 2);
    };

    Keyboard.prototype.createButton = function (symbol, width, height) {

        var button = new Button();
        button.symbol = symbol;
        
        button.label.txt = symbol;
        button.label.style.fill = '#bbbbbb';
        button.label.style.fontSize = this.fontSize;
        button.label.style.fontFamily = 'Arial Black';
        button.priority = 100;
        button.onMouseUp = Keyboard.prototype.keyMouseUp.bind(this);
        button.onMouseDown = Keyboard.prototype.keyMouseDown.bind(this);
        button.onMouseCancel = Keyboard.prototype.keyMouseCancel.bind(this);
        button.isSpecial = false;
        
        if(width && height){
            button.setSensorSize(width, height);
        }

        return button;
    };

    Keyboard.prototype.onChange = function (stream) {
        for (var i = 0; i < this.subscribers.length; i++) {
            var s = this.subscribers[i];
            if (s.onKeyboardChange) {
                s.onKeyboardChange(stream);
            }
        }
    };

    Keyboard.prototype.onType = function (letter, stream) {

    };

    Keyboard.prototype.onBackspace = function (stream) {

    };

    Keyboard.prototype.keyMouseCancel = function () {
        this.preview.visible = false;
    };

    Keyboard.prototype.keyMouseDown = function (event, object) {

        event.stopPropagation();

        if (!object.isSpecial) {

            this.preview.visible = true;
            var p = object.position;
            this.preview.label.txt = object.symbol;
            this.preview.position.set(p.x - this.preview.width / 2 , p.y - this.preview.height - object._height * 1.5);

        } else {
            object.tint = 0xdddddd;
        }
    };

    Keyboard.prototype.keyMouseUp = function (event, object) {
        event.stopPropagation();

        this.preview.visible = false;

        if (this.limit && this.limit <= this.stream.length && (!object.isSpecial || object.symbol === 'space')) {
            return;
        }

        if (object.symbol === 'capitalize') {
            this.isCapital = !this.isCapital;
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                if (!button.isSpecial) {
                    if (this.isCapital) {
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
                if(this.hasNext){
                    this.delegate.onTab(); //TODO This is a hack - fix it
                } else {
                    this.hide(true);
                }
            } else if (object.symbol === 'keyboard_symbols') {
                this.switchSymbols();
            }
        } else {
            this.stream += object.symbol;
            this.onType(object.symbol, this.stream);
            this.onChange(this.stream);
        }

    };

    Keyboard.prototype.positionSetup = function () {
        var y = app.height - this._height;
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

    Keyboard.prototype.switchSymbols = function () {
        app.input.remove(this.buttons);

        this.isSymbol = !this.isSymbol;

        if (this.isSymbol) {
            this.topSymbols = this.symbols;
        } else {
            this.topSymbols = this.digits;
        }

        this.layout();

        this.position.set(this.openPosition.x, this.openPosition.y);

        app.input.add(this.buttons);
    };

    Keyboard.prototype.show = function (type) {



        if (this.isShown) {
            return false;
        }
        Actions.stopByTag('keyboard_animation');
        this.isShown = true;
        this.kiboSetType(type);

        this.loadKeyboardSymbols();

        // layout the keyboard
        this.layout();

        app.input.add(this.buttons);
        app.input.add(this);

        this.visible = true;

        var t = new TweenMoveTo(this, this.openPosition, null, 200);
        t.run('keyboard_animation');

        if (this.delegate.onKeyboardShow) {
            this.delegate.onKeyboardShow();
        }

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

    window.Keyboard = Keyboard;

}(window));