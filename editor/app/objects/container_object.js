(function (window, undefined) {

    function ContainerObject() {
        this.initialize();
    }

    ContainerObject.prototype = new Entity();
    ContainerObject.prototype.entityInitialize = ContainerObject.prototype.initialize;
    ContainerObject.prototype.initialize = function () {

        this.entityInitialize('_container');
        this.type = 'ContainerObject';
        this.centered();

        this.imageName = '';


        this.properties = {
            padding: 0
        };

    };

    ContainerObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
            //this.setTexture(data.imageName);
        }

        this.enableSensor();
        this.createFrame(20, 16);
        this.updateFrame();

        this.deselect();

    };


    ContainerObject.prototype.onUpdate = function (dt) {


    };

    ContainerObject.prototype.export = function () {

        var o = this.basicExport();
        return o;

    };


    ContainerObject.prototype.bindProperties = function (editor) {

        var eHTML = Entity.prototype.bindProperties.call(this, editor);

        var html = '';

        var method = 'onSelectedObjectPropertyChange';

        var opt0 = {name: 'padding', value: Math.round(this.properties.padding), method: method};
        var opt1 = {name: 'layout', displayName: 'Layout Now', class: '', icon: 'fa fa-th',  method: '' ,tooltip: 'It will layout all the containing elements' , style:'margin-top:5px;'};


        html += HtmlElements.createSection('Grid').html;
        html += HtmlElements.createInput(opt0).html;
        html += HtmlElements.createButton(opt1).html;

        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;

    };

    ContainerObject.prototype.onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {

        this.properties[property] = value;

//        if (property === "padding") {
//            if (value <= 0) {
//                this.label.style.wordWrap = false;
//            } else {
//                this.label.style.wordWrap = true;
//                this.label.style.wordWrapWidth = value;
//            }
//        }
//
//        var command = new CommandProperty(this, 'properties.' + property, value, function () {
//
//            this.updateSize();
//            this.updateFrame();
//
//        }, this);
//
//        editor.commands.add(command);

    };

    window.ContainerObject = ContainerObject;

}(window));