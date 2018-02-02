(function (window, undefined) {

    function LabelObject(text) {
        this.initialize(text);
    }

    LabelObject.prototype = new Entity();
    LabelObject.prototype.entityInitialize = LabelObject.prototype.initialize;
    LabelObject.prototype.initialize = function (text) {

        this.entityInitialize(null);

        this._padding = 20;
        this.type = 'LabelObject';

        this.label = new Label(Style.DEFAULT_INPUT);
        this.label.txt = text;
        this.label.anchor.set(0.5, 0.5);

        this.addChild(this.label);


        this.centered();



    };

    LabelObject.prototype.updateSize = function () {
        this.sensor = null;
        this.setSensorSize(this.label.width + this._padding, this.label.height + this._padding);
    };


    LabelObject.prototype.update = function (dt) {
        
        if(this.anchor.x !== this.label.anchor.x || this.anchor.y !== this.label.anchor.y ){
            this.label.anchor.x = this.anchor.x;
            this.label.anchor.y = this.anchor.y;
        }

    };

    LabelObject.prototype.export = function () {

        var o = this.basicExport();

        o.txt = this.label.txt;

        o.style = {
            fill: this.label.style.fill,
            fontFamily: this.label.style.fontFamily,
            fontSize: this.label.style.fontSize,
            padding: 4,
            align: this.label.style.align,
            stroke: this.label.style.stroke,
            strokeThickness: this.label.style.strokeThickness,
            dropShadow: this.label.style.dropShadow,
            dropShadowDistance: this.label.style.dropShadowDistance,
            dropShadowAngle: this.label.style.dropShadowAngle,
            dropShadowColor: this.label.style.dropShadowColor,
        };

        return o;

    };

    LabelObject.prototype.build = function (data) {

        if (data) {
            this.setBasicData(data);
            //  this.setTexture(data.imageName);
            this.label.txt = data.txt;


            for (var property in data.style) {
                if (data.style.hasOwnProperty(property)) {
                    this.label.style[property] = data.style[property];
                    // do stuff
                }
            }
        }



        this.enableSensor();

        this.updateSize();
        this.createFrame(0, 16);
        this.updateFrame();

        this.canResize = false;

        this.deselect();
    };

    window.LabelObject = LabelObject;

}(window));