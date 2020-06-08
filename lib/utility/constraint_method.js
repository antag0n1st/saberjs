(function (window, undefined) {


    function ConstraintMethod(object, methodName, argsLine) {
        this.initialize(object, methodName, argsLine);
    }

    ConstraintMethod.prototype.initialize = function (object, methodName, argsLine) {
        
        //TODO , this will not work with different constraint parents

        this.value = argsLine;
        this.args = [];
        this.isValid = false;
        this.parent = null;
        this.parentID = null;
        this.methodName = methodName;
        this._originalParentID = null;
        this.children = [];
        this.object = object;
        this._isRoot = true;
        this.isMethod = true;
        this.requiredArguments = 2;

        this.evaluatedValues = [];

        if (Array.isArray(argsLine)) {
            this.value = argsLine.join(',');
            this.args = argsLine;
        } else {
            this.parse(this.value);
        }
    };

    ConstraintMethod.prototype.parseLine = function (value) {


        if (value) {

            var isID = false;
            var parentID = '';
            this.isValid = true;

            var chars = value.split();

            for (var i = 0; i < chars.length; i++) {
                var c = chars[i];

                if (c === '[') {
                    isID = true;
                    parentID = '';
                } else if (c === ']') {
                    isID = false;
                    this.parentID = parentID;
                    this._originalParentID = this.parentID.replace(/\s\s+/g, '');
                } else if (isID) {
                    parentID += c;
                }

            }

            var preped = this.prepString(value);
            this.args.push(preped);
            this.isValid = this.resolveArgument(preped);

        } else {
            this.isValid = false;
        }

    };

    ConstraintMethod.prototype.parse = function (value) {

        var args = value.trim().split(",");

        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            this.parseLine(arg);
        }
        
    };

    ConstraintMethod.prototype.prepString = function (value) {

        var evalString = value || '';

        if (this.parent) {
            var rx = new RegExp('\\[' + this._originalParentID + '\\]', 'g');
            evalString = evalString.replace(rx, 'this.parent');
        }

        evalString = evalString.replace(/\.width/g, '.w_idth');
        evalString = evalString.replace(/\.height/g, '.h_eight');

        evalString = evalString.replace(/width/g, 'this.object._width');
        evalString = evalString.replace(/height/g, 'this.object._height');

        evalString = evalString.replace(/\.w_idth/g, '.width');
        evalString = evalString.replace(/\.h_eight/g, '.height');

        return evalString;

    };

    ConstraintMethod.prototype.resolve = function () {

        this.args = [];
        this.evaluatedValues = [];

        this.parse(this.value);
        // if they match it was ok
        return (this.args.length === this.evaluatedValues.length && this.args.length === this.requiredArguments);

    };

    ConstraintMethod.prototype.applyMethod = function () {
        
        if ((this.args.length === this.evaluatedValues.length && this.args.length === this.requiredArguments)) {

            var evalStr = 'this.object.' + this.methodName + '(' + this.evaluatedValues.join(',') + ')';
            
            try {

                eval("'use strict'; " + evalStr);
                return true;

            } catch (e) {
                console.error(e);
                return false;
            }
            
        } else {
            console.warn("Can't apply constraint , it has invalid arguments");
        }
        
        return false;


    };

    ConstraintMethod.prototype.resolveArgument = function (argument) {

        try {

            var x = eval("'use strict'; " + argument);

            if (typeof x === 'number') {
                if (isNaN(x)) {
                    return false;
                }
                this.evaluatedValues.push(x);

                return true;
            }

            return false;

        } catch (e) {

            return false;
        }
    };

    window.ConstraintMethod = ConstraintMethod;

}(window));