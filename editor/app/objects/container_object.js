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
            width: 600,
            spacing: 10,
            hSpacing: 0,
            xOffset: 0,
            yOffset: 0,
            alignment: 'center',
            wrap: true
        };

    };

    ContainerObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
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

        var opt0 = {name: 'width', value: this.properties.width, method: method , range: [0,]};
        var opt1 = {name: 'spacing', value: this.properties.spacing, method: method, class: 'small', range: [0,]};
        var opt2 = {name: 'hSpacing', value: this.properties.hSpacing, method: method, class: 'small',range:[0,]};
        var opt3 = {name: 'xOffset', value: this.properties.xOffset, method: method, class: 'small'};
        var opt4 = {name: 'yOffset', value: this.properties.yOffset, method: method, class: 'small'};
        
        var opt5 = {name: 'alignment', value: this.properties.alignment, method: method, items: ['center', 'top', 'bottom', 'compact']};
        var opt6 = {name: 'wrap', displayName: 'Wrap', class: '', method: method, checked: this.properties.wrap, isDisabled: false};
        var optBtn = {name: 'layout', displayName: 'Layout Now', class: '', icon: 'fa fa-th', method: 'layoutObjects', tooltip: 'It will layout all the containing elements', style: 'margin-top:5px;'};
        var optBtn2 = {name: 'strip-anchor', displayName: 'Reset Anchors', class: 'btn btn-success', icon: 'fa fa-anchor', method: 'resetObjectsAnchor', tooltip: 'It will set the anchor to 0,0', style: 'margin-top:5px;'};


        html += HtmlElements.createSection('Grid').html;
        html += HtmlElements.createInput(opt0).html;
        html += HtmlElements.createInput(opt1).html;
        html += HtmlElements.createInput(opt2).html;
        html += HtmlElements.createInput(opt3).html;
        html += HtmlElements.createInput(opt4).html;
        html += HtmlElements.createDropdown(opt5).html;
        html += HtmlElements.createCheckbox(opt6).html;
        html += HtmlElements.createButton(optBtn2).html;
        html += '<br />';
        html += HtmlElements.createButton(optBtn).html;


        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;

    };

    ContainerObject.prototype.onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {

        if (property === "wrap") {
            this.properties[property] = element.checked;
        } else {
            this.properties[property] = value;
        }

    };

    window.ContainerObject = ContainerObject;

}(window));