(function (window, undefined) {

    var Styles = {};
    
    Styles.colors = {};

    Styles.types = {
        Button: {} , 
        Label: {} ,
        Input: {} // for future use        
    };
    
    Styles.types.ButtonObject = Styles.types.Button;
    Styles.types.LabelObject = Styles.types.Label;
    Styles.types.InputObject = Styles.types.Input;
    
    Styles.addLabel = function (name, style , properties) {        
        var s = JSON.parse(JSON.stringify(style));
        var p = JSON.parse(JSON.stringify(properties || null));
        Styles.types.Label[name] = {
            style : s,
            properties: p
        };
    };

    Styles.addButton = function (name, style, properties) {
        
        var s = JSON.parse(JSON.stringify(style));
        var p = JSON.parse(JSON.stringify(properties));
        
        Styles.types.Button[name] = {
            style: s,
            properties: p
        };

    };
    
    Styles.addColor = function (name, color) {
        Styles.colors[name] = color;
    };

    window.Styles = Styles;

}(window));