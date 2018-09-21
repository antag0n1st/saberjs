(function (window, undefined) {

    function GenericPopup() {
        this.initialize();
    }

    GenericPopup.prototype = new Sprite();
    GenericPopup.prototype.spriteInitialize = GenericPopup.prototype.initialize;
    // DELEGATE
    // onPopup(popup,button)
    GenericPopup.prototype.initialize = function () {

        this.spriteInitialize();

        this.buttons = [];
        this.inputs = [];
        this.radioButtons = [];

        this.priority = 2;

        this.delegate = null;




    };

    GenericPopup.prototype.enableButtons = function (enable) {

        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            button.isTouchable = enable;
        }
        
        for (var i = 0; i < this.inputs.length; i++) {
            var button = this.inputs[i];
            button.isTouchable = enable;
        }
        
        for (var i = 0; i < this.radioButtons.length; i++) {
            var button = this.radioButtons[i];
            button.isTouchable = enable;
            if(enable){
                Notes.add(button, Notes.RADIO_BUTTON_SELECTED);
            } else {
                Notes.remove(button, Notes.RADIO_BUTTON_SELECTED);
            }
        }
        
        this.isTouchable = enable;
    };

    GenericPopup.prototype.show = function (layer) {
        if (layer) {

            this.visible = true;

            this.enableButtons(true);
            layer.addChild(this);


            this.alpha = 0;
            this.scale.x = 0.5;

            new TweenScale(this, 1, new Bezier(.17, .67, .62, 1.17), 200).run();
            new TweenAlpha(this, 1, null, 200).run();

        } else {
            console.warn("You need to set a layer");
        }
    };

    GenericPopup.prototype.hide = function (instant) {
        if (instant) {
            this.removeFromParent();
            this.enableButtons(false);
            this.visible = false;
        } else {
            new TweenAlpha(this, 0, null, 200, function () {
                this.object.removeFromParent();
                this.object.enableButtons(false);
                this.object.visible = false;
            }, this).run();
        }

    };

    GenericPopup.prototype.setData = function (data) {
        this.setTexture(data.imageName);
    };

    GenericPopup.prototype.onImport = function () {


        this._findButtons(this.children);
        this._findInputs(this.children);
        this._findRadioButtons(this.children);

        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];
            button.onMouseDown = this.onBtnDown.bind(this);
            button.onMouseUp = this.onBtn.bind(this);
        }

        this.visible = true;

        // don't hide it here

        //   this.hide(true);
    };

    GenericPopup.prototype._findButtons = function (children) {
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c instanceof Button || c instanceof TableView) {
                this.buttons.push(c);
            }
            this._findButtons(c.children);
        }
    };
    
    GenericPopup.prototype._findInputs = function (children) {
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c instanceof InputField) {
                this.inputs.push(c);
            }
            this._findInputs(c.children);
        }
    };
    
     GenericPopup.prototype._findRadioButtons = function (children) {
        for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c instanceof RadioButton) {
                this.radioButtons.push(c);
            }
            this._findRadioButtons(c.children);
        }
    };

    GenericPopup.prototype.onBtnDown = function (event, sender) {
        event.stopPropagation();

    };

    GenericPopup.prototype.onBtn = function (event, sender) {
        event.stopPropagation();
        if (this.delegate && this.delegate.onPopup) {
            if (this.delegate.onPopup(this, sender) === false) {
                return;
            }
        }
        this.hide();
    };

    GenericPopup.prototype.onMouseDown = function (event, sender) {
        event.stopPropagation();
    };

    GenericPopup.prototype.onUpdate = function (dt) {


    };

    window.GenericPopup = GenericPopup;

}(window));