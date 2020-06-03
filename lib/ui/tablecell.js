(function (window, undefined) {

    function TableCell() {
        this.initialize();
    }

    TableCell.prototype = new Sprite();
    TableCell.prototype.spriteInitialize = TableCell.prototype.initialize;


    TableCell.prototype.initialize = function () {

        this.spriteInitialize();
        this.index = 0;
        this.isSelected = false;
        this._width = 100;
        this._height = 60;
        this.tappedLocation = {x: 0, y: 0};

        this._id = -1;

        this.label = new Label();
        this.label.style.fill = "#dddddd";
        this.label.style.fontSize = 32;
        this.label.style.fontFamily = "Arial Black";
        this.label.anchor.set(0, 0.5);
        this.label.position.set(20, 30);
        this.addChild(this.label);

        this.setSensorSize(this._width, this._height);
        this.isMouseDown = false;
        this.hasMoved = false;

    };

    TableCell.prototype.onMouseDown = function (event, sender) {
        //this.background.tint = 0xe9faaa;
        this.isMouseDown = true;
        this.hasMoved = false;
    };

    TableCell.prototype.onMouseMove = function (event, sender) {
        //this.background.tint = 0xeeeeee;
        this.hasMoved = true;
    };

    TableCell.prototype.onMouseUp = function (event, sender) {
        //this.background.tint = 0xeeeeee;
        this.isMouseDown = false;
        this.hasMoved = false;
    };

    TableCell.prototype.onMouseCancel = function (event, sender) {
        //this.background.tint = 0xeeeeee;
        this.isMouseDown = false;
        this.hasMoved = false;
    };

    TableCell.prototype.bindData = function (data) {
        this.label.txt = data.text;
        // throw "cell should implement its own bind data method";
    };

    window.TableCell = TableCell;


}(window));