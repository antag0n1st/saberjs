(function (window, app , sharedObject, undefined) {

    /**
     * 
     * @property {PIXI.TextStyle} style
     * @param {type} text
     * @returns {labelL#1.Label}
     */
    function Label(style, text) {
        this.initialize(style, text);
    }

    Label.prototype = Object.create(PIXI.Text.prototype);
    Label.prototype.constructor = Label;

    Label.TEXT_H_ALIGN_CENTER = 'center';
    Label.TEXT_H_ALIGN_LEFT = 'left';
    Label.TEXT_H_ALIGN_RIGHT = 'right';

    Label.TEXT_V_ALIGN_TOP = 'top';
    Label.TEXT_V_ALIGN_MIDDLE = 'middle';
    Label.TEXT_V_ALIGN_BOTTOM = 'bottom';
    Label.TEXT_V_ALIGN_ALPHABETIC = 'alphabetic';

    Label.prototype.initialize = function (style, text) {

        style = style || {};

        PIXI.Text.call(this, text || 'Default Label Text');
        
//        this.resolution = 2;


        this.setStyle(style);

    };

    Label.prototype.setStyle = function (style) {

        this.style = style;

    };

    Label.prototype.clone = function () {


        return null;

    };

    Label.prototype.onUpdate = function (dt) {

    };

// GETTERS AND SETTERS

    Object.defineProperty(Label.prototype, "txt", {
        get: function () {
            return this._txt;
        },
        set: function (value) {
            this._txt = value;
            this.text = value;
        }
    });


    window.Label = Label;

}(window , app , sharedObject));
