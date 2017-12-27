(function (window, undefined) {


    function Layout() {
        throw "can't initialize Layout";
    }

    Layout.hbox = function (items, width, x_offset, y_offset, spacing, alignment, wrap, h_spacing , custom) {


        spacing = spacing || 10;
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
            maxHeight = Math.max(maxHeight, items[i].__height);
        }

        var container_width = 0;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (wrap && x + item.__width + spacing > width) {
                x = spacing;
                y += maxHeight + h_spacing;
            }
            if (alignment === "bottom") {
                ypos = maxHeight - item.__height;
            } else if (alignment === "center") {
                ypos = (maxHeight - item.__height) / 2;
            }
            
            var data = null;
            
            if(custom){
                data = custom(item);
            }
            
            if(data && data.spacing){
                x += data.spacing;
            }
            
            item.position.set(x + x_offset, y + ypos + y_offset);
            x += item.__width + spacing;

            container_width = (x > container_width) ? x : container_width;
            
            if(data && data.is_break){
                x = spacing;
                y += maxHeight + h_spacing;
            }
        }



        return {width: container_width, height: y + ypos + maxHeight + h_spacing};

    };

    window.Layout = Layout;

}(window));