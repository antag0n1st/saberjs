(function (window, undefined) {

    function InputContent(delegate) {
        this.initialize(delegate);
    }

    //DELEGATE
    // - onKeyboardStream
    // - onKeyboardDone
    // - onKeyboardActivated
    // - onKeyboardDismissed
    // - onKeyboardInputFocus
    // - onKeyboardInputBlur

    InputContent.prototype = new Sprite();
    InputContent.prototype.spriteInitialize = InputContent.prototype.initialize;
    InputContent.prototype.initialize = function (delegate) {

        if (!delegate) {
            throw 'You must initialize the InputContent with a delegate';
        }

        this.spriteInitialize(null);
        this.delegate = delegate;

        this.keyboard = new Keyboard(this);
        this.delegate.addChild(this.keyboard);

        this.inputFields = [];

        this.priority = -100;

        this._inputTabCounter = 0;

        this.tabIndex = 0;

        this.setSensorSize(app.width, app.height);

    };

    InputContent.prototype.addInput = function (input) {

        input.setKeyboard(this.keyboard);
        input.tabIndex = this._inputTabCounter++;
        input.delegate = this;
        input.onFocus = InputContent.prototype.onInputFocus.bind(this);
        this.inputFields.push(input);

        app.input.add(input);

    };

    InputContent.prototype.onInputFocus = function (input) {
        this.tabIndex = input.tabIndex;
        for (var i = 0; i < this.inputFields.length; i++) {
            var ipt = this.inputFields[i];
            if (!Object.is(input, ipt)) {

                if (ipt.isFocused && this.delegate && this.delegate.onKeyboardInputBlur) {
                    this.delegate.onKeyboardInputBlur(input);
                }

                ipt.blur();

            }
        }
        if (this.delegate && this.delegate.onKeyboardInputFocus) {
            this.delegate.onKeyboardInputFocus(input);
        }
    };

    InputContent.prototype.onMouseUp = function (event, sender) {
        for (var i = 0; i < this.inputFields.length; i++) {
            var input = this.inputFields[i];

            if (input.isFocused && this.delegate && this.delegate.onKeyboardInputBlur) {
                this.delegate.onKeyboardInputBlur(input);
            }

            input.blur();
        }
        window.focus();
    };

    InputContent.prototype.onMouseCancel = function (event, sender) {
        for (var i = 0; i < this.inputFields.length; i++) {
            var input = this.inputFields[i];
            if (input.isFocused && this.delegate && this.delegate.onKeyboardInputBlur) {
                this.delegate.onKeyboardInputBlur(input);
            }
            input.blur();
        }
        window.focus();
    };

    InputContent.prototype.onKeyboardShow = function () {

        var y = this.position.y;

        var size = this.keyboard.getSize();
        var p = new V(0, -size.height);
        Actions.stopByTag('animate_content');

        var fp = new V();
        var fi = null;
        // find the focused input
        for (var i = 0; i < this.inputFields.length; i++) {
            var input = this.inputFields[i];
            if (input.isFocused) {
                fi = input;
                fp.copy(input.getGlobalPosition());
            }
        }

        if (fi.scrollToY) {
            new TweenMoveTo(this, new V(0, fi.scrollToY - fp.y), null, 200).run('animate_content');
        } else {
            var visibleHeight = app.height - size.height;
            var mid_y = visibleHeight / 2;
            p.y = (mid_y - fp.y + y);

            if (p.y < -size.height) {
                p.y = -size.height;
            }

            var rest = app.height - size.height;

            /// scroll only if needed
            if (fp.y + fi._height / 2 > rest
                    || fp.y - fi._height / 2 < 0) {
                new TweenMoveTo(this, p, null, 200).run('animate_content');
            }
        }

        if (window.history) {
            window.history.pushState({
                keyboard: true
            }, '');
        }



        if (this.delegate && this.delegate.onKeyboardActivated) {

            this.delegate.onKeyboardActivated();
        }
        
        var _this = this;
        
        window.onpopstate = function (e) {
            _this.onHistoryChange(e);

        };

    };

    InputContent.prototype.onKeyboardHide = function () {

        var p = new V(0, 0);
        Actions.stopByTag('animate_content');

        new TweenMoveTo(this, p, null, 200).run('animate_content');
        
        if (window.history) {
            if (history.state && history.state.keyboard) {
                history.back();
            }
        }
        
        if (this.delegate && this.delegate.onKeyboardDismissed) {
            this.delegate.onKeyboardDismissed();
        }

    };

    InputContent.prototype.onTab = function () {

        if (this.inputFields.length) {
            var index = ++this.tabIndex % this.inputFields.length;
            for (var i = 0; i < this.inputFields.length; i++) {
                var input = this.inputFields[i];
                if (input.tabIndex === index) {
                    input.focus();
                    break;
                }
            }
        }
    };

    InputContent.prototype.onShiftTab = function () {

        if (this.inputFields.length) {
            var index = --this.tabIndex % this.inputFields.length;
            index = (index < 0) ? (this.inputFields.length + index) : index;
            for (var i = 0; i < this.inputFields.length; i++) {
                var input = this.inputFields[i];
                if (input.tabIndex === index) {
                    input.focus();
                    break;
                }
            }
        }

    };

    InputContent.prototype.onEsc = function () {
        for (var i = 0; i < this.inputFields.length; i++) {
            var input = this.inputFields[i];
            input.blur();
        }
        window.focus();
    };

    InputContent.prototype.onEnter = function () {

        if (this.delegate && this.delegate.onKeyboardDone) {
            this.delegate.onKeyboardDone();
        }

        for (var i = 0; i < this.inputFields.length; i++) {
            var input = this.inputFields[i];
            if (input.isFocused) {
                input.onEnter(input);
            }
            input.blur();
        }
        window.focus();

    };

    InputContent.prototype.onInputAdded = function () {
        app.input.add(this.inputFields);
    };

    InputContent.prototype.onInputRemoved = function () {
        app.input.remove(this.inputFields);
        this.keyboard.hide(true);

        // just make sure there are no input fields active
        for (var i = 0; i < this.inputFields.length; i++) {
            var input = this.inputFields[i];
            input.blur();
        }
    };

    InputContent.prototype.onStreamChanged = function (stream, prevStream, inputField) {
        if (this.delegate && this.delegate.onKeyboardStream) {
            this.delegate.onKeyboardStream(stream, prevStream, inputField);
        }
    };

    InputContent.prototype.onKeyboardDone = function () {
        if (this.delegate && this.delegate.onKeyboardDone) {
            this.delegate.onKeyboardDone();
        }
    };

    InputContent.prototype.onUpdate = function (dt) {

        if (this.keyboard) {
            this.keyboard.processQueue();
        }

    };
    
    InputContent.prototype.onHistoryChange = function (e) {
        
        for (var i = 0; i < this.inputFields.length; i++) {
            var input = this.inputFields[i];
            input.blur();
        }
        
    };

    window.InputContent = InputContent;

}(window));