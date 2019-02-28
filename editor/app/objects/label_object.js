(function (window, undefined) {

    function LabelObject(text) {
        this.initialize(text);
    }

    LabelObject.prototype = new Entity();
    LabelObject.prototype.entityInitialize = LabelObject.prototype.initialize;
    LabelObject.prototype.initialize = function (text) {

        this.entityInitialize(null);

        this._padding = 20;
        this.type = 'LabelObject';

        this.label = new Label(Style.DEFAULT_INPUT);
        this.label.txt = text;
        this.label.anchor.set(0.5, 0.5);

        this.addChild(this.label);


        this.centered();

        this.properties = {
            width: 0
        };



    };

    LabelObject.prototype.updateSize = function () {
        this.sensor = null;
        this.setSensorSize(this.label.width + this._padding, this.label.height + this._padding);
    };


    LabelObject.prototype.onUpdate = function (dt) {

        if (this.anchor.x !== this.label.anchor.x || this.anchor.y !== this.label.anchor.y) {
            this.label.anchor.x = this.anchor.x;
            this.label.anchor.y = this.anchor.y;
        }

    };

    LabelObject.prototype.export = function () {

        var o = this.basicExport();

        o.txt = this.label.txt;

        o.style = {
            fill: this.label.style.fill,
            fontFamily: this.label.style.fontFamily,
            fontSize: this.label.style.fontSize,
            align: this.label.style.align,
            stroke: this.label.style.stroke,
            strokeThickness: this.label.style.strokeThickness,
            dropShadow: this.label.style.dropShadow,
            dropShadowDistance: this.label.style.dropShadowDistance,
            dropShadowAngle: this.label.style.dropShadowAngle,
            dropShadowColor: this.label.style.dropShadowColor,
            wordWrap: this.label.style.wordWrap,
            wordWrapWidth: this.label.style.wordWrapWidth,
            letterSpacing: this.label.style.letterSpacing,
            lineHeight: this.label.style.lineHeight,
            padding: this.label.style.padding
        };

        return o;

    };

    LabelObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
            this.label.txt = data.txt;


            for (var property in data.style) {
                if (data.style.hasOwnProperty(property)) {
                    this.label.style[property] = data.style[property];
                    // do stuff
                }
            }
        }



        this.enableSensor();

        this.updateSize();
        this.createFrame(0, 16);
        this.updateFrame();

        this.canResize = false;

        this.deselect();
    };

    LabelObject.prototype.bindProperties = function (editor) {

        var eHTML = Entity.prototype.bindProperties.call(this, editor);

        var html = '';

        var method = 'onSelectedObjectPropertyChange';

        var opt0 = {name: 'width', value: Math.round(this.properties.width), method: method};

        html += HtmlElements.createSection('Multiline').html;
        html += HtmlElements.createInput(opt0).html;

        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;

    };

    LabelObject.prototype.onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {

        if (property === "width") {
            if (value <= 0) {
                this.label.style.wordWrap = false;
            } else {
                this.label.style.wordWrap = true;
                this.label.style.wordWrapWidth = value;
            }
        }

        var command = new CommandProperty(this, 'properties.' + property, value, function () {

            this.updateSize();
            this.updateFrame();

        }, this);

        editor.commands.add(command);

    };

    window.LabelObject = LabelObject;

}(window));