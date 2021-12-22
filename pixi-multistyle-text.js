(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MultiStyleText = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require("./pixi-multistyle-text").default;
},{"./pixi-multistyle-text":2}],2:[function(require,module,exports){
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MultiStyleText = (function (_super) {
        __extends(MultiStyleText, _super);
        function MultiStyleText(text, styles) {
            var _this = _super.call(this, text) || this;
            _this.styles = styles;
            return _this;
        }
        Object.defineProperty(MultiStyleText.prototype, "styles", {
            set: function (styles) {
                this.textStyles = {};
                this.textStyles["default"] = this.assign({}, MultiStyleText.DEFAULT_TAG_STYLE);
                for (var style in styles) {
                    if (style === "default") {
                        this.assign(this.textStyles["default"], styles[style]);
                    }
                    else {
                        this.textStyles[style] = this.assign({}, styles[style]);
                    }
                }
                this._style = new PIXI.TextStyle(this.textStyles["default"]);
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        MultiStyleText.prototype.setTagStyle = function (tag, style) {
            if (tag in this.textStyles) {
                this.assign(this.textStyles[tag], style);
            }
            else {
                this.textStyles[tag] = this.assign({}, style);
            }
            this._style = new PIXI.TextStyle(this.textStyles["default"]);
            this.dirty = true;
        };
        MultiStyleText.prototype.deleteTagStyle = function (tag) {
            if (tag === "default") {
                this.textStyles["default"] = this.assign({}, MultiStyleText.DEFAULT_TAG_STYLE);
            }
            else {
                delete this.textStyles[tag];
            }
            this._style = new PIXI.TextStyle(this.textStyles["default"]);
            this.dirty = true;
        };
        MultiStyleText.prototype._getTextDataPerLine = function (lines) {
            var outputTextData = [];
            var tags = Object.keys(this.textStyles).join("|");
            var re = new RegExp("</?(" + tags + ")>", "g");
            var styleStack = [this.assign({}, this.textStyles["default"])];
            var tagNameStack = ["default"];
            for (var i = 0; i < lines.length; i++) {
                var lineTextData = [];
                var matches = [];
                var matchArray = void 0;
                while (matchArray = re.exec(lines[i])) {
                    matches.push(matchArray);
                }
                if (matches.length === 0) {
                    lineTextData.push(this.createTextData(lines[i], styleStack[styleStack.length - 1], tagNameStack[tagNameStack.length - 1]));
                }
                else {
                    var currentSearchIdx = 0;
                    for (var j = 0; j < matches.length; j++) {
                        if (matches[j].index > currentSearchIdx) {
                            lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx, matches[j].index), styleStack[styleStack.length - 1], tagNameStack[tagNameStack.length - 1]));
                        }
                        if (matches[j][0][1] === "/") {
                            if (styleStack.length > 1) {
                                styleStack.pop();
                                tagNameStack.pop();
                            }
                        }
                        else {
                            styleStack.push(this.assign({}, styleStack[styleStack.length - 1], this.textStyles[matches[j][1]]));
                            tagNameStack.push(matches[j][1]);
                        }
                        currentSearchIdx = matches[j].index + matches[j][0].length;
                    }
                    if (currentSearchIdx < lines[i].length) {
                        lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx), styleStack[styleStack.length - 1], tagNameStack[tagNameStack.length - 1]));
                    }
                }
                outputTextData.push(lineTextData);
            }
            return outputTextData;
        };
        MultiStyleText.prototype.getFontString = function (style) {
            return new PIXI.TextStyle(style).toFontString();
        };
        MultiStyleText.prototype.createTextData = function (text, style, tagName) {
            return {
                text: text,
                style: style,
                width: 0,
                height: 0,
                fontProperties: undefined,
                tagName: tagName
            };
        };
        MultiStyleText.prototype.getDropShadowPadding = function () {
            var _this = this;
            var maxDistance = 0;
            var maxBlur = 0;
            Object.keys(this.textStyles).forEach(function (styleKey) {
                var _a = _this.textStyles[styleKey], dropShadowDistance = _a.dropShadowDistance, dropShadowBlur = _a.dropShadowBlur;
                maxDistance = Math.max(maxDistance, dropShadowDistance || 0);
                maxBlur = Math.max(maxBlur, dropShadowBlur || 0);
            });
            return maxDistance + maxBlur;
        };
        MultiStyleText.prototype.updateText = function () {
            var _this = this;
            if (!this.dirty) {
                return;
            }
            this.texture.baseTexture.resolution = this.resolution;
            var textStyles = this.textStyles;
            var outputText = this.text;
            if (this._style.wordWrap) {
                outputText = this.wordWrap(this.text);
            }
            var lines = outputText.split(/(?:\r\n|\r|\n)/);
            var outputTextData = this._getTextDataPerLine(lines);
            var lineWidths = [];
            var lineYMins = [];
            var lineYMaxs = [];
            var baselines = [];
            var maxLineWidth = 0;
            for (var i = 0; i < lines.length; i++) {
                var lineWidth = 0;
                var lineYMin = 0;
                var lineYMax = 0;
                var baseline = 0;
                var lineHeight = 0;
                
                for (var j = 0; j < outputTextData[i].length; j++) {
                    var sty = outputTextData[i][j].style;
                    lineHeight = sty.lineHeight;
                    this.context.font = this.getFontString(sty);
                    outputTextData[i][j].width = this.context.measureText(outputTextData[i][j].text).width;
                    if (outputTextData[i][j].text.length === 0) {
                        outputTextData[i][j].width += (outputTextData[i][j].text.length - 1) * sty.letterSpacing;
                        if (j > 0) {
                            lineWidth += sty.letterSpacing / 2;
                        }
                        if (j < outputTextData[i].length - 1) {
                            lineWidth += sty.letterSpacing / 2;
                        }
                    }
                    lineWidth += outputTextData[i][j].width;
                    outputTextData[i][j].fontProperties = PIXI.TextMetrics.measureFont(this.context.font);
                    outputTextData[i][j].height =
                        outputTextData[i][j].fontProperties.fontSize + outputTextData[i][j].style.strokeThickness;
                    if (typeof sty.valign === "number") {
                        lineYMin = Math.min(lineYMin, sty.valign - outputTextData[i][j].fontProperties.descent);
                        lineYMax = Math.max(lineYMax, sty.valign + outputTextData[i][j].fontProperties.ascent);
                    }
                    else {
                        lineYMin = Math.min(lineYMin, -outputTextData[i][j].fontProperties.descent);
                        lineYMax = Math.max(lineYMax, outputTextData[i][j].fontProperties.ascent);
                    }
                }
                lineWidths[i] = lineWidth;
                lineYMins[i] = lineYMin;
                lineYMaxs[i] = Math.max(lineYMax, lineHeight);
                maxLineWidth = Math.max(maxLineWidth, lineWidth);
            }
            var stylesArray = Object.keys(textStyles).map(function (key) { return textStyles[key]; });
            var maxStrokeThickness = stylesArray.reduce(function (prev, cur) { return Math.max(prev, cur.strokeThickness || 0); }, 0);
            var dropShadowPadding = this.getDropShadowPadding();
            var totalHeight = lineYMaxs.reduce(function (prev, cur) { return prev + cur; }, 0) - lineYMins.reduce(function (prev, cur) { return prev + cur; }, 0);
            var width = maxLineWidth + maxStrokeThickness + 2 * dropShadowPadding;
            var height = totalHeight + 2 * dropShadowPadding;
            this.canvas.width = (width + this.context.lineWidth) * this.resolution;
            this.canvas.height = height * this.resolution;
            this.context.scale(this.resolution, this.resolution);
            this.context.textBaseline = "alphabetic";
            this.context.lineJoin = "round";
            var basePositionY = dropShadowPadding;
            var drawingData = [];
            for (var i = 0; i < outputTextData.length; i++) {
                var line = outputTextData[i];
                var linePositionX = void 0;
                switch (this._style.align) {
                    case "left":
                        linePositionX = dropShadowPadding;
                        break;
                    case "center":
                        linePositionX = dropShadowPadding + (maxLineWidth - lineWidths[i]) / 2;
                        break;
                    case "right":
                        linePositionX = dropShadowPadding + maxLineWidth - lineWidths[i];
                        break;
                }
                for (var j = 0; j < line.length; j++) {
                    var _a = line[j], style = _a.style, text = _a.text, fontProperties = _a.fontProperties, width_1 = _a.width, height_1 = _a.height, tagName = _a.tagName;
                    linePositionX += maxStrokeThickness / 2;
                    var linePositionY = maxStrokeThickness / 2 + basePositionY + fontProperties.ascent;
                    switch (style.valign) {
                        case "top":
                            break;
                        case "baseline":
                            linePositionY += lineYMaxs[i] - fontProperties.ascent;
                            break;
                        case "middle":
                            linePositionY += (lineYMaxs[i] - lineYMins[i] - fontProperties.ascent - fontProperties.descent) / 2;
                            break;
                        case "bottom":
                            linePositionY += lineYMaxs[i] - lineYMins[i] - fontProperties.ascent - fontProperties.descent;
                            break;
                        default:
                            linePositionY += lineYMaxs[i] - fontProperties.ascent - style.valign;
                            break;
                    }
                    if (style.letterSpacing === 0) {
                        drawingData.push({
                            text: text,
                            style: style,
                            x: linePositionX,
                            y: linePositionY,
                            width: width_1,
                            ascent: fontProperties.ascent,
                            descent: fontProperties.descent,
                            tagName: tagName
                        });
                        linePositionX += line[j].width;
                    }
                    else {
                        this.context.font = this.getFontString(line[j].style);
                        for (var k = 0; k < text.length; k++) {
                            if (k > 0 || j > 0) {
                                linePositionX += style.letterSpacing / 2;
                            }
                            drawingData.push({
                                text: text.charAt(k),
                                style: style,
                                x: linePositionX,
                                y: linePositionY,
                                width: width_1,
                                ascent: fontProperties.ascent,
                                descent: fontProperties.descent,
                                tagName: tagName
                            });
                            linePositionX += this.context.measureText(text.charAt(k)).width;
                            if (k < text.length - 1 || j < line.length - 1) {
                                linePositionX += style.letterSpacing / 2;
                            }
                        }
                    }
                    linePositionX -= maxStrokeThickness / 2;
                }
                basePositionY += lineYMaxs[i] - lineYMins[i];
            }
            this.context.save();
            drawingData.forEach(function (_a) {
                var style = _a.style, text = _a.text, x = _a.x, y = _a.y;
                if (!style.dropShadow) {
                    return;
                }
                _this.context.font = _this.getFontString(style);
                var dropFillStyle = style.dropShadowColor;
                if (typeof dropFillStyle === "number") {
                    dropFillStyle = PIXI.utils.hex2string(dropFillStyle);
                }
                _this.context.shadowColor = dropFillStyle;
                _this.context.shadowBlur = style.dropShadowBlur;
                _this.context.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance * _this.resolution;
                _this.context.shadowOffsetY = Math.sin(style.dropShadowAngle) * style.dropShadowDistance * _this.resolution;
                _this.context.fillText(text, x, y);
            });
            this.context.restore();
            drawingData.forEach(function (_a) {
                var style = _a.style, text = _a.text, x = _a.x, y = _a.y, width = _a.width, ascent = _a.ascent, descent = _a.descent, tagName = _a.tagName;
                _this.context.font = _this.getFontString(style);
                var strokeStyle = style.stroke;
                if (typeof strokeStyle === "number") {
                    strokeStyle = PIXI.utils.hex2string(strokeStyle);
                }
                _this.context.strokeStyle = strokeStyle;
                _this.context.lineWidth = style.strokeThickness;
                var fillStyle = style.fill;
                if (typeof fillStyle === "number") {
                    fillStyle = PIXI.utils.hex2string(fillStyle);
                }
                else if (Array.isArray(fillStyle)) {
                    for (var i = 0; i < fillStyle.length; i++) {
                        var fill = fillStyle[i];
                        if (typeof fill === "number") {
                            fillStyle[i] = PIXI.utils.hex2string(fill);
                        }
                    }
                }
                _this.context.fillStyle = _this._generateFillStyle(new PIXI.TextStyle(style), [text]);
                if (style.stroke && style.strokeThickness) {
                    _this.context.strokeText(text, x, y);
                }
                if (style.fill) {
                    _this.context.fillText(text, x, y);
                }
                var debugSpan = style.debug === undefined
                    ? MultiStyleText.debugOptions.spans.enabled
                    : style.debug;
                if (debugSpan) {
                    _this.context.lineWidth = 1;
                    if (MultiStyleText.debugOptions.spans.bounding) {
                        _this.context.fillStyle = MultiStyleText.debugOptions.spans.bounding;
                        _this.context.strokeStyle = MultiStyleText.debugOptions.spans.bounding;
                        _this.context.beginPath();
                        _this.context.rect(x, y - ascent, width, ascent + descent);
                        _this.context.fill();
                        _this.context.stroke();
                        _this.context.stroke();
                    }
                    if (MultiStyleText.debugOptions.spans.baseline) {
                        _this.context.strokeStyle = MultiStyleText.debugOptions.spans.baseline;
                        _this.context.beginPath();
                        _this.context.moveTo(x, y);
                        _this.context.lineTo(x + width, y);
                        _this.context.closePath();
                        _this.context.stroke();
                    }
                    if (MultiStyleText.debugOptions.spans.top) {
                        _this.context.strokeStyle = MultiStyleText.debugOptions.spans.top;
                        _this.context.beginPath();
                        _this.context.moveTo(x, y - ascent);
                        _this.context.lineTo(x + width, y - ascent);
                        _this.context.closePath();
                        _this.context.stroke();
                    }
                    if (MultiStyleText.debugOptions.spans.bottom) {
                        _this.context.strokeStyle = MultiStyleText.debugOptions.spans.bottom;
                        _this.context.beginPath();
                        _this.context.moveTo(x, y + descent);
                        _this.context.lineTo(x + width, y + descent);
                        _this.context.closePath();
                        _this.context.stroke();
                    }
                    if (MultiStyleText.debugOptions.spans.text) {
                        _this.context.fillStyle = "#ffffff";
                        _this.context.strokeStyle = "#000000";
                        _this.context.lineWidth = 2;
                        _this.context.font = "8px monospace";
                        _this.context.strokeText(tagName, x, y - ascent + 8);
                        _this.context.fillText(tagName, x, y - ascent + 8);
                        _this.context.strokeText(width.toFixed(2) + "x" + (ascent + descent).toFixed(2), x, y - ascent + 16);
                        _this.context.fillText(width.toFixed(2) + "x" + (ascent + descent).toFixed(2), x, y - ascent + 16);
                    }
                }
            });
            if (MultiStyleText.debugOptions.objects.enabled) {
                if (MultiStyleText.debugOptions.objects.bounding) {
                    this.context.fillStyle = MultiStyleText.debugOptions.objects.bounding;
                    this.context.beginPath();
                    this.context.rect(0, 0, width, height);
                    this.context.fill();
                }
                if (MultiStyleText.debugOptions.objects.text) {
                    this.context.fillStyle = "#ffffff";
                    this.context.strokeStyle = "#000000";
                    this.context.lineWidth = 2;
                    this.context.font = "8px monospace";
                    this.context.strokeText(width.toFixed(2) + "x" + height.toFixed(2), 0, 8, width);
                    this.context.fillText(width.toFixed(2) + "x" + height.toFixed(2), 0, 8, width);
                }
            }
            this.updateTexture();
        };
        MultiStyleText.prototype.wordWrap = function (text) {
            var result = '';
            var tags = Object.keys(this.textStyles).join("|");
            var re = new RegExp("(</?(" + tags + ")>)", "g");
            var lines = text.split("\n");
            var wordWrapWidth = this._style.wordWrapWidth;
            var styleStack = [this.assign({}, this.textStyles["default"])];
            this.context.font = this.getFontString(this.textStyles["default"]);
            for (var i = 0; i < lines.length; i++) {
                var spaceLeft = wordWrapWidth;
                var words = lines[i].split(" ");
                for (var j = 0; j < words.length; j++) {
                    var parts = words[j].split(re);
                    for (var k = 0; k < parts.length; k++) {
                        if (re.test(parts[k])) {
                            result += parts[k];
                            if (parts[k][1] === "/") {
                                k++;
                                styleStack.pop();
                            }
                            else {
                                k++;
                                styleStack.push(this.assign({}, styleStack[styleStack.length - 1], this.textStyles[parts[k]]));
                            }
                            this.context.font = this.getFontString(styleStack[styleStack.length - 1]);
                            continue;
                        }
                        var partWidth = this.context.measureText(parts[k]).width;
                        if (this._style.breakWords && partWidth > spaceLeft) {
                            var characters = parts[k].split('');
                            if (j > 0 && k === 0) {
                                result += " ";
                                spaceLeft -= this.context.measureText(" ").width;
                            }
                            for (var c = 0; c < characters.length; c++) {
                                var characterWidth = this.context.measureText(characters[c]).width;
                                if (characterWidth > spaceLeft) {
                                    result += "\n" + characters[c];
                                    spaceLeft = wordWrapWidth - characterWidth;
                                }
                                else {
                                    if (j > 0 && k === 0 && c === 0) {
                                        result += " ";
                                    }
                                    result += characters[c];
                                    spaceLeft -= characterWidth;
                                }
                            }
                        }
                        else if (this._style.breakWords) {
                            result += parts[k];
                            spaceLeft -= partWidth;
                        }
                        else {
                            var paddedPartWidth = partWidth + (k === 0 ? this.context.measureText(" ").width : 0);
                            if (j === 0 || paddedPartWidth > spaceLeft) {
                                if (j > 0) {
                                    result += "\n";
                                }
                                result += parts[k];
                                spaceLeft = wordWrapWidth - partWidth;
                            }
                            else {
                                spaceLeft -= paddedPartWidth;
                                if (k === 0) {
                                    result += " ";
                                }
                                result += parts[k];
                            }
                        }
                    }
                }
                if (i < lines.length - 1) {
                    result += '\n';
                }
            }
            return result;
        };
        MultiStyleText.prototype.updateTexture = function () {
            var texture = this._texture;
            var dropShadowPadding = this.getDropShadowPadding();
            texture.baseTexture.resolution = this.resolution;
            texture.baseTexture.setRealSize(this.canvas.width , this.canvas.height , 1);
            texture.baseTexture.width = this.canvas.width / this.resolution;
            texture.baseTexture.height = this.canvas.height / this.resolution;
            texture.trim.width = texture.frame.width = this.canvas.width / this.resolution;
            texture.trim.height = texture.frame.height = this.canvas.height / this.resolution;
            texture.trim.x = -this._style.padding - dropShadowPadding;
            texture.trim.y = -this._style.padding - dropShadowPadding;
            texture.orig.width = texture.frame.width - (this._style.padding + dropShadowPadding) * 2;
            texture.orig.height = texture.frame.height - (this._style.padding + dropShadowPadding) * 2;
            this._onTextureUpdate();
            texture.baseTexture.emit('update', texture.baseTexture);
            this.dirty = false;
        };
        MultiStyleText.prototype.assign = function (destination) {
            var sources = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                sources[_i - 1] = arguments[_i];
            }
            for (var _a = 0, sources_1 = sources; _a < sources_1.length; _a++) {
                var source = sources_1[_a];
                for (var key in source) {
                    destination[key] = source[key];
                }
            }
            return destination;
        };
        MultiStyleText.DEFAULT_TAG_STYLE = {
            align: "left",
            breakWords: false,
            dropShadow: false,
            dropShadowAngle: Math.PI / 6,
            dropShadowBlur: 0,
            dropShadowColor: "#000000",
            dropShadowDistance: 5,
            fill: "black",
            fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_VERTICAL,
            fontFamily: "Arial",
            fontSize: 26,
            fontStyle: "normal",
            fontVariant: "normal",
            fontWeight: "normal",
            letterSpacing: 0,
            lineHeight: 0,
            lineJoin: "miter",
            miterLimit: 10,
            padding: 0,
            stroke: "black",
            strokeThickness: 0,
            textBaseline: "alphabetic",
            valign: "baseline",
            wordWrap: false,
            wordWrapWidth: 100
        };
        MultiStyleText.debugOptions = {
            spans: {
                enabled: false,
                baseline: "#44BB44",
                top: "#BB4444",
                bottom: "#4444BB",
                bounding: "rgba(255, 255, 255, 0.1)",
                text: true
            },
            objects: {
                enabled: false,
                bounding: "rgba(255, 255, 255, 0.05)",
                text: true
            }
        };
        return MultiStyleText;
    }(PIXI.Text));
    exports.default = MultiStyleText;
});
},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInBpeGktbXVsdGlzdHlsZS10ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0VBLFlBQVksQ0FBQzs7SUFxRGI7UUFBNEMsa0NBQVM7UUFnRHBELHdCQUFZLElBQVksRUFBRSxNQUFvQjtZQUE5QyxZQUNDLGtCQUFNLElBQUksQ0FBQyxTQUdYO1lBREEsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O1FBQ3RCLENBQUM7UUFFRCxzQkFBVyxrQ0FBTTtpQkFBakIsVUFBa0IsTUFBb0I7Z0JBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO2dCQUVyQixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2dCQUUvRSxLQUFLLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRTtvQkFDekIsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO3dCQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3ZEO3lCQUFNO3dCQUNOLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7cUJBQ3hEO2lCQUNEO2dCQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDN0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbkIsQ0FBQzs7O1dB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QUUsRUFBRTtZQUNaLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFdBQVcsRUFBRSxRQUFRO1lBQ3JCLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLFVBQVUsRUFBRSxDQUFDO1lBQ2IsUUFBUSxFQUFFLE9BQU87WUFDakIsVUFBVSxFQUFFLEVBQUU7WUFDZCxPQUFPLEVBQUUsQ0FBQztZQUNWLE1BQU0sRUFBRSxPQUFPO1lBQ2YsZUFBZSxFQUFFLENBQUM7WUFDbEIsWUFBWSxFQUFFLFlBQVk7WUFDMUIsTUFBTSxFQUFFLFVBQVU7WUFDbEIsUUFBUSxFQUFFLEtBQUs7WUFDZixhQUFhLEVBQUUsR0FBRztTQUNsQixDQUFDO1FBRVksMkJBQVksR0FBb0I7WUFDN0MsS0FBSyxFQUFFO2dCQUNOLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFFBQVEsRUFBRSxTQUFTO2dCQUNuQixHQUFHLEVBQUUsU0FBUztnQkFDZCxNQUFNLEVBQUUsU0FBUztnQkFDakIsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsSUFBSSxFQUFFLElBQUk7YUFDVjtZQUNELE9BQU8sRUFBRTtnQkFDUixPQUFPLEVBQUUsS0FBSztnQkFDZCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxJQUFJLEVBQUUsSUFBSTthQUNWO1NBQ0QsQ0FBQztRQW9tQkgscUJBQUM7S0FocEJELEFBZ3BCQyxDQWhwQjJDLElBQUksQ0FBQyxJQUFJLEdBZ3BCcEQ7c0JBaHBCb0IsY0FBYyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vcGl4aS1tdWx0aXN0eWxlLXRleHRcIikuZGVmYXVsdDsiLCIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInBpeGkuanNcIiAvPlxuXG5cInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0IGludGVyZmFjZSBFeHRlbmRlZFRleHRTdHlsZSBleHRlbmRzIFBJWEkuVGV4dFN0eWxlT3B0aW9ucyB7XG5cdHZhbGlnbj86IFwidG9wXCIgfCBcIm1pZGRsZVwiIHwgXCJib3R0b21cIiB8IFwiYmFzZWxpbmVcIiB8IG51bWJlcjtcblx0ZGVidWc/OiBib29sZWFuO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRleHRTdHlsZVNldCB7XG5cdFtrZXk6IHN0cmluZ106IEV4dGVuZGVkVGV4dFN0eWxlO1xufVxuXG5pbnRlcmZhY2UgRm9udFByb3BlcnRpZXMge1xuXHRhc2NlbnQ6IG51bWJlcjtcblx0ZGVzY2VudDogbnVtYmVyO1xuXHRmb250U2l6ZTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgVGV4dERhdGEge1xuXHR0ZXh0OiBzdHJpbmc7XG5cdHN0eWxlOiBFeHRlbmRlZFRleHRTdHlsZTtcblx0d2lkdGg6IG51bWJlcjtcblx0aGVpZ2h0OiBudW1iZXI7XG5cdGZvbnRQcm9wZXJ0aWVzOiBGb250UHJvcGVydGllcztcblx0dGFnTmFtZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgVGV4dERyYXdpbmdEYXRhIHtcblx0dGV4dDogc3RyaW5nO1xuXHRzdHlsZTogRXh0ZW5kZWRUZXh0U3R5bGU7XG5cdHg6IG51bWJlcjtcblx0eTogbnVtYmVyO1xuXHR3aWR0aDogbnVtYmVyO1xuXHRhc2NlbnQ6IG51bWJlcjtcblx0ZGVzY2VudDogbnVtYmVyO1xuXHR0YWdOYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTXN0RGVidWdPcHRpb25zIHtcblx0c3BhbnM6IHtcblx0XHRlbmFibGVkPzogYm9vbGVhbjtcblx0XHRiYXNlbGluZT86IHN0cmluZztcblx0XHR0b3A/OiBzdHJpbmc7XG5cdFx0Ym90dG9tPzogc3RyaW5nO1xuXHRcdGJvdW5kaW5nPzogc3RyaW5nO1xuXHRcdHRleHQ/OiBib29sZWFuO1xuXHR9O1xuXHRvYmplY3RzOiB7XG5cdFx0ZW5hYmxlZD86IGJvb2xlYW47XG5cdFx0Ym91bmRpbmc/OiBzdHJpbmc7XG5cdFx0dGV4dD86IGJvb2xlYW47XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVsdGlTdHlsZVRleHQgZXh0ZW5kcyBQSVhJLlRleHQge1xuXHRwcml2YXRlIHN0YXRpYyBERUZBVUxUX1RBR19TVFlMRTogRXh0ZW5kZWRUZXh0U3R5bGUgPSB7XG5cdFx0YWxpZ246IFwibGVmdFwiLFxuXHRcdGJyZWFrV29yZHM6IGZhbHNlLFxuXHRcdC8vIGRlYnVnIGludGVudGlvbmFsbHkgbm90IGluY2x1ZGVkXG5cdFx0ZHJvcFNoYWRvdzogZmFsc2UsXG5cdFx0ZHJvcFNoYWRvd0FuZ2xlOiBNYXRoLlBJIC8gNixcblx0XHRkcm9wU2hhZG93Qmx1cjogMCxcblx0XHRkcm9wU2hhZG93Q29sb3I6IFwiIzAwMDAwMFwiLFxuXHRcdGRyb3BTaGFkb3dEaXN0YW5jZTogNSxcblx0XHRmaWxsOiBcImJsYWNrXCIsXG5cdFx0ZmlsbEdyYWRpZW50VHlwZTogUElYSS5URVhUX0dSQURJRU5ULkxJTkVBUl9WRVJUSUNBTCxcblx0XHRmb250RmFtaWx5OiBcIkFyaWFsXCIsXG5cdFx0Zm9udFNpemU6IDI2LFxuXHRcdGZvbnRTdHlsZTogXCJub3JtYWxcIixcblx0XHRmb250VmFyaWFudDogXCJub3JtYWxcIixcblx0XHRmb250V2VpZ2h0OiBcIm5vcm1hbFwiLFxuXHRcdGxldHRlclNwYWNpbmc6IDAsXG5cdFx0bGluZUhlaWdodDogMCxcblx0XHRsaW5lSm9pbjogXCJtaXRlclwiLFxuXHRcdG1pdGVyTGltaXQ6IDEwLFxuXHRcdHBhZGRpbmc6IDAsXG5cdFx0c3Ryb2tlOiBcImJsYWNrXCIsXG5cdFx0c3Ryb2tlVGhpY2tuZXNzOiAwLFxuXHRcdHRleHRCYXNlbGluZTogXCJhbHBoYWJldGljXCIsXG5cdFx0dmFsaWduOiBcImJhc2VsaW5lXCIsXG5cdFx0d29yZFdyYXA6IGZhbHNlLFxuXHRcdHdvcmRXcmFwV2lkdGg6IDEwMFxuXHR9O1xuXG5cdHB1YmxpYyBzdGF0aWMgZGVidWdPcHRpb25zOiBNc3REZWJ1Z09wdGlvbnMgPSB7XG5cdFx0c3BhbnM6IHtcblx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0YmFzZWxpbmU6IFwiIzQ0QkI0NFwiLFxuXHRcdFx0dG9wOiBcIiNCQjQ0NDRcIixcblx0XHRcdGJvdHRvbTogXCIjNDQ0NEJCXCIsXG5cdFx0XHRib3VuZGluZzogXCJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSlcIixcblx0XHRcdHRleHQ6IHRydWVcblx0XHR9LFxuXHRcdG9iamVjdHM6IHtcblx0XHRcdGVuYWJsZWQ6IGZhbHNlLFxuXHRcdFx0Ym91bmRpbmc6IFwicmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KVwiLFxuXHRcdFx0dGV4dDogdHJ1ZVxuXHRcdH1cblx0fTtcblxuXHRwcml2YXRlIHRleHRTdHlsZXM6IFRleHRTdHlsZVNldDtcblxuXHRjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcsIHN0eWxlczogVGV4dFN0eWxlU2V0KSB7XG5cdFx0c3VwZXIodGV4dCk7XG5cblx0XHR0aGlzLnN0eWxlcyA9IHN0eWxlcztcblx0fVxuXG5cdHB1YmxpYyBzZXQgc3R5bGVzKHN0eWxlczogVGV4dFN0eWxlU2V0KSB7XG5cdFx0dGhpcy50ZXh0U3R5bGVzID0ge307XG5cblx0XHR0aGlzLnRleHRTdHlsZXNbXCJkZWZhdWx0XCJdID0gdGhpcy5hc3NpZ24oe30sIE11bHRpU3R5bGVUZXh0LkRFRkFVTFRfVEFHX1NUWUxFKTtcblxuXHRcdGZvciAobGV0IHN0eWxlIGluIHN0eWxlcykge1xuXHRcdFx0aWYgKHN0eWxlID09PSBcImRlZmF1bHRcIikge1xuXHRcdFx0XHR0aGlzLmFzc2lnbih0aGlzLnRleHRTdHlsZXNbXCJkZWZhdWx0XCJdLCBzdHlsZXNbc3R5bGVdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMudGV4dFN0eWxlc1tzdHlsZV0gPSB0aGlzLmFzc2lnbih7fSwgc3R5bGVzW3N0eWxlXSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fc3R5bGUgPSBuZXcgUElYSS5UZXh0U3R5bGUodGhpcy50ZXh0U3R5bGVzW1wiZGVmYXVsdFwiXSk7XG5cdFx0dGhpcy5kaXJ0eSA9IHRydWU7XG5cdH1cblxuXHRwdWJsaWMgc2V0VGFnU3R5bGUodGFnOiBzdHJpbmcsIHN0eWxlOiBFeHRlbmRlZFRleHRTdHlsZSk6IHZvaWQge1xuXHRcdGlmICh0YWcgaW4gdGhpcy50ZXh0U3R5bGVzKSB7XG5cdFx0XHR0aGlzLmFzc2lnbih0aGlzLnRleHRTdHlsZXNbdGFnXSwgc3R5bGUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnRleHRTdHlsZXNbdGFnXSA9IHRoaXMuYXNzaWduKHt9LCBzdHlsZSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fc3R5bGUgPSBuZXcgUElYSS5UZXh0U3R5bGUodGhpcy50ZXh0U3R5bGVzW1wiZGVmYXVsdFwiXSk7XG5cdFx0dGhpcy5kaXJ0eSA9IHRydWU7XG5cdH1cblxuXHRwdWJsaWMgZGVsZXRlVGFnU3R5bGUodGFnOiBzdHJpbmcpOiB2b2lkIHtcblx0XHRpZiAodGFnID09PSBcImRlZmF1bHRcIikge1xuXHRcdFx0dGhpcy50ZXh0U3R5bGVzW1wiZGVmYXVsdFwiXSA9IHRoaXMuYXNzaWduKHt9LCBNdWx0aVN0eWxlVGV4dC5ERUZBVUxUX1RBR19TVFlMRSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRlbGV0ZSB0aGlzLnRleHRTdHlsZXNbdGFnXTtcblx0XHR9XG5cblx0XHR0aGlzLl9zdHlsZSA9IG5ldyBQSVhJLlRleHRTdHlsZSh0aGlzLnRleHRTdHlsZXNbXCJkZWZhdWx0XCJdKTtcblx0XHR0aGlzLmRpcnR5ID0gdHJ1ZTtcblx0fVxuXG5cdHByaXZhdGUgX2dldFRleHREYXRhUGVyTGluZSAobGluZXM6IHN0cmluZ1tdKSB7XG5cdFx0bGV0IG91dHB1dFRleHREYXRhOiBUZXh0RGF0YVtdW10gPSBbXTtcblx0XHRsZXQgdGFncyA9IE9iamVjdC5rZXlzKHRoaXMudGV4dFN0eWxlcykuam9pbihcInxcIik7XG5cdFx0bGV0IHJlID0gbmV3IFJlZ0V4cChgPFxcLz8oJHt0YWdzfSk+YCwgXCJnXCIpO1xuXG5cdFx0bGV0IHN0eWxlU3RhY2sgPSBbdGhpcy5hc3NpZ24oe30sIHRoaXMudGV4dFN0eWxlc1tcImRlZmF1bHRcIl0pXTtcblx0XHRsZXQgdGFnTmFtZVN0YWNrID0gW1wiZGVmYXVsdFwiXTtcblxuXHRcdC8vIGRldGVybWluZSB0aGUgZ3JvdXAgb2Ygd29yZCBmb3IgZWFjaCBsaW5lXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IGxpbmVUZXh0RGF0YTogVGV4dERhdGFbXSA9IFtdO1xuXG5cdFx0XHQvLyBmaW5kIHRhZ3MgaW5zaWRlIHRoZSBzdHJpbmdcblx0XHRcdGxldCBtYXRjaGVzOiBSZWdFeHBFeGVjQXJyYXlbXSA9IFtdO1xuXHRcdFx0bGV0IG1hdGNoQXJyYXk6IFJlZ0V4cEV4ZWNBcnJheTtcblxuXHRcdFx0d2hpbGUgKG1hdGNoQXJyYXkgPSByZS5leGVjKGxpbmVzW2ldKSkge1xuXHRcdFx0XHRtYXRjaGVzLnB1c2gobWF0Y2hBcnJheSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIGlmIHRoZXJlIGlzIG5vIG1hdGNoLCB3ZSBzdGlsbCBuZWVkIHRvIGFkZCB0aGUgbGluZSB3aXRoIHRoZSBkZWZhdWx0IHN0eWxlXG5cdFx0XHRpZiAobWF0Y2hlcy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0bGluZVRleHREYXRhLnB1c2godGhpcy5jcmVhdGVUZXh0RGF0YShsaW5lc1tpXSwgc3R5bGVTdGFja1tzdHlsZVN0YWNrLmxlbmd0aCAtIDFdLCB0YWdOYW1lU3RhY2tbdGFnTmFtZVN0YWNrLmxlbmd0aCAtIDFdKSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gV2UgZ290IGEgbWF0Y2ghIGFkZCB0aGUgdGV4dCB3aXRoIHRoZSBuZWVkZWQgc3R5bGVcblx0XHRcdFx0bGV0IGN1cnJlbnRTZWFyY2hJZHggPSAwO1xuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IG1hdGNoZXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0XHQvLyBpZiBpbmRleCA+IDAsIGl0IG1lYW5zIHdlIGhhdmUgY2hhcmFjdGVycyBiZWZvcmUgdGhlIG1hdGNoLFxuXHRcdFx0XHRcdC8vIHNvIHdlIG5lZWQgdG8gYWRkIGl0IHdpdGggdGhlIGRlZmF1bHQgc3R5bGVcblx0XHRcdFx0XHRpZiAobWF0Y2hlc1tqXS5pbmRleCA+IGN1cnJlbnRTZWFyY2hJZHgpIHtcblx0XHRcdFx0XHRcdGxpbmVUZXh0RGF0YS5wdXNoKHRoaXMuY3JlYXRlVGV4dERhdGEoXG5cdFx0XHRcdFx0XHRcdGxpbmVzW2ldLnN1YnN0cmluZyhjdXJyZW50U2VhcmNoSWR4LCBtYXRjaGVzW2pdLmluZGV4KSxcblx0XHRcdFx0XHRcdFx0c3R5bGVTdGFja1tzdHlsZVN0YWNrLmxlbmd0aCAtIDFdLFxuXHRcdFx0XHRcdFx0XHR0YWdOYW1lU3RhY2tbdGFnTmFtZVN0YWNrLmxlbmd0aCAtIDFdXG5cdFx0XHRcdFx0XHQpKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAobWF0Y2hlc1tqXVswXVsxXSA9PT0gXCIvXCIpIHsgLy8gcmVzZXQgdGhlIHN0eWxlIGlmIGVuZCBvZiB0YWdcblx0XHRcdFx0XHRcdGlmIChzdHlsZVN0YWNrLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0c3R5bGVTdGFjay5wb3AoKTtcblx0XHRcdFx0XHRcdFx0dGFnTmFtZVN0YWNrLnBvcCgpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSB7IC8vIHNldCB0aGUgY3VycmVudCBzdHlsZVxuXHRcdFx0XHRcdFx0c3R5bGVTdGFjay5wdXNoKHRoaXMuYXNzaWduKHt9LCBzdHlsZVN0YWNrW3N0eWxlU3RhY2subGVuZ3RoIC0gMV0sIHRoaXMudGV4dFN0eWxlc1ttYXRjaGVzW2pdWzFdXSkpO1xuXHRcdFx0XHRcdFx0dGFnTmFtZVN0YWNrLnB1c2gobWF0Y2hlc1tqXVsxXSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gdXBkYXRlIHRoZSBjdXJyZW50IHNlYXJjaCBpbmRleFxuXHRcdFx0XHRcdGN1cnJlbnRTZWFyY2hJZHggPSBtYXRjaGVzW2pdLmluZGV4ICsgbWF0Y2hlc1tqXVswXS5sZW5ndGg7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBpcyB0aGVyZSBhbnkgY2hhcmFjdGVyIGxlZnQ/XG5cdFx0XHRcdGlmIChjdXJyZW50U2VhcmNoSWR4IDwgbGluZXNbaV0ubGVuZ3RoKSB7XG5cdFx0XHRcdFx0bGluZVRleHREYXRhLnB1c2godGhpcy5jcmVhdGVUZXh0RGF0YShcblx0XHRcdFx0XHRcdGxpbmVzW2ldLnN1YnN0cmluZyhjdXJyZW50U2VhcmNoSWR4KSxcblx0XHRcdFx0XHRcdHN0eWxlU3RhY2tbc3R5bGVTdGFjay5sZW5ndGggLSAxXSxcblx0XHRcdFx0XHRcdHRhZ05hbWVTdGFja1t0YWdOYW1lU3RhY2subGVuZ3RoIC0gMV1cblx0XHRcdFx0XHQpKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRvdXRwdXRUZXh0RGF0YS5wdXNoKGxpbmVUZXh0RGF0YSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFRleHREYXRhO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRGb250U3RyaW5nKHN0eWxlOiBFeHRlbmRlZFRleHRTdHlsZSk6IHN0cmluZyB7XG5cdFx0cmV0dXJuIG5ldyBQSVhJLlRleHRTdHlsZShzdHlsZSkudG9Gb250U3RyaW5nKCk7XG5cdH1cblxuXHRwcml2YXRlIGNyZWF0ZVRleHREYXRhKHRleHQ6IHN0cmluZywgc3R5bGU6IEV4dGVuZGVkVGV4dFN0eWxlLCB0YWdOYW1lOiBzdHJpbmcpOiBUZXh0RGF0YSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRleHQsXG5cdFx0XHRzdHlsZSxcblx0XHRcdHdpZHRoOiAwLFxuXHRcdFx0aGVpZ2h0OiAwLFxuXHRcdFx0Zm9udFByb3BlcnRpZXM6IHVuZGVmaW5lZCxcblx0XHRcdHRhZ05hbWVcblx0XHR9O1xuXHR9XG5cblx0cHJpdmF0ZSBnZXREcm9wU2hhZG93UGFkZGluZygpOiBudW1iZXIge1xuXHRcdGxldCBtYXhEaXN0YW5jZSA9IDA7XG5cdFx0bGV0IG1heEJsdXIgPSAwO1xuXG5cdFx0IE9iamVjdC5rZXlzKHRoaXMudGV4dFN0eWxlcykuZm9yRWFjaCgoc3R5bGVLZXkpID0+IHtcblx0XHRcdGxldCB7IGRyb3BTaGFkb3dEaXN0YW5jZSwgZHJvcFNoYWRvd0JsdXIgfSA9IHRoaXMudGV4dFN0eWxlc1tzdHlsZUtleV07XG5cdFx0XHRtYXhEaXN0YW5jZSA9IE1hdGgubWF4KG1heERpc3RhbmNlLCBkcm9wU2hhZG93RGlzdGFuY2UgfHwgMCk7XG5cdFx0XHRtYXhCbHVyID0gTWF0aC5tYXgobWF4Qmx1ciwgZHJvcFNoYWRvd0JsdXIgfHwgMCk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gbWF4RGlzdGFuY2UgKyBtYXhCbHVyO1xuXHR9XG5cblx0cHVibGljIHVwZGF0ZVRleHQoKTogdm9pZCB7XG5cdFx0aWYgKCF0aGlzLmRpcnR5KSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGhpcy50ZXh0dXJlLmJhc2VUZXh0dXJlLnJlc29sdXRpb24gPSB0aGlzLnJlc29sdXRpb247XG5cdFx0bGV0IHRleHRTdHlsZXMgPSB0aGlzLnRleHRTdHlsZXM7XG5cdFx0bGV0IG91dHB1dFRleHQgPSB0aGlzLnRleHQ7XG5cblx0XHRpZih0aGlzLl9zdHlsZS53b3JkV3JhcCkge1xuXHRcdFx0b3V0cHV0VGV4dCA9IHRoaXMud29yZFdyYXAodGhpcy50ZXh0KTtcblx0XHR9XG5cblx0XHQvLyBzcGxpdCB0ZXh0IGludG8gbGluZXNcblx0XHRsZXQgbGluZXMgPSBvdXRwdXRUZXh0LnNwbGl0KC8oPzpcXHJcXG58XFxyfFxcbikvKTtcblxuXHRcdC8vIGdldCB0aGUgdGV4dCBkYXRhIHdpdGggc3BlY2lmaWMgc3R5bGVzXG5cdFx0bGV0IG91dHB1dFRleHREYXRhID0gdGhpcy5fZ2V0VGV4dERhdGFQZXJMaW5lKGxpbmVzKTtcblxuXHRcdC8vIGNhbGN1bGF0ZSB0ZXh0IHdpZHRoIGFuZCBoZWlnaHRcblx0XHRsZXQgbGluZVdpZHRoczogbnVtYmVyW10gPSBbXTtcblx0XHRsZXQgbGluZVlNaW5zOiBudW1iZXJbXSA9IFtdO1xuXHRcdGxldCBsaW5lWU1heHM6IG51bWJlcltdID0gW107XG5cdFx0bGV0IGJhc2VsaW5lczogbnVtYmVyW10gPSBbXTtcblx0XHRsZXQgbWF4TGluZVdpZHRoID0gMDtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBsaW5lV2lkdGggPSAwO1xuXHRcdFx0bGV0IGxpbmVZTWluID0gMDtcblx0XHRcdGxldCBsaW5lWU1heCA9IDA7XG5cdFx0XHRsZXQgYmFzZWxpbmUgPSAwO1xuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBvdXRwdXRUZXh0RGF0YVtpXS5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRsZXQgc3R5ID0gb3V0cHV0VGV4dERhdGFbaV1bal0uc3R5bGU7XG5cblx0XHRcdFx0dGhpcy5jb250ZXh0LmZvbnQgPSB0aGlzLmdldEZvbnRTdHJpbmcoc3R5KTtcblxuXHRcdFx0XHQvLyBzYXZlIHRoZSB3aWR0aFxuXHRcdFx0XHRvdXRwdXRUZXh0RGF0YVtpXVtqXS53aWR0aCA9IHRoaXMuY29udGV4dC5tZWFzdXJlVGV4dChvdXRwdXRUZXh0RGF0YVtpXVtqXS50ZXh0KS53aWR0aDtcblxuXHRcdFx0XHRpZiAob3V0cHV0VGV4dERhdGFbaV1bal0udGV4dC5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRvdXRwdXRUZXh0RGF0YVtpXVtqXS53aWR0aCArPSAob3V0cHV0VGV4dERhdGFbaV1bal0udGV4dC5sZW5ndGggLSAxKSAqIHN0eS5sZXR0ZXJTcGFjaW5nO1xuXG5cdFx0XHRcdFx0aWYgKGogPiAwKSB7XG5cdFx0XHRcdFx0XHRsaW5lV2lkdGggKz0gc3R5LmxldHRlclNwYWNpbmcgLyAyOyAvLyBzcGFjaW5nIGJlZm9yZSBmaXJzdCBjaGFyYWN0ZXJcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoaiA8IG91dHB1dFRleHREYXRhW2ldLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRcdGxpbmVXaWR0aCArPSBzdHkubGV0dGVyU3BhY2luZyAvIDI7IC8vIHNwYWNpbmcgYWZ0ZXIgbGFzdCBjaGFyYWN0ZXJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsaW5lV2lkdGggKz0gb3V0cHV0VGV4dERhdGFbaV1bal0ud2lkdGg7XG5cblx0XHRcdFx0Ly8gc2F2ZSB0aGUgZm9udCBwcm9wZXJ0aWVzXG5cdFx0XHRcdG91dHB1dFRleHREYXRhW2ldW2pdLmZvbnRQcm9wZXJ0aWVzID0gUElYSS5UZXh0TWV0cmljcy5tZWFzdXJlRm9udCh0aGlzLmNvbnRleHQuZm9udCk7XG5cblx0XHRcdFx0Ly8gc2F2ZSB0aGUgaGVpZ2h0XG5cdFx0XHRcdG91dHB1dFRleHREYXRhW2ldW2pdLmhlaWdodCA9XG5cdFx0XHRcdFx0XHRvdXRwdXRUZXh0RGF0YVtpXVtqXS5mb250UHJvcGVydGllcy5mb250U2l6ZSArIG91dHB1dFRleHREYXRhW2ldW2pdLnN0eWxlLnN0cm9rZVRoaWNrbmVzcztcblxuXHRcdFx0XHRpZiAodHlwZW9mIHN0eS52YWxpZ24gPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0XHRsaW5lWU1pbiA9IE1hdGgubWluKGxpbmVZTWluLCBzdHkudmFsaWduIC0gb3V0cHV0VGV4dERhdGFbaV1bal0uZm9udFByb3BlcnRpZXMuZGVzY2VudCk7XG5cdFx0XHRcdFx0bGluZVlNYXggPSBNYXRoLm1heChsaW5lWU1heCwgc3R5LnZhbGlnbiArIG91dHB1dFRleHREYXRhW2ldW2pdLmZvbnRQcm9wZXJ0aWVzLmFzY2VudCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bGluZVlNaW4gPSBNYXRoLm1pbihsaW5lWU1pbiwgLW91dHB1dFRleHREYXRhW2ldW2pdLmZvbnRQcm9wZXJ0aWVzLmRlc2NlbnQpO1xuXHRcdFx0XHRcdGxpbmVZTWF4ID0gTWF0aC5tYXgobGluZVlNYXgsIG91dHB1dFRleHREYXRhW2ldW2pdLmZvbnRQcm9wZXJ0aWVzLmFzY2VudCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0bGluZVdpZHRoc1tpXSA9IGxpbmVXaWR0aDtcblx0XHRcdGxpbmVZTWluc1tpXSA9IGxpbmVZTWluO1xuXHRcdFx0bGluZVlNYXhzW2ldID0gbGluZVlNYXg7XG5cdFx0XHRtYXhMaW5lV2lkdGggPSBNYXRoLm1heChtYXhMaW5lV2lkdGgsIGxpbmVXaWR0aCk7XG5cdFx0fVxuXG5cdFx0Ly8gdHJhbnNmb3JtIHN0eWxlcyBpbiBhcnJheVxuXHRcdGxldCBzdHlsZXNBcnJheSA9IE9iamVjdC5rZXlzKHRleHRTdHlsZXMpLm1hcCgoa2V5KSA9PiB0ZXh0U3R5bGVzW2tleV0pO1xuXG5cdFx0bGV0IG1heFN0cm9rZVRoaWNrbmVzcyA9IHN0eWxlc0FycmF5LnJlZHVjZSgocHJldiwgY3VyKSA9PiBNYXRoLm1heChwcmV2LCBjdXIuc3Ryb2tlVGhpY2tuZXNzIHx8IDApLCAwKTtcblxuXHRcdGxldCBkcm9wU2hhZG93UGFkZGluZyA9IHRoaXMuZ2V0RHJvcFNoYWRvd1BhZGRpbmcoKTtcblxuXHRcdGxldCB0b3RhbEhlaWdodCA9IGxpbmVZTWF4cy5yZWR1Y2UoKHByZXYsIGN1cikgPT4gcHJldiArIGN1ciwgMCkgLSBsaW5lWU1pbnMucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYgKyBjdXIsIDApO1xuXG5cdFx0Ly8gZGVmaW5lIHRoZSByaWdodCB3aWR0aCBhbmQgaGVpZ2h0XG5cdFx0bGV0IHdpZHRoID0gbWF4TGluZVdpZHRoICsgbWF4U3Ryb2tlVGhpY2tuZXNzICsgMiAqIGRyb3BTaGFkb3dQYWRkaW5nO1xuXHRcdGxldCBoZWlnaHQgPSB0b3RhbEhlaWdodCArIDIgKiBkcm9wU2hhZG93UGFkZGluZztcblxuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gKHdpZHRoICsgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCkgKiB0aGlzLnJlc29sdXRpb247XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0ICogdGhpcy5yZXNvbHV0aW9uO1xuXG5cdFx0dGhpcy5jb250ZXh0LnNjYWxlKHRoaXMucmVzb2x1dGlvbiwgdGhpcy5yZXNvbHV0aW9uKTtcblxuXHRcdHRoaXMuY29udGV4dC50ZXh0QmFzZWxpbmUgPSBcImFscGhhYmV0aWNcIjtcblx0XHR0aGlzLmNvbnRleHQubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cblx0XHRsZXQgYmFzZVBvc2l0aW9uWSA9IGRyb3BTaGFkb3dQYWRkaW5nO1xuXG5cdFx0bGV0IGRyYXdpbmdEYXRhOiBUZXh0RHJhd2luZ0RhdGFbXSA9IFtdO1xuXG5cdFx0Ly8gQ29tcHV0ZSB0aGUgZHJhd2luZyBkYXRhXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBvdXRwdXRUZXh0RGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IGxpbmUgPSBvdXRwdXRUZXh0RGF0YVtpXTtcblx0XHRcdGxldCBsaW5lUG9zaXRpb25YOiBudW1iZXI7XG5cblx0XHRcdHN3aXRjaCAodGhpcy5fc3R5bGUuYWxpZ24pIHtcblx0XHRcdFx0Y2FzZSBcImxlZnRcIjpcblx0XHRcdFx0XHRsaW5lUG9zaXRpb25YID0gZHJvcFNoYWRvd1BhZGRpbmc7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcImNlbnRlclwiOlxuXHRcdFx0XHRcdGxpbmVQb3NpdGlvblggPSBkcm9wU2hhZG93UGFkZGluZyArIChtYXhMaW5lV2lkdGggLSBsaW5lV2lkdGhzW2ldKSAvIDI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBcInJpZ2h0XCI6XG5cdFx0XHRcdFx0bGluZVBvc2l0aW9uWCA9IGRyb3BTaGFkb3dQYWRkaW5nICsgbWF4TGluZVdpZHRoIC0gbGluZVdpZHRoc1tpXTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBsaW5lLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGxldCB7IHN0eWxlLCB0ZXh0LCBmb250UHJvcGVydGllcywgd2lkdGgsIGhlaWdodCwgdGFnTmFtZSB9ID0gbGluZVtqXTtcblxuXHRcdFx0XHRsaW5lUG9zaXRpb25YICs9IG1heFN0cm9rZVRoaWNrbmVzcyAvIDI7XG5cblx0XHRcdFx0bGV0IGxpbmVQb3NpdGlvblkgPSBtYXhTdHJva2VUaGlja25lc3MgLyAyICsgYmFzZVBvc2l0aW9uWSArIGZvbnRQcm9wZXJ0aWVzLmFzY2VudDtcblxuXHRcdFx0XHRzd2l0Y2ggKHN0eWxlLnZhbGlnbikge1xuXHRcdFx0XHRcdGNhc2UgXCJ0b3BcIjpcblx0XHRcdFx0XHRcdC8vIG5vIG5lZWQgdG8gZG8gYW55dGhpbmdcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSBcImJhc2VsaW5lXCI6XG5cdFx0XHRcdFx0XHRsaW5lUG9zaXRpb25ZICs9IGxpbmVZTWF4c1tpXSAtIGZvbnRQcm9wZXJ0aWVzLmFzY2VudDtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdFx0Y2FzZSBcIm1pZGRsZVwiOlxuXHRcdFx0XHRcdFx0bGluZVBvc2l0aW9uWSArPSAobGluZVlNYXhzW2ldIC0gbGluZVlNaW5zW2ldIC0gZm9udFByb3BlcnRpZXMuYXNjZW50IC0gZm9udFByb3BlcnRpZXMuZGVzY2VudCkgLyAyO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0XHRjYXNlIFwiYm90dG9tXCI6XG5cdFx0XHRcdFx0XHRsaW5lUG9zaXRpb25ZICs9IGxpbmVZTWF4c1tpXSAtIGxpbmVZTWluc1tpXSAtIGZvbnRQcm9wZXJ0aWVzLmFzY2VudCAtIGZvbnRQcm9wZXJ0aWVzLmRlc2NlbnQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblxuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHQvLyBBIG51bWJlciAtIG9mZnNldCBmcm9tIGJhc2VsaW5lLCBwb3NpdGl2ZSBpcyBoaWdoZXJcblx0XHRcdFx0XHRcdGxpbmVQb3NpdGlvblkgKz0gbGluZVlNYXhzW2ldIC0gZm9udFByb3BlcnRpZXMuYXNjZW50IC0gc3R5bGUudmFsaWduO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoc3R5bGUubGV0dGVyU3BhY2luZyA9PT0gMCkge1xuXHRcdFx0XHRcdGRyYXdpbmdEYXRhLnB1c2goe1xuXHRcdFx0XHRcdFx0dGV4dCxcblx0XHRcdFx0XHRcdHN0eWxlLFxuXHRcdFx0XHRcdFx0eDogbGluZVBvc2l0aW9uWCxcblx0XHRcdFx0XHRcdHk6IGxpbmVQb3NpdGlvblksXG5cdFx0XHRcdFx0XHR3aWR0aCxcblx0XHRcdFx0XHRcdGFzY2VudDogZm9udFByb3BlcnRpZXMuYXNjZW50LFxuXHRcdFx0XHRcdFx0ZGVzY2VudDogZm9udFByb3BlcnRpZXMuZGVzY2VudCxcblx0XHRcdFx0XHRcdHRhZ05hbWVcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGxpbmVQb3NpdGlvblggKz0gbGluZVtqXS53aWR0aDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuZm9udCA9IHRoaXMuZ2V0Rm9udFN0cmluZyhsaW5lW2pdLnN0eWxlKTtcblxuXHRcdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwgdGV4dC5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdFx0aWYgKGsgPiAwIHx8IGogPiAwKSB7XG5cdFx0XHRcdFx0XHRcdGxpbmVQb3NpdGlvblggKz0gc3R5bGUubGV0dGVyU3BhY2luZyAvIDI7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGRyYXdpbmdEYXRhLnB1c2goe1xuXHRcdFx0XHRcdFx0XHR0ZXh0OiB0ZXh0LmNoYXJBdChrKSxcblx0XHRcdFx0XHRcdFx0c3R5bGUsXG5cdFx0XHRcdFx0XHRcdHg6IGxpbmVQb3NpdGlvblgsXG5cdFx0XHRcdFx0XHRcdHk6IGxpbmVQb3NpdGlvblksXG5cdFx0XHRcdFx0XHRcdHdpZHRoLFxuXHRcdFx0XHRcdFx0XHRhc2NlbnQ6IGZvbnRQcm9wZXJ0aWVzLmFzY2VudCxcblx0XHRcdFx0XHRcdFx0ZGVzY2VudDogZm9udFByb3BlcnRpZXMuZGVzY2VudCxcblx0XHRcdFx0XHRcdFx0dGFnTmFtZVxuXHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdGxpbmVQb3NpdGlvblggKz0gdGhpcy5jb250ZXh0Lm1lYXN1cmVUZXh0KHRleHQuY2hhckF0KGspKS53aWR0aDtcblxuXHRcdFx0XHRcdFx0aWYgKGsgPCB0ZXh0Lmxlbmd0aCAtIDEgfHwgaiA8IGxpbmUubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRcdFx0XHRsaW5lUG9zaXRpb25YICs9IHN0eWxlLmxldHRlclNwYWNpbmcgLyAyO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxpbmVQb3NpdGlvblggLT0gbWF4U3Ryb2tlVGhpY2tuZXNzIC8gMjtcblx0XHRcdH1cblxuXHRcdFx0YmFzZVBvc2l0aW9uWSArPSBsaW5lWU1heHNbaV0gLSBsaW5lWU1pbnNbaV07XG5cdFx0fVxuXG5cdFx0dGhpcy5jb250ZXh0LnNhdmUoKTtcblxuXHRcdC8vIEZpcnN0IHBhc3M6IGRyYXcgdGhlIHNoYWRvd3Mgb25seVxuXHRcdGRyYXdpbmdEYXRhLmZvckVhY2goKHsgc3R5bGUsIHRleHQsIHgsIHkgfSkgPT4ge1xuXHRcdFx0aWYgKCFzdHlsZS5kcm9wU2hhZG93KSB7XG5cdFx0XHRcdHJldHVybjsgLy8gVGhpcyB0ZXh0IGRvZXNuJ3QgaGF2ZSBhIHNoYWRvd1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmNvbnRleHQuZm9udCA9IHRoaXMuZ2V0Rm9udFN0cmluZyhzdHlsZSk7XG5cblx0XHRcdGxldCBkcm9wRmlsbFN0eWxlID0gc3R5bGUuZHJvcFNoYWRvd0NvbG9yO1xuXHRcdFx0aWYgKHR5cGVvZiBkcm9wRmlsbFN0eWxlID09PSBcIm51bWJlclwiKSB7XG5cdFx0XHRcdGRyb3BGaWxsU3R5bGUgPSBQSVhJLnV0aWxzLmhleDJzdHJpbmcoZHJvcEZpbGxTdHlsZSk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmNvbnRleHQuc2hhZG93Q29sb3IgPSBkcm9wRmlsbFN0eWxlO1xuXHRcdFx0dGhpcy5jb250ZXh0LnNoYWRvd0JsdXIgPSBzdHlsZS5kcm9wU2hhZG93Qmx1cjtcblx0XHRcdHRoaXMuY29udGV4dC5zaGFkb3dPZmZzZXRYID0gTWF0aC5jb3Moc3R5bGUuZHJvcFNoYWRvd0FuZ2xlKSAqIHN0eWxlLmRyb3BTaGFkb3dEaXN0YW5jZSAqIHRoaXMucmVzb2x1dGlvbjtcblx0XHRcdHRoaXMuY29udGV4dC5zaGFkb3dPZmZzZXRZID0gTWF0aC5zaW4oc3R5bGUuZHJvcFNoYWRvd0FuZ2xlKSAqIHN0eWxlLmRyb3BTaGFkb3dEaXN0YW5jZSAqIHRoaXMucmVzb2x1dGlvbjtcblxuXHRcdFx0dGhpcy5jb250ZXh0LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuXHRcdC8vIFNlY29uZCBwYXNzOiBkcmF3IHN0cm9rZXMgYW5kIGZpbGxzXG5cdFx0ZHJhd2luZ0RhdGEuZm9yRWFjaCgoeyBzdHlsZSwgdGV4dCwgeCwgeSwgd2lkdGgsIGFzY2VudCwgZGVzY2VudCwgdGFnTmFtZSB9KSA9PiB7XG5cdFx0XHR0aGlzLmNvbnRleHQuZm9udCA9IHRoaXMuZ2V0Rm9udFN0cmluZyhzdHlsZSk7XG5cblx0XHRcdGxldCBzdHJva2VTdHlsZSA9IHN0eWxlLnN0cm9rZTtcblx0XHRcdGlmICh0eXBlb2Ygc3Ryb2tlU3R5bGUgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0c3Ryb2tlU3R5bGUgPSBQSVhJLnV0aWxzLmhleDJzdHJpbmcoc3Ryb2tlU3R5bGUpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBzdHJva2VTdHlsZTtcblx0XHRcdHRoaXMuY29udGV4dC5saW5lV2lkdGggPSBzdHlsZS5zdHJva2VUaGlja25lc3M7XG5cblx0XHRcdC8vIHNldCBjYW52YXMgdGV4dCBzdHlsZXNcblx0XHRcdGxldCBmaWxsU3R5bGUgPSBzdHlsZS5maWxsO1xuXHRcdFx0aWYgKHR5cGVvZiBmaWxsU3R5bGUgPT09IFwibnVtYmVyXCIpIHtcblx0XHRcdFx0ZmlsbFN0eWxlID0gUElYSS51dGlscy5oZXgyc3RyaW5nKGZpbGxTdHlsZSk7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZmlsbFN0eWxlKSkge1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGZpbGxTdHlsZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGxldCBmaWxsID0gZmlsbFN0eWxlW2ldO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgZmlsbCA9PT0gXCJudW1iZXJcIikge1xuXHRcdFx0XHRcdFx0ZmlsbFN0eWxlW2ldID0gUElYSS51dGlscy5oZXgyc3RyaW5nKGZpbGwpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuX2dlbmVyYXRlRmlsbFN0eWxlKG5ldyBQSVhJLlRleHRTdHlsZShzdHlsZSksIFt0ZXh0XSkgYXMgc3RyaW5nIHwgQ2FudmFzR3JhZGllbnQ7XG5cdFx0XHQvLyBUeXBlY2FzdCByZXF1aXJlZCBmb3IgcHJvcGVyIHR5cGVjaGVja2luZ1xuXG5cdFx0XHRpZiAoc3R5bGUuc3Ryb2tlICYmIHN0eWxlLnN0cm9rZVRoaWNrbmVzcykge1xuXHRcdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlVGV4dCh0ZXh0LCB4LCB5KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHN0eWxlLmZpbGwpIHtcblx0XHRcdFx0dGhpcy5jb250ZXh0LmZpbGxUZXh0KHRleHQsIHgsIHkpO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgZGVidWdTcGFuID0gc3R5bGUuZGVidWcgPT09IHVuZGVmaW5lZFxuXHRcdFx0XHQ/IE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5zcGFucy5lbmFibGVkXG5cdFx0XHRcdDogc3R5bGUuZGVidWc7XG5cblx0XHRcdGlmIChkZWJ1Z1NwYW4pIHtcblx0XHRcdFx0dGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IDE7XG5cblx0XHRcdFx0aWYgKE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5zcGFucy5ib3VuZGluZykge1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMuc3BhbnMuYm91bmRpbmc7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLnNwYW5zLmJvdW5kaW5nO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQucmVjdCh4LCB5IC0gYXNjZW50LCB3aWR0aCwgYXNjZW50ICsgZGVzY2VudCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmZpbGwoKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZSgpOyAvLyB5ZXMsIHR3aWNlXG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLnNwYW5zLmJhc2VsaW5lKSB7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLnNwYW5zLmJhc2VsaW5lO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQubW92ZVRvKHgsIHkpO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5saW5lVG8oeCArIHdpZHRoLCB5KTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5zcGFucy50b3ApIHtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMuc3BhbnMudG9wO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQubW92ZVRvKHgsIHkgLSBhc2NlbnQpO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5saW5lVG8oeCArIHdpZHRoLCB5IC0gYXNjZW50KTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuY2xvc2VQYXRoKCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5zcGFucy5ib3R0b20pIHtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMuc3BhbnMuYm90dG9tO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQubW92ZVRvKHgsIHkgKyBkZXNjZW50KTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQubGluZVRvKHggKyB3aWR0aCwgeSArIGRlc2NlbnQpO1xuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5jbG9zZVBhdGgoKTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLnNwYW5zLnRleHQpIHtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gXCIjZmZmZmZmXCI7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gXCIjMDAwMDAwXCI7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IDI7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmZvbnQgPSBcIjhweCBtb25vc3BhY2VcIjtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlVGV4dCh0YWdOYW1lLCB4LCB5IC0gYXNjZW50ICsgOCk7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmZpbGxUZXh0KHRhZ05hbWUsIHgsIHkgLSBhc2NlbnQgKyA4KTtcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlVGV4dChgJHt3aWR0aC50b0ZpeGVkKDIpfXgkeyhhc2NlbnQgKyBkZXNjZW50KS50b0ZpeGVkKDIpfWAsIHgsIHkgLSBhc2NlbnQgKyAxNik7XG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmZpbGxUZXh0KGAke3dpZHRoLnRvRml4ZWQoMil9eCR7KGFzY2VudCArIGRlc2NlbnQpLnRvRml4ZWQoMil9YCwgeCwgeSAtIGFzY2VudCArIDE2KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKE11bHRpU3R5bGVUZXh0LmRlYnVnT3B0aW9ucy5vYmplY3RzLmVuYWJsZWQpIHtcblx0XHRcdGlmIChNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMub2JqZWN0cy5ib3VuZGluZykge1xuXHRcdFx0XHR0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gTXVsdGlTdHlsZVRleHQuZGVidWdPcHRpb25zLm9iamVjdHMuYm91bmRpbmc7XG5cdFx0XHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdFx0dGhpcy5jb250ZXh0LnJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0XHRcdHRoaXMuY29udGV4dC5maWxsKCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChNdWx0aVN0eWxlVGV4dC5kZWJ1Z09wdGlvbnMub2JqZWN0cy50ZXh0KSB7XG5cdFx0XHRcdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBcIiNmZmZmZmZcIjtcblx0XHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gXCIjMDAwMDAwXCI7XG5cdFx0XHRcdHRoaXMuY29udGV4dC5saW5lV2lkdGggPSAyO1xuXHRcdFx0XHR0aGlzLmNvbnRleHQuZm9udCA9IFwiOHB4IG1vbm9zcGFjZVwiO1xuXHRcdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlVGV4dChgJHt3aWR0aC50b0ZpeGVkKDIpfXgke2hlaWdodC50b0ZpeGVkKDIpfWAsIDAsIDgsIHdpZHRoKTtcblx0XHRcdFx0dGhpcy5jb250ZXh0LmZpbGxUZXh0KGAke3dpZHRoLnRvRml4ZWQoMil9eCR7aGVpZ2h0LnRvRml4ZWQoMil9YCwgMCwgOCwgd2lkdGgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMudXBkYXRlVGV4dHVyZSgpO1xuXHR9XG5cblx0cHJvdGVjdGVkIHdvcmRXcmFwKHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG5cdFx0Ly8gR3JlZWR5IHdyYXBwaW5nIGFsZ29yaXRobSB0aGF0IHdpbGwgd3JhcCB3b3JkcyBhcyB0aGUgbGluZSBncm93cyBsb25nZXIgdGhhbiBpdHMgaG9yaXpvbnRhbCBib3VuZHMuXG5cdFx0bGV0IHJlc3VsdCA9ICcnO1xuXHRcdGxldCB0YWdzID0gT2JqZWN0LmtleXModGhpcy50ZXh0U3R5bGVzKS5qb2luKFwifFwiKTtcblx0XHRsZXQgcmUgPSBuZXcgUmVnRXhwKGAoPFxcLz8oJHt0YWdzfSk+KWAsIFwiZ1wiKTtcblxuXHRcdGNvbnN0IGxpbmVzID0gdGV4dC5zcGxpdChcIlxcblwiKTtcblx0XHRjb25zdCB3b3JkV3JhcFdpZHRoID0gdGhpcy5fc3R5bGUud29yZFdyYXBXaWR0aDtcblx0XHRsZXQgc3R5bGVTdGFjayA9IFt0aGlzLmFzc2lnbih7fSwgdGhpcy50ZXh0U3R5bGVzW1wiZGVmYXVsdFwiXSldO1xuXHRcdHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5nZXRGb250U3RyaW5nKHRoaXMudGV4dFN0eWxlc1tcImRlZmF1bHRcIl0pO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IHNwYWNlTGVmdCA9IHdvcmRXcmFwV2lkdGg7XG5cdFx0XHRjb25zdCB3b3JkcyA9IGxpbmVzW2ldLnNwbGl0KFwiIFwiKTtcblxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB3b3Jkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRjb25zdCBwYXJ0cyA9IHdvcmRzW2pdLnNwbGl0KHJlKTtcblxuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IHBhcnRzLmxlbmd0aDsgaysrKSB7XG5cdFx0XHRcdFx0aWYgKHJlLnRlc3QocGFydHNba10pKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgKz0gcGFydHNba107XG5cdFx0XHRcdFx0XHRpZiAocGFydHNba11bMV0gPT09IFwiL1wiKSB7XG5cdFx0XHRcdFx0XHRcdGsrKztcblx0XHRcdFx0XHRcdFx0c3R5bGVTdGFjay5wb3AoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGsrKztcblx0XHRcdFx0XHRcdFx0c3R5bGVTdGFjay5wdXNoKHRoaXMuYXNzaWduKHt9LCBzdHlsZVN0YWNrW3N0eWxlU3RhY2subGVuZ3RoIC0gMV0sIHRoaXMudGV4dFN0eWxlc1twYXJ0c1trXV0pKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMuY29udGV4dC5mb250ID0gdGhpcy5nZXRGb250U3RyaW5nKHN0eWxlU3RhY2tbc3R5bGVTdGFjay5sZW5ndGggLSAxXSk7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjb25zdCBwYXJ0V2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQocGFydHNba10pLndpZHRoO1xuXG5cdFx0XHRcdFx0aWYgKHRoaXMuX3N0eWxlLmJyZWFrV29yZHMgJiYgcGFydFdpZHRoID4gc3BhY2VMZWZ0KSB7XG5cdFx0XHRcdFx0XHQvLyBQYXJ0IHNob3VsZCBiZSBzcGxpdCBpbiB0aGUgbWlkZGxlXG5cdFx0XHRcdFx0XHRjb25zdCBjaGFyYWN0ZXJzID0gcGFydHNba10uc3BsaXQoJycpO1xuXG5cdFx0XHRcdFx0XHRpZiAoaiA+IDAgJiYgayA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHQgKz0gXCIgXCI7XG5cdFx0XHRcdFx0XHRcdHNwYWNlTGVmdCAtPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQoXCIgXCIpLndpZHRoO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBjID0gMDsgYyA8IGNoYXJhY3RlcnMubGVuZ3RoOyBjKyspIHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgY2hhcmFjdGVyV2lkdGggPSB0aGlzLmNvbnRleHQubWVhc3VyZVRleHQoY2hhcmFjdGVyc1tjXSkud2lkdGg7XG5cblx0XHRcdFx0XHRcdFx0aWYgKGNoYXJhY3RlcldpZHRoID4gc3BhY2VMZWZ0KSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0ICs9IGBcXG4ke2NoYXJhY3RlcnNbY119YDtcblx0XHRcdFx0XHRcdFx0XHRzcGFjZUxlZnQgPSB3b3JkV3JhcFdpZHRoIC0gY2hhcmFjdGVyV2lkdGg7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKGogPiAwICYmIGsgPT09IDAgJiYgYyA9PT0gMCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0ICs9IFwiIFwiO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdCArPSBjaGFyYWN0ZXJzW2NdO1xuXHRcdFx0XHRcdFx0XHRcdHNwYWNlTGVmdCAtPSBjaGFyYWN0ZXJXaWR0aDtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZih0aGlzLl9zdHlsZS5icmVha1dvcmRzKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgKz0gcGFydHNba107XG5cdFx0XHRcdFx0XHRzcGFjZUxlZnQgLT0gcGFydFdpZHRoO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjb25zdCBwYWRkZWRQYXJ0V2lkdGggPVxuXHRcdFx0XHRcdFx0XHRwYXJ0V2lkdGggKyAoayA9PT0gMCA/IHRoaXMuY29udGV4dC5tZWFzdXJlVGV4dChcIiBcIikud2lkdGggOiAwKTtcblxuXHRcdFx0XHRcdFx0aWYgKGogPT09IDAgfHwgcGFkZGVkUGFydFdpZHRoID4gc3BhY2VMZWZ0KSB7XG5cdFx0XHRcdFx0XHRcdC8vIFNraXAgcHJpbnRpbmcgdGhlIG5ld2xpbmUgaWYgaXQncyB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgbGluZSB0aGF0IGlzXG5cdFx0XHRcdFx0XHRcdC8vIGdyZWF0ZXIgdGhhbiB0aGUgd29yZCB3cmFwIHdpZHRoLlxuXHRcdFx0XHRcdFx0XHRpZiAoaiA+IDApIHtcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQgKz0gXCJcXG5cIjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRyZXN1bHQgKz0gcGFydHNba107XG5cdFx0XHRcdFx0XHRcdHNwYWNlTGVmdCA9IHdvcmRXcmFwV2lkdGggLSBwYXJ0V2lkdGg7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRzcGFjZUxlZnQgLT0gcGFkZGVkUGFydFdpZHRoO1xuXG5cdFx0XHRcdFx0XHRcdGlmIChrID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0ICs9IFwiIFwiO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmVzdWx0ICs9IHBhcnRzW2tdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoaSA8IGxpbmVzLmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0cmVzdWx0ICs9ICdcXG4nO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH1cblxuXHRwcm90ZWN0ZWQgdXBkYXRlVGV4dHVyZSgpIHtcblx0XHRjb25zdCB0ZXh0dXJlID0gdGhpcy5fdGV4dHVyZTtcblxuXHRcdGxldCBkcm9wU2hhZG93UGFkZGluZyA9IHRoaXMuZ2V0RHJvcFNoYWRvd1BhZGRpbmcoKTtcblxuXHRcdC8vIHRleHR1cmUuYmFzZVRleHR1cmUuaGFzTG9hZGVkID0gdHJ1ZTtcblx0XHR0ZXh0dXJlLmJhc2VUZXh0dXJlLnJlc29sdXRpb24gPSB0aGlzLnJlc29sdXRpb247XG5cblx0XHQvL3RleHR1cmUuYmFzZVRleHR1cmUucmVhbFdpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XG5cdFx0Ly90ZXh0dXJlLmJhc2VUZXh0dXJlLnJlYWxIZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XG5cdFx0XG5cdFx0Ly90ZXh0dXJlLmJhc2VUZXh0dXJlLnNldFJlYWxTaXplKHRoaXMuY2FudmFzLndpZHRoICwgdGhpcy5jYW52YXMuaGVpZ2h0ICwgMSk7XG5cdFx0dGV4dHVyZS5iYXNlVGV4dHVyZS53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoIC8gdGhpcy5yZXNvbHV0aW9uO1xuXHRcdHRleHR1cmUuYmFzZVRleHR1cmUuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gdGhpcy5yZXNvbHV0aW9uO1xuXHRcdHRleHR1cmUudHJpbS53aWR0aCA9IHRleHR1cmUuZnJhbWUud2lkdGggPSB0aGlzLmNhbnZhcy53aWR0aCAvIHRoaXMucmVzb2x1dGlvbjtcblx0XHR0ZXh0dXJlLnRyaW0uaGVpZ2h0ID0gdGV4dHVyZS5mcmFtZS5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyB0aGlzLnJlc29sdXRpb247XG5cblx0XHR0ZXh0dXJlLnRyaW0ueCA9IC10aGlzLl9zdHlsZS5wYWRkaW5nIC0gZHJvcFNoYWRvd1BhZGRpbmc7XG5cdFx0dGV4dHVyZS50cmltLnkgPSAtdGhpcy5fc3R5bGUucGFkZGluZyAtIGRyb3BTaGFkb3dQYWRkaW5nO1xuXG5cdFx0dGV4dHVyZS5vcmlnLndpZHRoID0gdGV4dHVyZS5mcmFtZS53aWR0aCAtICh0aGlzLl9zdHlsZS5wYWRkaW5nICsgZHJvcFNoYWRvd1BhZGRpbmcpICogMjtcblx0XHR0ZXh0dXJlLm9yaWcuaGVpZ2h0ID0gdGV4dHVyZS5mcmFtZS5oZWlnaHQgLSAodGhpcy5fc3R5bGUucGFkZGluZyArIGRyb3BTaGFkb3dQYWRkaW5nKSAqIDI7XG5cblx0XHQvLyBjYWxsIHNwcml0ZSBvblRleHR1cmVVcGRhdGUgdG8gdXBkYXRlIHNjYWxlIGlmIF93aWR0aCBvciBfaGVpZ2h0IHdlcmUgc2V0XG5cdFx0dGhpcy5fb25UZXh0dXJlVXBkYXRlKCk7XG5cblx0XHR0ZXh0dXJlLmJhc2VUZXh0dXJlLmVtaXQoJ3VwZGF0ZScsIHRleHR1cmUuYmFzZVRleHR1cmUpO1xuXG5cdFx0dGhpcy5kaXJ0eSA9IGZhbHNlO1xuXHR9XG5cblx0Ly8gTGF6eSBmaWxsIGZvciBPYmplY3QuYXNzaWduXG5cdHByaXZhdGUgYXNzaWduKGRlc3RpbmF0aW9uOiBhbnksIC4uLnNvdXJjZXM6IGFueVtdKTogYW55IHtcblx0XHRmb3IgKGxldCBzb3VyY2Ugb2Ygc291cmNlcykge1xuXHRcdFx0Zm9yIChsZXQga2V5IGluIHNvdXJjZSkge1xuXHRcdFx0XHRkZXN0aW5hdGlvbltrZXldID0gc291cmNlW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRlc3RpbmF0aW9uO1xuXHR9XG59XG4iXX0=
