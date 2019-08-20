(function (window) {


    var ContentManager = function () {
        throw 'cant initialize';
    };

    ContentManager.baseURL = '';

    ContentManager.countLoaded = 0;
    ContentManager.countToLoad = 0;
    ContentManager.countSoundsToLoad = 0;
    ContentManager.countSoundsLoaded = 0;
    ContentManager.countProgress = 0;
    ContentManager.soundsToLoad = [];
    ContentManager.hasError = false;
    ContentManager.callback = function () {};
    ContentManager.context = null;

    ContentManager.spine = {};
    ContentManager.files = {};
    ContentManager.jsons = {};

    ContentManager.isSoundLoaded = true;
    ContentManager.isResourcesLoaded = true;

    ContentManager.onProgress = function (loader, resource) {
        ContentManager.countLoaded++;
        ContentManager.countProgress++;

        // log(resource.name)

        if (resource.type === PIXI.loaders.Resource.TYPE.IMAGE) {
            Images[resource.name] = resource;
        } else if (resource.data && resource.data.bones) {
            ContentManager.spine[resource.name] = resource;
        } else if (resource.type === PIXI.loaders.Resource.TYPE.JSON) {
            ContentManager.jsons[resource.name] = resource.data;
        } else if (resource.url.endsWith('.fnt')) {

        } else {
            ContentManager.files[resource.name] = resource.data;
        }

    };

    ContentManager.onComplete = function () {

        ContentManager.isResourcesLoaded = true;

        if (ContentManager.isSoundLoaded) {
            ContentManager.countLoaded = 0;
            ContentManager.countToLoad = 0;
            ContentManager.countSoundsLoaded = 0;
            ContentManager.countSoundsToLoad = 0;
            ContentManager.countProgress = 0;
            ContentManager.soundsToLoad = [];

            ContentManager.callback.call(ContentManager.context, ContentManager.hasError);
        }

    };

    ContentManager.setLoader = function () {
        ContentManager.loader = PIXI.loader;

        ContentManager.loader.pre(function (resource, next) {
            if (window['_VERSION']) {
                if(resource.url.indexOf('?v=') === -1){
                    resource.url += window['_VERSION'];
                }
            }
            next();
        }).on('progress', function (loader, resource) {
            ContentManager.onProgress(loader, resource);
        }).on('error', function () {
            ContentManager.hasError = true;
        }).on('complete', function () {
            ContentManager.onComplete();
        });

    };



    ContentManager.addImage = function (index, url, useRelativePath) {

        if (ContentManager.loader.resources[index]) {
            //console.warn('Trying to load image at existing key - ' + index);
            return;
        }

        if (useRelativePath) {

        } else if (!url) {
            url = ContentManager.baseURL + 'assets/images/' + index + '.png';
        } else if (url.startsWith('http')) {

        } else if (url.startsWith('../')) {
            url = ContentManager.baseURL + url;
        } else {
            url = ContentManager.baseURL + 'assets/images/' + url;
        }

//        if (window['_VERSION']) {
//            url += window['_VERSION'];
//        }

        ContentManager.loader.add(index, url, {
            loadType: PIXI.loaders.Resource.LOAD_TYPE.IMAGE,
            crossOrigin: true
        });
        ContentManager.countToLoad++;
        ContentManager.isResourcesLoaded = false;

    };

    ContentManager.addFile = function (index, url) {

        url = ContentManager.baseURL + url;

//        if (window['_VERSION']) {
//            url += window['_VERSION'];
//        }

        ContentManager.loader.add(index, url);
        ContentManager.countToLoad++;
        ContentManager.isResourcesLoaded = false;

    };

    ContentManager.addSound = function (index, data) {

        if (Howler.noAudio) {
            Sounds[index] = {play: function () {
                    return this;
                }, volume: function () {
                    return this;
                }, _volume: 1, once: function () {}};
            return;
        }

        for (var i = 0; i < data.length; i++) {
            var url = data[i];
            if (!url.startsWith("data:")) {
//                if (window['_VERSION']) {
//                    url += window['_VERSION'];
//                }
                data[i] = ContentManager.baseURL + url;
            }
        }

        ContentManager.soundsToLoad[index] = data;
        ContentManager.countToLoad++;
        ContentManager.countSoundsToLoad++;
        ContentManager.isSoundLoaded = false;

    };

    ContentManager.addSpine = function (index) {

        this.loader.add(index, ContentManager.baseURL + 'assets/spine/' + index + '.json');

        ContentManager.isResourcesLoaded = false;
        ContentManager.countToLoad += 3;

//        PIXI.loader
//    .add('dragon', 'required/assets/spine/dragon.json')
//    .load(onAssetsLoaded);

//        ContentManager.countToLoad += 3;
//        this.loader.use(PIXI.spine.loaders.atlasParser())
//                .add(index, ContentManager.baseURL + 'assets/spine/' + index + '.json');
//        ContentManager.loader.add(index + '_texture', ContentManager.baseURL + 'assets/spine/' + index + '.png');
//        ContentManager.isResourcesLoaded = false;

    };

    ContentManager.addAtlas = function (index) {
        var url = '';

        if (index.startsWith("..")) {
            url = ContentManager.baseURL + index + '.json';
        } else {
            url = ContentManager.baseURL + 'assets/images/atlases/' + index + '.json';
        }

//        if (window['_VERSION']) {
//            url += window['_VERSION'];
//        }

        ContentManager.loader.add(index, url);
        ContentManager.countToLoad += 2;
        ContentManager.isResourcesLoaded = false;
    };

    ContentManager.addFont = function (index, url) {

        if (ContentManager.loader.resources[index]) {
            //console.warn('Trying to load image at existing key - ' + index);
            return;
        }

        ContentManager.loader.add(index, ContentManager.baseURL + url);
        ContentManager.countToLoad++;
        ContentManager.isResourcesLoaded = false;
    };

    ContentManager.addBitmapFont = function (index, url) {
        ContentManager.loader.add(index, ContentManager.baseURL + url);
        ContentManager.countToLoad += 2;
        ContentManager.isResourcesLoaded = false;
    };

    ContentManager.addAudio = function (index, data) {

        if (Howler.noAudio) {
            Sounds[index] = {play: function () {
                    return this;
                }, volume: function () {
                    return this;
                }, _volume: 1, once: function () {}};
            return;
        }

        for (var i = 0; i < data.length; i++) {
            var url = data[i];
            if (!url.startsWith("data:")) {
//                if (window['_VERSION']) {
//                    url += window['_VERSION'];
//                }
                data[i] = ContentManager.baseURL + url;
            }
        }

        var sound = new Howl({
            src: data,
            onload: function () {
            },
            onloaderror: function () {
            }
        });

        Sounds[index] = sound;

    };

    ContentManager.downloadResources = function (callback, context) {

        ContentManager.callback = callback;
        ContentManager.context = context;
        ContentManager.hasError = false;

        for (var index in ContentManager.soundsToLoad) {

            var data = ContentManager.soundsToLoad[index];

            var sound = new Howl({
                src: data,
                onload: function () {
                    ContentManager.countLoaded++;
                    ContentManager.countSoundsLoaded++;

                    if (ContentManager.countSoundsToLoad === ContentManager.countSoundsLoaded) {
                        ContentManager.isSoundLoaded = true;
                        ContentManager.soundsToLoad = [];
                    }

                    if (ContentManager.countToLoad === ContentManager.countLoaded) {
                        if (ContentManager.isResourcesLoaded) {

                            ContentManager.onComplete();


                        }
                    }
                },
                onloaderror: function (e) {
                    log("Error loading: " + index);
                    log(e);

                    ContentManager.hasError = true;
                    ContentManager.countLoaded++;
                    ContentManager.countSoundsLoaded++;

                    if (ContentManager.countToLoad === ContentManager.countLoaded) {
                        if (ContentManager.isResourcesLoaded) {

                            ContentManager.onComplete();

                        }
                    }
                },
                buffer: true
            });

            Sounds[index] = sound;
        }

        ContentManager.loader.load();

    };

    ContentManager.readBaseURL = function () {

        var url = document.URL;

        if (url.indexOf("localhost") > 0) {

            var index = url.lastIndexOf('/');
            var base = url.substring(0, index);
            ContentManager.baseURL = base + '/';
        } else {
            ContentManager.baseURL = '';
        }

        if (Config.baseURL) {
            ContentManager.baseURL = Config.baseURL;
        }

    };

    ContentManager.readBaseURL();
    ContentManager.setLoader();

    window.ContentManager = ContentManager;

}(window));