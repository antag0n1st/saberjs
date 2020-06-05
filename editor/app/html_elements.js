(function (window, undefined) {


    function HtmlElements() {
        throw "Can't initialize html elements";
    }

//    HtmlElements.INPUT_TYPE_ALL = 0;
//    HtmlElements.INPUT_TYPE_NUMBER = 1;
//    HtmlElements.INPUT_TYPE_BOOLEAN = 2;

    HtmlElements.TYPE_INPUT_STRING = 0;
    HtmlElements.TYPE_INPUT_NUMBER = 1; // default
    HtmlElements.TYPE_INPUT_INTEGER = 2;
    HtmlElements.TYPE_CHECKBOX = 3;
    HtmlElements.TYPE_DROPDOWN = 4;
    HtmlElements.TYPE_COLORPICKER = 5;

    // name,displayName , value, class, event, isDisabled, tooltip, method, inputType
    var sample = {
        name: '',
        displayName: '',
        value: '',
        class: '',
        event: '',
        isDisabled: false,
        tooltip: '',
        method: '',
        feedback: false,
        type: HtmlElements.TYPE_INPUT_STRING,
        buttonClass: '',
        buttonAction: '',
        style: '',
        range: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
    };

    HtmlElements.createInput = function (options) {

        var value = (typeof options.value === "undefined") ? '' : options.value;

        if (typeof value === "string") {
            value = value.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
                    .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
                    .replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
        }

        var className = options.class || 'big';
        var method = options.method || "propertiesBinder.onPropertyChange";
        var tooltip = options.tooltip || "";
        var inputType = (options.type === undefined) ? HtmlElements.TYPE_INPUT_NUMBER : options.type;
        var name = options.name || '';
        var style = options.style || '';
        var displayName = options.displayName || name;
        var range = options.range || [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
        range[0] = (range[0] === undefined) ? Number.MIN_SAFE_INTEGER : range[0];
        range[1] = (range[1] === undefined) ? Number.MAX_SAFE_INTEGER : range[1];
        
        if (displayName === name) {
            displayName = displayName.replace('_', ' ').capitalize();
        }
        var event_string = options.event ? options.event.name + '="' + options.event.callback + '"' : "";

        var id = "htmlElementId-" + PIXI.utils.uid();
        var feedbackID = id; // "feedbackElementId-" + PIXI.utils.uid();

        var html = '<div class="' + className + ' ' + (options.buttonAction ? 'input-group m-bot15' : '') + '">';
        //  html += options.feedback ? '<i id="' + feedbackID + '" style="color:orange;" class="fa fa-warning form-control-feedback"></i>' : '';
        html += '<label ';
        html += tooltip ? 'title="' + tooltip + '"' : '';
        html += '>';


        html += displayName + ': </label>';
        html += ' <input ' + (options.isDisabled ? "disabled" : "");
        html += ' class="form-control" ';
        html += ' style="' + style + '" ';
        html += ' id="' + id + '" ';
        html += tooltip ? ' title="' + tooltip + '"' : '';
        html += ' type="text" value="' + value + '" ' + event_string;
        html += ' onkeyup="app.navigator.currentScreen.' + method + '(\'' + name + '\',this.value,this,' + inputType + ',\'' + feedbackID + '\' , ['+range[0]+','+range[1]+'] );" ';
        html += ' />';

        html += options.buttonAction ? '<span class="input-group-btn"><button onclick="app.navigator.currentScreen.' + options.buttonAction + '(\'' + name + '\',document.getElementById(\'' + id + '\').value)" class="btn btn-info ' + options.buttonClass + '" type="button"></button></span>' : '';


        html += '</div>';

        return {html: html, id: id, feedbackID: feedbackID};

    };

    HtmlElements.setFeedback = function (id, isValid) {

        var feedback = document.getElementById(id);

        feedback.classList.remove("is-valid");
        feedback.classList.remove("is-invalid");

        if (isValid) {
            feedback.classList.add("is-valid");
        } else {
            feedback.classList.add("is-invalid");
        }
    };

    HtmlElements.createImageButton = function (imageName, method, argsString, className, tooltip) {

        var id = "htmlElementId-" + PIXI.utils.uid();

        var html = '';
        html += '<img class="' + className + '" ';
        html += ' id="' + id + '" ';
        html += ' title="' + tooltip + '" ';
        html += ' src="assets/images/icons/' + imageName + '.png" ';
        html += ' onclick="app.navigator.currentScreen.' + method + '(' + argsString + ')" ';
        html += '/>';

        return {html: html, id: id};

    };

    var buttonOpt = {
        name: '',
        displayName: '',
        class: '',
        icon: '',
        tooltip: '',
        method: '',
        style: ''
    };

    HtmlElements.createButton = function (options) {

        var id = "htmlElementId-" + PIXI.utils.uid();
        var className = options.class || 'btn-info';
        var style = options.style || "margin-left:5px;";
        var method = options.method || "blank";
        var tooltip = options.tooltip || "";
        var icon = options.icon || "";
        var name = options.name || '';
        var displayName = options.displayName || name;
        if (displayName === name) {
            displayName = displayName.replace('_', ' ').capitalize();
        }

        var html = '<button class="btn ' + className + '"';
        html += tooltip ? ' title="' + tooltip + '"' : '';
        html += ' id="' + id + '" ';
        html += ' style="' + style + '" ';
        html += ' type="button" ';
        html += ' onclick="app.navigator.currentScreen.' + method + '(\'' + name + '\',this);" ';
        html += '>';

        html += '<i class="' + icon + '"></i> ';
        html += displayName;
        html += '</button>';

        return {html: html, id: id};

    };

    HtmlElements.createSection = function (title) {

        var id = "htmlElementId-" + PIXI.utils.uid();

        var html = '';
        html += '<div ';

        html += ' style="border-top:1px solid #aaaaaa;text-align:left; margin-top:10px; margin-bottom:6px; padding-top:5px;" ';
        html += ' id="' + id + '" ';
        html += '>';
        html += '<h3 style="font-size:20px;color:#999999;margin-bottom:0px;">';
        html += ' ' + title + ' ';
        html += '</h3>';
        html += '</div>';

        return {html: html, id: id};

    };

    var checkboxOpt = {
        name: '',
        displayName: '',
        class: '',
        method: '',
        checked: false,
        isDisabled: false
    };

    HtmlElements.createCheckbox = function (options) {


        var className = options.class || 'big';
        var method = options.method || "propertiesBinder.onPropertyChange";
        var tooltip = options.tooltip || "";

        var name = options.name || '';
        var displayName = options.displayName || name;
        if (displayName === name) {
            displayName = displayName.replace('_', ' ').capitalize();
        }

        var checked = options.checked;


        var id = "htmlElementId-" + PIXI.utils.uid();


        var html = '<div class="' + className + ' ' + (options.feedback ? 'has-feedback' : '') + '">';
        html += '<label ';
        html += tooltip ? 'title="' + tooltip + '"' : '';

        html += ' style="cursor:pointer;" ';
        html += 'for="' + id + '"';
        html += '>';
        html += displayName + ': </label>';
        html += ' <input ' + (options.isDisabled ? "disabled" : "");
        html += tooltip ? ' title="' + tooltip + '"' : '';
        html += ' class="form-control" ';
        html += checked ? ' checked="checked" ' : '';
        html += ' style="cursor:pointer;" ';
        html += ' id="' + id + '" ';
        html += ' type="checkbox" ';
        html += ' onchange="app.navigator.currentScreen.' + method + '(\'' + name + '\',this.value,this,' + HtmlElements.TYPE_CHECKBOX + ',null);" ';
        html += ' />';

        html += '</div>';

        return {html: html, id: id, feedbackID: null};

    };

    HtmlElements.createImageUpload = function (options) {


        // var key = options.key || '';
        var tooltip = options.tooltip || '';

        var className = options.class || 'big';
        //   var method = options.method || "propertiesBinder.onPropertyChange";
        var tooltip = options.tooltip || "";

        var name = options.name || '';
        var displayName = options.displayName || name;
        if (displayName === name) {
            displayName = displayName.replace('_', ' ').capitalize();
        }

        var id = "htmlElementId-" + PIXI.utils.uid();


        var html = '<div class="' + className + '">';
        html += '<label ';
        html += tooltip ? 'title="' + tooltip + '"' : '';

        html += ' style="cursor:pointer;" ';
        html += 'for="' + id + '"';
        html += '>';
        html += displayName + ': &nbsp; </label>';

        html += '<input onchange="app.navigator.currentScreen.mathcore.fileSelectHandler(event,this,\'' + name + '\')" type="file"  id="' + id + '" name="fileselect[]" multiple="multiple" />';

        html += "</div>";

        return {html: html, id: id};
    };


    var dropdownOpt = {
        name: '',
        displayName: '',
        method: '',
        items: '',
        value: '',
        isDisabled: false
    };

    HtmlElements.createDropdown = function (options) {


        var className = options.class || 'big';
        var method = options.method || "propertiesBinder.onPropertyChange";
        var items = options.items || [];
        var tooltip = options.tooltip || "";

        var name = options.name || '';
        var displayName = options.displayName || name;
        if (displayName === name) {
            displayName = displayName.replace('_', ' ').capitalize();
        }

        var value = options.value;
        var id = "htmlElementId-" + PIXI.utils.uid();

        var html = '<div class="' + className + '">';
        html += '<label ';
        html += tooltip ? ' title="' + tooltip + '"' : '';
        html += ' style="cursor:pointer;" ';
        html += '>';
        html += displayName + ': </label> ';

        html += '<select';
        html += ' class="form-control" ';
        html += tooltip ? ' title="' + tooltip + '"' : '';
        html += ' id="' + id + '" ';
        html += ' onchange="app.navigator.currentScreen.' + method + '(\'' + name + '\',this.value,this,' + HtmlElements.TYPE_DROPDOWN + ',null);" ';
        html += '>';

        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            var _name = item;
            var _value = item;

            if (item.name) {
                _name = item.name;
                _value = item.value;
            }

            html += '<option';
            // 
            if (_value == value) {
                html += ' selected="selected"';
            }

            html += ' value="' + _value + '" ';
            html += '>';
            html += _name;
            html += '</option>';

        }

        html += '</select>';
        html += '</div>';

        return {html: html, id: id, feedbackID: null};

    };

    var colorPickerOpt = {
        name: '',
        displayName: '',
        class: '',
        value: '',
        method: ''
    };

    HtmlElements.createColorPicker = function (options) {


        var className = options.class || 'big';
        options.method = options.method || "propertiesBinder.onPropertyChange";

        var name = options.name || '';
        var displayName = options.displayName || name;
        if (displayName === name) {
            displayName = displayName.replace('_', ' ').capitalize();
        }

        var value = options.value || '#DD0F20';

        var style = options.style || ''; // margin-top: 10px; width: 165px;


        var id = "htmlElementId-" + PIXI.utils.uid();


        var html = '<div class="' + className + '">';
        html += '<label ';
        html += '>';
        html += displayName + ': </label>';

        html += '<div id="' + id + '" class="input-group color-pickers" style="margin-left:4px;' + style + '" >';
        html += ' <input ';
        //    html += ' id="' + id + '" ';
        html += ' class="form-control" ';
        html += ' type="text" ';
        html += ' value="' + value + '" ';
        html += ' />';
        html += '<span class="input-group-text colorpicker-input-addon"><i></i></span>';
        html += '</div>';

        html += '</div>';


        return {html: html, id: id, feedbackID: null, options: options};

    };

    HtmlElements.getPickerOptions = function () {
        return JSON.parse(JSON.stringify(HtmlElements.colorPickerOptions));
    };
    

    HtmlElements.colorPickerOptions = {
        useAlpha: true,
        customClass: 'colorpicker-2x',
        extensions: [
            {
                name: 'swatches', // extension name to load
                options: {// extension options
                    colors: Config.colors || {
                        'transparent': 'transparent',
                        'black': '#000000',
                        'white': '#ffffff'                        
                    }
                }
            }
        ],
        sliders: {
            saturation: {
                maxLeft: 200,
                maxTop: 200
            },
            hue: {
                maxTop: 200
            },
            alpha: {
                maxTop: 200
            }
        }
    };

    HtmlElements.activateColorPicker = function (picker) {


        var colorPicker = $('#' + picker.id).colorpicker(HtmlElements.colorPickerOptions);

        colorPicker.on('change', function (e) {
            'use strict';

            var value = 'transparent';
            if (e.color.original.color !== "transparent") {
                value = e.color.toHexString();
            }

            eval('app.navigator.currentScreen.' + picker.options.method + '(\'' + picker.options.name + '\',value,this,' + HtmlElements.TYPE_COLORPICKER + ',null);');


        });


    };



    window.HtmlElements = HtmlElements;

}(window));