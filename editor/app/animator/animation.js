(function (window, undefined) {


    function Animation() {
        this.initialize();
    }

    Animation.prototype.initialize = function () {

        this.name = '';
        this.threads = [];
        this.duration = 10 * 1000;

        for (var i = 0; i < 10; i++) {
            this.threads.push({
                id: i+1,
            });
        }

    };

    window.Animation = Animation;

}(window));