// perform initial checks here

window.addEventListener("load", function () {

    Config.lang = 'en';

    PIXI.utils.skipHello();

    app = new App();
    
    //GlobalData.read();
    
    for (var i = 1; i < 15; i++) {
        timeout(function () {
            if(!app.device.isKeyboardUp){
                app.resize(true); // do it with auto layout
            }            
        }, 100 * i);
    }

}, false);

// why was this ?
//document.addEventListener('focusout', function() {
//  window.scrollTo(0, 0);
//});