(function (window, undefined) {


    function PropertiesBinder(editor) {
        this.initialize(editor);
    }
    //PropertiesBinder.prototype = new ParentClassName();
    //PropertiesBinder.prototype.parentInitialize = PropertiesBinder.prototype.initialize;
    PropertiesBinder.prototype.initialize = function (editor) {
        // this.parentInitialize();
        this.editor = editor;

        this.genericPropertis = {
            id: true,
            x: true,
            y: true,
            anchorX: true,
            anchorY: true,
            scaleX: true,
            scaleY: true,
            tag: true,
            alpha: true,
            rotation: true,
            'z-index': true,
            className: true,
            constraintX: true,
            constraintY: true,
            constraintWidth: true,
            constraintHeight: true,
            constraintFit: true,
            constraintFill: true,
            tint: true
        };
    };

    PropertiesBinder.prototype.bindSelected = function () {

        if (this.editor.htmlInterface.commonPropertiesPanel.style.display === "none") {
            return;
        }

        if (this.editor.selectedObjects.length === 1) {
            this.bindObject(this.editor.selectedObjects[0]);
        } else if (this.editor.selectedObjects.length > 1) {
            // clear the panel... for now
            this.editor.htmlInterface.commonPropertiesContent.innerHTML = '';
            // multi object binding , should only be alowed for single type objects

            if (this.editor._multiObjectsBind) {
                this.editor._multiObjectsBind(this.editor.selectedObjects);
            }

        }

    };

    PropertiesBinder.prototype.bindObject = function (object) {
        
        var html = '';

        var opt0 = {name: 'id', value: object.id, class: 'big', displayName: 'ID', feedback: true};
        var opt1 = {name: 'x', value: Math.roundDecimal(object.x, 2), class: 'small'};
        var opt2 = {name: 'y', value: Math.roundDecimal(object.y, 2), class: 'small'};
        var opt3 = {name: 'scaleX', value: Math.roundDecimal(object.scale.x, 2), class: 'small', displayName: 'Scale X'};
        var opt4 = {name: 'scaleY', value: Math.roundDecimal(object.scale.y, 2), class: 'small', displayName: 'Scale Y'};
        var opt5 = {name: 'anchorX', value: Math.roundDecimal(object.anchor.x, 2), class: 'small', displayName: 'Anchor X'};
        var opt6 = {name: 'anchorY', value: Math.roundDecimal(object.anchor.y, 2), class: 'small', displayName: 'Anchor Y'};
        var opt7 = {name: 'tag', value: object.tag};
        var opt8 = {name: 'alpha', value: Math.roundDecimal(object.alpha, 2), class: 'small'};
        var opt9 = {name: 'rotation', value: Math.roundDecimal(Math.radiansToDegrees(object.rotation), 2), class: 'small'};
        var opt10 = {name: 'z-index', value: Math.round(object.zIndex), class: 'small', displayName: 'Z-Index'};

        var opt11 = {name: 'constraintX', value: object.constraintX ? object.constraintX.value : '', class: 'big', displayName: 'X', feedback: true};
        var opt12 = {name: 'constraintY', value: object.constraintY ? object.constraintY.value : '', class: 'big', displayName: 'Y', feedback: true};

        var opt15 = {name: 'constraintWidth', value: object.constraintWidth ? object.constraintWidth.value : '', class: 'big', displayName: 'Width', feedback: true};
        var opt16 = {name: 'constraintHeight', value: object.constraintHeight ? object.constraintHeight.value : '', class: 'big', displayName: 'Height', feedback: true};

        var opt17 = {name: 'constraintFit', value: object.constraintFit ? object.constraintFit.value : '', class: 'big', displayName: 'Fit', feedback: true};
        var opt18 = {name: 'constraintFill', value: object.constraintFill ? object.constraintFill.value : '', class: 'big', displayName: 'Fill', feedback: true};

        var opt13 = {name: 'className', value: object.className, class: 'big', displayName: 'Class'};



        var opt14 = {name: 'tint', displayName: 'Tint', value: PIXI.utils.hex2string(object.tint)};

        var colorPicker = HtmlElements.createColorPicker(opt14);

        var idControl = HtmlElements.createInput(opt0);

        html += idControl.html;
        html += HtmlElements.createInput(opt1).html;
        html += HtmlElements.createInput(opt2).html;

        html += HtmlElements.createInput(opt5).html;
        html += HtmlElements.createInput(opt6).html;
        html += HtmlElements.createInput(opt3).html;
        html += HtmlElements.createInput(opt4).html;



        html += HtmlElements.createInput(opt7).html;
        if (object instanceof ImageObject) {
            html += colorPicker.html; // tint
        }

        html += HtmlElements.createInput(opt8).html;
        html += HtmlElements.createInput(opt9).html;
        html += HtmlElements.createInput(opt10).html;

        if (editorConfig.features.constraints) {
            html += HtmlElements.createInput(opt13).html;
            html += HtmlElements.createSection('Constraints').html;

            var cx = HtmlElements.createInput(opt11);
            var cy = HtmlElements.createInput(opt12);

            var cw = HtmlElements.createInput(opt15);
            var ch = HtmlElements.createInput(opt16);


            var cfit = HtmlElements.createInput(opt17);
            var cfill = HtmlElements.createInput(opt18);

            html += cx.html;
            html += cy.html;

            html += cw.html;
            html += ch.html;

            html += cfit.html;
            html += cfill.html;
        }

        this.editor.htmlInterface.commonPropertiesContent.innerHTML = html;

        // validate fields
        if (editorConfig.features.constraints) {
            if (object.constraintX) {
                HtmlElements.setFeedback(cx.feedbackID, object.constraintX.isValid);
            }

            if (object.constraintY) {
                HtmlElements.setFeedback(cy.feedbackID, object.constraintY.isValid);
            }

            if (object.constraintWidth) {
                HtmlElements.setFeedback(cw.feedbackID, object.constraintWidth.isValid);
            }

            if (object.constraintHeight) {
                HtmlElements.setFeedback(ch.feedbackID, object.constraintHeight.isValid);
            }

            if (object.constraintFit) {
                HtmlElements.setFeedback(cfit.feedbackID, object.constraintFit.isValid);
            }

            if (object.constraintFill) {
                HtmlElements.setFeedback(cfill.feedbackID, object.constraintFill.isValid);
            }

        }

        var isValid = this.editor.isIdUnique(object.id);
        if (object.id === '') {
            isValid = false;
        }
        HtmlElements.setFeedback(idControl.feedbackID, isValid);
        HtmlElements.activateColorPicker(colorPicker);

        //   }


    };

    PropertiesBinder.prototype.onPropertyInputWheel = function (event, property, value, element, inputType, feedbackID, range) {

        var delta = 0;

        if (!event) {
            event = window.event;
        }

        if (event.deltaY) {
            delta = -event.deltaY;
        } else if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
        } else if (event.detail) {
            delta = -event.detail / 3;
        }

        var dir = (delta < 0) ? -1 : 1;

        if (inputType === HtmlElements.TYPE_INPUT_INTEGER
                || inputType === HtmlElements.TYPE_INPUT_NUMBER
                || inputType === HtmlElements.TYPE_INPUT_EMPTY_INTEGER) {

            var v = 1;

            value = this.editor.cleanUpValuesByType(inputType, value, element, range, feedbackID);

            if (inputType === HtmlElements.TYPE_INPUT_NUMBER) {

                if (value <= 1 && value >= -0.9 && dir < 0) {
                    v = 0.1;
                } else if (value <= 0.9 && value >= -1 && dir > 0) {
                    v = 0.1;
                }

                value += dir * v;
                value = Math.roundDecimal(value, 2);

            } else {
                value += dir * v;
            }

            // do some if else here

            if (this.genericPropertis[property]) {
                this.onPropertyChange(property, value.toString(), element, inputType, feedbackID);
            } else {
                this.editor.onSelectedObjectPropertyChange(property, value.toString(), element, inputType, feedbackID, range);
            }

            element.value = value;

        }

    };

    PropertiesBinder.prototype.onPropertyChange = function (property, value, element, inputType, feedbackID) {

        if (this.editor.selectedObjects.length === 1) {
            this.bindObjectWithProperty(this.editor.selectedObjects[0], property, value, element, inputType, feedbackID)
        } else if (this.editor.selectedObjects.length > 1) {
            // multi object binding , should only be alowed for single type objects
        }

    };

    PropertiesBinder.prototype.bindObjectWithProperty = function (object, property, value, element, inputType, feedbackID) {
     
        //TODO do it with commands
        if (property === 'id') {
            value = value.trim().toLowerCase();
            object.id = value;

            var isValid = this.editor.isIdUnique(value);
            if (object.id === '') {
                isValid = false;
            }
            HtmlElements.setFeedback(feedbackID, isValid);

        } else if (property === 'x') {
            if (object.canMove) {
                object.x = Number(value) || 0;
            }
        } else if (property === 'y') {
            if (object.canMove) {
                object.y = Number(value) || 0;
            }
        } else if (property === 'scaleX') {
            object.scale.x = Number(value) || 0.01;
        } else if (property === 'scaleY') {
            object.scale.y = Number(value) || 0.01;
        } else if (property === 'tag') {
            object.tag = value;
        } else if (property === 'alpha') {
            object.alpha = Number(value) || 0;
        } else if (property === 'rotation') {
            object.rotation = Math.degreesToRadians(Number(value) || 0);
        } else if (property === 'z-index') {
            object.zIndex = parseInt(value) || 0;
            //   this.editor.sortObjectsPriority();
        } else if (property === 'anchorX') {
            object.anchor.x = Number(value) || 0;
        } else if (property === 'anchorY') {
            object.anchor.y = Number(value) || 0;
        } else if (property === 'constraintX') {

            var constraint = new Constraint(object, 'x', value);
            HtmlElements.setFeedback(feedbackID, constraint.isValid);
            object.constraintX = constraint;

        } else if (property === 'constraintY') {

            var constraint = new Constraint(object, 'y', value);
            HtmlElements.setFeedback(feedbackID, constraint.isValid);
            object.constraintY = constraint;

        } else if (property === 'constraintWidth') {

            var constraint = new Constraint(object, 'width', value);
            HtmlElements.setFeedback(feedbackID, constraint.isValid);
            object.constraintWidth = constraint;

        } else if (property === 'constraintHeight') {

            var constraint = new Constraint(object, 'height', value);
         
            HtmlElements.setFeedback(feedbackID, constraint.isValid);
            object.constraintHeight = constraint;

        } else if (property === 'constraintFill') {

            var constraint = new ConstraintMethod(object, 'fillOut', value);
            HtmlElements.setFeedback(feedbackID, constraint.isValid);
            object.constraintFill = constraint;

        } else if (property === 'constraintFit') {

            var constraint = new ConstraintMethod(object, 'fitTo', value);
            HtmlElements.setFeedback(feedbackID, constraint.isValid);
            object.constraintFit = constraint;

        } else if (property === 'className') {
            object.className = value.trim() || '';
        } else if (property === 'tint') {
            object.tint = PIXI.utils.string2hex(value);
        }


        if (property === 'constraintY' || property === 'constraintX' || property === 'constraintWidth' || property === 'constraintHeight' || property === 'constraintFit' || property === 'constraintFill') {

            this.editor.constraints.remove(constraint);

            if (constraint.isValid) {
                this.editor.constraints.add(constraint);
            }

            this.editor.constraints.rebuildDependencyTree();

            //TODO resolve a single constraint
            this.editor.constraints._applyValues([constraint]);
        }

        if (object.updateSize) {
            object.updateSize();
        }
        object.updateFrame();

        if (object._basePropertyChange) {
            object._basePropertyChange(property, value, element, inputType, feedbackID);
        }

    };


    window.PropertiesBinder = PropertiesBinder;

}(window));