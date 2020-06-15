// Lets define ALL defaults

Default = {
    properties: {
        Label: {
            width: 0
        },
        Button: {
            imageNormal: 'white',
            imageSelected: 'white',
            width: 200,
            height: 80,
            padding: '1',
            offsetX: 0,
            offsetY: 0,
            sensorWidth: 0,
            sensorHeight: 0,
            labelRotation: 0,
            isNineSlice: true,
            backgroundColorNormal: '#8AC6D0',
            backgroundColorDown: '#50A8B9',
            backgroundColorHover: '#C5E2E8',
            backgroundColorDisabled: "#bababa",
            textColorNormal: '#36213E',
            textColorDown: '#36213E',
            textColorHover: '#36213E',
            textColorDisabled: '#cccccc',
            onMouseDown: '',
            onMouseMove: '',
            onMouseUp: '',
            onMouseCancel: ''
        },
        Input: {
            width: 320,
            height: 90,
            padding: '20',
            sensorWidth: 0,
            sensorHeight: 0,
            hasPlaceholder: false,
            hasNext: false,
            placeholderColor: '#555555',
            input_type: 0,
            doneText: '',
            scrollTo: ''
        },
        NineSlice: {
            width: 250,
            height: 100,
            backgroundName: 'white',
            tintColor: "#ffffff",
            padding: '1',
            sensorWidth: 0,
            sensorHeight: 0
        },
        TilingSprite: {
            width: 250,
            height: 100,
            backgroundName: 'white',
            tilePositionX: 0,
            tilePositionY: 0,
            tileScaleX: 1,
            tileScaleY: 1
        }
    },
    styles: {
        Label: {
            _align: "left",
            _breakWords: false,
            _dropShadow: false,
            _dropShadowAlpha: 1,
            _dropShadowAngle: 0.5235987755982988,
            _dropShadowBlur: 0,
            _dropShadowColor: "black",
            _dropShadowDistance: 0,
            _fill: "#36213E",
            _fillGradientType: 0,
            _fontFamily: "'Arial Black', Gadget, sans-serif",
            _fontSize: 50,
            _fontStyle: "normal",
            _fontVariant: "normal",
            _fontWeight: "normal",
            _leading: 0,
            _letterSpacing: 0,
            _lineHeight: 0,
            _lineJoin: "miter",
            _miterLimit: 10,
            _padding: 4,
            _stroke: "black",
            _strokeThickness: 0,
            _textBaseline: "alphabetic",
            _trim: false,
            _whiteSpace: "pre",
            _wordWrap: false,
            _wordWrapWidth: 100
        }
    },
    stylesClean: {
        Label: {
            align: "left",
            breakWords: false,
            dropShadow: false,
            dropShadowAlpha: 1,
            dropShadowAngle: 0.5235987755982988,
            dropShadowBlur: 0,
            dropShadowColor: "black",
            dropShadowDistance: 0,
            fill: "#36213E",
            fillGradientType: 0,
            fontFamily: "'Arial Black', Gadget, sans-serif",
            fontSize: 50,
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: "normal",
            leading: 0,
            letterSpacing: 0,
            lineHeight: 0,
            lineJoin: "miter",
            miterLimit: 10,
            padding: 4,
            stroke: "black",
            strokeThickness: 0,
            textBaseline: "alphabetic",
            trim: false,
            whiteSpace: "pre",
            wordWrap: false,
            wordWrapWidth: 100
        }
    }
};

Default.properties.LabelObject = Default.properties.Label;
Default.properties.ButtonObject = Default.properties.Button;
Default.properties.NineSliceObject = Default.properties.NineSlice;
Default.properties.TilingSpriteObject = Default.properties.TilingSprite;

Default.styles.LabelObject = Default.styles.Label;
Default.styles.Button = Default.styles.Label;
Default.styles.ButtonObject = Default.styles.Label;


Default.stylesClean.LabelObject = Default.stylesClean.Label;
Default.stylesClean.Button = Default.stylesClean.Label;
Default.stylesClean.ButtonObject = Default.stylesClean.Label;