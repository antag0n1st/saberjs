var OP = PIXI.ObservablePoint;
var P = PIXI.Point;


///////////////////////////////// DisplayObject ////////////////////////////////

PIXI.DisplayObject.prototype.sensor = null;
PIXI.DisplayObject.prototype._width = 0;
PIXI.DisplayObject.prototype._height = 0;
PIXI.DisplayObject.prototype.zIndex = 0;
PIXI.DisplayObject.prototype.tag = 0;
PIXI.DisplayObject.prototype.priority = 0;

PIXI.DisplayObject.prototype.sumAllAngles = function () {
    if (this.parent) {
        return this.rotation + this.parent.sumAllAngles();
    } else {
        return this.rotation;
    }
};

PIXI.DisplayObject.prototype.absoluteScale = function () {
    if (this.parent) {
        return this.scale.x * this.parent.absoluteScale();
    } else {
        return this.scale.x;
    }
};

PIXI.DisplayObject.prototype.absoluteScaleY = function () {
    if (this.parent) {
        return this.scale.y * this.parent.absoluteScaleY();
    } else {
        return this.scale.y;
    }
};

PIXI.DisplayObject.prototype.setCustomSensor = function (satPolygon) {
    this.sensor = satPolygon;

    this.sensor.translate(-this._sensorTranslationX, -this._sensorTranslationY);
    this.sensor.rotate(this._sensorRotation);
};

PIXI.DisplayObject.prototype.enableSensor = function () {
    if (!this.sensor) {

        if (this.texture) {
            this._width = this.texture.width;
            this._height = this.texture.height;
        } else {
            this._width = 1;
            this._height = 1;
        }

        this.sensor = new SAT.Box(new SAT.V(this.x, this.y), this._width, this._height).toPolygon();
        this._sensorTranslationX = 0;
        this._sensorTranslationY = 0;
        this._sensorRotation = 0;

        // this.sensor.scale = new V(1, 1);

        this._sensorTranslationScaleX = 1;
        this._sensorTranslationScaleY = 1;

        this.eventIdx = -1;
        this.isMouseDown = false;
        this.isTouchable = true;
    }
};

PIXI.DisplayObject.prototype.setSensorSize = function (width, height) {
    if (!this.sensor) {
        this.enableSensor();
    }

    this._width = Math.round(width);
    this._height = Math.round(height);
    this.sensor = new SAT.Box(new SAT.V(this.x, this.y), this._width, this._height).toPolygon();


    this._sensorTranslationX = 0;
    this._sensorTranslationY = 0;
    this._sensorTranslationScaleX = 1;
    this._sensorTranslationScaleY = 1;
    this._sensorRotation = 0;    

};

PIXI.DisplayObject.prototype.getSensor = function () {

    if (this.sensor) {

        var pos = this.getGlobalPosition();
        this.sensor.pos.copy(pos);

        var sx = this.absoluteScale();
        var sy = this.absoluteScaleY();

        var angle = this.sumAllAngles();

        if (sx !== this._sensorTranslationScaleX || sy !== this._sensorTranslationScaleY) {
            // just a special case , when anchor and scale are set at the same time , 
            this.adjustScale(this._sensorTranslationScaleX, this._sensorTranslationScaleY);
            this.adjustTranslation(this._sensorTranslationScaleX, this._sensorTranslationScaleY, angle);
            this.adjustRotation(angle);
        }

        this.adjustScale(sx, sy);

        this.adjustTranslation(sx, sy, angle);

        this.adjustRotation(angle);

        return this.sensor;
    }

    return null;

};

PIXI.DisplayObject.prototype.adjustTranslation = function (sx, sy) {

    var pivotX = this.pivot ? this.pivot.x : 0;
    var pivotY = this.pivot ? this.pivot.y : 0;

    var anchorX = this.anchor ? this.anchor.x : 0;
    var anchorY = this.anchor ? this.anchor.y : 0;

    var _x = (pivotX + (this._width * anchorX * sx));
    var _y = (pivotY + (this._height * anchorY * sy));

    var x = this._sensorTranslationX - _x;
    var y = this._sensorTranslationY - _y;

    if (!this.sensor.anchor || (this.sensor.anchor.x !== anchorX || this.sensor.anchor.y !== anchorY)) {

        var dir = new V(x, y);
        dir.rotate(this._sensorRotation);

        this.sensor.translate(dir.x, dir.y);
        this.sensor.anchor = new V(anchorX, anchorY);
        this._sensorTranslationX = _x;
        this._sensorTranslationY = _y;
        this._sensorTranslationScaleX = sx;
        this._sensorTranslationScaleY = sy;
    }

};

PIXI.DisplayObject.prototype.adjustScale = function (sx, sy) {

    //var sx = sx;

    var dsx = sx / this.sensor.scale.x;
    var dsy = sy / this.sensor.scale.y;
    this.sensor.scale.x = sx;
    this.sensor.scale.y = sy;

    if (dsx !== 1 || dsy !== 1) {
        var newPoints = [];
        for (var i = 0; i < this.sensor.points.length; i++) {
            var p = this.sensor.points[i].clone();
            p.scale(dsx, dsy);
            newPoints.push(p);
        }
        this.sensor.setPoints(newPoints);
    }

};

PIXI.DisplayObject.prototype.adjustRotation = function (angle) {


    var a = angle - this._sensorRotation;

    if (a) {
        this.sensor.rotate(a);
        this._sensorRotation = angle;
    }
};

PIXI.DisplayObject.prototype.removeFromParent = function () {
    if (this.parent) {
        this.parent.removeChild(this);
    }
};

PIXI.DisplayObject.prototype._check = function (point) {
    var sensor = this.getSensor();
    if (SAT.pointInPolygon(point, sensor)) {
        return true;
    }
    return false;
};

PIXI.DisplayObject.prototype.stretch = function (width, height) {
    //TODO , do this using the scale
    this.width = width;
    this.height = height;
};

PIXI.DisplayObject.prototype.centered = function () {
    this.anchor.set(0.5, 0.5);
};

/**
 * Finds the element recusivly for a given ID
 * @param String id 
 * @param Object parent the layer in which to serach 
 */
PIXI.DisplayObject.prototype.findById = function (id, parent) {
    parent = parent || this;
    for (var i = 0; i < parent.children.length; i++) {
        var c = parent.children[i];
        if (c.id === id) {
            return c;
        }
        var b = this._findById(id, c.children);
        if (b) {
            return b;
        }
    }

    return null;
};

PIXI.DisplayObject.prototype._findById = function (id, children) {
    for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c.id === id) {
            return c;
        }
        var b = this._findById(id, c.children);
        if (b) {
            return b;
        }
    }
    return null;
};

PIXI.DisplayObject.prototype.findByName = function (name, children) {
    children = children || this.children;
    for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c.name === name) {
            return c;
        }
        var b = this.findByName(name, c.children);
        if (b) {
            return b;
        }
    }

    return null;
};

PIXI.DisplayObject.prototype.findByTag = function (tag, result, children) {
    children = children || this.children;
    result = result || [];
    for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c.tag == tag) {
            result.push(c);
        }
        this.findByTag(tag, result, c.children);
    }

    return result.length ? result : null;
};

PIXI.DisplayObject.prototype.findByType = function (type, result, children) {
    children = children || this.children;
    result = result || [];
    for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c instanceof type) {
            result.push(c);
        }
        this.findByType(type, result, c.children);
    }

    return result.length ? result : null;
};

PIXI.DisplayObject.prototype.findByCustom = function (method, result, children) {
    children = children || this.children;
    result = result || [];
    for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (method(c)) {
            result.push(c);
        }
        this.findByCustom(method, result, c.children);
    }

    return result.length ? result : null;
};

// #### EVENTS

PIXI.DisplayObject.prototype.update = function (dt) {

};

PIXI.DisplayObject.prototype.postUpdate = function (dt) {

};

PIXI.DisplayObject.prototype.onMouseDown = function (event, sender) {

};

PIXI.DisplayObject.prototype.onMouseMove = function (event, sender) {

};

PIXI.DisplayObject.prototype.onMouseUp = function (event, sender) {

};

PIXI.DisplayObject.prototype.onMouseCancel = function (event, sender) {

};

PIXI.DisplayObject.prototype.onRightMouseDown = function (event, sender) {

};

PIXI.DisplayObject.prototype.onRightMouseMove = function (event, sender) {

};

PIXI.DisplayObject.prototype.onRightMouseUp = function (event, sender) {

};

PIXI.DisplayObject.prototype.onWheel = function (event, sender) {

};

PIXI.DisplayObject.prototype.onInputAdded = function () {

};

PIXI.DisplayObject.prototype.onInputRemoved = function () {

};

////////////////////////////////// SPRITE //////////////////////////////////////

PIXI.Sprite.prototype.findTexture = function (name) {

    if (Images[name]) {
        return Images[name].texture;
    } else if (name) {
        return PIXI.Texture.fromFrame(name);
    } else {
        return PIXI.Texture.EMPTY;
    }

};

PIXI.Sprite.prototype.textureExists = function (name) {

    if (PIXI.utils.TextureCache[name]) {
        return true;
    }

    return false;
};

PIXI.Sprite.prototype.setTexture = function (name) {
    this.texture = this.findTexture(name);
    this.imageName = name;
};

/////////////////////////////// PIXI PLANE /////////////////////////////////////


function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {default: obj};
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, enumerable: false, writable: true, configurable: true}});
    if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Plane = function (_Mesh) {
    _inherits(Plane, _Mesh);

    /**
     * @param {PIXI.Texture} texture - The texture to use on the Plane.
     * @param {number} verticesX - The number of vertices in the x-axis
     * @param {number} verticesY - The number of vertices in the y-axis
     */
    function Plane(texture, points, sx, sy) {
        _classCallCheck(this, Plane, sx, sy);

        /**
         * Tracker for if the Plane is ready to be drawn. Needed because Mesh ctor can
         * call _onTextureUpdated which could call refresh too early.
         *
         * @member {boolean}
         * @private
         */
        var _this = _possibleConstructorReturn(this, _Mesh.call(this, texture));

        _this.originalPoints = points;


        _this._anchor = new OP(_this.onAnchorUpdate, _this);

        _this.sx = sx || 2;
        _this.sy = sy || 2;

        _this.initPoints();

        _this.drawMode = PIXI.mesh.Mesh.DRAW_MODES.TRIANGLES;

        _this._ready = true;

        _this.refresh();
        return _this;
    }

    /**
     * Refreshes plane coordinates
     *
     */

    Plane.prototype.initPoints = function ()
    {
        /**
         * The points of mesh. It's a 2D array , this.verticesY rows , this.verticesX colums.
         * Users could change those points for mesh transforming.
         */
        this.points = [];

        var texture = this._texture;

        var sx = this.sx - 1;
        var sy = this.sy - 1;
        var sw = texture.width / sx;
        var sh = texture.height / sy;

        for (var i = 0; i < this.sx; i++) {
            for (var j = 0; j < this.sy; j++) {
                if (i === 0 || i === sx || j === 0 || j === sy) {
                    var point = new OV(i * sw, j * sh);
                    this.points.push(point);
                }

            }
        }

//        for (let i = 0; i < this.verticesY; i++)
//        {
//
//            for (let j = 0; j < this.verticesX; j++)
//            {
//                const point = new OV(j * texture.width, i * texture.height);
//                this.points.push(point);
//            }
//        }


        for (var i = 0; i < this.originalPoints.length; i++) {
            this.points.push(this.originalPoints[i]);
        }

        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i];
            point.index = i;
            point.callback = function (p) {

                this.vertices[p.index * 2] = p.x;
                this.vertices[p.index * 2 + 1] = p.y;

            };
            point.context = this;
        }

    };


    Plane.prototype._refresh = function () {

        var texture = this._texture;
        var verts = [];
        var colors = [];
        var uvs = [];


        for (var i = 0; i < this.points.length; i++) {
            var p = this.points[i];
            verts.push(p.x, p.y);
            uvs.push(Math.normalize(p.x, 0, texture.width), Math.normalize(p.y, 0, texture.height));
        }


        var points = [];

        for (var i = 0; i < this.points.length; i++) {
            points.push([this.points[i].x, this.points[i].y]);
        }


        var delaunay = new Delaunator(points);

        this.vertices = new Float32Array(verts);
        this.uvs = new Float32Array(uvs);
        this.colors = new Float32Array(colors);
        this.indices = new Uint16Array(delaunay.triangles);

        this.dirty++;
        this.indexDirty++;

        this.multiplyUvs();
    };

    Plane.prototype.onAnchorUpdate = function () {
        this._transformID = -1;
        if (this._ready)
        {
            this.refresh();
        }
    };

    /**
     * Clear texture UVs when new texture is set
     *
     * @private
     */


    Plane.prototype._onTextureUpdate = function () {

        PIXI.mesh.Mesh.prototype._onTextureUpdate.call(this);

        // wait for the Plane ctor to finish before calling refresh
        if (this._ready) {
            this.refresh();
        }
    };



    return Plane;

}(PIXI.mesh.Mesh);


PIXI.utils.string2hex = function (string) {
    string = string.replace('#', '0x');
    return Math.round(string);
};