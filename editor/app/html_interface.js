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

        this.tabs = ['commonProperties', 'properties', 'layers', 'objectsGalery', 'imageLibrary', 'prefabs', 'settings'];

        this.createTabs();
        this.bindHTML();


        this.imagesLibrary = new HtmlLibrary(this.imageLibraryContent, this.editor, 'dropImage');
        this.imagesLibrary.heightOffset = -55;

        this.imagesSearchInput = document.getElementById('images-search-input');
        this.imagesSearchInput.onkeyup = this.onImagesSearch.bind(this);

        this.objectsGalery = new HtmlLibrary(this.objectsGaleryContent, this.editor, 'dropObject');
        this.objectsGalery.addFiles([
            {name: "LabelObject", url: 'assets/images/_text_icon.png'},
            {name: "ButtonObject", url: 'assets/images/_button.png'},
            {name: "InputObject", url: 'assets/images/_input_field_icon.png'},
            {name: "ContainerObject", url: 'assets/images/_container.png'},
            {name: "ViewComponentObject", url: 'assets/images/_view_icon.png'},
            {name: "NineSliceObject", url: 'assets/images/_nine_slice_icon.png'},
            {name: "TilingSpriteObject", url: 'assets/images/_tile_icon.png'},
            {name: "GenericObject", url: 'assets/images/_cube.png'},
        ]);

        this.prefabs = new HtmlLibrary(this.prefabsContent, this.editor, 'dropPrefab');
        this.prefabs.heightOffset = -55;
        this.prefabs.itemsImageScale = false;
        this.prefabs.onDeleteButton = this.onDeletePrefab.bind(this);

        this.prefabSearchInput = document.getElementById('prefab-search-input');
        this.prefabSearchInput.onkeyup = this.onPrefabsSearch.bind(this);

        this.tree = new LayersTree(this.editor, this);

        this.activeTabName = '';

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



        // textUpdatePanel
        this.dragElement(document.getElementById('textUpdatePanel'));
        this.dragElement(document.getElementById('imageBrowser'));



        // SETTINGS PANEL

        // LAYERS

        this.addLayerBtn = document.getElementById('addLayerBtn');
        this.addLayerBtn.onclick = this.onAddLayerBtn.bind(this);

        this.addCustomPropertyBtn = document.getElementById('addCustomPropertyBtn');
        this.addCustomPropertyBtn.onclick = this.onAddCustomPropertyBtn.bind(this);

        this.addGuideLineBtn = document.getElementById('addGuideLineBtn');
        this.addGuideLineBtn.onclick = this.onAddGuideLineBtn.bind(this);

        this.addLayoutBtn = document.getElementById('addLayoutBtn');
        this.addLayoutBtn.onclick = this.onAddLayoutBtn.bind(this);

        $("#newLayoutModal").on('shown.bs.modal', function () {
            $('#layoutNameInput').focus();
        });

        $("#saveStyleModal").on('shown.bs.modal', function () {
            $('#saveStyleInput').focus();
        });

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
        var libraryID = data.getData('library_id');

        if (action === 'dropImage') {
            var id = data.getData('id').replace(libraryID + '_i_m_a_g_e_', '');
            this.editor.onLibraryImageDropped(id);
        } else if (action === 'dropObject') {
            var id = data.getData('id').replace(libraryID + '_i_m_a_g_e_', '');
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

        this.activeTabName = name;

    };

    HtmlInterface.prototype.onImageLibrary = function () {
        this.imagesSearchInput.value = '';
        this.imagesLibrary.filter('');
        this.imagesLibrary.show();
    };

    HtmlInterface.prototype.onCommonProperties = function () {
        this.editor.propertiesBinder.bindSelected();

    };

    HtmlInterface.prototype.onProperties = function () {

        if (this.editor.selectedObjects.length) {

            if (this.editor.selectedObjects.length === 1) {
                this.editor.selectedObjects[0].bindProperties(this.editor);
            } else if (this.editor.selectedObjects.length > 1) {
                // they should remain 

                var isSame = true;
                var type = this.editor.selectedObjects[0].type;
                for (var i = 0; i < this.editor.selectedObjects.length; i++) {
                    var o = this.editor.selectedObjects[i];
                    if (o.type !== type) {
                        isSame = false;
                        break;
                    }
                }

                this.editor.htmlInterface.propertiesContent.innerHTML = '';

                if (isSame) {

                    this.editor.selectedObjects[0].bindProperties(this.editor);
                    this.editor.selectedObjects[0].bindCommonProperties(this.editor);

                }


            }

        }

    };

    HtmlInterface.prototype.onSettings = function () {


        var html = '';


        html += HtmlElements.createSection("Layouts").html;

        var buttonOpt = {name: 'new_layout', displayName: 'New Layout', class: 'btn-info big', method: 'newLayout', icon: 'fa fa-plus', style: 'margin-top:5px;'};
        html += HtmlElements.createButton(buttonOpt).html;

        if (editorConfig.features.exportToFiles) {

            html += '<div class="big" >';
            html += '<label>Open:</label> ';
            html += '<select id="selectJSON" class="form-control">';
            html += '</select>';
            html += '</div>';

            html += '<div class="big">';
            html += '<input id="exportFileName" type="text" class="form-control" />';
            html += '<button id="exportBtn" class="btn btn-info" style="margin-left:5px;"><i class="fa fa-arrow-up"></i> Export</button>';
            html += '</div>';

        }

        html += '<div class="big">';
        html += '<button id="clearAll" class="btn btn-danger"><i class="fa fa-trash"></i> Clear All</button>';
        html += '</div>';



        html += HtmlElements.createSection('Editor').html;

        html += '<div class="big  "><label>Preview: </label> <input class="form-control" style="" id="previewScreenInput" type="text" value="' + this.editor.previewScreenName + '" onkeyup="app.navigator.currentScreen.changePreviewScreen(\'preview-screen\',this.value,this,0,\'previewScreenInput\');"></div>';


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

        var buttonOpt = {name: 'add-guide', displayName: 'Add Guide', class: 'btn-info big', method: 'addGuideLine', icon: 'fa fa-plus', style: 'margin-top:5px;'};
        html += HtmlElements.createButton(buttonOpt).html;

        document.getElementById('settingsContent').innerHTML = html;

        HtmlElements.activateColorPicker(colorPicker);

        var that = this;
        this.clearAll = document.getElementById('clearAll');
        this.clearAll.onclick = this.onClearAll.bind(this);


        if (editorConfig.features.exportToFiles) {

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
        this.prefabSearchInput.value = '';

        var prefabs = store.get('prefabs-' + ContentManager.baseURL);

        if (prefabs) {
            prefabs = JSON.parse(prefabs);

            var files = [];

            if (prefabs.length) {
                files.push({isSection: true, name: "Local"});
            }


            for (var i = 0; i < prefabs.length; i++) {

                var prefab = prefabs[i];
                var object = JSON.parse(prefab.data);
                var url = object.prefabPreviewImageURL;

                var file = {
                    name: object.type + "-" + i,
                    url: url,
                    title: prefab.name,
                    data: {
                        index: i,
                        remote: false
                    },
                    canDelete: true,
                    description: prefab.description
                };

                files.push(file);
            }

            // set separator
            if (this.editor.remotePrefabs.length) {
                files.push({isSection: true, name: "Remote"});
            }

            for (var i = 0; i < this.editor.remotePrefabs.length; i++) {

                var prefab = this.editor.remotePrefabs[i];
                var object = JSON.parse(prefab.data);
                var url = object.prefabPreviewImageURL;

                var file = {
                    name: object.type + "-" + i,
                    url: url,
                    title: prefab.name,
                    data: {
                        index: i,
                        remote: true
                    },
                    canDelete: false,
                    description: prefab.description
                };

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

            if (editorConfig.features.exportToFiles) {
                document.getElementById('exportFileName').value = '';
            }

        }
    };

    HtmlInterface.prototype.onExportBtn = function () {
        var that = this;
        this.saveCurrentContent(function () {
            that.onSettings();
        });
    };

    HtmlInterface.prototype.saveCurrentContent = function (callback, hideMessage) {

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

        var layoutType = '';

        if (document.getElementById('layoutType') && document.getElementById('layoutType').value) {
            layoutType = document.getElementById('layoutType').value;
        } else {
            layoutType = this.editor.importer.layoutType || 'screen';
        }

        ////////////////////////////////////////////////////////////////////////


        ////////////////////////////////////////////////////////////////////////

        this.editor.importer.fileName = fileName;
        data.fileName = fileName;
        data.previewScreenName = this.editor.previewScreenName;
        data.layoutType = layoutType;

        // attach extra data here
        var sendData = {
            file_name: fileName,
            data: JSON.stringify(data)
        };

        var exportURL = editorConfig.export.url;

        var cURLs = editorConfig.export.callback.slice();

        function callMeBack(msg) {
            if (cURLs.length) {
                var url = cURLs.shift();
                ajaxGet(url, function (response) {
                    callMeBack(msg);
                });
            } else {
                if (!hideMessage) {
                    toastr.success(msg);
                }
                if (callback) {
                    callback();
                }
            }
        }

        ajaxPost(exportURL, sendData, function (response) {
            var msg = response.message;
            callMeBack(msg);
        });

        var jsonString = JSON.stringify(data);

        store.set(ContentManager.baseURL + 'editor-saved-content', jsonString);

        ContentManager.jsons[fileName.replace('.json', '')] = data;

    };

//    HtmlInterface.prototype.onImportJSONBtn = function (evt) {
//
//        var files = evt.target.files; // FileList object        
//
//        var importer = this.editor.importer;
//        importer.clearStage();
//
//        for (var i = 0, f; f = files[i]; i++) {
//
//            // Only process image files.
//            if (!f.name.endsWith('.json')) {
//                toastr.error('Please select a JSON file!');
//                break;
//            }
//
//            var reader = new FileReader();
//            document.getElementById('exportFileName').value = f.name;
//
//            // Closure to capture the file information.
//            reader.onload = (function (theFile) {
//                return function (e) {
//                    var data = JSON.parse(e.target.result);
//                    importer.import(data);
//                    toastr.success('File Imported with success.');
//                };
//            })(f);
//
//            // Read in the image file as a data URL.
//            reader.readAsText(f);
//        }
//    };

    HtmlInterface.prototype.onSelectJSON = function (e) {
        if (this.selectJSON.value) {

            var importer = this.editor.importer;
            importer.clearStage();

            document.getElementById('exportFileName').value = '';
            document.getElementById('previewScreenInput').value = '';
            document.getElementById('layoutType').value = '';

            if (this.selectJSON.value != 0) {
                var editor = this.editor;
                ajaxGet(this.selectJSON.value, function (response) {
                    if (response) {
                        importer.import(response);
                        document.getElementById('exportFileName').value = importer.data.fileName;
                        document.getElementById('previewScreenInput').value = importer.data.previewScreenName || '';
                        document.getElementById('layoutType').value = importer.data.layoutType || '';
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
            document.getElementById('layerFactor').value = '1';
            document.getElementById('layerID').value = '';
            document.getElementById('layerInputContent').checked = true;
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

    HtmlInterface.prototype.onAddLayoutBtn = function () {

        var formElement = document.getElementById('newLayoutForm');

        var form = new FormData(formElement);
        var name = form.get("name");
        var type = form.get("type");


        this.editor.importer.clearStage();
        this.editor.setDefaultLayer();

        
        document.getElementById('previewScreenInput').value = '';
        this.editor.previewScreenName = '';
        document.getElementById('exportFileName').value = name;
        document.getElementById('layoutType').value = type;

        var that = this;
        this.saveCurrentContent(function () {
            that.onSettings();
        });

        $("#newLayoutModal").modal('hide');

        return false;
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

    HtmlInterface.prototype.onImagesSearch = function (event) {
        this.imagesLibrary.filter(this.imagesSearchInput.value);
    };


    HtmlInterface.prototype.onPrefabsSearch = function (event) {
        this.prefabs.filter(this.prefabSearchInput.value);
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