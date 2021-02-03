(function (window, app , sharedObject, undefined) {

    function RadioButton(text, imageName, style, padding) {
        this.initialize(text, imageName, style, padding);
    }

    RadioButton.prototype = new Sprite();
    RadioButton.prototype.spriteInitialize = RadioButton.prototype.initialize;
    RadioButton.prototype.initialize = function (text, imageName, style, padding) {

        padding = (padding === undefined) ? 20 : padding;

        this.isSelected = false;

        this.spriteInitialize(null);

        this.radioImage = imageName;

        this.radioSprite = new Sprite(imageName);
        this.label = new Label(style);
        this.label.txt = text;

        this.label.position.set(this.radioSprite.width + padding, 0);

        this.addChild(this.radioSprite);
        this.addChild(this.label);

        var bounds = this.getBounds();
        this.setSensorSize(bounds.width, bounds.height);
        
        this.priority = 10;

    };

    RadioButton.prototype.setSelected = function (isSelected) {
        isSelected = (isSelected === undefined) ? true : isSelected;
        this.isSelected = isSelected;

        if (isSelected) {
            Notes.send(Notes.RADIO_BUTTON_SELECTED, null, this);
            this.radioSprite.setTexture(this.radioImage + '_selected');
        } else {
            this.radioSprite.setTexture(this.radioImage);
        }
    };

    RadioButton.prototype.onMouseUp = function (event, sender) {      
          this.setSelected();
    };

    RadioButton.prototype.onUpdate = function (dt) {

    };

    RadioButton.prototype.onNote = function (noteName, data, sender) {

        if (noteName === Notes.RADIO_BUTTON_SELECTED) {
            if (sender === this) {

            } else {
                this.setSelected(false);
            }
        }
    };

    window.RadioButton = RadioButton;

}(window , app , sharedObject));