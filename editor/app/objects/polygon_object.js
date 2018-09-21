(function (window, undefined) {

    function PolygonObject() {
        this.initialize();
    }

    PolygonObject.prototype = new Entity();
    PolygonObject.prototype.entityInitialize = PolygonObject.prototype.initialize;
    PolygonObject.prototype.initialize = function () {

        this.entityInitialize(null);
        this.type = 'PolygonObject';
        this.centered();

        this.points = [];

        this.graphics = null;

        this.imageName = ''; // in order to prevent showing into the layer tree view

    };

    PolygonObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
        }


        this.enableSensor();

        //  this.setSensorSize(30, 30);

        this.canResize = false;
        this.hasFrame = false;

        this.deselect();

        if (data && data.points) {
            ///////////
            var points = [];
            for (var i = 0; i < data.points.length; i++) {
                var p = data.points[i];

                var gp = new GenericPoint();
                gp.graphics = this.graphics;
                gp.delegate = this;
                gp.position.set(p.x, p.y);
                gp.build();
                this.points.push(gp);
                this.addChild(gp);
                var p = new V().copy(gp.position);
                points.push(p);
            }
            // create polygon 


            var polygon = new SAT.Polygon(new V(), points);
            this.setCustomSensor(polygon);
        }



    };

    PolygonObject.prototype.onPointChange = function (point) {
        this.rebuildPolygon();
    };

    PolygonObject.prototype.onPointDelete = function (point) {
        this.points.removeElement(point);
        this.rebuildPolygon();
    };

    PolygonObject.prototype.rebuildPolygon = function () {
        var points = [];
        for (var i = 0; i < this.points.length; i++) {
            var p0 = this.points[i];
            p0.delegate = this;
            var p = new V().copy(p0.position);
            points.push(p);
        }

        var polygon = new SAT.Polygon(new V(), points);
        this.setCustomSensor(polygon);
    };

    PolygonObject.prototype.onUpdate = function (dt) {

        if (!this.visible) {
            return;
        }

        var graphics = this.graphics;

        this.draw(graphics);

    };
    
    PolygonObject.prototype.draw = function (graphics) {
          var sensor = this.getSensor();

        var fillColor = 0x2d31e6;
        var strokeColor = 0xffffff;
        var alpha = 0.3;

        if (this.isSelected) {
            // strokeColor = 0xadaee8;
            alpha = 0.6;
        }

        graphics.lineStyle(2, strokeColor, 1);
        graphics.beginFill(fillColor, alpha);

        this.renderPolygon(sensor, graphics);
    };
    
    PolygonObject.prototype.bindProperties = function (editor) {

        var eHTML = Entity.prototype.bindProperties.call(this, editor);

        var html = '';

        var method = 'onSelectedObjectPropertyChange';
      
        var opt0 = {name: 'isCustomSensor', checked: this.properties.isCustomSensor, method: method, displayName: 'Is Sensor'};

        html += HtmlElements.createCheckbox(opt0).html;

        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;



    };

    PolygonObject.prototype.onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {

        if (property === "isCustomSensor") {
             value = element.checked;
        }

        var command = new CommandProperty(this, 'properties.' + property, value, undefined, this);

        editor.commands.add(command);

    };
    

    
    PolygonObject.prototype.export = function () {

        var points = [];
        for (var i = 0; i < this.points.length; i++) {
            var p0 = this.points[i];
            p0.export = null;
            points.push({
                x: p0.position.x,
                y: p0.position.y
            });
        }

        var o = this.basicExport();
        o.points = points;

        for (var i = 0; i < this.points.length; i++) {
            var p0 = this.points[i];
            p0.export = GenericPoint.prototype.export;
        }

        return o;

    };

    window.PolygonObject = PolygonObject;

}(window));