(function (window, undefined) {


    function CommandDelete(object, editor) {
        this.initialize(object, editor);
    }

    CommandDelete.prototype.initialize = function (object, editor) {

        this.object = object;
        this.editor = editor;
        this.parent = object.parent;
        this.isExecuted = false;

    };

    CommandDelete.prototype.execute = function () {

        if (!this.isExecuted) {

            if (this.object._onDelete) {
                this.object._onDelete();
            }

            if (this.object.canDelete) {
                this.object.removeFromParent();
                this.object.isSelected = false;
            }

            this.isExecuted = true;
        }

    };

    CommandDelete.prototype.undo = function () {
        if (this.isExecuted) {
            
            if (this.object.canDelete) {
                this.parent.addChild(this.object);
                if (this.object.rebuild) {
                    this.object.rebuild();
                }
            }

            this.isExecuted = false;
        }

    };

    window.CommandDelete = CommandDelete;

}(window));