(function (window, undefined) {

    function Notes() {
        throw "Can't initialize Notes";
    }

    Notes.listeners = {};

    Notes.add = function (listener, eventName) {
        // check if the object can respond to onNote method
        if (listener.onNote) {
            if (!Notes.listeners[eventName]) {
                Notes.listeners[eventName] = [];
            }

            //////////////////////

            if (Notes.listeners[eventName].indexOf(listener) === -1) {
                Notes.listeners[eventName].push(listener);
            }

        } else {
            throw "the object must implement onNote method in order to recive Notes";
        }
    };

    Notes.remove = function (listener, eventName) {

        if (eventName) {
            var events = Notes.listeners[eventName];
            if (events) {
                var index = events.indexOf(listener);
                if (index !== -1) {
                    events.splice(index, 1);
                }
            }
        } else {
            for (var event in Notes.listeners) {
                var events = Notes.listeners[event];
                if (events) {
                    var index = events.indexOf(listener);
                    if (index !== -1) {
                        events.splice(index, 1);
                    }
                }
            }
        }

    };

    Notes.removeAll = function () {
        Notes.listeners = {};
    };

    Notes.send = function (eventName, data, sender) {

        // check if there is such an event

        if (Notes.listeners[eventName]) {
            var subscribers = Notes.listeners[eventName];
            for (var i = 0; i < subscribers.length; i++) {
                var object = subscribers[i];
                object.onNote(eventName, data, sender);
            }
        } else {
            log("You are tring to send a message for which there are no subscribers :" + eventName);
        }

    };

    window.Notes = Notes;

}(window));