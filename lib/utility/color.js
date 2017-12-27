(function (window, undefined) {


    function Color(hex_code) {
        this.initialize(hex_code);
    }

    Color.prototype.initialize = function (hex_code) {

        this.hex_code = hex_code;

        if (hex_code > 16777215) {
            this.alpha = hex_code >>> 24;
            this.a = hex_code >>> 24;
        } else {
            this.alpha = 255;
            this.a = hex_code >>> 255;
        }

        this.red = hex_code >> 16 & 0xFF;
        this.green = hex_code >> 8 & 0xFF;
        this.blue = hex_code & 0xFF;

        this.r = hex_code >> 16 & 0xFF;
        this.g = hex_code >> 8 & 0xFF;
        this.b = hex_code & 0xFF;

    };

    Color.hex_to_color_32 = function (hex_code) {

        var a = 0;

        if (hex_code > 16777215) {
            a = hex_code >>> 24;
        } else {
            a = hex_code >>> 255;
        }

        var r = hex_code >> 16 & 0xFF;
        var g = hex_code >> 8 & 0xFF;
        var b = hex_code & 0xFF;


        return a << 24 | r << 16 | g << 8 | b;

    };


    Color.get_color_32 = function (a, r, g, b) {

        return a << 24 | r << 16 | g << 8 | b;

    };

    Color.hex_to_number = function (color) {
        var color = color.replace('#', '0x');
        color = PIXI.utils.hex2rgb(color);
        color = Color.get_color_32(1, color[0] * 255, color[1] * 255, color[2] * 255);

        return color;
    };

    window.Color = Color;

}(window));