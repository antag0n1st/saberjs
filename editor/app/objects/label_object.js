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
        this.hasLabel = true;

        this.label = new Label();
        this.label.txt = text;
        this.label.anchor.set(0.5, 0.5);

        this.addChild(this.label);

        this.centered();

        this._defaultValues = _label_properties_defaults;
        this.properties = JSON.parse(JSON.stringify(this._defaultValues));

        this.applyStyle(_label_style_defaults);

    };

    LabelObject.prototype.applyStyle = function (style , compare) {
        for (var property in style) {
            if (style.hasOwnProperty(property)) {
                if(compare){
                    if (compare[property] !== undefined) {
                        this.label.style[property] = style[property];
                    }
                } else {
                    this.label.style[property] = style[property];
                }
                
            }
        }
    };

    LabelObject.prototype.updateSize = function () {
        var w = this.label.width + this._padding;
        if (this.properties.width) {
            w = this.properties.width;
        }

        this.sensor = null;
        this.setSensorSize(w, this.label.height + this._padding);
    };


    LabelObject.prototype.onUpdate = function (dt) {

        Entity.prototype.onUpdate.call(this, dt);

        if (this.anchor.x !== this.label.anchor.x || this.anchor.y !== this.label.anchor.y) {
            this.label.anchor.x = this.anchor.x;
            this.label.anchor.y = this.anchor.y;
        }

    };

    LabelObject.prototype.export = function () {

        var o = this.basicExport();

        o.txt = this.label.txt;
        o.style = this._exportStyle();

        if (this._exportMap) {
            o = this._exportMap(o);
        }

        return o;

    };

    LabelObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
            this.label.txt = data.txt;


            this.applyStyle(data.style)

            if (this._importMap) {
                this._importMap(data);
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