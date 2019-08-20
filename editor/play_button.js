MainScreen.prototype.onPlayButton = function (event, sender) {

    if (!this.previewScreenName) {
        toastr.error("Please specify a Preview Screen Name");
        this.htmlInterface.activateTab('settings');
        var input = document.getElementById('previewScreenInput');
        input.focus();
        return;
    } else if (!window[this.previewScreenName]) {
        toastr.error("Please include the screen in the extra_scripts.php");
        this.htmlInterface.activateTab('settings');
        return;
    }

    var data = this.importer.export();
    if (this._exportAddapter) {
        data = this._exportAddapter(data, this.importer);
    }

    //TODO filter content here

    previewData = data;

    var leftToolbar = document.getElementById('leftToolbar');
    var sideToolbar = document.getElementById('sideToolbar');
    var topToolbar = document.getElementById('topToolbar');

    leftToolbar.style.display = 'none';
    sideToolbar.style.display = 'none';
    topToolbar.style.display = 'none';

    Config.canvas_padding = '0 0 0 0';
    Config.window_mode = Config.MODE_CENTERED;

    if (this._onPlayButton) {
        this._onPlayButton();
    }

    app.resize();

    var that = this;

    timeout(function () {
        var screen = new window[that.previewScreenName]();
        app.navigator.add(screen, 100);

        var backBtn = new Button('Exit', Style.DEFAULT_BUTTON, Button.TYPE_NINE_SLICE);
        var w = 70;
        var h = 50;
        backBtn.background.setSize(w, h);
        backBtn.setSensorSize(w, h);
        backBtn.label.style.fontSize = 20;
        backBtn.position.set(10 + w / 2, 10 + h / 2);
        backBtn.alpha = 0.7;
        backBtn.onMouseUp = function () {

            Config.canvas_padding = '50 360 0 50'; // top - right - bottom - left
            Config.window_mode = Config.MODE_PADDING;


            if (that._onBackButton) {
                that._onBackButton();

            }



            var leftToolbar = document.getElementById('leftToolbar');
            var sideToolbar = document.getElementById('sideToolbar');
            var topToolbar = document.getElementById('topToolbar');

            leftToolbar.style.display = 'block';
            sideToolbar.style.display = 'block';
            topToolbar.style.display = 'block';

            timeout(function () {
                app.resize();
            }, 100);

            app.navigator.goBack();

        };
        screen.addTouchable(backBtn);
        screen.addChild(backBtn);

    }, 100);




    //  }, true);


};