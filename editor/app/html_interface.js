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

        this.importJSONBtn = document.getElementById('importJSONBtn');
        this.importJSONBtn.onchange = this.onImportJSONBtn.bind(this);

        // textUpdatePanel
        this.dragElement(document.getElementById('textUpdatePanel'));



        // SETTINGS PANEL

//        this.saveContent = document.getElementById('saveContent');
//        this.saveContent.onclick = this.onSaveContent.bind(this);

        this.clearAll = document.getElementById('clearAll');
        this.clearAll.onclick = this.onClearAll.bind(this);

        this.exportBtn = document.getElementById('exportBtn');
        this.exportBtn.onclick = this.onExportBtn.bind(this);

        this.selectJSON = document.getElementById('selectJSON');
        this.selectJSON.onchange = this.onSelectJSON.bind(this);

        var that = this;

        ajaxGet(ContentManager.baseURL + 'app/php/json-files.php', function (response) {
            var html = '<option value="0" >none</option>';
            for (var i = 0; i < response.length; i++) {
                var file = response[i];
                html += '<option value="' + file.url + '" >' + file.name + '</option>';
            }
            that.selectJSON.innerHTML = html;
        });

        // LAYERS

        this.addLayerBtn = document.getElementById('addLayerBtn');
        this.addLayerBtn.onclick = this.onAddLayerBtn.bind(this);

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

    HtmlInterface.prototype.onLayers = function (callback) {
        // create layers tree
        this.tree.build(callback);
    };

    HtmlInterface.prototype.onObjectsGalery = function () {
        this.objectsGalery.show();
    };

    HtmlInterface.prototype.onPrefabs = function () {

        // set files to the galery

        var prefabs = store.get('prefabs');

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

        var prefabs = store.get('prefabs');
        prefabs = JSON.parse(prefabs);
        prefabs.splice(index, 1);

        var json = JSON.stringify(prefabs);
        store.set('prefabs', json);

        this.onPrefabs();
    };

    // called when the clear button in the settings panel is clicked
    HtmlInterface.prototype.onClearAll = function () {
        var r = confirm("Are you sure ?");
        if (r === true) {
            this.editor.importer.clearStage();
            this.editor.setDefaultLayer();
        }
    };

    // called when the save button is clicked
    HtmlInterface.prototype.onSaveContent = function () {

        var data = this.editor.importer.export();

        var jsonString = JSON.stringify(data);

        store.set(ContentManager.baseURL + 'editor-saved-content', jsonString);

        /// toastr.success('The content was saved into browsers memory', "Local Save!");

    };

    HtmlInterface.prototype.onExportBtn = function () {
        this.saveCurrentContent();

    };

    HtmlInterface.prototype.saveCurrentContent = function () {
        var data = this.editor.importer.export();

        var fileName = document.getElementById('exportFileName').value;

        if (!fileName) {
            toastr.error("Please specify a file name");
            this.activateTab('settings');
            return;
        }

        if (!fileName.endsWith('.json')) {
            fileName += '.json';
            document.getElementById('exportFileName').value = fileName;
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

    HtmlInterface.prototype.onSelectJSON = function () {
        if (this.selectJSON.value) {

            var importer = this.editor.importer;
            importer.clearStage();


            var editor = this.editor;
            ajaxGet(this.selectJSON.value, function (response) {
                if (response) {
                    importer.import(response);
                } else {
                    editor.setDefaultLayer();
                }
            });
        }
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