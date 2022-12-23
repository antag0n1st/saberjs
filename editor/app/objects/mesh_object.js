(function (window, undefined) {

    function MeshObject(name) {
        this.initialize(name);
    }

    MeshObject.prototype = new Entity();
    MeshObject.prototype.entityInitialize = MeshObject.prototype.initialize;

    MeshObject.prototype.initialize = function () {

        this.entityInitialize('_missing_image');
        this.type = 'MeshObject';
        this.centered();

        this.hasImage = true;
        this.canTransform = true;

        this.zoomLevel = 0;

        this.mesh = null;
        this.initialPoints = [];
        this.finalPoints = [];
        this.myGraphics = new PIXI.Graphics();
        this.addChild(this.myGraphics);
    };

    MeshObject.prototype.saveInitialPoints = function () {
        this.initialPoints = this.toPoints(this.finalPoints);
    };

    MeshObject.prototype.toPoints = function (finalPoints) {
        var initialPoints = [];
        for (var i = 0; i < finalPoints.length; i++) {
            var p = finalPoints[i];
            initialPoints.push(p.toData());
        }
        return initialPoints;
    };

    MeshObject.prototype.generateBasicGrid = function (name) {

        var texture = PIXI.utils.TextureCache[name];

        var points = [];

        var gridSize = 4;

        var ww = texture.width / gridSize;
        var hh = texture.height / gridSize;
        for (var i = 0; i <= gridSize; i++) {
            for (var j = 0; j <= gridSize; j++) {
                var p = [ww * j, hh * i];
                points.push(p);
            }
        }

        return points;
    };

    MeshObject.prototype.convertToArrayPoints = function (name, fromPoints) {
        var texture = PIXI.utils.TextureCache[name];
        var width = texture.width;
        var height = texture.height;
        var points = [];
        for (var i = 0; i < fromPoints.length; i++) {
            var p = fromPoints[i];
            points.push([p.x + width / 2, p.y + height / 2]);
        }
        return points;
    };

    MeshObject.prototype.rebuildMesh = function (name, fromPoints) {
        if (this.mesh) {
            this.mesh.removeFromParent();
        }

        this.texture = PIXI.Texture.EMPTY;
        this.imageName = '';

        this.meshName = name;

        const points = fromPoints ? this.convertToArrayPoints(name, fromPoints) : this.generateBasicGrid(name);

        var d = Delaunator.from(points);

        var uvs = new Float32Array(d.coords.length);
        for (let i = 0; i < d.coords.length; i++) {
            var c = d.coords[i];
            uvs[i] = c / 1024;
        }

        this.mesh = new PIXI.SimpleMesh(PIXI.utils.TextureCache[name],
                d.coords,
                uvs,
                d.triangles,
                PIXI.DRAW_MODES.TRIANGLES
                );


        var w = this.mesh.width;
        var h = this.mesh.height;

        this.mesh.pivot.x = w / 2;
        this.mesh.pivot.y = h / 2;

        this.addChild(this.mesh);

        var vertices = this.mesh.geometry.getBuffer('aVertexPosition');

        for (var i = 0; i < this.finalPoints.length; i++) {
            var p = this.finalPoints[i];
            if (p.parent) {
                p.removeFromParent();
            }
        }

        this.finalPoints = [];

        for (var i = 0; i < vertices.data.length; i += 2) {
            var x = vertices.data[i];
            var y = vertices.data[i + 1];

            var point = new ObservableGenericPoint(x - w / 2, y - h / 2, this.onHandleMove.bind(this));
            point.canExport = false;
            point.index = i;
            point.delegate = this;
            point.graphics = this.myGraphics;

            point.build();
            point.sensor.pos.enabled = true;

            this.finalPoints.push(point);
            this.addChild(point);
        }

        this.myGraphics.bringToFront();
        this.renderPoints();
    };

    MeshObject.prototype.onPointSelected = function (point) {
        this.renderPoints();
    };

    MeshObject.prototype.onPointDeselected = function (point) {
        this.renderPoints();
    };

    MeshObject.prototype.onPointDelete = function (point) {

        for (var i = 0; i < this.initialPoints.length; i++) {
            var ip = this.initialPoints[i];
            if (ip.index === point.index) {
                this.initialPoints.splice(i, 1);
            }
        }

        this.rebuildMesh(this.meshName, this.initialPoints);
        this.saveInitialPoints();

        setTimeout(() => {
            this.renderPoints();
        }, 200);
    };

    MeshObject.prototype.onAltMouseDown = function (event, sender) {
        const p = this.toLocal(event.point);
        this.initialPoints.push(p);
        this.rebuildMesh(this.meshName, this.initialPoints);
        this.saveInitialPoints();

        setTimeout(() => {
            this.renderPoints();
        }, 200);
    };

    MeshObject.prototype.onHandleMove = function (point, dx, dy) {

        const vertices = this.mesh.geometry.getBuffer('aVertexPosition');
        vertices.data[point.index] += dx;
        vertices.data[point.index + 1] += dy;
        vertices.update();
        this.renderPoints();
    };

    MeshObject.prototype.renderPoints = function () {
        if (!this.mesh) {
            return;
        }

        this.debounce(() => {

            this.myGraphics.clear();
            for (var j = 0; j < this.finalPoints.length; j++) {
                var p = this.finalPoints[j];
                p.draw(this.zoomLevel);
            }

            if (this.mesh && this.mesh.indices) {
                var breakAt = 0;
                this.myGraphics.lineStyle(1, 0xffffff, 0.5);
                for (var i = 0; i < this.mesh.indices.length; i++) {
                    var index = this.mesh.indices[i];
                    var p = this.finalPoints[index];

                    if (breakAt++ % 3 === 0) {
                        this.myGraphics.moveTo(p.x, p.y);
                    }
                    this.myGraphics.lineTo(p.x, p.y);
                    this.myGraphics.moveTo(p.x, p.y);
                }
            }

        });
    };
    
    MeshObject.prototype.movePointsTo = function (dataFinalPoints) {
        if (dataFinalPoints) {
                const vertices = this.mesh.geometry.getBuffer('aVertexPosition');

                for (var i = 0; i < dataFinalPoints.length; i++) {
                    var dp = dataFinalPoints[i];
                    var fp = this.finalPoints[i];

                    vertices.data[fp.index] += dp.x - fp.x;
                    vertices.data[fp.index + 1] += dp.y - fp.y;

                    fp.setNoCallback(dp.x, dp.y);
                }

                vertices.update();
            }
    };

    MeshObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
            this.initialPoints = data.initialPoints || [];
            this.rebuildMesh(data.imageName, this.initialPoints.length ? this.initialPoints : null);

            if (data.finalPoints) {
                this.movePointsTo(data.finalPoints);
            }

            setTimeout(() => {
                this.renderPoints();
            }, 200);

            if (this._importMap) {
                this._importMap(data);
            }
        }

        this.enableSensor();
        if (this.mesh) {
            this.setSensorSize(this.mesh.width, this.mesh.height);
        }
        this.createFrame(20, 16);
        this.updateFrame();

        this.deselect();
    };

    MeshObject.prototype.onUpdate = function (dt) {
        Entity.prototype.onUpdate.call(this, dt);

        if (this.toExecute) {
            this.toExecute();
            this.toExecute = null;
        }

    };

    MeshObject.prototype.debounce = function (func) {
        this.toExecute = func;
    };

    MeshObject.prototype.export = function () {

        var o = this.basicExport();
        o.imageName = this.meshName || this.imageName;
        o.finalPoints = [];
        o.initialPoints = this.initialPoints;

        for (var j = 0; j < this.finalPoints.length; j++) {
            var p = this.finalPoints[j];
            o.finalPoints.push({
                x: p.x,
                y: p.y,
                index: p.index
            });
        }

        if (this._exportMap) {
            o = this._exportMap(o);
        }

        return o;
    };

    MeshObject.prototype._setImage = function (name) {
        var sx = this.scale.x;
        var sy = this.scale.y;

        this.rebuildMesh(name);

        this.saveInitialPoints();

        this.width = this.mesh.width;
        this.height = this.mesh.height;

        this.setSensorSize(this.width, this.height);

        this._sensorTranslationX = 0;
        this._sensorTranslationY = 0;
        this._sensorTranslationScaleX = sx;
        this._sensorTranslationScaleY = sy;
        this._sensorRotation = 0;
        this.updateFrame();

        this.scale.set(sx, sy);

        this.updateFrame();
    };

    MeshObject.prototype.onMouseDown = function (event, sender) {

    };

    MeshObject.prototype.bindProperties = function (editor) {

        var eHTML = Entity.prototype.bindProperties.call(this, editor);

        var html = '';

        var method = 'onSelectedObjectPropertyChange';
        var optBtn = {name: 'resetPoints', displayName: 'Reset Points', class: '', icon: 'fa fa-th', method: method, tooltip: 'Reset mesh points', style: 'margin-top:5px;'};
        var optBtn2 = {name: 'setAsDefault', displayName: 'Set As Default', class: '', icon: 'fa fa-bullseye', method: method, tooltip: 'Set current mesh points as default', style: 'margin-top:5px;'};

        html += HtmlElements.createButton(optBtn).html;
        html += '<br />';
        html += HtmlElements.createButton(optBtn2).html;

        editor.htmlInterface.propertiesContent.innerHTML = html + eHTML;

    };

    MeshObject.prototype.onPropertyChange = function (editor, property, element, value, inputType, feedbackID) {
        if (property === 'resetPoints') {
            this.onResetPoints();
            return;
        } else if (property === 'setAsDefault') {
            this.onSetAsDefault();
            return;
        }
    };

    MeshObject.prototype.onResetPoints = function () {
        var command = new CommandUpdatePoints(this, this.initialPoints);
        app.screen.commands.add(command);
    };

    MeshObject.prototype.onSetAsDefault = function () {
        var finalPoint = this.toPoints(this.finalPoints);
        var command = new CommandUpdatePoints(this, finalPoint);
        app.screen.commands.add(command);
    };

    MeshObject.prototype.onZoomChanged = function (zoomLevel) {
        this.zoomLevel = zoomLevel;
        this.renderPoints();
    };

    window.MeshObject = MeshObject;

}(window));