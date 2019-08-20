(function (window, undefined) {

    function PrefabExplorer(editor) {
        this.initialize(editor);
    }

    PrefabExplorer.MODE_SAVE = 0;
    PrefabExplorer.MODE_EDIT = 1;

    PrefabExplorer.prototype.initialize = function (editor) {

        this.editor = editor;
        this.selectedItem = null;
        this.browser = null;
        this.contextMenu = null;

        this.mode = PrefabExplorer.MODE_SAVE;

        document.getElementById('prefabs-explorer').onclick = this.onEditPrefabs.bind(this);

    };

    PrefabExplorer.prototype.onLibraryItemClicked = function (event, library) {

    };

    PrefabExplorer.prototype.createExplorer = function () {
        var template = `
        <div 
            class="card" 
            id="prefabBrowser" 
            style="position: absolute;
                   width: 470px;
                   top:50px;
                   left:250px;
                   display:none;
                   -webkit-box-shadow: 4px 4px 24px 0px rgba(0,0,0,0.5);
                   -moz-box-shadow: 4px 4px 24px 0px rgba(0,0,0,0.5);
                   box-shadow: 4px 4px 24px 0px rgba(0,0,0,0.5);
                   resize: both;
                   overflow:hidden;
                " >

            <div id="prefabBrowserHeader" class="card-header" style="padding: 0; overflow: hidden;cursor: move; line-height:normal;">
                <label style="margin:8px 0 0 8px;" >Prefabs Explorer</label>
        
                <div style="display:none;" id="prefab-remote-save-spinner" class="spinner-border text-primary spinner-border-sm" role="status">
                 <span class="sr-only">Loading...</span>
                </div>
        
                <div id="closePrefabBrowser" class="btn btn-xs" style="float: right; cursor: pointer;">
                    <i class="fa fa-close"></i>
                </div>
            </div>
        
            <div id="prefabBrowserHeading" class="card-body" style="border-bottom:1px solid #aaaaaa; background-color:#eeeeee">
                
                <div class="custom-control custom-switch" style="display:inline-block;line-height:normal;cursor:pointer;">
                    <input type="checkbox" class="custom-control-input" id="isPrefabPrivate">
                    <label class="custom-control-label" for="isPrefabPrivate">Is Private</label>
                </div>
        
                <button id="prefabExplorerCreate" class="btn btn-sm btn-info" style="float:right"> <i class="fa fa-folder"></i> new folder </button>
                
                <div id="prefabExplorerWarning" style="line-height:normal;color:#555555;margin-top:10px; display:none;">
                    <i style="color:orange;" class="fa fa-warning"></i> 
                    <span id="prefabExplorerWarningMsg"> There is an existing file with the same name. </span>
                </div>
                
            </div>
            
            <div id="prefabBrowseContent" class="libraryContent" style="background-color:#f5fae4;" class="card-body"  >
               
            </div>
        
            <div id="prefabBrowserFooter" class="card-body" style="border-top:1px solid #aaaaaa; background-color:transparent; padding:10px; min-height:60px;">
                <div id="prefab-file-save">
                    <input  id="prefab-name" type="text" class="form-control" placeholder="Name"  />
                    <textarea  style="margin-top:15px;" id="prefab-desc" class="form-control" placeholder="description" ></textarea>
                    <button id="prefabExplorerSave" class="btn btn-success" style="margin-top:5px;" > 
                        <i class="fa fa-floppy-o"></i> save 
                    </button> 
                </div>      
            </div>
        
            <div id="prefabContextMenu" class="contextMenu" >
                <nav class="navbar navbar-expand-md navbar-light bg-light" style="padding:0px;">
                    <div class="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul class="navbar-nav">
                            <li class="nav-item dropdown">
                               <ul id="contextPanel" class="dropdown-menu" style="display:block;line-height:normal;">

                                   <li id="prefabExplorerRename" class="dropdown-item" >
                                       <i class="fa fa-fw fa-lg fa-pencil"></i> 
                                       <span class="actionName">Rename</span>
                                   </li>

                                   <li id="prefabExplorerDelete" class="dropdown-item" >
                                       <i class="fa fa-fw fa-lg fa-trash-o"></i> 
                                       <span class="actionName">Delete</span>
                                   </li>

                               </ul>
                           </li>
                        </ul>
                    </div>
                </nav>
            </div>
        
        </div>
`;

        var div = document.createElement('div');
        div.innerHTML = template;
        document.body.appendChild(div.children[0]);

        this.browser = document.getElementById('prefabBrowser');
        this.browser.onclick = this.onBrowserClick.bind(this);

        this.spiner = document.getElementById('prefab-remote-save-spinner');

        this.isPrefabPrivateElement = document.getElementById('isPrefabPrivate');
        this.isPrefabPrivateElement.onchange = this.onIsPrivateToggle.bind(this);

        document.getElementById('prefabExplorerRename').onclick = this.onItemRename.bind(this);
        document.getElementById('prefabExplorerDelete').onclick = this.onFolderDelete.bind(this);
        document.getElementById('prefabExplorerSave').onclick = this.onPrefabSave.bind(this);

        this.contextMenu = document.getElementById('prefabContextMenu');

        this.bindExplorer();

    };

    PrefabExplorer.prototype.bindExplorer = function () {

        var dom = document.getElementById('prefabBrowseContent');
        dom.style.height = "300px";
        this.library = new HtmlLibrary(dom, this.editor, 'hierarchyDrop');
        this.library.isFolderList = true;
        this.library.canDropHierarchy = true;
        this.library.delegate = this;
        this.library.show();



        var closeBtn = document.getElementById('closePrefabBrowser');
        var that = this;
        closeBtn.onclick = function () {
            that.hide();
        };
        var prefabExplorerCreate = document.getElementById('prefabExplorerCreate');
        prefabExplorerCreate.onclick = this.onCreateFolder.bind(this);

        this.editor.htmlInterface.dragElement(this.browser);

    };

    PrefabExplorer.prototype.showFolderName = function () {


        var modal = document.getElementById('prefabFolderName');

        if (!modal) {
            modal = document.createElement("div");
            modal.id = 'prefabFolderName';
            modal.className = 'modal';
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('role', 'dialog');

            var content = `
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
        
                            <div class="modal-header">
                              <h5 class="modal-title">Folder Name</h5>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
        
                            <div class="modal-body">    
                            <input id="prefabFolderNameInput" class="form-control" />
                            </div>
        
                            <div class="modal-footer">
                              <button id="prefabFolderSave" type="button" class="btn btn-success" data-dismiss="modal">Save</button>
                            </div>
        
                          </div>
                        </div>`;

            modal.innerHTML = content;
            document.body.appendChild(modal);
        }



        $('#prefabFolderName').modal('show');

        var input = document.getElementById('prefabFolderNameInput');

        input.value = "";



        if (this.selectedItem) {
            input.value = this.selectedItem.name;
        }

        input.focus();

        var prefabFolderSave = document.getElementById('prefabFolderSave');
        prefabFolderSave.onclick = this.onFolderName.bind(this);

    };

    PrefabExplorer.prototype.onCreateFolder = function () {

        this.selectedItem = null;
        this.showFolderName();

    };

    PrefabExplorer.prototype.onFolderName = function () {

        if (this.selectedItem) {

            var name = document.getElementById('prefabFolderNameInput').value;

            this.selectedItem.name = name;

            this.updateOriginalPrefabTree();

            if (!this.isPrefabPrivateElement.checked) {
                this.remoteRename(this.selectedItem);
            }

        } else {
            this.createFolder();
        }

    };

    PrefabExplorer.prototype.createFolder = function () {

        var input = document.getElementById('prefabFolderNameInput');

        var id = 'fff-' + Math.randomInt(0, 10000) + '-' + Math.randomInt(0, 100000);

        var file = this.library.getItemAt(this.library.path);
        var parent_id = file ? file.id : 0;

        var folder = {
            id: id,
            name: input.value,
            children: [],
            type: 'folder',
            parent_id: parent_id
        };

        this.library.shownFiles.push(folder);

        this.updateOriginalPrefabTree();

        if (!this.isPrefabPrivateElement.checked) {
            this.remoteSave(folder);
        }

    };

    PrefabExplorer.prototype.onBrowserClick = function (event) {
        this.contextMenu.style.display = 'none';
    };

    PrefabExplorer.prototype.onLibraryItemRightClicked = function (evt, library) {

        var x = evt.pageX - $('#prefabBrowser').offset().left;
        var y = evt.pageY - $('#prefabBrowser').offset().top;

        this.contextMenu.style.left = x + 'px';
        this.contextMenu.style.top = y + 'px';

        this.contextMenu.style.display = 'block';

        var id = evt.target.dataset.id;

        for (var i = 0; i < this.library.shownFiles.length; i++) {
            var file = this.library.shownFiles[i];
            if (file.id.toString() === id.toString()) {
                this.selectedItem = file;
            }
        }

    };

    PrefabExplorer.prototype.onItemRename = function (event) {

        if (this.selectedItem.children) {
            this.showFolderName();
        } else {
            this.showItemRename();
        }

    };

    PrefabExplorer.prototype.showItemRename = function () {


        var modal = document.getElementById('prefabItemName');

        if (!modal) {
            modal = document.createElement("div");
            modal.id = 'prefabItemName';
            modal.className = 'modal';
            modal.setAttribute('tabindex', '-1');
            modal.setAttribute('role', 'dialog');

            var content = `
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
        
                            <div class="modal-header">
                              <h5 class="modal-title">Item Details</h5>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
        
                            <div class="modal-body">    
                                <input id="prefabItemNameInput" class="form-control" />
                                <textarea id="prefabItemDescInput" class="form-control" style="margin-top:10px;"></textarea>
                            </div>
        
                            <div class="modal-footer">
                              <button id="prefabItemSave" type="button" class="btn btn-success" data-dismiss="modal">Save</button>
                            </div>
        
                          </div>
                        </div>`;

            modal.innerHTML = content;
            document.body.appendChild(modal);
        }



        $('#prefabItemName').modal('show');

        var prefabItemNameInput = document.getElementById('prefabItemNameInput');
        var prefabItemDescInput = document.getElementById('prefabItemDescInput');


        prefabItemNameInput.value = this.selectedItem.name;
        prefabItemDescInput.value = this.selectedItem.description;

        prefabItemNameInput.focus();

        var prefabItemSave = document.getElementById('prefabItemSave');
        prefabItemSave.onclick = this.onPrefabRenameSave.bind(this);


    };

    PrefabExplorer.prototype.onPrefabRenameSave = function () {

        var prefabItemNameInput = document.getElementById('prefabItemNameInput');
        var prefabItemDescInput = document.getElementById('prefabItemDescInput');

        var name = prefabItemNameInput.value;

        //TODO checkup

//        if (name !== this.selectedItem.data.name) {
//            if (this.checkCompleteForDuplicate({name: 'Entity_' + name})) {
//                alert("Please provide a unique name.");
//                return;
//            }
//        }

//        this.selectedItem.title = name;
        this.selectedItem.name = name;
        this.selectedItem.data.name = name;
        this.selectedItem.description = prefabItemDescInput.value;

        this.updateOriginalPrefabTree();
        if (!this.isPrefabPrivateElement.checked) {
            this.remoteRename(this.selectedItem);
        }

    };

    PrefabExplorer.prototype.checkCurrentForDuplicate = function (prefab) {
        var files = this.library.shownFiles;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (prefab.name === file.name) {
                return file;
            }
        }

        return false;
    };

    PrefabExplorer.prototype.checkCompleteForDuplicate = function (prefab, files) {

        files = files || this.library.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            if (file.children) {
                var result = null;
                if (result = this.checkCompleteForDuplicate(prefab, file.children)) {
                    return result;
                }
            }

            if (file.name === prefab.name) {
                return file;
            }
        }

        return null;
    };

    PrefabExplorer.prototype.onFolderDelete = function (event) {

        if (confirm("Are you sure ?")) {

            this.library.shownFiles.removeElement(this.selectedItem);

            this.updateOriginalPrefabTree();

            if (!this.isPrefabPrivateElement.checked) {
                this.remoteDelete(this.selectedItem);
            }

        }

    };

    PrefabExplorer.prototype.onIsPrivateToggle = function (event) {
        this.setPrefabFiles();
        this.library.show();
    };

    PrefabExplorer.prototype.setPrefabFiles = function () {

        if (this.isPrefabPrivateElement.checked) {

            var prefabs = store.get('local-prefabs-' + ContentManager.baseURL);

            if (prefabs) {
                prefabs = JSON.parse(prefabs);
            } else {
                prefabs = [];
            }

        } else {

            var prefabs = [];

            if (this.editor.remotePrefabs) {

                prefabs = this.editor.remotePrefabs;
            }
        }

        this.library.sort(prefabs);
        this.library.files = prefabs;

        this.library._originalFiles = prefabs;
        this.library.path = [];

    };

    PrefabExplorer.prototype.updateOriginalPrefabTree = function () {

        this.library.sort(this.library.files);

        if (this.isPrefabPrivateElement.checked) {
            store.set('local-prefabs-' + ContentManager.baseURL, JSON.stringify(this.library.files));
        }

        this.editor.htmlInterface.onPrefabs();
        this.library.show();

    };

    PrefabExplorer.prototype.createPrefab = function (objects) {

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

    PrefabExplorer.prototype.onPrefabSave = function () {

        var nameElement = document.getElementById('prefab-name');
        var descElement = document.getElementById('prefab-desc');

        nameElement.classList.remove("is-invalid");
        descElement.classList.remove("is-invalid");

        if (!nameElement.value) {
            nameElement.classList.add("is-invalid");
        }

        if (!descElement.value) {
            descElement.classList.add("is-invalid");
        }

        if (!nameElement.value || !descElement.value) {
            return false;
        }

        var name = nameElement.value;
        var desc = descElement.value;

        ////////////////////

        if (this.editor.selectedObjects.length) {

            var prefab = this.createPrefab(this.editor.selectedObjects);

            if (prefab) {

                var url = prefab.prefabPreviewImageURL;
                delete prefab.prefabPreviewImageURL;
                var file = this.library.getItemAt(this.library.path);
                var parent_id = file ? file.id : 0;
                var id = "xxx-" + Math.randomInt(0, 1000000) + '-' + Math.randomInt(0, 1000000);

                var prefabElement = {
                    id: id,
                    name: name,
                    url: url,
                    type: 'prefab',
                    parent_id: parent_id,
                    data: {
                        id: id,
                        parent_id: parent_id
                    },
                    description: desc
                };

                this.library.shownFiles.push(prefabElement);

            }
        }

        this.updateOriginalPrefabTree();

        if (!this.isPrefabPrivateElement.checked) {
            this.remoteSave(prefabElement, JSON.stringify(prefab));
        } else {

            prefabElement.prefabData = JSON.stringify(prefab);
            store.set('local-prefabs-' + ContentManager.baseURL, JSON.stringify(this.library.files));

            this.editor.htmlInterface.onPrefabs();
            this.library.show();

        }

        this.browser.style.display = 'none';

    };

    PrefabExplorer.prototype.onHierarchyDrop = function (from, to) {

        if (to) {
            if (to.children) {
                to.children.push(from);
                this.library.shownFiles.removeElement(from);
            }
        } else {
            //go up

            var path = this.library.path;
            var pp = path.slice(0, path.length - 1);
            var topFiles = this.library.getFiles(pp);
            topFiles.push(from);

            to = this.library.getItemAt(pp);

            this.library.shownFiles.removeElement(from);

        }

        this.updateOriginalPrefabTree();

        if (!this.isPrefabPrivateElement.checked) {
            this.remoteMove(from, to);
        }

    };

    PrefabExplorer.prototype.onEditPrefabs = function () {

        this.show(PrefabExplorer.MODE_EDIT);
    };

    PrefabExplorer.prototype.setGUIMode = function () {
        // 
        if (this.mode === PrefabExplorer.MODE_EDIT) {
            document.getElementById('prefab-file-save').style.display = 'none';
        } else if (this.mode === PrefabExplorer.MODE_SAVE) {
            document.getElementById('prefab-file-save').style.display = 'block';
        }
    };

    PrefabExplorer.prototype.show = function (mode) {

        this.mode = (mode !== undefined) ? mode : PrefabExplorer.MODE_SAVE;

        if (!this.browser) {
            this.createExplorer();
        }

        this.setGUIMode();

        this.setPrefabFiles();

        this.library.show();
        this.browser.style.display = 'block';

        document.getElementById('prefab-name').value = '';
        document.getElementById('prefab-desc').value = '';
        document.getElementById('prefabExplorerWarning').style.display = 'none';

        document.getElementById('prefab-name').focus();

        //var b0 = this.browser.getBoundingClientRect();

        var prefabBrowserBody = document.getElementById('prefabBrowseContent');

        var prefabBrowserFooter = document.getElementById('prefabBrowserFooter');
        var prefabBrowserHeader = document.getElementById('prefabBrowserHeader');
        var prefabBrowserHeading = document.getElementById('prefabBrowserHeading');

        //var b1 = prefabBrowserBody.getBoundingClientRect();
        var b2 = prefabBrowserHeader.getBoundingClientRect();
        var b3 = prefabBrowserHeading.getBoundingClientRect();
        var b4 = prefabBrowserFooter.getBoundingClientRect();

        var othersHeight = b2.height + b3.height + b4.height;

        if (prefabBrowserBody.style.height === "300px") {
            this.browser.style.height = "80%";
        }

        prefabBrowserBody.style.height = "calc(100% - " + othersHeight + "px)";


    };

    PrefabExplorer.prototype.hide = function () {

        if (this.browser && this.browser.style.display !== 'none') {

            this.browser.style.display = 'none';

        }

    };

    PrefabExplorer.prototype.getAllIds = function (prefab, ids) {

        ids = ids || [];

        ids.push(prefab.id);

        if (prefab.children) {
            for (var i = 0; i < prefab.children.length; i++) {
                var p = prefab.children[i];
                this.getAllIds(p, ids);
            }
        }

        return ids;

    };

    PrefabExplorer.prototype.remoteSave = function (prefab, data) {

        var url = '../api/editor/prefab-save';

        var imageData = null;

        if (prefab.type === "prefab") {
            imageData = prefab.url;
        }

        var that = this;
        that.spiner.style.display = 'inline-block';

        ajaxPost(url, {
            name: prefab.name,
            description: prefab.description,
            parent_id: prefab.parent_id,
            type: prefab.type,
            data: data,
            imageData: imageData
        }, function (response) {

            that.spiner.style.display = 'none';

            prefab.id = response.id;

            if (prefab.type === "prefab") {
                prefab.data.id = response.id;
            }

        });

    };

    PrefabExplorer.prototype.remoteRename = function (prefab) {

        var url = '../api/editor/prefab-rename';

        var that = this;
        that.spiner.style.display = 'inline-block';

        ajaxPost(url, {
            id: prefab.id,
            name: prefab.name,
            description: prefab.description
        }, function (response) {
            that.spiner.style.display = 'none';
        });

    };

    PrefabExplorer.prototype.remoteDelete = function (prefab) {

        var ids = this.getAllIds(prefab);

        var url = '../api/editor/prefab-delete';

        var that = this;
        that.spiner.style.display = 'inline-block';

        ajaxPost(url, {ids: ids}, function (response) {
            that.spiner.style.display = 'none';
        });

    };

    PrefabExplorer.prototype.remoteMove = function (from, to) {

        // if to is null , then it goes to the top hierarchy , parentID = 0;

        var parentID = to ? to.id : 0;
        from.parent_id = parentID;

        var url = '../api/editor/prefab-move';

        var that = this;
        that.spiner.style.display = 'inline-block';

        ajaxPost(url, {id: from.id, parent_id: parentID}, function (response) {
            that.spiner.style.display = 'none';
        });

    };

    window.PrefabExplorer = PrefabExplorer;

}(window));