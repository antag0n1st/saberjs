(function (window, undefined) {


    function HtmlContextMenu(htmlInterface, editor) {
        this.initialize(htmlInterface, editor);
    }

    HtmlContextMenu.prototype.initialize = function (htmlInterface, editor) {

        this.htmlInterface = htmlInterface;
        this.editor = editor;

        this.imageBrowser = document.getElementById('imageBrowser');


    };

    HtmlContextMenu.prototype.build = function (objects) {



        var object = objects[0];

        var html = '';

        html += '<div id="contextMenu" class="dropdown bootstrapMenu">';
        html += '<ul class="dropdown-menu" style="position:static;display:block;font-size:0.9em;">';

        if (object instanceof LabelObject || object instanceof ButtonObject || object instanceof InputObject) {
            html += '<li role="presentation" >';
            html += '<a id="contextEdit" href="#" role="menuitem">';
            html += '<i class="fa fa-fw fa-lg fa-pencil"></i> ';
            html += '<span class="actionName">Edit Text</span>';
            html += '</a>';
            html += '</li>';
        }


        html += '<li role="presentation"  >';
        html += '<a id="contextFindInTree" href="#" role="menuitem">';
        html += '<i class="fa fa-fw fa-lg fa-search"></i> ';
        html += '<span class="actionName">Find In Tree</span>';
        html += '</a>';
        html += '</li>';

//        if (object instanceof ImageObject) {
//
//            html += '<li role="presentation" >';
//            html += '<a id="contextConvertToButton" href="#" role="menuitem">';
//            html += '<i class="fa fa-fw fa-lg fa-exchange"></i> ';
//            html += '<span class="actionName">Convert To Btn</span>';
//            html += '</a>';
//            html += '</li>';
//
//            html += '<li role="presentation" >';
//            html += '<a id="contextConvertToInput" href="#" role="menuitem">';
//            html += '<i class="fa fa-fw fa-lg fa-exchange"></i> ';
//            html += '<span class="actionName">Convert To Input</span>';
//            html += '</a>';
//            html += '</li>';
//
//        }

        if (object instanceof ImageObject || object instanceof ButtonObject || object instanceof InputObject) {
            html += '<li role="presentation" >';
            html += '<a id="contextChangeImage" href="#" role="menuitem">';
            html += '<i class="fa fa-fw fa-lg fa-picture-o"></i> ';
            html += '<span class="actionName">Change Image</span>';
            html += '</a>';
            html += '</li>';
        }

        html += '<li role="presentation"  >';
        html += '<a id="contextSaveAsPrefab" href="#" role="menuitem">';
        html += '<i class="fa fa-fw fa-lg fa-cube"></i> ';
        html += '<span class="actionName">Save as Prefab</span>';
        html += '</a>';
        html += '</li>';

        html += '</ul>';
        html += ' </div>';

        var container = document.createElement("div");
        container.innerHTML = html;
        var cm = container.getElementsByTagName('div')[0];
        var oldContextMenu = document.getElementById('contextMenu');
        if (oldContextMenu) {
            document.body.removeChild(oldContextMenu);
        }
        document.body.appendChild(cm);

        // bind events here
        if (object instanceof LabelObject || object instanceof ButtonObject || object instanceof InputObject) {
            var contextEdit = document.getElementById('contextEdit');
            contextEdit.onclick = this.onContextEditBtn.bind(this);
        }

//        if (object instanceof ImageObject) {
//
//            var contextConvertToButton = document.getElementById('contextConvertToButton');
//            contextConvertToButton.onclick = this.onContextConvertToBtn.bind(this);
//
//            var contextConvertToInput = document.getElementById('contextConvertToInput');
//            contextConvertToInput.onclick = this.onContextConvertToInput.bind(this);
//
//        }

        if (object instanceof ImageObject || object instanceof ButtonObject || object instanceof InputObject) {
            var contextChangeImage = document.getElementById('contextChangeImage');
            contextChangeImage.onclick = this.onContextChangeImage.bind(this);
        }

        var contextFindInTree = document.getElementById('contextFindInTree');
        contextFindInTree.onclick = this.onContextFindInTree.bind(this);

        var contextSaveAsPrefab = document.getElementById('contextSaveAsPrefab');
        contextSaveAsPrefab.onclick = this.onContextSaveAsPrefab.bind(this);

        this.htmlInterface.contextMenuHtml = document.getElementById('contextMenu');



        //        <li role="presentation" data-action="editDescription" class="disabled">
        //            <a href="#" role="menuitem">
        //                <i class="fa fa-fw fa-lg fa-pencil"></i> 
        //                <span class="actionName">Edit description</span>
        //            </a>
        //        </li>

        //        <li role="presentation" class="noActionsMessage disabled" style="display: none;">
        //            <a href="#" role="menuitem">
        //                <span>No available actions</span>
        //            </a>
        //        </li>

        //        <li class="divider"></li>

        //        <li role="presentation" data-action="setEditable" class="" style="">
        //            <a href="#" role="menuitem">
        //                <i class="fa fa-fw fa-lg fa-unlock"></i> 
        //                <span class="actionName">Set editable</span>
        //            </a>
        //        </li>


        //        <li role="presentation" class="noActionsMessage disabled" style="display: none;">
        //            <a href="#" role="menuitem">
        //                <span>No available actions</span>
        //            </a>
        //        </li>



    };

    HtmlContextMenu.prototype.open = function (point) {

        //TODO do the math to show it properly on the screen

        if (this.editor.selectedObjects.length !== 1) {
            return;
        }

        this.build(this.editor.selectedObjects);

        var size = app.device.windowSize();
        var canvasPadding = Config.canvas_padding.split(' ');
        
        var w = size.width - canvasPadding[1] - canvasPadding[3];
        var h = size.height - canvasPadding[0] - canvasPadding[2];

        var x = point.x * (w / app.width) + 60;
        var y = point.y * (h / app.height) + 50;

        this.htmlInterface.contextMenuHtml.style.display = 'block';
        this.htmlInterface.contextMenuHtml.style.left = x + 'px';
        this.htmlInterface.contextMenuHtml.style.top = y + 'px';

    };

    HtmlContextMenu.prototype.close = function () {

        if (this.htmlInterface.contextMenuHtml) {
            this.htmlInterface.contextMenuHtml.style.display = 'none';
        }

    };

    HtmlContextMenu.prototype.closeImageBrowser = function () {
        this.imageBrowser.style.display = 'none';
    };

    HtmlContextMenu.prototype.onContextEditBtn = function () {

        this.close();

        // only if the object is a label
        if (this.editor.selectedObjects[0] && this.editor.selectedObjects[0].label) {
            this.htmlInterface.htmlTopTools.showTextEdit(this.editor.selectedObjects[0]);
        }

    };

    HtmlContextMenu.prototype.onContextFindInTree = function () {
        this.close();

        var tree = this.editor.htmlInterface.tree;
        var object = this.editor.selectedObjects[0];

        if (this.editor.htmlInterface[ 'layersPanel'].style.display !== 'block') {
            this.editor.htmlInterface.activateTab('layers', function () {

                tree.selectNode(object, true);
            });
        } else {
            tree.selectNode(object, true);
        }

    };

    HtmlContextMenu.prototype.onContextConvertToBtn = function () {
        var object = this.editor.selectedObjects[0];

        this.editor.deselectAllObjects();

        var imageName = object.imageName;
        var p = new V().copy(object.position);

        var btn = new ButtonObject(imageName);
        btn.id = object.id;

        btn.position = p;

        btn.build();

        var batch = new CommandBatch();

        var deleteCommand = new CommandDelete(object, this.editor);
        var addCommand = new CommandAdd(btn, object.parent, this.editor);

        batch.add(addCommand);
        batch.add(deleteCommand);

        this.editor.commands.add(batch);

        this.editor.deselectAllObjects();
        this.editor.addObjectToSelection(btn);

        this.close();

    };

    HtmlContextMenu.prototype.onContextConvertToInput = function () {
        var object = this.editor.selectedObjects[0];

        this.editor.deselectAllObjects();

        var imageName = object.imageName;
        var p = new V().copy(object.position);

        var input = new InputObject(imageName);
        input.id = object.id;
        input.position = p;

        input.build();

        var batch = new CommandBatch();

        var deleteCommand = new CommandDelete(object, this.editor);
        var addCommand = new CommandAdd(input, object.parent, this.editor);

        batch.add(addCommand);
        batch.add(deleteCommand);

        this.editor.commands.add(batch);

        this.editor.deselectAllObjects();
        this.editor.addObjectToSelection(input);

        this.close();
    };

    HtmlContextMenu.prototype.onContextSaveAsPrefab = function () {

        if (this.editor.selectedObjects.length === 1) {

            var prefabs = store.get('prefabs-' + ContentManager.baseURL);

            if (prefabs) {
                prefabs = JSON.parse(prefabs);
            } else {
                prefabs = [];
            }

            var sampleObject = this.editor.selectedObjects[0];

            if (sampleObject instanceof PolygonObject) {
                var graphics = new PIXI.Graphics();
                sampleObject.draw(graphics);
                sampleObject = graphics;
            }

////////////////////////////////


            var object = this.editor.selectedObjects[0].export();

            var bounds = sampleObject.getBounds();
            var renderTexture = PIXI.RenderTexture.create(bounds.width, bounds.height);

            var localP = new V().copy(sampleObject.position);
            var p = new V().copy(sampleObject.getGlobalPosition());

            var dx = -bounds.left + p.x;
            var dy = -bounds.top + p.y;

            sampleObject.position.set(dx, dy);
            app.pixi.renderer.render(sampleObject, renderTexture);
            sampleObject.position.set(localP.x, localP.y);

            var url = app.pixi.renderer.plugins.extract.base64(renderTexture);

            renderTexture.destroy(true);

            /////////////////////////////////////////////////////////


            object.prefabPreviewImageURL = url;

            prefabs.push(object);
            var json = JSON.stringify(prefabs);

            store.set('prefabs-' + ContentManager.baseURL, json);

            toastr.success("Object was saved as Prefab.");

            this.editor.htmlInterface.onPrefabs();

        } else {
            toastr.error("Only one selected object can be saved as Prefabs.");
        }

        this.close();
    };

    HtmlContextMenu.prototype.onContextChangeImage = function () {


        this.close();

        var dom = document.getElementById('imageLibraryBrowseContent');

        var htmlLibrary = new HtmlLibrary(dom, this.editor, null);
        htmlLibrary.delegate = this;
        htmlLibrary.addFiles(app.libraryImages);
        htmlLibrary.show();

        var height = htmlLibrary.displayContainer.style.height;
        height = height.replace('px', '');
        height = Math.round(height);

        this.imageBrowser.style.height = (height + 30) + 'px';
        this.imageBrowser.style.top = '75px';
        this.imageBrowser.style.left = '25px';

        this.imageBrowser.style.display = 'block';

        var closeBtn = document.getElementById('closeImageBrowser');
        var that = this;
        closeBtn.onclick = function () {
            that.imageBrowser.style.display = 'none';
        };

    };

    HtmlContextMenu.prototype.onLibraryItemClicked = function (event, library) {

        var id = event.target.id.replace(library.id + '_i_m_a_g_e_', '');

        event.preventDefault();

        this.closeImageBrowser();

        /// change the new image

        var object = this.editor.selectedObjects[0];


        if (object.imageName) {

            var sx = object.scale.x;
            var sy = object.scale.y;

            var texture = PIXI.utils.TextureCache[id];
            object.setTexture(id);

            object.width = texture.width;
            object.height = texture.height;



            if (object.updateSize) {
                object.scale.set(sx, sy);
                object.updateSize();
            } else {

                object.setSensorSize(object.width, object.height);

                object._sensorTranslationX = 0;
                object._sensorTranslationY = 0;
                object._sensorTranslationScaleX = sx;
                object._sensorTranslationScaleY = sy;
                object._sensorRotation = 0;
                object.updateFrame();

                object.scale.set(sx, sy);

            }

            object.updateFrame();

        } else if (object.background) {
            // update the nine slice

            object.backgroundName = id;
            object.background.imageName = id;
            object.background.buildBackground();

        }

    };

    window.HtmlContextMenu = HtmlContextMenu;

}(window));