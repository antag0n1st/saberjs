(function (window, undefined) {

    function NineSliceObject() {
        this.initialize();
    }

    NineSliceObject.prototype = new Entity();
    NineSliceObject.prototype.entityInitialize = NineSliceObject.prototype.initialize;
    NineSliceObject.prototype.initialize = function () {

        this.entityInitialize(null);
        this.type = 'NineSliceObject';
        this.centered();

        this.imageName = ''; // in order to prevent showing into the layer tree view

        this.properties = {
            width: 250,
            height: 100,
            backgroundName: 'white',
            tintColor: "#ffffff",
            padding: '1',
            sensorWidth: 0,
            sensorHeight: 0,
        };


        this.anchor.set(0.5, 0.5);

        this.canResize = false;
        this.hasRotationHandle = false;

        this.background = new NineSlice(this.properties.backgroundName, '1');
        this.addChild(this.background);

        this.hasImage = true;


    };

    NineSliceObject.prototype.updateSize = function () {
        this.sensor = null;
        this.setSensorSize(this.properties.width, this.properties.height);
    };

    NineSliceObject.prototype.build = function (data) {


        if (data) {
            this.setBasicData(data);
            this.background.imageName = data.properties.backgroundName || 'white';
        }

        this.background.padding = this.properties.padding;
        this.background.setSize(this.properties.width, this.properties.height);
        this.background.tint = convertColor(this.properties.tintColor);

        this.enableSensor();
        this.createFrame(20, 16);
        this.updateFrame();

        this.deselect();

        this.updateSize();

    };

    NineSliceObject.prototype.rebuild = function () {

        if (this.background) {
            this.background.removeFromParent();
            this.background = null;
        }

        this.background = new NineSlice(this.properties.backgroundName, '1');
        this.addChild(this.background);

        this.background.padding = this.properties.padding;
        this.background.setSize(this.properties.width, this.properties.height);
        this.background.tint = convertColor(this.properties.tintColor);

    };


    NineSliceObject.prototype.onUpdate = function (dt) {


    };

    NineSliceObject.prototype.export = function () {

        var o = this.basicExport();

        return o;

    };

    NineSliceObject.prototype.onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {



        if (property === 'padding') {
            HtmlElements.setFeedback(feedbackID, this.isPaddingValid());
        }

        var command = new CommandProperty(this, 'properties.' + property, value, function () {

            this.background.padding = this.properties.padding;
            this.background.setSize(this.properties.width, this.properties.height);
            this.background.tint = convertColor(this.properties.tintColor);

            this.updateSize();
            this.updateFrame();



        }, this);

        editor.commands.add(command);

    };

    NineSliceObject.prototype.bindProperties = function (editor) {

        var eHTML = Entity.prototype.bindProperties.call(this, editor);

        var html = '';

        var method = 'onSelectedObjectPropertyChange';

        var opt0 = {name: 'width', value: Math.round(this.properties.width), class: 'small', method: method};
        var opt1 = {name: 'height', value: Math.round(this.properties.height), class: 'small', method: method};
        var opt2 = {name: 'padding', value: Math.round(this.properties.padding), class: 'big', method: method, feedback: true , type: HtmlElements.TYPE_INPUT_STRING};
        var opt5 = {name: 'sensorWidth', value: Math.round(this.properties.sensorWidth), class: 'small', displayName: 'width', method: method};
        var opt6 = {name: 'sensorHeight', value: Math.round(this.properties.sensorHeight), class: 'small', displayName: 'height', method: method};

        var opt9 = {name: 'tintColor', method: method, displayName: 'Color', value: this.properties.tintColor};

        html += HtmlElements.createInput(opt0).html;
        html += HtmlElements.createInput(opt1).html;

        var padding = HtmlElements.createInput(opt2);
        var colorPicker = HtmlElements.createColorPicker(opt9);
        html += padding.html;

        html += colorPicker.html;
        html += HtmlElements.createSection('Sensor').html;
        html += HtmlElements.createInput(opt5).html;
        html += HtmlElements.createInput(opt6).html;


        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;


        // adjust feedback
        HtmlElements.setFeedback(padding.feedbackID, this.isPaddingValid());
        HtmlElements.activateColorPicker(colorPicker);

    };

    NineSliceObject.prototype.isPaddingValid = function () {
        
        return true;
    };

    NineSliceObject.prototype._setImage = function (name) {
    
        this.properties.backgroundName = name;
        this.background.imageName = name;
        this.background.buildBackground();
    };
    
     Object.defineProperty(NineSliceObject.prototype, "width", {
        get: function () {
            return this.properties.width;
        },
        set: function (value) {
            this.properties.width = value;
            this.rebuild();
        }
    });
    
    Object.defineProperty(NineSliceObject.prototype, "height", {
        get: function () {
            return this.properties.height;
        },
        set: function (value) {
            this.properties.height = value;
            this.rebuild();
        }
    });

    window.NineSliceObject = NineSliceObject;

}(window));