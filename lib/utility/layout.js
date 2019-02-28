(function (window, undefined) {


    function Layout() {
        throw "can't initialize Layout";
    }

    Layout.hbox = function (items, width, x_offset, y_offset, spacing, alignment, wrap, h_spacing, custom) {
        
        spacing = (spacing !== undefined) ? spacing : 10;
        alignment = alignment || "bottom";
        x_offset = x_offset || 0;
        y_offset = y_offset || 0;
        wrap = (typeof wrap === "undefined") ? true : wrap;
        width = width || 800;
        h_spacing = h_spacing || spacing;

        var x = spacing,
                y = spacing,
                maxHeight = 0,
                ypos = 0;

        for (var i = 0; i < items.length; i++) {
            maxHeight = Math.max(maxHeight, items[i]._height);
        }

        var container_width = 0;
        var rows = [];
        var row = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (wrap && x + item._width + spacing > width) {
                x = spacing;
                y += maxHeight + h_spacing;
                rows.push(row);
                row = [];
            }
            row.push(item);

            if (alignment === "bottom") {
                ypos = maxHeight - item._height;
            } else if (alignment === "center") {
                ypos = (maxHeight - item._height) / 2;
            }

            var data = null;

            if (custom) {
                data = custom(item);
            }

            if (data && data.spacing) {
                x += data.spacing;
            }

            item.position.set(x + x_offset, y + ypos + y_offset);
            x += item._width + spacing;

            container_width = (x > container_width) ? x : container_width;

            if (data && data.is_break) {
                x = spacing;
                y += maxHeight + h_spacing;
            }
        }

        if (rows.indexOf(row) === -1) {
            rows.push(row);
        }

        if (alignment.startsWith("compact")) {
            this.squize(rows, maxHeight, h_spacing);
        }

        return {width: container_width, height: y + ypos + maxHeight + h_spacing};

    };

    Layout.squize = function (rows, maxHeight, h_spacing) {
        
        var totalY = 0;
        for (var j = 0; j < rows.length; j++) {
            var row = rows[j];
            totalY += this.squizeRow(row, maxHeight, h_spacing, totalY);            
        }

    };

    Layout.squizeRow = function (row, maxHeight, h_spacing, totalY) {
        var dy = this.findDY(row, maxHeight);


        for (var i = 0; i < row.length; i++) {
            var cell = row[i];
            cell.position.y += totalY;
        }

        return dy;
    };

    Layout.findDY = function (row, maxHeight) {
        var height = 0;
        for (var i = 0; i < row.length; i++) {
            var cell = row[i];
            if (cell._height > height) {
                height = cell._height;
            }
        }
        return height - maxHeight;
    };



    window.Layout = Layout;

}(window));