(function (window, undefined) {

    function KinematicsScreen() {
        this.initialize();
    }

    KinematicsScreen.prototype = new HScreen();
    KinematicsScreen.prototype.screenInitialize = KinematicsScreen.prototype.initialize;

    KinematicsScreen.prototype.initialize = function () {
        this.screenInitialize();
        
        var wurst = new Sprite('wurst');
        wurst.position.set(500,500);
        this.addChild(wurst);
        
        
        this.iks = new IKSystem(500,500);
	for(var i = 0; i < 20; i++) {
		this.iks.addArm(30);
	}
        
        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
        
        this.addTouchable(this);
        

    };
    
    KinematicsScreen.prototype.onUpdate = function(dt){
        
        this.graphics.clear();
        this.iks.render(this.graphics);
    };


    KinematicsScreen.prototype.onMouseDown = function (event, sender) {
       
    };

    KinematicsScreen.prototype.onMouseMove = function (event, sender) {
       this.iks.drag(event.point.x,event.point.y);
    };

    KinematicsScreen.prototype.onMouseUp = function (event, sender) {
       
    };

    KinematicsScreen.prototype.onMouseCancel = function (event, sender) {

    };



    window.KinematicsScreen = KinematicsScreen; // make it available in the main scope

}(window));