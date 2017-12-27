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
        this.label.anchor.set(0,0.5);
        this.label.position.set(20,30);
        this.addChild(this.label);

    };

    TableCell.prototype.onMouseMove = function (event) {

        var distance = Math.getDistance(this.tappedLocation, event.point);

        if (distance > this.parent.toleranceDistance) {
            // this.resign_event_to_parent(event, 'onMouseDown');
        }

    };

    TableCell.prototype.onMouseDown = function (event) {
        var parent = this.parent;
        this.tappedLocation = event.point;

        if (parent.scrollingSpeed !== 0.0) {
            parent.stopScrolling();
            //  this.resign_event_to_parent(event, 'onMouseDown');
        }
    };

    TableCell.prototype.onMouseUp = function (event) {
        var parent = this.get_parent();

        if (parent.scrollingSpeed !== 0.0) {
            parent.stopScrolling();
        } else {
            //this.isSelected = true;
            parent.onCellSelected(this, event);
        }
    };

    TableCell.prototype.bindData = function (data) {      
        this.label.txt = data.text;
        // throw "cell should implement its own bind data method";
    };

    window.TableCell = TableCell;


}(window));