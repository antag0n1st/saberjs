(function (window, app , sharedObject, undefined) {

    var sequenceCounter = 0;

    function Sequencer(delegate) {
        this.initialize(delegate);
    }

    // DELEGATE
    // - onTweenStarted(tween, name, tag, sequencer)
    // - onTweenEnded(tween, name, tag, sequencer)
    // - onThreadFinished(thread)
    // - onSequencerStarted(sequencer)
    // - onSequencerFinished(sequencer)
    Sequencer.prototype.initialize = function (delegate) {

        this.threads = [];

        this.isRunning = false;
        this.isPaused = false;
        this.delegate = delegate;

        this._countFinishedThreads = 0;
        this.tag = 0;
        this.context = null;

    };

    Sequencer.prototype.setGlobalContext = function (context) {
        this.context = context;
        for (var i = 0; i < this.threads.length; i++) {
            var thread = this.threads[i];
            for (var j = 0; j < thread.length; j++) {
                var tween = thread[j];
                tween.context = context;
            }
        }
    };

    Sequencer.prototype.addThread = function (tweens, tag) {

        tag = tag || '_thread' + (sequenceCounter++);

        var duration = 0;

        var threadTweens = [];

        for (var i = 0; i < tweens.length; i++) {
            var tween = tweens[i];

            if (tween.length === undefined) {
                threadTweens.push([tween]);
            } else {
                threadTweens.push(tween);
            }
        }

        for (var i = 0; i < threadTweens.length; i++) {

            var longestDuration = 0;
            var longestIndex = -1;

            for (var j = 0; j < threadTweens[i].length; j++) {
                var tween = threadTweens[i][j];
                if (tween.duration > longestDuration) {
                    longestDuration = tween.duration;
                    longestIndex = j;
                }
                tween.onCallbackInvoked = Sequencer.prototype.delgateCallback.bind(this);
                // add callback only to the longest tween

            }

            var tween = threadTweens[i][longestIndex];

            tween.onCallbackInvoked = Sequencer.prototype.onCallback.bind(this);
            if (tween._repeat === 0) {
                throw "You can't run infinite tweens into Sequencer \n(They will never finish and call the next!)";
            }
            duration += tween.duration; // calulates the total duration of the thread

        }

        var thread = {
            tweens: threadTweens,
            tag: tag,
            index: -1,
            duration: duration
        };

        this.threads.push(thread);

        return thread;

    };

    Sequencer.prototype.delgateCallback = function (object, tween, tag) {

        if (this.delegate && this.delegate.onTweenEnded) {
            this.delegate.onTweenEnded(tween, tween._name, tag, this);
        }

    };

    Sequencer.prototype.onCallback = function (object, tween, tag) {

        this.delgateCallback(object, tween, tag);

        this.next(tag);

    };

    Sequencer.prototype.run = function () {

        if (!this.isRunning) {
            this.isRunning = true;
            if (this.delegate && this.delegate.onSequencerStarted) {
                this.delegate.onSequencerStarted(this);
            }
        }

        for (var i = 0; i < this.threads.length; i++) {
            var thread = this.threads[i];
            thread.index++;

            for (var j = 0; j < thread.tweens.length; j++) {
                if (thread.index === j) {

                    for (var k = 0; k < thread.tweens[j].length; k++) {
                        var tween = thread.tweens[j][k];
                        tween.applyValues(); // not sure if it is neede in the first run
                        if (this.delegate && this.delegate.onTweenStarted) {
                            this.delegate.onTweenStarted(tween, tween._name, thread.tag, this);
                        }
                        tween.run(thread.tag);
                    }

                }
            }
        }

    };

    Sequencer.prototype.next = function (tag) {

        if (this.isFinished) {
            return;
        }

        for (var i = 0; i < this.threads.length; i++) {
            var thread = this.threads[i];
            if (thread.tag === tag) {
                thread.index++;

                if (thread.index >= thread.tweens.length) {
                    this._countFinishedThreads++;
                    if (this.delegate && this.delegate.onThreadFinished) {
                        this.delegate.onThreadFinished(thread);
                    }
                    if (this._countFinishedThreads === this.threads.length) {
                        if (this.delegate && this.delegate.onSequencerFinished) {
                            this.delegate.onSequencerFinished(this);
                        }
                    }
                } else {
                    for (var j = 0; j < thread.tweens.length; j++) {

                        for (var k = 0; k < thread.tweens[j].length; k++) {
                            var tween = thread.tweens[j][k];
                            if (thread.index === j) {

                                tween.applyValues();
                                if (this.delegate && this.delegate.onTweenStarted) {
                                    this.delegate.onTweenStarted(tween, tween._name, thread.tag, this);
                                }
                                tween.run(thread.tag);

                            }
                        }


                    }
                }

            }

        }

    };

    Sequencer.prototype.pause = function () {

        if (!this.isPaused) {
            this.isPaused = true;
            
            for (var i = 0; i < this.threads.length; i++) {
                var thread = this.threads[i];
                for (var j = 0; j < thread.tweens.length; j++) {
                    var tweens = thread.tweens[j];
                    for (var k = 0; k < tweens.length; k++) {
                        var tween = tweens[k];
                        tween.pause();
                    }
                }
            }
        }



    };

    Sequencer.prototype.resume = function () {

        if (this.isPaused) {
            this.isPaused = false;

            for (var i = 0; i < this.threads.length; i++) {
                var thread = this.threads[i];
                for (var j = 0; j < thread.tweens.length; j++) {
                    var tweens = thread.tweens[j];
                    for (var k = 0; k < tweens.length; k++) {
                        var tween = tweens[k];
                        tween.resume();
                    }
                }
            }
        }



    };

    Sequencer.prototype.stop = function () {

        this.isRunning = false;
        this.isFinished = true;

        for (var i = 0; i < this.threads.length; i++) {
            var thread = this.threads[i];
            Actions.stopByTag(thread.tag);
        }

    };

    Sequencer.prototype.reset = function () {

        this.isFinished = false;
        this._countFinishedThreads = 0;

        for (var i = 0; i < this.threads.length; i++) {
            var thread = this.threads[i];
            thread.index = -1;
        }

    };

    window.Sequencer = Sequencer;

}(window , app , sharedObject));