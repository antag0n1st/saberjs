(function (window, undefined) {

    function TableView() {
        this.initialize();
    }

    TableView.prototype = new Sprite();
    TableView.prototype.spriteInitialize = TableView.prototype.initialize;


    TableView.prototype.initialize = function () {

        this.spriteInitialize();

        this.cellType = TableCell;

        this.data = [];
        this.offsetY = 0;
        this.offsetX = 0;
        this.cells = [];
        this.cellsHeight = 100;
        this.numberOfVisibleCells = 0;
        this.previousY = 0;
        this.scrollingSpeed = 0; // pixels per second
        this.friction = 0.05; // 5%
        this.previousFrameOffsetY = 0;
        this.isChildrenSortable = false;
        this.isScrollable = true;
        this.cellSelectedIndex = undefined;
        this.toleranceDistance = 5;
        this.tappedLocation = {x: 0, y: 0};

        this.readyCounter = 100; // should draw the table instantly

        this.mask = new PIXI.Graphics();

    };

    TableView.prototype.onWheel = function (event) {

        var speed = 0.8;
        if (event.point.y > 0) {
            this.scrollingSpeed = -speed;
        } else {
            this.scrollingSpeed = speed;
        }
    };

    TableView.prototype.setSize = function (width, height) {
        this._width = width;
        this._height = height;
        this.setSensorSize(width, height);

        this.mask.clear();
        this.mask.beginFill();
        this.mask.drawRect(0, 0, this._width, this._height);
        this.mask.endFill();
        this.addChild(this.mask);
    };

    TableView.prototype.onMouseDown = function (event) {
        this.previousY = event.point.y;
        this.tappedLocation = event.point;
        event.stopPropagation();
    };

    TableView.prototype.onMouseMove = function (event) {

        var distance = Math.getDistance(this.tappedLocation, event.point);

        var change = this.previousY - event.point.y;
        this.previousY = event.point.y;

        if (distance > this.toleranceDistance) {
            this.scrollY(change);
        }

    };

    TableView.prototype.setCellType = function (type) {
        this.cellType = type;
    };

    TableView.prototype.scrollY = function (y) {

        if (!this.isScrollable) {
            this.offsetY = 0;
            return true;
        }

        if (this.offsetY + y < 0) {
            this.offsetY = 0;
            this.scrollingSpeed = 0;
        } else if (this.offsetY + y >= this.data.length * this.cellsHeight - this._height) {
            this.offsetY = this.data.length * this.cellsHeight - this._height;
            this.scrollingSpeed = 0;
        } else {
            this.offsetY += y;
        }
    };

    TableView.prototype.initCells = function () {

        if (this._width <= 0 || this._height <= 0) {
            throw 'framework: table must have visible size';
        }

        if (!this.data.length) {
            return;
            // throw 'framework: table must have data';
        }

        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].removeFromParent();
        }
        this.cells = [];

        var inspection_cell = new this.cellType();
        this.cellsHeight = inspection_cell._height;

        if (this.cellsHeight * this.data.length <= this._height) {
            this.numberOfVisibleCells = this.data.length;
            this.isScrollable = false;
        } else {
            this.numberOfVisibleCells = Math.ceil((this._height / this.cellsHeight)) + 1;
        }


        for (var i = 0; i < this.numberOfVisibleCells; i++) {
            var cell = new this.cellType();
            //  cell.set_size(this.__width,this.cellsHeight);
            this.cells.push(cell);
            this.addChild(cell);
        }

        // app.input.add(this.cells);

    };

    TableView.prototype.setData = function (data) {
        this.data = data;
        
        if(data){
            for (var i = 0; i < data.length; i++) {
                var o = data[i];
                o._id = i;
            }
        }
        
    };

    TableView.prototype.get_first_visible_cell_index = function () {
        return Math.floor(this.offsetY / this.cellsHeight);
    };

    TableView.prototype.stopScrolling = function () {
        this.readyCounter = 0;
        this.scrollingSpeed = 0;
        this.previousFrameOffsetY = this.offsetY;

    };

    TableView.prototype.onUpdate = function (dt) {

        if (!this.data.length) {
            return;
        }

        var current_offset = this.offsetY - this.previousFrameOffsetY;

        if (current_offset !== 0) {
            this.scrollingSpeed = (this.scrollingSpeed + (current_offset / dt)) / 2;
        }

        if (this.scrollingSpeed > 0.02 || this.scrollingSpeed < -0.02) {

            if (!this.isMouseDown) {
                this.scrollY(this.scrollingSpeed * dt);
            }

            this.scrollingSpeed = this.scrollingSpeed - this.scrollingSpeed * this.friction;

        } else if (this.scrollingSpeed < 0.02 && this.scrollingSpeed > -0.02) {
            this.scrollingSpeed = 0.0;
        }

        this.previousFrameOffsetY = this.offsetY;

        ///////////////////

        var first_index = Math.floor(this.offsetY / this.cellsHeight);
        var localOffsetY = this.offsetY % this.cellsHeight;
        var pos = 0;

        for (var i = first_index; i < first_index + this.numberOfVisibleCells; i++) {

            var cell = this.cells[pos];


            cell.index = i;
            cell.position.set(0, pos * this.cellsHeight - localOffsetY);
            if (i === this.data.length) {
                break;
            }

            cell.isSelected = false;
            if (cell.index === this.cellSelectedIndex) {
                cell.isSelected = true;
            }
            
            if(this.data[i]._id !== cell._id){
                cell._id = this.data[i]._id;
                cell.bindData(this.data[i]);
            }            

            pos++;
        }

    };
    
    TableView.prototype.onInputAdded = function () {
        // attach the children to listen here
    };
    
    TableView.prototype.onInputRemoved = function () {
        // detach children inputs
    };

    /**
     * 
     * @param TableCell cell
     * @param {type} point
     * @returns {undefined}
     */
    TableView.prototype.onCellSelected = function (cell, event) {
        this.cellSelectedIndex = cell.index;

    };

    window.TableView = TableView;


}(window));