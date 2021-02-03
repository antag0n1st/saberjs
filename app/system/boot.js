window.addEventListener("load", function () {

    Config.lang = 'en';

    PIXI.utils.skipHello();
    
    App.initialize();
    
    if(!app.device.isLocalhost){
        window['app'] = undefined;
    }

}, false);