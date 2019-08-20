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

        var html = '<div id="contextMenu" class="contextMenu" >';
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
            this.htmlInterface.textEditor.showTextEdit(this.editor.selectedObjects[0]);
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
        this.editor.htmlInterface.prefabExplorer.show();
        this.close();
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

    HtmlContextMenu.prototype.onLibraryItemClicked = function (event, library) {
        
        var id = event.target.dataset.id;
        
        var data = library.getItemByID(id);      

        event.preventDefault();

        this.closeImageBrowser();

        var object = this.editor.selectedObjects[0];

        object._setImage(data.name);

    };

    window.HtmlContextMenu = HtmlContextMenu;

}(window));