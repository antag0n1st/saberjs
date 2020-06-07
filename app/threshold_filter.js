function ThresholdFilter(hexStringColor) {

    var hex = PIXI.utils.string2hex(hexStringColor || "#0000ff");
    var rgb = PIXI.utils.hex2rgb(hex);

    PIXI.Filter.call(this,
            null,
            [
                'precision mediump float;',
                'varying vec2 vTextureCoord;',
                'uniform sampler2D uSampler;',
                'uniform float threshold;',
                'void main(void)',
                '{',
                '    vec4 color = texture2D(uSampler, vTextureCoord);',
                '    vec3 mcolor = vec3(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ');',
                '    if (color.a > threshold) {',
                '       gl_FragColor = vec4(mcolor, 1.0);',
                '    } else {',
                '       gl_FragColor = vec4(vec3(0.0), 0.0);',
                '    }',
                '}'
            ].join('\n'),
            {
                threshold: 0.5
            }
    );
}
ThresholdFilter.prototype = Object.create(PIXI.Filter.prototype);
ThresholdFilter.prototype.constructor = ThresholdFilter;
Object.defineProperties(ThresholdFilter.prototype, {
    threshold: {
        get: function () {
            return this.uniforms.threshold;
        },
        set: function (value) {
            this.uniforms.threshold = value;
        }
    }
});