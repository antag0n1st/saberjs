(function (window, undefined) {

    function ViewComponentObject() {
        this.initialize();
    }

    ViewComponentObject.prototype = new Entity();
    ViewComponentObject.prototype.entityInitialize = ViewComponentObject.prototype.initialize;
    ViewComponentObject.prototype.initialize = function () {

        this.entityInitialize(null);
        this.type = 'ViewComponentObject';
        this.centered();

        this.imageName = ''; // in order to prevent showing into the layer tree view

        this.properties = {
            width: 800,
            height: 200 , 
            view_name: ''
        };

        this.badge = new Sprite('_document_icon')
        this.badge.scale.set(0.5);
        this.badge.alpha = 0.5;
        this.badge.zIndex = 100;
//        this.badge.anchor.set(0.5, 0.5);
//        this.badge.position.set(20, 20);
        this.addChild(this.badge);

        this.anchor.set(0, 0);

        this.canResize = false;
        this.hasRotationHandle = false;

        // 

        this.canExportChildren = false;


    };

    ViewComponentObject.prototype.updateSize = function () {
        this.sensor = null;
        this.setSensorSize(this.properties.width, this.properties.height);
    };

    ViewComponentObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
        }

        this.enableSensor();
        this.createFrame(20, 16);
        this.updateFrame();

        this.deselect();

        this.updateSize();

    };

    ViewComponentObject.prototype.bindProperties = function (editor) {

        var eHTML = Entity.prototype.bindProperties.call(this, editor);

        var html = '';

        var method = 'onSelectedObjectPropertyChange';

        var opt0 = {name: 'width', value: Math.round(this.properties.width), class: 'small', method: method};
        var opt1 = {name: 'height', value: Math.round(this.properties.height), class: 'small', method: method};
        
        var tooltip = "Refresh the page in order to make the import\nAny direct modifications will not be saved\nas its content is non exportable";
        var opt2 = {tooltip:tooltip,name: 'view_name', value: this.properties.view_name, method: method , type: HtmlElements.TYPE_INPUT_STRING};

        html += HtmlElements.createInput(opt0).html;
        html += HtmlElements.createInput(opt1).html;
        html += HtmlElements.createInput(opt2).html;
        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;

    };

    ViewComponentObject.prototype.onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {



        var command = new CommandProperty(this, 'properties.' + property, value, function () {

            this.updateSize();
            this.updateFrame();

        }, this);

        editor.commands.add(command);

    };


    ViewComponentObject.prototype.onUpdate = function (dt) {


    };

    ViewComponentObject.prototype.export = function () {

        var o = this.basicExport();

        return o;

    };

    window.ViewComponentObject = ViewComponentObject;

}(window));