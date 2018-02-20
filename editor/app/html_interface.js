(function (window, undefined) {


    function HtmlInterface(editor) {
        this.initialize(editor);
    }

    HtmlInterface.prototype.initialize = function (editor) {
        this.editor = editor;

        this.htmlTopTools = new HtmlTopTools(this.editor);


        this.contextMenu = new HtmlContextMenu(this, this.editor);

        app.pixi.renderer.view.ondrop = this.canvasDrop.bind(this);
        app.pixi.renderer.view.ondragover = this.canvasAllowDrop.bind(this);

        this.tabs = ['imageLibrary', 'commonProperties', 'settings', 'layers', 'properties', 'prefabs', 'objectsGalery'];

        this.createTabs();
        this.bindHTML();

        this.htmlLibrary = new HtmlLibrary(this.imageLibraryContent, this.editor, 'dropImage');

        this.objectsGalery = new HtmlLibrary(this.objectsGaleryContent, this.editor, 'dropObject');
        this.objectsGalery.addFiles([
            {name: "LabelObject", url: 'assets/images/_text_icon.png'},
            {name: "ContainerObject", url: 'assets/images/_container.png'},
            {name: "GenericObject", url: 'assets/images/_cube.png'}
        ]);


        this.prefabs = new HtmlLibrary(this.prefabsContent, this.editor, 'dropPrefab');
        this.prefabs.canDeleteObjects = true;
        this.prefabs.onDeleteButton = this.onDeletePrefab.bind(this);

        //TODO set data to objects galery
        this.tree = new LayersTree(this.editor, this);

    };

    HtmlInterface.prototype.createTabs = function () {
        for (var i = 0; i < this.tabs.length; i++) {

            var name = this.tabs[i];
            this[name + 'Tab'] = document.getElementById(name + 'Tab');
            this[name + 'Panel'] = document.getElementById(name + 'Panel');
            this[name + 'Content'] = document.getElementById(name + 'Content');
            var eventName = 'on' + name.capitalize();

            if (!this[eventName]) {
                // create a default event 
                this[eventName] = function () {};
            }

            (function (name, that) {
                this[name + 'Tab'].onclick = (function () {
                    this.activateTab(name);
                }).bind(that);
            })(name, this);

        }
    };

    HtmlInterface.prototype.bindHTML = function () {

        this.htmlTopTools.bindHTML();

        // GLOBAL

        this.contextMenuHtml = document.getElementById('contextMenu');
        this.sideToolbarPanel = document.getElementById('sideToolbarPanel');

        this.localFileLoaderBtn = document.getElementById('localFileLoaderBtn');
        this.localFileLoaderBtn.onchange = this.onLocalFileLoaderBtn.bind(this);



        // textUpdatePanel
        this.dragElement(document.getElementById('textUpdatePanel'));



        // SETTINGS PANEL

//        this.saveContent = document.getElementById('saveContent');
//        this.saveContent.onclick = this.onSaveContent.bind(this);



        // LAYERS

        this.addLayerBtn = document.getElementById('addLayerBtn');
        this.addLayerBtn.onclick = this.onAddLayerBtn.bind(this);

        this.addCustomPropertyBtn = document.getElementById('addCustomPropertyBtn');
        this.addCustomPropertyBtn.onclick = this.onAddCustomPropertyBtn.bind(this);

        this.addGuideLineBtn = document.getElementById('addGuideLineBtn');
        this.addGuideLineBtn.onclick = this.onAddGuideLineBtn.bind(this);



    };

    ////////////////////////////////// DRAG & DROP /////////////////////////////

    HtmlInterface.prototype.canvasAllowDrop = function (ev) {
        ev.preventDefault();
    };

    HtmlInterface.prototype.canvasDrop = function (ev) {

        ev.preventDefault();

        var p = app.input.getMousePoint(ev);
        app.input.mapPointLocation(p.x, p.y);

        var data = ev.dataTransfer;
        var action = data.getData('action');

        if (action === 'dropImage') {
            var id = data.getData('id').replace('_i_m_a_g_e_', '');
            this.editor.onLibraryImageDropped(id);
        } else if (action === 'dropLabel') {
            this.editor.onLabelDropped();
        } else if (action === 'dropObject') {
            var id = data.getData('id').replace('_i_m_a_g_e_', '');
            this.editor.onGalleryObjectDropped(id);
        } else if (action === 'dropPrefab') {
            this.editor.onPrefabDropped(data);
        }

    };

    ////////////// TAB METHODS

    HtmlInterface.prototype.hideAllPanels = function () {
        for (var i = 0; i < this.tabs.length; i++) {
            var name = this.tabs[i];
            this[name + 'Panel'].style.display = 'none';
        }
    };

    HtmlInterface.prototype.deactiveAllTabs = function () {
        for (var i = 0; i < this.tabs.length; i++) {
            var name = this.tabs[i];
            this[name + 'Tab'].className = this[name + 'Tab'].className.replace(/\bactive\b/g, "");
        }
    };

    HtmlInterface.prototype.activateTab = function (name, callback) {
        this.deactiveAllTabs();
        this.hideAllPanels();
        this[name + 'Tab'].className += ' active';
        this[name + 'Panel'].style.display = 'block';
        this['on' + name.capitalize()](callback);
    };

    HtmlInterface.prototype.onImageLibrary = function () {
        this.htmlLibrary.show();
    };

    HtmlInterface.prototype.onCommonProperties = function () {
        this.editor.propertiesBinder.bindSelected();

    };

    HtmlInterface.prototype.onProperties = function () {

        if (this.editor.selectedObjects.length) {

            if (this.editor.selectedObjects.length === 1) {
                this.editor.selectedObjects[0].bindProperties(this.editor);
            }

        }

    };

    HtmlInterface.prototype.onSettings = function () {


        var html = '';

        html += '<div class="big">';
        html += '<input id="exportFileName" type="text" class="form-control" />';
        html += '<div id="exportBtn" class="btn btn-info"><i class="fa fa-arrow-up"></i>Export</div>';
        html += '</div>';

        html += ' <div class="big" style="display: block;">';
        html += '<label>Import</label>';
        html += '<input id="importJSONBtn" type="file" class="form-control" />';
        html += '</div>';

        html += '<div class="big" >';
        html += '<label>Import:</label>';
        html += '<select id="selectJSON" class="form-control">';
        html += '</select>';
        html += '</div>';

        html += '<div class="big">';
        html += '<div id="clearAll" class="btn btn-danger"><i class="fa fa-trash"></i>Clear All</div>';
        html += '</div>';



        html += HtmlElements.createSection('Editor').html;

        var tintColor = store.get('tint-' + ContentManager.baseURL) || 0xffffff;
        var colorPickerOpt = {
            name: 'background-tint',
            displayName: 'Bg. Color',
            class: 'big',
            value: PIXI.utils.hex2string(tintColor),
            method: 'onBackgroundTintChanged'
        };

        var colorPicker = HtmlElements.createColorPicker(colorPickerOpt);

        html += colorPicker.html;

        html += HtmlElements.createSection('Guides').html;

        for (var i = 0; i < this.editor.guideLines.length; i++) {
            var guide = this.editor.guideLines[i];

            for (var key in guide) {
                if (guide[key]) {
                    var opt0 = {displayName: key + ' ', name: key, value: guide[key], method: 'blank', class: 'big', isDisabled: true, buttonClass: 'btn-danger fa fa-trash', buttonAction: 'onGuideLineDelete'};
                    html += HtmlElements.createInput(opt0).html;
                }
            }

        }

        var buttonOpt = {name: 'add-guide', displayName: 'Add Guide', class: 'btn-info big', method: 'addGuideLine', icon: 'fa fa-plus'};
        html += HtmlElements.createButton(buttonOpt).html;

        document.getElementById('settingsContent').innerHTML = html;

        HtmlElements.activateColorPicker(colorPicker);

        var that = this;
        this.clearAll = document.getElementById('clearAll');
        this.clearAll.onclick = this.onClearAll.bind(this);

        this.exportBtn = document.getElementById('exportBtn');
        this.exportBtn.onclick = this.onExportBtn.bind(this);

        this.selectJSON = document.getElementById('selectJSON');
        this.selectJSON.onchange = this.onSelectJSON.bind(this);

        var fileName = this.editor.importer.fileName || '';
        document.getElementById('exportFileName').value = fileName;

        fileName = fileName.replace('.json', '');

        ajaxGet(ContentManager.baseURL + 'app/php/json-files.php', function (response) {
            var html = '<option value="0" >none</option>';
            for (var i = 0; i < response.length; i++) {
                var file = response[i];
                var selected = '';
                if (fileName === file.name) {
                    selected = 'selected="selected"';
                }
                html += '<option ' + selected + ' value="' + file.url + '" >' + file.name + '</option>';
            }
            that.selectJSON.innerHTML = html;
        });



    };

    HtmlInterface.prototype.onLayers = function (callback) {
        // create layers tree
        this.tree.build(callback);
    };

    HtmlInterface.prototype.onObjectsGalery = function () {
        this.objectsGalery.show();
    };

    HtmlInterface.prototype.onPrefabs = function () {

        // set files to the galery

        var prefabs = store.get('prefabs-' + ContentManager.baseURL);

        if (prefabs) {
            prefabs = JSON.parse(prefabs);

            var files = [];

            for (var i = 0; i < prefabs.length; i++) {
                var prefab = prefabs[i];

                var url = prefab.prefabPreviewImageURL;

                var file = {name: prefab.type + "-" + i, url: url, data: {
                        index: i
                    }};

                files.push(file);
            }

            this.prefabs.addFiles(files);

            this.prefabs.show();

        }


    };

    ////////////////////////////////// BIND METHODS
    HtmlInterface.prototype.onDeletePrefab = function (e) {

        var index = e.target.dataset.index;

        var prefabs = store.get('prefabs-' + ContentManager.baseURL);
        prefabs = JSON.parse(prefabs);
        prefabs.splice(index, 1);

        var json = JSON.stringify(prefabs);
        store.set('prefabs-' + ContentManager.baseURL, json);

        this.onPrefabs();
    };

    // called when the clear button in the settings panel is clicked
    HtmlInterface.prototype.onClearAll = function () {
        var r = confirm("Are you sure ?");
        if (r === true) {
            this.editor.importer.clearStage();
            this.editor.setDefaultLayer();
            document.getElementById('exportFileName').value = '';
        }
    };

    // called when the save button is clicked
    HtmlInterface.prototype.onSaveContent = function () {

        var data = this.editor.importer.export();

        if (!data) {
            toastr.error("Can't save this. You have a missing image.");
        } else {
            var jsonString = JSON.stringify(data);

            store.set(ContentManager.baseURL + 'editor-saved-content', jsonString);
        }



        /// toastr.success('The content was saved into browsers memory', "Local Save!");

    };

    HtmlInterface.prototype.onExportBtn = function () {
        this.saveCurrentContent();

    };

    HtmlInterface.prototype.saveCurrentContent = function () {

        var data = this.editor.importer.export();

        if (!data) {
            toastr.error("Can't save this. You have a missing image.");
            return;
        }

        var fileName = '';

        if (document.getElementById('exportFileName') && document.getElementById('exportFileName').value) {
            fileName = document.getElementById('exportFileName').value;
        } else {
            fileName = this.editor.importer.fileName;
        }

        if (!fileName) {
            toastr.error("Please specify a file name");
            this.activateTab('settings');
            return;
        }

        if (!fileName.endsWith('.json')) {
            fileName += '.json';

            this.editor.importer.fileName = fileName;
            if (document.getElementById('exportFileName')) {
                document.getElementById('exportFileName').value = fileName;
            }
        }

        var sendData = {
            file_name: fileName,
            data: JSON.stringify(data)

        };

        ajaxPost('app/php/export.php', sendData, function (response) {
            var msg = response.message;

            ajaxGet('../tools/assets.php', function (response) {
                toastr.success(msg);
            });

        });



        this.onSaveContent();
    };

    HtmlInterface.prototype.onLocalFileLoaderBtn = function (e) {
        this.editor.localReader.selectFolder(e);
    };

    HtmlInterface.prototype.onImportJSONBtn = function (evt) {

        var files = evt.target.files; // FileList object        

        var importer = this.editor.importer;
        importer.clearStage();

        for (var i = 0, f; f = files[i]; i++) {

            // Only process image files.
            if (!f.name.endsWith('.json')) {
                toastr.error('Please select a JSON file!');
                break;
            }

            var reader = new FileReader();
            document.getElementById('exportFileName').value = f.name;

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    var data = JSON.parse(e.target.result);
                    importer.import(data);
                    toastr.success('File Imported with success.');
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    };

    HtmlInterface.prototype.onSelectJSON = function (e) {
        if (this.selectJSON.value) {

            var importer = this.editor.importer;
            importer.clearStage();

            document.getElementById('exportFileName').value = '';

            if (this.selectJSON.value != 0) {
                var editor = this.editor;
                ajaxGet(this.selectJSON.value, function (response) {
                    if (response) {
                        importer.import(response);
                        document.getElementById('exportFileName').value = importer.data.fileName;
                    } else {
                        editor.setDefaultLayer();
                    }

                });
            } else {
                this.editor.setDefaultLayer();
            }

        }

        e.target.blur();

    };

    HtmlInterface.prototype.onAddLayerBtn = function () {
        var name = document.getElementById('layerName').value;
        var factor = document.getElementById('layerFactor').value;
        var id = document.getElementById('layerID').value;
        var isLayerInputContent = document.getElementById('layerInputContent').checked;

        if (name && factor) {

            this.editor.addLayer(name, factor, id, isLayerInputContent);

            $("#addLayerModal").modal('hide');

            document.getElementById('layerName').value = '';
            document.getElementById('layerFactor').value = '';
            document.getElementById('layerID').value = '';
            document.getElementById('layerInputContent').checked = false;
        }

    };

    HtmlInterface.prototype.onAddCustomPropertyBtn = function () {


        var key = document.getElementById('customPropertyKey').value;
        var value = document.getElementById('customPropertyValue').value;

        if (this.editor.selectedObjects.length === 1) {

            // check if that property exists

            for (var i = 0; i < this.editor.selectedObjects[0].properties._custom.length; i++) {
                var prop = this.editor.selectedObjects[0].properties._custom[i];
                if (prop.key === key) {
                    toastr.error('There is already a property with the same Key.');
                    return;
                }
            }

            var o = {
                key: key,
                value: value
            };
            this.editor.selectedObjects[0].properties._custom.push(o);

            this.editor.selectedObjects[0].bindProperties(this.editor);
        }

        document.getElementById('customPropertyKey').value = '';
        document.getElementById('customPropertyValue').value = '';

        $("#addCustomPropertyModal").modal('hide');
    };

    HtmlInterface.prototype.onAddGuideLineBtn = function () {

        // guideLineAxis
        // guideLineValue

        var orientation = document.getElementById('guideLineAxis').value;
        var value = document.getElementById('guideLineValue').value;
        value = Math.round(value);

        if (value) {
            var guide = {};
            guide[orientation] = value;

            // add the guide

            for (var i = 0; i < this.editor.guideLines.length; i++) {
                var g = this.editor.guideLines[i];
                if (g[orientation] === value) {
                    toastr.error('Duplicate Guide Line value');
                    return;
                }
            }

            this.editor.guideLines.push(guide);

            document.getElementById('guideLineValue').value = '';

            $("#addGuidesModal").modal('hide');

            this.activateTab('settings');

            var json = JSON.stringify(this.editor.guideLines);
            store.set('guideLines-' + ContentManager.baseURL, json);

        } else {
            toastr.error('Invalid Guide Line value');
        }


    };

    HtmlInterface.prototype.dragElement = function (elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "Header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    };

    /// align elements

    window.HtmlInterface = HtmlInterface;

}(window));