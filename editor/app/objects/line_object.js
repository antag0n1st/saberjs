(function (window, undefined) {

    function LineObject() {
        this.initialize();
    }

    LineObject.prototype = new Entity();
    LineObject.prototype.entityInitialize = LineObject.prototype.initialize;
    LineObject.prototype.initialize = function () {

        this.entityInitialize(null);
        this.type = 'LineObject';
        this.centered();

        this.points = [];

        this.graphics = null;

        this.imageName = ''; // in order to prevent showing into the layer tree view


        this.sensors = [];


    };

    LineObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
        }


        this.enableSensor();

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

            var pos = new V().copy(this.getGlobalPosition());  //this.getGlobalPosition()

            if (points.length > 1) {
                for (var i = 0; i < points.length - 1; i++) {
                    var p = points[i];
                    var polygon = new SAT.Polygon(pos, [points[i], points[i + 1]]);
                    this.sensors.push(polygon);
                }
            }

        }



    };

    LineObject.prototype._checkPolygon = function (polygon) {

        var pos = new V().copy(this.getGlobalPosition());

        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];
            s.pos.copy(pos);

            if (SAT.testPolygonPolygon(polygon, s)) {
                return true;
            }
        }

        return false;

    };

    function getDistanceFromLine(p, a, b) {

        var atob = {x: b.x - a.x, y: b.y - a.y};
        var atop = {x: p.x - a.x, y: p.y - a.y};
        var len = atob.x * atob.x + atob.y * atob.y;
        var dot = atop.x * atob.x + atop.y * atob.y;
        var t = Math.min(1, Math.max(0, dot / len));

        dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

        var pp = {
            x: a.x + atob.x * t,
            y: a.y + atob.y * t
        };

        return Math.getDistance(p, pp);

    }

    LineObject.prototype._checkPoint = function (point) {

        var pos = new V().copy(this.getGlobalPosition());

        for (var i = 0; i < this.sensors.length; i++) {
            var s = this.sensors[i];

            s.pos.copy(pos);

            var distance = -1;

            var pt1 = new V().copy(s.pos).add(s.points[0]);
            var pt2 = new V().copy(s.pos).add(s.points[1]);

            distance = getDistanceFromLine(point, pt1, pt2);

            if (distance < 20) {
                return true;
            }

        }

        return false;
    };

    LineObject.prototype.onPointChange = function (point) {
        this.rebuildLine();
    };

    LineObject.prototype.onPointDelete = function (point) {
        this.points.removeElement(point);
        this.rebuildLine();
    };

    LineObject.prototype.rebuildLine = function () {

        var points = [];
        for (var i = 0; i < this.points.length; i++) {
            var p0 = this.points[i];
            p0.delegate = this;
            var p = new V().copy(p0.position);
            points.push(p);
        }

        this.sensors = [];

        var pos = new V().copy(this.getGlobalPosition());  //this.getGlobalPosition()

        if (points.length > 1) {
            for (var i = 0; i < points.length - 1; i++) {
                var p = points[i];
                var polygon = new SAT.Polygon(pos, [points[i], points[i + 1]]);
                this.sensors.push(polygon);
            }
        }


    };

    LineObject.prototype.onUpdate = function (dt) {

        if (!this.visible) {
            return;
        }

        var graphics = this.graphics;

        this.draw(graphics);

    };

    LineObject.prototype.draw = function (graphics) {


        var fillColor = 0x2d31e6;
        var strokeColor = 0xffffff;
        var alpha = 0.3;

        if (this.isSelected) {
            strokeColor = 0xadaee8;
            alpha = 0.6;
        }

        graphics.lineStyle(2, strokeColor, 1);

        this.renderLine(graphics);
    };

    LineObject.prototype.renderLine = function (graphics) {

        var points = this.points;
        var p = this.getGlobalPosition();

        graphics.moveTo(p.x + points[0].x, p.y + points[0].y);

        for (var i = 1; i < points.length; i++) {
            graphics.lineTo(p.x + points[i].x, p.y + points[i].y);
        }

    };

    LineObject.prototype.bindProperties = function (editor) {

        var eHTML = Entity.prototype.bindProperties.call(this, editor);

        var html = '';

        var method = 'onSelectedObjectPropertyChange';

        var opt0 = {name: 'isCustomSensor', checked: this.properties.isCustomSensor, method: method, displayName: 'Is Sensor'};

        html += HtmlElements.createCheckbox(opt0).html;

        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;



    };

    LineObject.prototype.onPropertyChange = function (editor, property, value, element, inputType, feedbackID) {

        if (property === "isCustomSensor") {
            value = element.checked;
        }

        var command = new CommandProperty(this, 'properties.' + property, value, undefined, this);

        editor.commands.add(command);

    };



    LineObject.prototype.export = function () {

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

    window.LineObject = LineObject;

}(window));