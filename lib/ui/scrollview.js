(function (window, undefined) {

    function ScrollView() {
        this.initialize();
    }
    ScrollView.prototype = new Sprite();
    ScrollView.prototype.spriteInitialize = ScrollView.prototype.initialize;

    ScrollView.prototype.initialize = function () {
        this.spriteInitialize();

        this.contentWidth = 0;
        this.contentHeight = 0;

        this.bodyWidth = 0;
        this.bodyHeight = 0;

        this.body = new Layer();
        Sprite.prototype.addChild.call(this, this.body);

        this.content = new ScrollviewContent();
        this.body.addChild(this.content);

        this.scrollingSpeed = new V();

        this.lastScrollPosition = new V();
        this.currentScrollPosition = new V();

        this.startScrollPosition = new V();

        this.prevX = 0;
        this.prevY = 0;

        this.priority = 11; // 1 above the button

        this._hasScrolled = false;

    };

    ScrollView.prototype.scrollToElement = function (element, time) {

        var p = new V().copy(element.getGlobalPosition());
        var to = new V(app.width / 2, 2 * (app.height / 3));

        var diffP = V.substruction(to, p);

        if (time > 0) {
            var that = this;
            var animateTo = V.addition(diffP, this.currentScrollPosition);
            var bezier = new Bezier(.48, .15, .52, .92); //  new Bezier(.16,.49,.4,.99)

            var t = new TweenMoveTo(this.content, animateTo, bezier, time, function (object) {
                that.currentScrollPosition.copy(object.position);
                that.lastScrollPosition.copy(that.currentScrollPosition);
            });
            t.run();
        } else {
            this.scrollBy(diffP.x, diffP.y);
            this.lastScrollPosition.copy(this.currentScrollPosition);
        }

    };

    ScrollView.prototype.scrollBy = function (diffX, diffY) {

        var p = this.currentScrollPosition;
        var x = p.x + diffX;
        var y = p.y + diffY;

        // constrain the movement

        var maxX = this._width - this.contentWidth;
        if (x > 0 || x < maxX) {
            this.scrollingSpeed.x = 0;
        }
        x = (x > 0) ? 0 : x;
        x = (x < maxX) ? maxX : x;

        var maxY = this._height - this.contentHeight;
        if (y > 0 || y < maxY) {
            this.scrollingSpeed.y = 0;
        }
        y = (y > 0) ? 0 : y;
        y = (y < maxY) ? maxY : y;

        this.content.position.set(x, y);

        this.currentScrollPosition.x = x;
        this.currentScrollPosition.y = y;
    };

    ScrollView.prototype.onMouseDown = function (event, sender) {

        this.prevY = event.point.y;
        this.prevX = event.point.x;
        this.startScrollPosition.copy(event.point);
        this._hasScrolled = false;
    };

    ScrollView.prototype.onMouseMove = function (event, sender) {

        // add tolerance 
        var d = Math.getDistance(this.startScrollPosition, event.point);

        if (d > 10) {
            var diffX = -this.prevX + event.point.x;
            var diffY = -this.prevY + event.point.y;

            this.scrollBy(diffX, diffY);

            this.prevX = event.point.x;
            this.prevY = event.point.y;
            this._hasScrolled = true;
        }

    };

    ScrollView.prototype.onMouseUp = function (event) {
        if (this._hasScrolled) {
            event.stopPropagation();
        }
        this._hasScrolled = false;
    };

    ScrollView.prototype.onMouseCancel = function () {

    };

    ScrollView.prototype.onWheel = function (event) {
        var speed = 1;
        if (event.point.y < 0) {
            this.scrollingSpeed.y = -speed;
        } else {
            this.scrollingSpeed.y = speed;
        }
    };

    ScrollView.prototype.onUpdate = function (dt) {

        var currentOffset = V.substruction(this.currentScrollPosition, this.lastScrollPosition);

        if (currentOffset.len() > 0) {
            this.scrollingSpeed.x = (this.scrollingSpeed.x + (currentOffset.x / dt)) / 2;
            this.scrollingSpeed.y = (this.scrollingSpeed.y + (currentOffset.y / dt)) / 2;
        }

        var speed = this.scrollingSpeed.len();

        if (speed > 0.02) {
            if (!this.is_mouse_down) {
                this.scrollBy(this.scrollingSpeed.x * dt, this.scrollingSpeed.y * dt);
            }
            this.scrollingSpeed.scale(0.9, 0.9);
        } else if (speed < 0.02) {
            this.scrollingSpeed.x = 0;
            this.scrollingSpeed.y = 0;
        }

        this.lastScrollPosition.copy(this.currentScrollPosition);

    };

    ScrollView.prototype.addChild = function () {
        throw "Don't add child content to the scroll view directly , use the content instead";
    };

    ScrollView.prototype.setSize = function (width, height) {
        //Sprite.prototype.setSize.call(this,width,height);
        this.bodyWidth = width;
        this.bodyHeight = height;

        this.setSensorSize(width, height);

        if (this.mask) {
            this.mask.removeFromParent();
        }

        var mask = new PIXI.Graphics();
        mask.beginFill();
        mask.drawRect(0, 0, this._width, this._height);
        mask.endFill();
        this.body.mask = mask;
        this.body.addChild(mask);
    };

    ScrollView.prototype.setContentSize = function (width, height) {
        this.contentWidth = width;
        this.contentHeight = height;
        this.content.setSensorSize(width, height);
    };

    window.ScrollView = ScrollView;

}(window));