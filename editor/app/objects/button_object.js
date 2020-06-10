(function (window, undefined) {

    function ButtonObject(imageName) {
        this.initialize(imageName);
    }

    ButtonObject.prototype = new Entity();
    ButtonObject.prototype.entityInitialize = ButtonObject.prototype.initialize;
    ButtonObject.prototype.initialize = function (imageName) {

        this.entityInitialize(null);

        imageName = imageName || 'white';

        this._padding = 20;
        this.type = 'ButtonObject';
        this.hasLabel = true;
        this.hasImage = true;

        this.background = new NineSlice(imageName, '1');
        this.background.imageName = imageName;
        this.addChild(this.background);

        this.label = new Label(Style.DEFAULT_INPUT);
        this.label.txt = 'Click';
        this.label.anchor.set(0.5, 0.5);

        this.addChild(this.label);

        this.centered();

        this.originalBtnWidth = 200;
        this.originalBtnHeight = 200;

        // this needs to be exposed

        this._defaultValues = _button_properties_defaults;

        this.properties = JSON.parse(JSON.stringify(this._defaultValues));

    };

    ButtonObject.prototype.updateSize = function () {
        this.sensor = null;
        this.setSensorSize(this.properties.width, this.properties.height);
    };

    ButtonObject.prototype._downResize = function (event, editor) {
        var w = this._width / 2;
        var h = this._height / 2;
        this.initialSize = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
        this.originalBtnWidth = this.properties.width;
        this.originalBtnHeight = this.properties.height;

    };

    ButtonObject.prototype._moveResize = function (event, editor) {
        var gp = this.getGlobalPosition();

        // find the center
        var o = this;
        gp.x += -o.anchor.x * o._width * o.scale.x + o._width / 2 * o.scale.x;
        gp.y += -o.anchor.y * o._height * o.scale.y + o._height / 2 * o.scale.y;

        // 20 is the padding
        var distance = Math.getDistance(event.point, gp);

        var scale = distance / this.initialSize;

        this.properties.width = this.originalBtnWidth * scale;
        this.properties.height = this.originalBtnHeight * scale;

        this.background.setSize(this.properties.width, this.properties.height);
        // this.scale.set(scale, scale);

        this.updateSize();
        this.updateFrame();

        this.bindProperties(editor);

    };


    ButtonObject.prototype.onUpdate = function (dt) {


    };

    ButtonObject.prototype.export = function () {

        this.properties = this.cleanUpDefaultValues(this.properties, this._defaultValues);

        var o = this.basicExport();

        o.txt = this.label.txt;

        o.style = this._exportStyle();

        return o;

    };

    ButtonObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
            this.label.txt = data.txt;

            if (data.properties) {
                this.background.imageName = data.properties.backgroundName || this._defaultValues.backgroundName;
            } else {
                this.background.imageName = this._defaultValues.backgroundName;
            }

            if (data.style) {
                for (var property in data.style) {
                    if (data.style.hasOwnProperty(property)) {
                        this.label.style[property] = data.style[property];
                        // do stuff
                    }
                }
            }
            
        }

        this.background.padding = this.properties.padding;
        this.background.setSize(this.properties.width, this.properties.height);
        this.label.position.set(this.properties.offsetX, this.properties.offsetY);
        this.label.rotation = this.properties.labelRotation;

        if (this.properties.isNineSlice) {
            this.background.tint = convertColor(this.properties.backgroundColorNormal);
        } else {
            this.background.tint = 0xffffff;
        }
        this.label.style.fill = this.properties.textColorNormal;


        this.enableSensor();

        this.updateSize();
        this.createFrame(0, 16);
        this.updateFrame();

        this.canResize = true;

        // this.deselect();
    };

    ButtonObject.prototype.bindProperties = function (editor) {

        var eHTML = Entity.prototype.bindProperties.call(this, editor);

        var html = '';

        var method = 'onSelectedObjectPropertyChange';

        var opt0 = {name: 'width', value: Math.round(this.properties.width), class: 'small', method: method};
        var opt1 = {name: 'height', value: Math.round(this.properties.height), class: 'small', method: method};
        var opt2 = {name: 'padding', value: this.properties.padding, class: 'big', method: method, feedback: true, type: HtmlElements.TYPE_INPUT_STRING};
        var opt3 = {name: 'offsetX', value: Math.round(this.properties.offsetX), class: 'small', displayName: 'Offset X', method: method};
        var opt4 = {name: 'offsetY', value: Math.round(this.properties.offsetY), class: 'small', displayName: 'Offset Y', method: method};
        var opt5 = {name: 'sensorWidth', value: Math.round(this.properties.sensorWidth), class: 'small', displayName: 'width', method: method};
        var opt6 = {name: 'sensorHeight', value: Math.round(this.properties.sensorHeight), class: 'small', displayName: 'height', method: method};

        var opt7 = {name: 'labelRotation', value: Math.roundDecimal(this.properties.labelRotation, 2), class: 'big', method: method, displayName: 'Rotation'};

        var opt8 = {name: 'isNineSlice', checked: this.properties.isNineSlice, method: method, displayName: 'Is Sliced'};


        html += HtmlElements.createCheckbox(opt8).html;

        if (this.properties.isNineSlice) {
            html += HtmlElements.createInput(opt0).html;
            html += HtmlElements.createInput(opt1).html;

            var padding = HtmlElements.createInput(opt2);

            html += padding.html;
        }



        html += HtmlElements.createSection('Label').html;
        html += HtmlElements.createInput(opt3).html;
        html += HtmlElements.createInput(opt4).html;
        html += HtmlElements.createInput(opt7).html;
        html += HtmlElements.createSection('Sensor').html;
        html += HtmlElements.createInput(opt5).html;
        html += HtmlElements.createInput(opt6).html;


        // create color pickers;

        var pickers = [];

        if (this.properties.isNineSlice) {
            html += HtmlElements.createSection('Background Colors').html;

            var bc = ['backgroundColorNormal', 'backgroundColorHover', 'backgroundColorDown', 'backgroundColorDisabled'];

            for (var i = 0; i < bc.length; i++) {
                var c = bc[i];
                var optc1 = {name: c, method: method, displayName: c.replace('backgroundColor', ''), value: this.properties[c], class: "small-picker"};
                var picker = HtmlElements.createColorPicker(optc1);
                html += picker.html;

                pickers.push(picker);
            }


            html += HtmlElements.createSection('Text Colors').html;

            var bc = ['textColorNormal', 'textColorHover', 'textColorDown', 'textColorDisabled'];

            for (var i = 0; i < bc.length; i++) {
                var c = bc[i];
                var optc1 = {name: c, method: method, displayName: c.replace('textColor', ''), value: this.properties[c], class: "small-picker"};
                var picker = HtmlElements.createColorPicker(optc1);
                html += picker.html;

                pickers.push(picker);
            }

        }



        ////////// events 

        html += HtmlElements.createSection('Events').html;


        var opt20 = {name: 'onMouseDown', displayName: 'Down', value: this.properties.onMouseDown, method: method, type: HtmlElements.TYPE_INPUT_STRING};
        html += HtmlElements.createInput(opt20).html;

        var opt21 = {name: 'onMouseUp', displayName: 'Up', value: this.properties.onMouseUp, method: method, type: HtmlElements.TYPE_INPUT_STRING};
        html += HtmlElements.createInput(opt21).html;

        var opt22 = {name: 'onMouseMove', displayName: 'Move', value: this.properties.onMouseMove, method: method, type: HtmlElements.TYPE_INPUT_STRING};
        html += HtmlElements.createInput(opt22).html;

        var opt23 = {name: 'onMouseCancel', displayName: 'Cancel', value: this.properties.onMouseCancel, method: method, type: HtmlElements.TYPE_INPUT_STRING};
        html += HtmlElements.createInput(opt23).html;

        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;

        if (this.properties.isNineSlice) {
            // adjust feedback
            HtmlElements.setFeedback(padding.feedbackID, this.isPaddingValid());
        }

        for (var i = 0; i < pickers.length; i++) {
            var picker = pickers[i];
            HtmlElements.activateColorPicker(picker);
        }

        //  


    };

    ButtonObject.prototype.onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {



        if (property === 'padding') {
            HtmlElements.setFeedback(feedbackID, this.isPaddingValid());
        } else if (property === 'offsetX' || property === 'offsetY') {
            value = Math.round(value) || 0;
            value = Math.clamp(value, -100, 100);
        } else if (property === 'labelRotation') {
            value = Math.roundDecimal(value, 2) || 0;
        } else if (property === 'isNineSlice') {
            value = element.checked;
        }

        var command = new CommandProperty(this, 'properties.' + property, value, function () {

            if (this.properties.isNineSlice) {

                this.background.padding = this.properties.padding;
                this.background.setSize(this.properties.width, this.properties.height);
                this.canResize = true;

            } else {

                var t = PIXI.utils.TextureCache[this.background.imageName];

                this.properties.width = t ? t.width : this.properties.width;
                this.properties.height = t ? t.height : this.properties.height;

                this.background.padding = '2';
                this.canResize = false;
                this.background.setSize(this.properties.width, this.properties.height);
            }

            this.label.position.set(this.properties.offsetX, this.properties.offsetY);
            this.label.rotation = this.properties.labelRotation;

            this.updateSize();
            this.updateFrame();

            if (this.properties.isNineSlice) {
                this.background.tint = convertColor(this.properties.backgroundColorNormal);
            } else {
                this.background.tint = 0xffffff;
            }
            this.label.style.fill = this.properties.textColorNormal;


        }, this);

        editor.commands.add(command);

        if (property === 'isNineSlice') {
            // update the properties
            this.bindProperties(editor);
        }
    };

    ButtonObject.prototype.isPaddingValid = function () {
        return true;
    };

    ButtonObject.prototype._setImage = function (name) {
        this.properties.backgroundName = name;
        this.background.imageName = name;
        this.background.buildBackground();
    };

    window.ButtonObject = ButtonObject;

}(window));