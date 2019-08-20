(function (window, undefined) {


    function HtmlLibrary(displayContainer, editor, actionName) {
        this.initialize(displayContainer, editor, actionName);
    }
    // DELEGATE
    // onLibraryItemClicked(event,library)
    // onLibraryItemRightClicked(event,library)
    // onHierarchyDrop(from,to)
    HtmlLibrary.prototype.initialize = function (displayContainer, editor, actionName) {

        this.editor = editor;

        this.files = [];
        this.shownFiles = [];

        this.path = [];

        this.heightOffset = 0;

        this.itemSize = {
            width: 0, // auto height
            height: 0 // auto width
        };

        this.displayContainer = displayContainer;

        this.actionName = actionName;

        this.itemsImageScale = true;
        this.isFolderList = false;
        this.canDropHierarchy = false;

        this.id = 'lib-' + PIXI.utils.uid();

        this.name = ''; // in order to identify it

        this.delegate = null;

    };

    HtmlLibrary.prototype.sort = function (files) {

        Math.bubbleSort(files, function (a, b) {

            if (!a.children && b.children) {
                return true;
            }

            if ((a.children && b.children) || (!a.children && !b.children)) {

                return a.name > b.name;
            }

            return false;

        });

    };

    HtmlLibrary.prototype.filter = function (name, includeFolders) {

        var includeFolders = (includeFolders === undefined) ? true : includeFolders;

        if (name === '') {
            this.files = this._originalFiles;
        } else {

            var files = [];
            this.find(name, this._originalFiles, files, includeFolders);

            this.files = files;
            this.sort(this.files);

            // sort

        }

        this.build();

    };

    HtmlLibrary.prototype.find = function (name, files, result, includeFolders) {
        files = files || this._originalFiles;
        result = result || [];

        for (var i = 0; i < files.length; i++) {
            var f = files[i];

            if (f.children && !includeFolders || f.isSection) {

            } else {
                if (f.title && f.title.toLowerCase().indexOf(name) !== -1) {
                    result.push(f);
                } else if (f.description && f.description.toLowerCase().indexOf(name) !== -1) {
                    result.push(f);
                } else if (f.name && f.name.toLowerCase().indexOf(name) !== -1) {
                    result.push(f);
                }
            }

            if (f.children) {
                this.find(name, f.children, result);
            }

        }

        return result;

    };

    HtmlLibrary.prototype.setAction = function (actionName) {
        this.actionName = actionName;
    };

    HtmlLibrary.prototype.addFiles = function (files) {
        this.cleanup(files);
        this.files = files;
        this._originalFiles = this.files.slice(); // make a copy
    };

    HtmlLibrary.prototype.cleanup = function (files) {
        for (var i = files.length - 1; i >= 0; i--) {
            var file = files[i];
            if (file) {
                if (file.children) {
                    this.cleanup(file.children);
                }
            } else {
                files.splice(i, 1);
            }
        }
    };

    HtmlLibrary.prototype.getImagesAtPath = function () {

    };

    HtmlLibrary.prototype.show = function () {
        this.build();
    };
    
    HtmlLibrary.prototype.getItemAt = function (path) {
        var files = this.files || [];
        var result = null;
        for (var i = 0; i < path.length; i++) {
            var p = path[i];
            for (var j = 0; j < files.length; j++) {
                var ff = files[j];
                if (ff.children && ff.name === p.name) {
                    result = ff;
                }
            }
        }

        return result;
    };
    
     HtmlLibrary.prototype.getItemByID = function (id , files) {
         files = files || this.files;
         
         for (var i = 0; i < files.length; i++) {
            var f = files[i];
            if(f.id && f.id.toString() === id.toString()){
                return f;
            }
            
            if(f.children){
                var ff = this.getItemByID(id,f.children);
                
                if(ff){
                    return ff;
                }
            }
        }
        
        return null;
    };
    
    HtmlLibrary.prototype.getFiles = function (path) {
        var files = this.files || [];
        for (var i = 0; i < path.length; i++) {
            var p = path[i];
            for (var j = 0; j < files.length; j++) {
                var ff = files[j];
                if (ff.children && ff.name === p.name) {
                    files = ff.children;
                }
            }
        }

        return files;
    };

    HtmlLibrary.prototype.build = function (offset) {

        var children = [];

        var files = this.getFiles(this.path);

        this.shownFiles = files;

        // do sroting here


        if (this.path.length) {

            children.push(this.createUp());
        }

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.children) {
                children.push(this.createFolder(file));
            } else if (file.isSection) {
                children.push(this.createSection(file));
            } else {
                children.push(this.createImage(file));
            }

        }

        this.displayContainer.innerHTML = '';
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            this.displayContainer.appendChild(child);
        }

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            if (file.children) {

            } else if (file.isSection) {

            } else {
                var img = document.getElementById(this.id + '_lib_' + file.id);
                img.ondragstart = this.dragStart.bind(this);
                img.onclick = this.onItemClick.bind(this);
            }

        }

        if (!this.displayContainer.style.height) {
            this.displayContainer.style.height = (app.device.windowSize().height - 80 + this.heightOffset) + 'px';
        }

        if (offset) {
            this.displayContainer.scrollTo(offset.x, offset.y);
        }

    };

    HtmlLibrary.prototype.dragStart = function (ev) {

        var data = ev.target.dataset;

        ev.dataTransfer.setData("id", ev.target.id);
        ev.dataTransfer.setData("action", this.actionName);
        ev.dataTransfer.setData("library_id", this.id);

        for (var property in data) {
            if (data.hasOwnProperty(property)) {
                var value = data[property];
                ev.dataTransfer.setData(property, value);
            }
        }

    };

    HtmlLibrary.prototype.createImage = function (file) {

        var div = document.createElement("div");
        div.className = "libraryItem";
        div.oncontextmenu = this.onItemRightClick.bind(this);

        var w = 90;
        var h = 90;
        
        var id = this.id + '_lib_' + file.id;

        if (this.itemSize.width && this.itemSize.height) {
            w = this.itemSize.width - 2;
            h = this.itemSize.height - 2;
            div.style.width = this.itemSize.width + 'px';
            div.style.height = this.itemSize.height + 'px';
        }

        var img = document.createElement("div");
        img.id = id;
        img.title = file.name;
        img.style.backgroundImage = "url('" + file.url + "')";

        img.className = "libImg";
        img.style.backgroundRepeat = "no-repeat";
        
        img.setAttribute('data-id', file.id);

        if (this.itemSize.width && this.itemSize.height) {
            img.style.width = (this.itemSize.width - 2) + 'px';
            img.style.height = (this.itemSize.height - 2) + 'px';
        }

        var texture = null;

        if (PIXI.utils.TextureCache[file.name]) {
            texture = PIXI.utils.TextureCache[file.name];
        } else if (PIXI.utils.TextureCache[ ContentManager.baseURL + file.url]) {
            texture = PIXI.utils.TextureCache[ContentManager.baseURL + file.url];
        }

        if (texture) {
            var ar = texture.width / texture.height;

            if (file.frame) {

                // from atlas

                var base64 = null;

                if (app.texturesBase64Cache[file.name]) {
                    base64 = app.texturesBase64Cache[file.name];
                } else {
                    base64 = app.pixi.renderer.extract.base64(new PIXI.Sprite(texture));
                    app.texturesBase64Cache[file.name] = base64;
                }

                img.style.backgroundImage = "url('" + base64 + "')";
                img.style.backgroundPosition = "center";
                if (texture.width > texture.height) {
                    img.style.backgroundSize = w + "px " + (h / ar) + "px";
                } else {
                    img.style.backgroundSize = (w * ar) + "px " + h + "px";
                }

            } else {

                img.style.backgroundPosition = "center";

                if (texture.width > texture.height) {
                    img.style.backgroundSize = w + "px " + (h / ar) + "px";
                } else {
                    img.style.backgroundSize = (w * ar) + "px " + h + "px";
                }

            }
        } else {
            img.style.backgroundPosition = "center";
            img.style.backgroundSize = w + "px " + h + "px";
        }
        
        if (file.data) {
            for (var property in file.data) {
                if (file.data.hasOwnProperty(property)) {
                    var value = file.data[property];
                    // do stuff
                    img.setAttribute('data-' + property, value);
                }
            }
        }


        if (this.actionName) {
            img.draggable = true;
        }

        div.appendChild(img);

        if (file.title) {
            var label = document.createElement("div");
            label.className = "libFooter";
            label.innerHTML = '<label style="margin:auto;" >' + file.title + '</label>';
            div.appendChild(label);
        }


        if (file.canDelete) {

            var deleteBtn = document.createElement("span");
            deleteBtn.className = "btn btn-sm btn-danger";
            deleteBtn.style.position = 'absolute';
            deleteBtn.style.right = '0px';
            deleteBtn.style.top = '0px';
            deleteBtn.onclick = this.onDeleteButton.bind(this);

            var icon = document.createElement("i");
            icon.className = "fa fa-trash";
            deleteBtn.appendChild(icon);

            for (var property in file.data) {
                if (file.data.hasOwnProperty(property)) {
                    var value = file.data[property];
                    // do stuff
                    deleteBtn.setAttribute('data-' + property, value);
                    icon.setAttribute('data-' + property, value);
                }
            }

            div.appendChild(deleteBtn);
        }

        if (!this.itemsImageScale) {
            img.style.backgroundSize = '';
        }

        // set the index
        var index = this.shownFiles.indexOf(file);
        img.setAttribute('data-hierarchyIndex', index);

        return div;

    };

    HtmlLibrary.prototype.createFolder = function (file) {

        var index = this.shownFiles.indexOf(file);

        var div = document.createElement("div");
        div.classList.add("libraryItem");

        if (this.isFolderList) {
            div.classList.add("folder");
        }

        div.onclick = this.folderClick.bind(this);
        div.oncontextmenu = this.onItemRightClick.bind(this);
        div.id = this.id + '_folder_' + file.name;
        div['data-path'] = file.name;

        var icon = document.createElement("img");
        icon['data-path'] = file.name;
        icon.src = ContentManager.baseURL + 'assets/images/folder_icon.png';


        div.appendChild(icon);

        var footer = document.createElement("div");
        footer['data-path'] = file.name;
        footer.className = "libFooter";

        var label = document.createElement("label");
        label['data-path'] = file.name;
        label.innerHTML = file.name;
        label.style.margin = 'auto';
        footer.appendChild(label);

        div.appendChild(footer);

        if (file.data) {
            for (var property in file.data) {
                if (file.data.hasOwnProperty(property)) {
                    var value = file.data[property];
                    // do stuff
                    div.setAttribute('data-' + property, value);
                    icon.setAttribute('data-' + property, value);
                    label.setAttribute('data-' + property, value);
                }
            }
        }

        if (this.canDropHierarchy) {

            div.draggable = true;
            div.ondragstart = this.dragStart.bind(this);
            div.ondragover = function (ev) {
                ev.preventDefault();
            };

            div.ondrop = this.onHierarchyDrop.bind(this);
            div.setAttribute('data-hierarchyIndex', index);
            label.setAttribute('data-hierarchyIndex', index);
            footer.setAttribute('data-hierarchyIndex', index);
            icon.setAttribute('data-hierarchyIndex', index);
        }



        return div;

    };



    HtmlLibrary.prototype.createSection = function (file) {

        var div = document.createElement("div");
        div.innerHTML = '<h3 style="margin:auto;font-size:20px;" >' + file.name + '</h3>';
        div.style.width = "98%";

        div.style.paddingTop = '4px';
        div.style.marginTop = '4px';
        div.style.color = "#999999";
        div.style.borderTop = "1px solid #aaaaaa";


        return div;

    };

    HtmlLibrary.prototype.createUp = function () {

        var height = 40;

        //dc = this.displayContainer;

        //var width = this.displayContainer.clientWidth - 12;

        var div = document.createElement("div");
        div.className = "libraryItem back"; //
        div.style.width = '95%';// width + 'px';
        div.style.height = height + 'px';

        var icon = document.createElement("img");
        icon.src = ContentManager.baseURL + 'assets/images/folder_up.png';
        icon.style.height = height + 'px';
        div.appendChild(icon);
        div.onclick = this.backClick.bind(this);


        if (this.canDropHierarchy) {
            div.ondragover = function (ev) {
                ev.preventDefault();
            };
            div.ondrop = this.onHierarchyDrop.bind(this);
            div.setAttribute('data-hierarchyIndex', -1);
        }

        return div;

    };

    HtmlLibrary.prototype.onDeleteButton = function (event) {
        // you need to overwrite this one
        this.build();
    };

    HtmlLibrary.prototype.folderClick = function (event) {

        this.path.push({
            name: event.target['data-path'],
            offset: {x: 0, y: this.displayContainer.scrollTop}
        });
        this.build();

    };

    HtmlLibrary.prototype.onItemRightClick = function (event) {

        if (this.delegate && this.delegate.onLibraryItemRightClicked) {
            this.delegate.onLibraryItemRightClicked(event, this);
        }

        event.preventDefault();

        return false;

    };

    HtmlLibrary.prototype.backClick = function (event) {
        var path = this.path.pop();
        this.build(path.offset);
    };

    HtmlLibrary.prototype.onItemClick = function (event) {
        if (this.delegate && this.delegate.onLibraryItemClicked) {
            this.delegate.onLibraryItemClicked(event, this);
        }
    };

    HtmlLibrary.prototype.onHierarchyDrop = function (ev) {

        ev.preventDefault();

        var data = ev.dataTransfer;
        var index = data.getData('hierarchyIndex');
        var file = this.shownFiles[index];

        var toIndex = ev.target.dataset.hierarchyindex;
        var targetFile = null;

        if (toIndex >= 0) {
            targetFile = this.shownFiles[toIndex];
        }

        if (this.delegate && this.delegate.onHierarchyDrop) {
            this.delegate.onHierarchyDrop(file, targetFile);
        }

    };

    window.HtmlLibrary = HtmlLibrary;

}(window));