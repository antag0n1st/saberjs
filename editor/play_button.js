MainScreen.prototype.onPlayButton = function (event, sender) {

//    trace("You need to implement this method");
//    this.htmlInterface.saveCurrentContent(function () {
//        app.navigator.add(new DashboardScreen());
//    }, true);

    if (!this.previewScreenName) {
        toastr.error("Please specify a Preview Screen Name");
        this.htmlInterface.activateTab('settings');
        var input = document.getElementById('previewScreenInput');
        input.focus();
        return;
    } else if(!window[this.previewScreenName]){
        toastr.error("Please include the screen in the extra_scripts.php");
        this.htmlInterface.activateTab('settings');
        return;
    }




    this.htmlInterface.saveCurrentContent(function () {

        var leftToolbar = document.getElementById('leftToolbar');
        var sideToolbar = document.getElementById('sideToolbar');
        var topToolbar = document.getElementById('topToolbar');

        leftToolbar.style.display = 'none';
        sideToolbar.style.display = 'none';
        topToolbar.style.display = 'none';

        Config.canvas_padding = '0 0 0 0';

        timeout(function () {
            app.resize();
        }, 100);

        var screen = new DashboardScreen();
        app.navigator.add(screen);

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


    }, true);


};