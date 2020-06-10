(function (window, undefined) {

    var Styles = {};

    Styles.buttonStyles = {};
    Styles.labelStyles = {};
    Styles.colors = {};

    Styles.addLabel = function (name, style) {
        
        var s = JSON.parse(JSON.stringify(style));
        Styles.labelStyles[name] = s;
    };

    Styles.addButton = function (name, style, properties) {
        
        var s = JSON.parse(JSON.stringify(style));
        var p = JSON.parse(JSON.stringify(properties));
        
        p.styleName = name;
        
        Styles.buttonStyles[name] = {
            style: s,
            properties: p
        };

    };
    Styles.addColor = function (name, color) {
        Styles.colors[name] = color;
    };

    window.Styles = Styles;

}(window));