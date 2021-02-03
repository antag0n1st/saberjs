(function (window, app , sharedObject, undefined) {

    function Emitter(emissionPoint, layer, particleClass, frequency) {
        this.initialize(emissionPoint, layer, particleClass, frequency);
    }

    Emitter.prototype.initialize = function (emissionPoint, layer, particleClass, frequency) {

        this.emissionPoint = emissionPoint;
        this.layer = layer;
        this.particleClass = particleClass;
        this.frequency = frequency;
        this.timePassed = 0;
        this.particlesCount = 0; // emitted
        this.freeParticles = [];
        this.isRunning = false;
    };

    Emitter.prototype.reset = function () {
        this.timePassed = 0;
        this.particlesCount = 0;
    };

    Emitter.prototype.getParticle = function () {
        if (this.freeParticles.length === 0) {
            var particle = new this.particleClass();
            particle.emitter = this;
            this.freeParticles.push(particle);
        }
        return this.freeParticles.pop();
    };

    Emitter.prototype.recycleParticle = function (particle) {
        particle.removeFromParent();
       // particle.is_visible = false;
        this.freeParticles.push(particle);        
    };

    Emitter.prototype.start = function () {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        Actions.add(this);
    };

    Emitter.prototype.run = function () {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        Actions.add(this);
    };

    Emitter.prototype.stop = function () {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        Actions.remove(this);
    };

    Emitter.prototype.step = function (dt) {

        this.timePassed += dt;

        var tp = Math.round(this.timePassed * this.frequency);

        var particlesToEmmit = tp - this.particlesCount;

        this.particlesCount = tp;

        for (var i = 0; i < particlesToEmmit; i++) {

            var particle = this.getParticle();
            particle.reset();
            particle.position.set(this.emissionPoint.x, this.emissionPoint.y);

            if (!this.layer) {
                throw "Please set the layer for the particle engine,better do that in the 'on_added_to_parent()' method";
            }

            this.layer.addChild(particle);
            particle.onEmmitted(this.layer);
        }
    };

    window.Emitter = Emitter;

}(window , app , sharedObject));