// perform initial checks here

window.addEventListener("load", function () {

    Config.lang = 'en';

    PIXI.utils.skipHello();

    app = new App();
    
    for (var i = 1; i < 10; i++) {
        timeout(function () {
            app.resize();
        }, 500 * i);
    }

}, false);
