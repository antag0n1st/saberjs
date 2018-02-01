(function (window, undefined) {

    function Device(app) {
        this.initialize(app);
    }

    Device.prototype.initialize = function (app) {

        this.app = app;

        this.isMobile = PIXI.utils.isMobile;

        this.isTouch = false;
        this.isIE = false;

        this.isFullScreen = false;

        this.readTouchDevice();
        this.readIE();

        ////

        this.calculateSizes();

        //////////////

        var that = this;

        window.addEventListener("webkitfullscreenchange", function (evt) {
            that.fullscreenCallback();
        });

        window.addEventListener("mozfullscreenchange", function (evt) {
            that.fullscreenCallback();
        });

        window.addEventListener("fullscreenchange", function (evt) {
            that.fullscreenCallback();
        });

        window.addEventListener("MSFullscreenChange", function (evt) {
            that.fullscreenCallback();
        });

        ////////////

        window.addEventListener("resize", function (event) {

            that.app.resize();

        });

    };



    Device.prototype.readTouchDevice = function () {
        this.isTouch = 'ontouchstart' in window        // works on most browsers 
                || navigator.maxTouchPoints;       // works on IE10/11 and Surface
    };


    Device.prototype.calculateSizes = function () {

        var width = Config.game_width;
        var height = Config.game_height;
        var mode = Config.window_mode;
        var size = this.windowSize();

        this.app.windowWidth = size.width;
        this.app.windowHeight = size.height;

        this.app.canvasWidth = Math.ceil(size.width);
        this.app.canvasHeight = Math.ceil(size.height);

        var ratio = size.width / size.height;


        if (mode === Config.MODE_FLEXIBLE_WIDTH) {

            this.app.height = height;
            this.app.width = height * ratio;

        } else if (mode === Config.MODE_FLEXIBLE_HEIGHT) {

            this.app.width = width;
            this.app.height = width / ratio;

        } else if (mode === Config.MODE_STRETCH) {

            this.app.width = width;
            this.app.height = height;

        } else if (mode === Config.MODE_CENTERED) {

            this.app.width = width;
            this.app.height = height;

            var gratio = width / height;

            if (ratio >= width / height) {
                // the screen size is wider               
                this.app.canvasWidth = Math.ceil(size.height * gratio);
                this.app.canvasHeight = Math.ceil(size.height);
            } else {
                // the screen size is taller
                this.app.canvasWidth = Math.ceil(size.width);
                this.app.canvasHeight = Math.ceil(size.width / gratio);
            }


        } else if (mode === Config.MODE_NONE) {
            
            this.app.canvasWidth = Math.ceil(width);
            this.app.canvasHeight = Math.ceil(height);
            this.app.width = width;
            this.app.height = height;
            
        } else if (mode === Config.MODE_PADDING) {
            
            var canvasPadding = Config.canvas_padding.split(' ');
            
            this.app.canvasWidth = size.width - Math.round(canvasPadding[1]) - Math.round(canvasPadding[3]);
            this.app.canvasHeight = size.height - Math.round(canvasPadding[0]) - Math.round(canvasPadding[2]);
          
            var ar = this.app.canvasWidth / this.app.canvasHeight;
          
            this.app.width = height*ar;
            this.app.height = height;

        }

        //TODO create a global variable for the screen width/height

    };

    Device.prototype.windowSize = function () {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return {width: e[ a + 'Width' ], height: e[ a + 'Height' ]};
    };

    Device.prototype.readIE = function () {
        var ua = window.navigator.userAgent;

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            this.isIE = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            return this.isIE;
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            this.isIE = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            return this.isIE;
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            this.isIE = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            return this.isIE;
        }

        // other browser
        this.isIE = false;
        return this.isIE;
    };



    Device.prototype.goFullScreen = function () {

        if (!this.isFullScreen) {

            this.isFullScreen = true;
            var elem = document.body;

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }

        }

    };

    Device.prototype.canGoFullScreen = function () {

        var elem = document.body;

        if (elem.requestFullscreen) {
            return true;
        } else if (elem.msRequestFullscreen) {
            return true;
        } else if (elem.mozRequestFullScreen) {
            return true;
        } else if (elem.webkitRequestFullscreen) {
            return true;
        }

        return false;
    };

    Device.prototype.exitFullScreen = function () {

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }

    };

    Device.prototype.fullscreenCallback = function () {
        if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement &&
                !document.msFullscreenElement) {

            this.isFullScreen = false;
        } else {
            this.isFullScreen = true;
        }
    };

    window.Device = Device;

}(window));