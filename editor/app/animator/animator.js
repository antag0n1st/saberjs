(function (window, undefined) {


    function Animator(actor) {
        this.initialize(actor);
    }
    
    Animator.prototype.initialize = function (actor) {
        
        this.actor = actor;
        
        this.animations = [];  
        
        //////////////////////////////
        
        this.animation = null;
        
        
        this.groups = [];
        
        this.importAnimations();
        
        if(!this.animations.length){
            // prompt to create a new animation and give it a name
            
            this.animation = new Animation();
            this.animation.name = 'base';
            this.animations.push(this.animation);
            
        }
        
    };
    
    Animator.prototype.importAnimations = function(){
        
        
        
    };

    window.Animator = Animator;

}(window));