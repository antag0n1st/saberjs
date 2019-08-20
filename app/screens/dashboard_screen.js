(function(window, undefined) {
  function DashboardScreen() {
    this.initialize();
  }

  DashboardScreen.prototype = new HScreen();
  DashboardScreen.prototype.screenInitialize = DashboardScreen.prototype.initialize;

  DashboardScreen.prototype.initialize = function() {
    this.screenInitialize();

    this.setBackgroundColor("#ffffff");

    this.content = new Layer();
    this.addChild(this.content);
    this.importer = new Importer(this);

    if (Config.name === "editor") {
      // This is totaly generic solution , it will take data from any file
      // that we gonna reference this screen
      this.importer.importObjects(previewData, this.content);
    } else {
      this.importer.importObjects(ContentManager.jsons.animation.objects, this.content);
    }

    var t = new TableView();
    

  };

  DashboardScreen.prototype.onUpdate = function(dt) {};

  DashboardScreen.prototype.onShow = function() {};

  DashboardScreen.prototype.onHide = function() {};

  DashboardScreen.prototype.onMouseDown = function(event, element) {};

  DashboardScreen.prototype.onMouseMove = function(event, element) {};

  DashboardScreen.prototype.onMouseUp = function(event, element) {};

  DashboardScreen.prototype.onMouseCancel = function(element) {};

  DashboardScreen.prototype.onRightMouseDown = function(event) {};

  DashboardScreen.prototype.onRightMouseMove = function(event) {};

  DashboardScreen.prototype.onRightMouseUp = function(event) {};

  DashboardScreen.prototype.onNote = function(name, data, sender) {};

  DashboardScreen.prototype.onResize = function() {
    this._background.width = app.width;
  };

  DashboardScreen.prototype.destroy = function() {};

  window.DashboardScreen = DashboardScreen; // make it available in the main scope
})(window);
