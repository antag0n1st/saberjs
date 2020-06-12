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

        // https://www.codeply.com/go/ji5ijk6yJ4/bootstrap-4-dropdown-submenu-on-hover-(navbar)

        var object = objects[0];

        var html = '<div id="contextMenu" >';
        html += '<nav class="navbar navbar-expand-md navbar-light bg-light" style="padding:0px;">';
        html += '<div class="collapse navbar-collapse" id="navbarNavDropdown">';
        html += '<ul class="navbar-nav">';
        html += '<li class="nav-item dropdown">';
        html += '<ul id="contextPanel" class="dropdown-menu" style="display:block;line-height:normal;">';
        // shell start

        if (object.hasLabel) {
            html += '<li id="contextEdit" class="dropdown-item" >';
            html += '<i class="fa fa-fw fa-lg fa-pencil"></i> ';
            html += '<span class="actionName">Edit Text</span>';
            html += '</li>';
        }

        html += '<li id="contextFindInTree" class="dropdown-item">';
        html += '<i class="fa fa-fw fa-lg fa-search"></i> ';
        html += '<span class="actionName">Find In Tree</span>';
        html += '';
        html += '</li>';

        //if (object instanceof ImageObject || object instanceof ButtonObject || object instanceof InputObject) {
        if (object.hasImage) {
            html += '<li id="contextChangeImage" class="dropdown-item" >';

            html += '<i class="fa fa-fw fa-lg fa-picture-o"></i> ';
            html += '<span class="actionName">Change Image</span>';

            html += '</li>';
        }



        html += '<li id="contextSaveAsPrefab" class="dropdown-item"  >';
        html += '<i class="fa fa-fw fa-lg fa-cube"></i> ';
        html += '<span class="actionName">Save as Prefab</span>';
        html += '</li>';


        html += '<li class="dropdown-divider" ></li>';

        if (object.hasLabel) {

            html += '<li id="contextSaveStyle" class="dropdown-item" onclick="app.navigator.currentScreen.htmlInterface.contextMenu.onContextSaveStyle();"  >';
            html += '<i class="fa fa-fw fa-lg fa-floppy-o"></i> ';
            html += '<span class="actionName">Save Style</span>';
            html += '</li>';

            html += '<li id="contextChooseStyle" class="dropdown-item" onclick="app.navigator.currentScreen.htmlInterface.contextMenu.onContextStyleSelect();"  >';
            html += '<i class="fa fa-fw fa-lg fa-paint-brush"></i> ';
            html += '<span class="actionName">Style Select</span>';
            html += '</li>';

        }


        if (this._onContextMenuBuild) {
            html = this._onContextMenuBuild(objects, html);
        }

        // shell end
        html += '</ul></li></ul></div></nav>';
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

        if (this._onContextMenuBind) {
            this._onContextMenuBind();
        }

        if (object.hasLabel) {
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

        // if (object instanceof ImageObject || object instanceof ButtonObject || object instanceof InputObject) {
        if (object.hasImage) {
            var contextChangeImage = document.getElementById('contextChangeImage');
            contextChangeImage.onclick = this.onContextChangeImage.bind(this);
        }

        var contextFindInTree = document.getElementById('contextFindInTree');
        contextFindInTree.onclick = this.onContextFindInTree.bind(this);

        var contextSaveAsPrefab = document.getElementById('contextSaveAsPrefab');
        contextSaveAsPrefab.onclick = this.onContextSaveAsPrefab.bind(this);

        this.htmlInterface.contextMenuHtml = document.getElementById('contextMenu');


    };

    HtmlContextMenu.prototype.open = function (point) {

//        if (this.editor.selectedObjects.length !== 1) {
//            return;
//        }

        this.build(this.editor.selectedObjects);

        var size = app.device.windowSize();
        var canvasPadding = Config.canvas_padding.split(' ');

        var w = size.width - canvasPadding[1] - canvasPadding[3];
        var h = size.height - canvasPadding[0] - canvasPadding[2];

        var x = point.x * (w / app.width) + 60;
        var y = point.y * (h / app.height) + 50;

        var m = this.htmlInterface.contextMenuHtml;


        this.htmlInterface.contextMenuHtml.style.display = 'block';
        var cp = document.getElementById('contextPanel')

        var h = cp.getBoundingClientRect().height;

        var yOffset = 0;

        if (y + h > size.height) {
            yOffset = size.height - (y + h);
        }

        this.htmlInterface.contextMenuHtml.style.left = x + 'px';
        this.htmlInterface.contextMenuHtml.style.top = y + yOffset + 'px';

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
        this.showSavePrefabDialog();
        this.close();
    };

    HtmlContextMenu.prototype.showSavePrefabDialog = function () {

        var id = 'prefabSaveDialog';
        var modal = document.getElementById(id);
        var isLocalDisplay = 'display:none';

        if (userInfo && userInfo.permissions && userInfo.permissions.indexOf("1") !== -1) {
            isLocalDisplay = 'display:block;';
        }

        if (!modal) {

            var modal = document.createElement("div");
            modal.id = id;
            modal.className = 'modal';
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('role', 'dialog');

            var method = 'app.navigator.currentScreen.htmlInterface.contextMenu.onSavePrefab(this);';

            var content = `
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Save Prefab</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            
            <div class="form-group">
                <input  id="prefab-name" type="text" class="form-control" placeholder="Name"  />
            </div>
            
            <div class="form-group">
              <textarea  style="margin-top:15px;" id="prefab-desc" class="form-control" placeholder="description" ></textarea>
            
            </div>
            
            <div class="form-group" style="${isLocalDisplay}">
                <label for="prefab-local" class="col-form-label">Local Save:</label>
                <input checked style="display: inline-block; width:20px;height:20px;margin-left:20px;cursor:pointer;" id="prefab-local" type="checkbox" class="form-control" />
            </div>
   
</div>
      <div class="modal-footer">
        <button type="button" onclick="${method}" class="btn btn-success" >Save</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>`;

            modal.innerHTML = content;

            document.body.appendChild(modal);
        }

        var name = document.getElementById('prefab-name');
        var desc = document.getElementById('prefab-desc');

        name.value = '';
        desc.value = '';


        $('#' + id).modal('show');

        name.focus();

    };

    HtmlContextMenu.prototype.onSavePrefab = function (event) {
        var prefab = this.createPrefab(this.editor.selectedObjects);
        this.savePrefab(prefab);
    };

    HtmlContextMenu.prototype.createPrefab = function (objects) {

        var centerPoint = new V();

        var container = new Entity();

        var left = objects[0].x;
        var right = objects[0].x;
        var top = objects[0].y;
        var bottom = objects[0].y;

        var parent = objects[0].parent;

        for (var i = 0; i < objects.length; i++) {

            var sampleObject = objects[i];

            if (!sampleObject.canPrefab) {
                toastr.warning("You can't save " + sampleObject.type + ' as Prefab');
                return;
            }

            if (sampleObject.x > right) {
                right = sampleObject.x;
            }

            if (sampleObject.x < left) {
                left = sampleObject.x;
            }

            if (sampleObject.y > bottom) {
                bottom = sampleObject.y;
            }

            if (sampleObject.y < top) {
                top = sampleObject.y;
            }

        }

        centerPoint.x = left + (right - left) / 2;
        centerPoint.y = top + (bottom - top) / 2;

        for (var i = 0; i < objects.length; i++) {
            var sampleObject = objects[i];
            sampleObject.x -= centerPoint.x;
            sampleObject.y -= centerPoint.y;
            container.addChild(sampleObject);
        }

        var sx = container.scale.x;
        var sy = container.scale.y;

        container.fitTo(90, 90);

        var bounds = container.getBounds();

        var renderTexture = PIXI.RenderTexture.create(bounds.width, bounds.height);

        var localP = new V().copy(container.position);
        var p = new V().copy(container.getGlobalPosition());

        var dx = -bounds.left + p.x;
        var dy = -bounds.top + p.y;

        container.position.set(dx, dy);
        app.pixi.renderer.render(container, renderTexture);
        container.position.set(localP.x, localP.y);

        var url = app.pixi.renderer.plugins.extract.base64(renderTexture);

        container.scale.x = sx;
        container.scale.y = sy;

        renderTexture.destroy(true);

        /////////////////////////////////////////////////////////

        var object = container.basicExport();

        object.prefabPreviewImageURL = url;


        for (var i = 0; i < objects.length; i++) {
            var sampleObject = objects[i];
            sampleObject.x += centerPoint.x;
            sampleObject.y += centerPoint.y;
            parent.addChild(sampleObject);
        }


        return object;

    };

    HtmlContextMenu.prototype.savePrefab = function (prefab) {

        var nameElement = document.getElementById('prefab-name');
        var descElement = document.getElementById('prefab-desc');

        var isLocal = document.getElementById('prefab-local').checked;

        nameElement.classList.remove('is-invalid');
        descElement.classList.remove('is-invalid');

        if (!nameElement.value) {
            nameElement.classList.add('is-invalid');
            return;
        }

        if (!descElement.value) {
            descElement.classList.add('is-invalid');
            return;
        }

        if (isLocal) {

            var prefabs = store.get('prefabs-' + ContentManager.baseURL);

            if (prefabs) {
                prefabs = JSON.parse(prefabs);
            } else {
                prefabs = [];
            }

            prefabs.push({
                name: nameElement.value,
                description: descElement.value,
                data: JSON.stringify(prefab),
                canDelete: true
            });
            var json = JSON.stringify(prefabs);

            store.set('prefabs-' + ContentManager.baseURL, json);
            toastr.success("Object was saved as Prefab.");

            this.editor.htmlInterface.onPrefabs();

            $('#prefabSaveDialog').modal('hide');


        } else {

            if (this.editor._onPrefabRemoteSave) {
                this.editor._onPrefabRemoteSave(nameElement.value, descElement.value, prefab);
            }

        }


    };



    HtmlContextMenu.prototype.onContextChangeImage = function () {

        this.close();

        var dom = document.getElementById('imageLibraryBrowseContent');

        var htmlLibrary = new HtmlLibrary(dom, this.editor, null);
        htmlLibrary.delegate = this;
        htmlLibrary.addFiles(app.libraryImages);
        htmlLibrary.show();

        htmlLibrary.displayContainer.style.height = '400px';

        var height = htmlLibrary.displayContainer.style.height;
        height = height.replace('px', '');
        height = Math.round(height);

        this.imageBrowser.style.display = 'block';

        var closeBtn = document.getElementById('closeImageBrowser');
        var that = this;
        closeBtn.onclick = function () {
            that.imageBrowser.style.display = 'none';
        };

    };

    HtmlContextMenu.prototype.onContextSaveStyle = function () {

        this.close();
        // lets add some options
        
        var el = document.getElementById('saveStyleInput');
        el.value = this.editor.selectedObjects[0].properties.styleName;

        $("#saveStyleModal").modal("show");

    };

    HtmlContextMenu.prototype.onContextStyleSelect = function () {
        this.close();

        var listObject = null;

        var selectedObject = this.editor.selectedObjects[0];

        if (selectedObject.type === "ButtonObject") {
            listObject = Styles.buttonStyles;
        } else {
            listObject = Styles.labelStyles;
        }

        var options = '<option value="0">Remove Style</option>';

        for (var prop in listObject) {
            if (Object.prototype.hasOwnProperty.call(listObject, prop)) {
                options += '<option value="' + prop + '">' + prop + '</option>';
            }
        }

        document.getElementById('styleOptions').innerHTML = options;

        $("#selectStyleModal").modal("show");

    };

    HtmlContextMenu.prototype.onLibraryItemClicked = function (event, library) {

        var id = event.target.id.replace(library.id + '_i_m_a_g_e_', '');

        event.preventDefault();

        this.closeImageBrowser();

        /// change the new image

        var object = this.editor.selectedObjects[0];

        object._setImage(id);

    };

    window.HtmlContextMenu = HtmlContextMenu;

}(window));