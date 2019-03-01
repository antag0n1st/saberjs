(function (window, undefined) {


    function Animation() {
        this.initialize();
    }

    Animation.prototype.initialize = function () {

        this.name = '';
        this.threads = [];
        this.duration = 10 * 1000;

    };

    window.Animation = Animation;

}(window));