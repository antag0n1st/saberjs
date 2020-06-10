(function (window, undefined) {

    function TilingSpriteObject() {
        this.initialize();
    }

    TilingSpriteObject.prototype = new Entity();
    TilingSpriteObject.prototype.entityInitialize = TilingSpriteObject.prototype.initialize;
    TilingSpriteObject.prototype.initialize = function () {

        this.entityInitialize(null);
        this.type = 'TilingSpriteObject';
        this.centered();

        this.imageName = ''; // in order to prevent showing into the layer tree view



        this._defaultValues = _tilingsprite_properties_defaults;

        this.properties = JSON.parse(JSON.stringify(this._defaultValues));


        this.anchor.set(0.5, 0.5);

        this.canResize = false;
        this.hasRotationHandle = false;

        this.background = new PIXI.TilingSprite(this.findTexture(this.properties.backgroundName));
        this.background.anchor.set(0.5, 0.5);
        this.addChild(this.background);

        this.hasImage = true;


    };

    TilingSpriteObject.prototype.updateSize = function () {
        this.sensor = null;
        this.setSensorSize(this.properties.width, this.properties.height);
    };

    TilingSpriteObject.prototype.build = function (data) {


        if (data) {
            this.setBasicData(data);
            if (data.properties) {
                this.background.imageName = data.properties.backgroundName || this._defaultValues.backgroundName;
            } else {
                this.background.imageName = this._defaultValues.backgroundName;
            }
            this.background.texture = this.findTexture(this.background.imageName);
        }

        this.background.width = this.properties.width;
        this.background.height = this.properties.height;

        this.background.tilePosition.set(this.properties.tilePositionX, this.properties.tilePositionY);
        this.background.tileScale.set(this.properties.tileScaleX, this.properties.tileScaleY);


        this.enableSensor();
        this.createFrame(20, 16);
        this.updateFrame();

        this.deselect();

        this.updateSize();

    };

    TilingSpriteObject.prototype.rebuild = function () {

        this.background.texture = this.findTexture(this.properties.backgroundName || 'white');

        this.background.width = this.properties.width;
        this.background.height = this.properties.height;

        this.background.tilePosition.set(this.properties.tilePositionX, this.properties.tilePositionY);
        this.background.tileScale.set(this.properties.tileScaleX, this.properties.tileScaleY);

    };


    TilingSpriteObject.prototype.onUpdate = function (dt) {

        this.background.anchor = this.anchor;

    };

    TilingSpriteObject.prototype.export = function () {

        var o = this.basicExport();

        return o;

    };

    TilingSpriteObject.prototype.onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {

        var command = new CommandProperty(this, 'properties.' + property, value, function () {

            this.background.width = this.properties.width;
            this.background.height = this.properties.height;

            this.background.tilePosition.set(this.properties.tilePositionX, this.properties.tilePositionY);
            this.background.tileScale.set(this.properties.tileScaleX, this.properties.tileScaleY);

            this.updateSize();
            this.updateFrame();



        }, this);

        editor.commands.add(command);

    };

    TilingSpriteObject.prototype.bindProperties = function (editor) {

        var eHTML = Entity.prototype.bindProperties.call(this, editor);

        var html = '';

        var method = 'onSelectedObjectPropertyChange';

        var opt0 = {name: 'width', value: Math.round(this.properties.width), class: 'small', method: method, range: [1,1920]};
        var opt1 = {name: 'height', value: Math.round(this.properties.height), class: 'small', method: method, range: [1,1920]};

        var opt2 = {name: 'tilePositionX', value: Math.roundDecimal(this.properties.tilePositionX, 2), class: 'small', method: method, displayName: "X Offset"};
        var opt3 = {name: 'tilePositionY', value: Math.roundDecimal(this.properties.tilePositionY, 2), class: 'small', method: method, displayName: "Y Offset"};
        var opt4 = {name: 'tileScaleX', value: Math.roundDecimal(this.properties.tileScaleX, 2), class: 'small', displayName: 'Scale X', method: method};
        var opt5 = {name: 'tileScaleY', value: Math.roundDecimal(this.properties.tileScaleY, 2), class: 'small', displayName: 'Scale Y', method: method};

        html += HtmlElements.createInput(opt0).html;
        html += HtmlElements.createInput(opt1).html;
        html += HtmlElements.createInput(opt2).html;
        html += HtmlElements.createInput(opt3).html;
        html += HtmlElements.createInput(opt4).html;
        html += HtmlElements.createInput(opt5).html;

        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;

    };

    TilingSpriteObject.prototype._setImage = function (name) {

        this.properties.backgroundName = name;
        this.rebuild();
    };

    Object.defineProperty(TilingSpriteObject.prototype, "width", {
        get: function () {
            return this.properties.width;
        },
        set: function (value) {
            this.properties.width = value;
            this.rebuild();
        }
    });

    Object.defineProperty(TilingSpriteObject.prototype, "height", {
        get: function () {
            return this.properties.height;
        },
        set: function (value) {
            this.properties.height = value;
            this.rebuild();
        }
    });

    window.TilingSpriteObject = TilingSpriteObject;

}(window));