(function (window, undefined) {


    function HtmlLibrary(displayContainer, editor, actionName) {
        this.initialize(displayContainer, editor, actionName);
    }
    // DELEGATE
    // onLibraryItemClicked(event,library)
    HtmlLibrary.prototype.initialize = function (displayContainer, editor, actionName) {

        this.editor = editor;

        this.files = [];

        this.path = [];

        this.displayContainer = displayContainer;

        this.actionName = actionName;

        this.canDeleteObjects = false;

        this.id = 'lib-' + PIXI.utils.uid();

        this.delegate = null;

    };

    HtmlLibrary.prototype.setAction = function (actionName) {
        this.actionName = actionName;
    };

    HtmlLibrary.prototype.addFiles = function (files) {
        this.files = files;
    };

    HtmlLibrary.prototype.getImagesAtPath = function () {

    };

    HtmlLibrary.prototype.show = function () {
        this.build();
    };

    HtmlLibrary.prototype.build = function () {

        var children = [];

        var files = this.files;
        for (var i = 0; i < this.path.length; i++) {
            var path = this.path[i];
            for (var j = 0; j < files.length; j++) {
                var ff = files[j];
                if (ff.children && ff.name === path) {
                    files = ff.children;
                }
            }
        }

        if (this.path.length) {

            children.push(this.createUp());
        }

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.children) {
                children.push(this.createFolder(file));
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

            } else {
                var img = document.getElementById(this.id + '_i_m_a_g_e_' + file.name);
                img.ondragstart = this.dragStart.bind(this);
                img.onclick = this.onItemClick.bind(this);
            }

        }

        this.displayContainer.style.height = (app.device.windowSize().height - 120) + 'px';


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

        var img = document.createElement("div");
        img.id = this.id + '_i_m_a_g_e_' + file.name;
        img.title = file.name;
        img.style.backgroundImage = "url('" + file.url + "')";
        //  img.style.width = "92px";
        img.className = "libImg";
        img.style.backgroundRepeat = "no-repeat";


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
                    img.style.backgroundSize = "90px " + (90 / ar) + "px";
                } else {
                    img.style.backgroundSize = (90 * ar) + "px 90px";
                }

            } else {

                img.style.backgroundPosition = "center";

                if (texture.width > texture.height) {
                    img.style.backgroundSize = "90px " + (90 / ar) + "px";
                } else {
                    img.style.backgroundSize = (90 * ar) + "px 90px";
                }

            }
        } else {
            img.style.backgroundPosition = "center";
            img.style.backgroundSize = "90px 90px";
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

        if (this.canDeleteObjects) {

            var deleteBtn = document.createElement("span");
            deleteBtn.className = "btn btn-danger";
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

        return div;

    };

    HtmlLibrary.prototype.createFolder = function (file) {

        // var container = document.createElement("div");

        var div = document.createElement("div");
        div.className = "libraryItem";

        var icon = document.createElement("img");
        icon.id = this.id + '_folder_' + file.name;
        icon.onclick = this.folderClick.bind(this);
        icon.src = ContentManager.baseURL + 'assets/images/folder_icon.png';
        icon['data-path'] = file.name;

        div.appendChild(icon);

        var label = document.createElement("div");
        label.className = "libFooter";
        label.innerHTML = '<label style="margin:auto;" >' + file.name + '</label>';
        div.appendChild(label);

        return div;

    };

    HtmlLibrary.prototype.createUp = function () {

        var container = document.createElement("div");

        var div = document.createElement("div");
        div.className = "libraryItem";

        var icon = document.createElement("img");
        icon.src = ContentManager.baseURL + 'assets/images/folder_up.png';
        icon.onclick = this.backClick.bind(this);
        div.appendChild(icon);

        return div;

        container.appendChild(div);
        return container.innerHTML;

    };

    HtmlLibrary.prototype.onDeleteButton = function (event) {
        // you need to overwrite this one
        this.build();
    };



    HtmlLibrary.prototype.folderClick = function (event) {
        this.path.push(event.target['data-path']);
        this.build();
    };

    HtmlLibrary.prototype.backClick = function (event) {
        this.path.pop();
        this.build();
    };

    HtmlLibrary.prototype.onItemClick = function (event) {
        if (this.delegate && this.delegate.onLibraryItemClicked) {
            this.delegate.onLibraryItemClicked(event, this);
        }
    };

    window.HtmlLibrary = HtmlLibrary;

}(window));