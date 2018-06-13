(function (window, undefined) {

    function Actions() {
        throw "can't initialize Action";
    }

    Actions.actions = [];
    Actions.isPaused = false;

    Actions.add = function (action) {
        var index = this.actions.indexOf(action);
        if (index === -1) {
            this.actions.push(action);
            action.step(0); // it will execute immidietly if duration is 0   
        }
    };

    Actions.remove = function (action) {
        this.actions.removeElement(action);
    };

    Actions.pause = function () {
        Actions.isPaused = true;
    };

    Actions.resume = function () {
        Actions.isPaused = false;
    };

    Actions.stopAll = function () {
        Actions.actions = [];
    };

    Actions.stopByTag = function (tag) {
        for (var i = Actions.actions.length - 1; i >= 0; i--) {
            var action = Actions.actions[i];
            if (action && tag === action.tag) {
                action.stop(); // this will remove the action from the array
            }
        }
    };

    Actions.isRunning = function (tag) {
        for (var i = Actions.actions.length; i >= 0; i--) {
            if (Actions.actions[i] && tag === Actions.actions[i].tag) {
                return true;
            }
        }
        return false;
    };

    Actions.update = function (dt) {

        if (Actions.isPaused) {
            return;
        }

        var count = this.actions.length;

        for (var i = count - 1; i >= 0; i--) {
            if (this.actions[i] && !this.actions[i].isPaused) {
                this.actions[i].step(dt);
            }
        }

    };

    window.Actions = Actions;

}(window));