(function (window, undefined) {

    function Input(app, canvas) {
        this.initialize(app, canvas);
    }

    Input.prototype.initialize = function (app, canvas) {

        this.point = {x: 0, y: 0};
        this.app = app;
        this.device = app.device;
        this.elements = [];
        this.offset = {top: 0, left: 0};
        this.element = canvas;
        this.isBlocked = false;
        this.lastOriginalEvent = null;
        this.lastCursorIcon = '';

        this.addListener(canvas);

        // go manage them by yourself
        // so that I can listen , no matter what.
        this.wisperListeners = [];

    };

    Input.prototype.addListener = function (element) {

        this.offset = this.recursiveOffset(element);
        this.element = element;

        this.registerTouch(element);
        this.registerMouse(element);

    };

    Input.prototype.registerTouch = function (element) {

        var that = this;

        element.addEventListener("touchmove", function (event) {
            that.lastOriginalEvent = event;
            for (var i = 0; i < event.changedTouches.length; i++) {

                var lastX = that.point.x;
                var lastY = that.point.y;

                that.mapTouchLocation(event.changedTouches[i]);

                if (lastX === that.point.x && lastY === that.point.y) {
                    return;//TODO
                }

                that.setMouseMove(event.changedTouches[i].identifier);
            }
            event.preventDefault();
            event.stopPropagation();
        }, false);

        element.addEventListener("touchend", function (event) {
            that.lastOriginalEvent = event;
            for (var i = 0; i < event.changedTouches.length; i++) {
                that.mapTouchLocation(event.changedTouches[i]);
                that.setMouseUp(event.changedTouches[i].identifier);
            }
            event.preventDefault();
            event.stopPropagation();
        }, false);

        element.addEventListener("touchleave", function (event) {
            that.lastOriginalEvent = event;
            for (var i = 0; i < event.changedTouches.length; i++) {
                that.mapTouchLocation(event.changedTouches[i]);
                that.setMouseUp(event.changedTouches[i].identifier);
            }
            event.preventDefault();
            event.stopPropagation();
        }, false);

        element.addEventListener("touchstart", function (event) {
            // Session.prolong();
            that.lastOriginalEvent = event;
            for (var i = 0; i < event.changedTouches.length; i++) {
                that.mapTouchLocation(event.changedTouches[i]);
                that.setMouseDown(event.changedTouches[i].identifier);
            }
            event.preventDefault();
            event.stopPropagation();
        }, false);

        element.addEventListener("touchcancel", function (event) {
            that.lastOriginalEvent = event;
            for (var i = 0; i < event.changedTouches.length; i++) {
                that.setMouseCancel(event.changedTouches[i].identifier);
            }
            event.preventDefault();
            event.stopPropagation();
        }, false);

    };

    Input.prototype.registerMouse = function (element) {

        var that = this;

        element.addEventListener('mouseup', function (event) {
            that.lastOriginalEvent = event;
            var p = that.getMousePoint(event);

            that.mapPointLocation(p.x, p.y);

            if (event.which === 1) {
                that.setMouseUp(1);
            } else if (event.ctrlKey === true) {
                that.setMouseUp(1);
            } else {
                that.setRightMouseUp();
            }

        }, false);

        element.addEventListener('mouseleave', function (event) {

            that.lastOriginalEvent = event;
            var p = that.getMousePoint(event);

            that.mapPointLocation(p.x, p.y);

            if (event.which === 1) {
                that.setMouseCancel(1);
            } else if (event.ctrlKey === true) {
                that.setMouseCancel(1);
            } else {
                that.setRightMouseUp();
            }

        }, false);

        element.addEventListener('mousedown', function (event) {

            that.lastOriginalEvent = event;
            var p = that.getMousePoint(event);

            that.mapPointLocation(p.x, p.y);

            if (event.which === 1) {
                that.setMouseDown(1);
            } else if (event.ctrlKey === true) {
                that.setMouseDown(1);
            } else {
                that.setRightMouseDown();
            }

        }, false);

        element.addEventListener('mousemove', function (event) {
            that.lastOriginalEvent = event;
            var p = that.getMousePoint(event);

            var lastX = that.point.x;
            var lastY = that.point.y;

            that.mapPointLocation(p.x, p.y);

            if (lastX === that.point.x && lastY === that.point.y) {
                return;
            }

            if (event.which === 1) {
                that.setMouseMove(1);
            } else if (event.ctrlKey === true) {
                that.setMouseMove(1);
            } else {
                that.setRightMouseMove();
            }

        }, false);

        element.addEventListener("contextmenu", function (event) {

            that.lastOriginalEvent = event;
            event.preventDefault();
        });

        element.addEventListener("wheel", function (event) {

            var delta = 0;

            if (!event) {
                event = window.event;
            }

            if (event.deltaY) {
                delta = -event.deltaY;
            } else if (event.wheelDelta) {
                delta = event.wheelDelta / 120;
            } else if (event.detail) {
                delta = -event.detail / 3;
            }

            var dir = (delta < 0) ? -1 : 1;

            that.lastOriginalEvent = event;
            event.preventDefault();
            that.setWheel(dir);
        });

    };

    Input.prototype.fixWhich = function (e) {

        if (!e.which && e.button) {

            if (e.button & 1) {
                e.which = 1;      // Left
            } else if (e.button & 4) {
                e.which = 2; // Middle
            } else if (e.button & 2) {
                e.which = 3; // Right
            }

        }

    };

    Input.prototype.addElement = function (element) {
        var index = this.elements.indexOf(element);
        if (element) {
            if (index === -1) {
                this.elements.push(element);
                element.onInputAdded();
                element.enableSensor();
            }
        } else {
            throw "can't add undefined value to Input";
        }
    };

    Input.prototype.add = function (element) {

        if (Object.prototype.toString.call(element) === '[object Array]') {
            for (var i = 0; i < element.length; i++) {
                var el = element[i];
                this.addElement(el);
            }
        } else {
            this.addElement(element);

        }

        if (element._width === 0 || element._height === 0) {
            console.warn('you are trying to add zero size element for a click');
        }

    };

    Input.prototype.remove = function (element) {

        if (Object.prototype.toString.call(element) === '[object Array]') {

            for (var i = 0; i < element.length; i++) {
                this.removeElement(element[i]);
            }

        } else {
            this.removeElement(element);
        }

    };

    Input.prototype.removeElement = function (element) {
        var index = this.elements.indexOf(element);
        if (index !== -1) {
            this.elements.splice(index, 1);
            element.onInputRemoved();
        }
    };

    Input.prototype.removeAll = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.elements[i].onInputRemoved();
        }
        this.elements = [];
    };

    Input.prototype.sortInput = function () {
        Math.insertionSort(this.elements, function (a, b) {
            return a.priority < b.priority;
        });
    };

    Input.prototype.getMousePoint = function (event) {
        this.fixWhich(event);

        var posx = 0;
        var posy = 0;
        if (!event)
            event = window.event;
        if (event.pageX || event.pageY) {
            posx = event.offsetX ? (event.offsetX) : event.layerX;
            posy = event.offsetY ? (event.offsetY) : event.layerY;

        } else if (event.clientX || event.clientY) {
            posx = event.clientX + document.body.scrollLeft
                    + document.documentElement.scrollLeft;
            posy = event.clientY + document.body.scrollTop
                    + document.documentElement.scrollTop;
        }
        return new V(posx, posy);
    };

    Input.prototype.mapTouchLocation = function (touch) {
        this.mapPointLocation(touch.pageX - this.offset.left, touch.pageY - this.offset.top)
    };

    Input.prototype.mapPointLocation = function (x, y) {
        var ratio_x = x / this.app.canvasWidth;
        var xx = ratio_x * this.app.width;

        var ratio_y = y / this.app.canvasHeight;
        var yy = ratio_y * this.app.height;

        this.point.x = xx;
        this.point.y = yy;
    };

    Input.prototype.recalucateOffset = function () {
        this.offset = this.recursiveOffset(this.element);
    };

    Input.prototype.recursiveOffset = function (element) {
        var offsetLeft = 0;
        var offsetTop = 0;
        while (element) {
            offsetLeft += element.offsetLeft;
            offsetTop += element.offsetTop;
            element = element.offsetParent;
        }
        return {
            left: offsetLeft,
            top: offsetTop
        };
    };


    //////////////

    Input.prototype.setWheel = function (delta) {

        if (this.isBlocked) {
            return;
        }

        // create the event
        var event = new HEvent(0, delta, 0, null);
        event.originalEvent = this.lastOriginalEvent;
        this.sortInput();

        this.wisper(event, 'Wheel');

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element) {

                if (event.propagate) {
                    if (element._check(this.point)) {
                        element.onWheel(event, element);
                    }

                } else {
                    break;
                }
                //TODO consider if its needed to keep track of the events
            }
        }
    };

    Input.prototype.setMouseDown = function (identifier) {

        if (this.isBlocked) {
            return;
        }

        // create the event
        var event = new HEvent(this.point.x, this.point.y, HEvent.DOWN, identifier);
        event.originalEvent = this.lastOriginalEvent;
        this.sortInput();

        this.wisper(event, 'MouseDown');

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element && element.eventIdx === -1 && !element.isMouseDown && element._check(event.point) && element.isTouchable) {

                if (event.propagate) {
                    element.isMouseDown = true;
                    element.eventIdx = event.idx;
                    element.onMouseDown(event, element);

                    if (event.isCanceled) {
                        this.setMouseCancel(identifier);
                    }

                } else {
                    break;
                }
                //TODO consider if its needed to keep track of the events
            }
        }
    };

    Input.prototype.setMouseMove = function (identifier) {

        if (this.isBlocked) {
            return;
        }

        // create the event
        var event = new HEvent(this.point.x, this.point.y, HEvent.DOWN, identifier);
        event.originalEvent = this.lastOriginalEvent;

        this.wisper(event, 'MouseMove');

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element && element.eventIdx === identifier && element.isMouseDown) {

                element.eventIdx = event.idx;
                element.onMouseMove(event, element);

                if (event.isCanceled) {
                    this.setMouseCancel(identifier);
                }

            }
        }

    };

    Input.prototype.setMouseUp = function (identifier) {

        if (this.isBlocked) {
            return;
        }

        // create the event
        var event = new HEvent(this.point.x, this.point.y, HEvent.UP, identifier);
        event.originalEvent = this.lastOriginalEvent;

        this.wisper(event, 'MouseUp');
        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element && element.eventIdx === identifier && element.isMouseDown) {

                if (element._check(event.point) && event.propagate) {
                    element.isMouseDown = false;
                    element.eventIdx = -1;
                    element.onMouseUp(event, element);
                } else {
                    this.setMouseCancel(identifier);
                }

                //TODO consider if its needed to keep track of the events
            }
        }

    };

    Input.prototype.setMouseCancel = function (identifier) {

        if (this.isBlocked) {
            return;
        }

        this.wisper(null, 'MouseCancel');

        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];
            var event = new HEvent(0, 0, HEvent.CANCEL, identifier);
            event.originalEvent = this.lastOriginalEvent;
            if (element && element.eventIdx === identifier) {
                element.eventIdx = -1;
                element.isMouseDown = false;
                element.onMouseCancel(event, element);
            }
        }

    };



    Input.prototype.setRightMouseUp = function (identifier) {

        if (this.isBlocked) {
            return;
        }

        // create the event
        var event = new HEvent(this.point.x, this.point.y, HEvent.UP, identifier);
        event.originalEvent = this.lastOriginalEvent;

        this.wisper(event, 'RightMouseUp');

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element && element.eventIdx === identifier && element.isMouseDown) {

                if (element._check(event.point) && event.propagate) {
                    element.isMouseDown = false;
                    element.eventIdx = -1;
                    element.onRightMouseUp(event, element);
                } else {
                    this.setMouseCancel(identifier);
                }

                //TODO consider if its needed to keep track of the events
            }
        }

    };

    Input.prototype.setRightMouseDown = function (identifier) {

        if (this.isBlocked) {
            return;
        }

        // create the event
        var event = new HEvent(this.point.x, this.point.y, HEvent.DOWN, identifier);
        event.originalEvent = this.lastOriginalEvent;
        this.sortInput();

        this.wisper(event, 'RightMouseDown');

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element && element.eventIdx === -1 && !element.isMouseDown && element._check(event.point) && element.isTouchable) {

                if (event.propagate) {
                    element.isMouseDown = true;
                    element.eventIdx = event.idx;
                    element.onRightMouseDown(event, element);

                    if (event.isCanceled) {
                        this.setMouseCancel(identifier);
                    }

                } else {
                    break;
                }
                //TODO consider if its needed to keep track of the events
            }
        }

    };

    Input.prototype.setRightMouseMove = function (identifier) {

        if (this.isBlocked) {
            return;
        }

        // create the event
        var event = new HEvent(this.point.x, this.point.y, HEvent.MOVE, identifier);
        event.originalEvent = this.lastOriginalEvent;

        this.wisper(event, 'RightMouseMove');

        // distribute the event
        for (var i = 0; i < this.elements.length; i++) {
            var element = this.elements[i];

            if (element && element.eventIdx === identifier && element.isMouseDown) {

                element.eventIdx = event.idx;
                element.onRightMouseMove(event, element);

                if (event.isCanceled) {
                    this.setMouseCancel(identifier);
                }

            }
        }

    };

    Input.prototype.setCursor = function (icon) {

        var element = window.document.body;

        if (icon !== element.style.cursor) {

            this.lastCursorIcon = element.style.cursor;
            setTimeout(function () {
                element.style.cursor = icon;
            }, 100);
        }

    };

    Input.prototype.restoreCursor = function () {

        var element = window.document.body;

        if (this.lastCursorIcon !== element.style.cursor) {
            element.style.cursor = this.lastCursorIcon;
        }
    };

    Input.prototype.wisper = function (event, method) {
        method = 'onWisper' + method;
        for (var i = 0; i < this.wisperListeners.length; i++) {
            var listener = this.wisperListeners[i];
            if (listener[method]) {
                listener[method](event);
            }
        }
    };

    window.Input = Input;

}(window));
