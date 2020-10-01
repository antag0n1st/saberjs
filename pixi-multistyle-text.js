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
    var INTERACTION_EVENTS = [
        "pointerover",
        "pointerenter",
        "pointerdown",
        "pointermove",
        "pointerup",
        "pointercancel",
        "pointerout",
        "pointerleave",
        "gotpointercapture",
        "lostpointercapture",
        "mouseover",
        "mouseenter",
        "mousedown",
        "mousemove",
        "mouseup",
        "mousecancel",
        "mouseout",
        "mouseleave",
        "touchover",
        "touchenter",
        "touchdown",
        "touchmove",
        "touchup",
        "touchcancel",
        "touchout",
        "touchleave"
    ];
    var MultiStyleText = (function (_super) {
        __extends(MultiStyleText, _super);
        function MultiStyleText(text, styles) {
            var _this = _super.call(this, text) || this;
            _this.styles = styles;
            INTERACTION_EVENTS.forEach(function (event) {
                _this.on(event, function (e) { return _this.handleInteraction(e); });
            });
            return _this;
        }
        MultiStyleText.prototype.handleInteraction = function (e) {
            var ev = e;
            var localPoint = e.data.getLocalPosition(this);
            var targetTag = this.hitboxes.reduce(function (prev, hitbox) { return prev !== undefined ? prev : (hitbox.hitbox.contains(localPoint.x, localPoint.y) ? hitbox : undefined); }, undefined);
            ev.targetTag = targetTag === undefined ? undefined : targetTag.tag;
        };
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
        MultiStyleText.prototype.getTagRegex = function (captureName, captureMatch) {
            var tagAlternation = Object.keys(this.textStyles).join("|");
            if (captureName) {
                tagAlternation = "(" + tagAlternation + ")";
            }
            else {
                tagAlternation = "(?:" + tagAlternation + ")";
            }
            var reStr = "<" + tagAlternation + "(?:\\s+[A-Za-z0-9_\\-]+=(?:\"(?:[^\"]+|\\\\\")*\"|'(?:[^']+|\\\\')*'))*\\s*>|</" + tagAlternation + "\\s*>";
            if (captureMatch) {
                reStr = "(" + reStr + ")";
            }
            return new RegExp(reStr, "g");
        };
        MultiStyleText.prototype.getPropertyRegex = function () {
            return new RegExp("([A-Za-z0-9_\\-]+)=(?:\"((?:[^\"]+|\\\\\")*)\"|'((?:[^']+|\\\\')*)')", "g");
        };
        MultiStyleText.prototype._getTextDataPerLine = function (lines) {
            var outputTextData = [];
            var re = this.getTagRegex(true, false);
         
            var styleStack = [this.assign({}, this.textStyles["default"])];
            var tagStack = [{ name: "default", properties: {} }];
            for (var i = 0; i < lines.length; i++) {
                var lineTextData = [];
                var matches = [];
                var matchArray = void 0;
                while (matchArray = re.exec(lines[i])) {
                    matches.push(matchArray);
                }
                
               
                if (matches.length === 0) {                   
                    lineTextData.push(this.createTextData(lines[i], styleStack[styleStack.length - 1], tagStack[tagStack.length - 1]));
                }  else {
                    
                    var currentSearchIdx = 0;
                   
                    var _length = lineTextData.length;
                    
                    for (var j = 0; j < matches.length; j++) {
                        
                        if (matches[j].index > currentSearchIdx) {
                            lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx, matches[j].index), styleStack[styleStack.length - 1], tagStack[tagStack.length - 1]));
                        } 
                        
                        if (matches[j][0][1] === "/") {
                            if (styleStack.length > 1) {
                                styleStack.pop();
                                tagStack.pop();
                            }
                        } else {
                            var properties = {};
                            var propertyRegex = this.getPropertyRegex();
                            var propertyMatch = void 0;
                            while (propertyMatch = propertyRegex.exec(matches[j][0])) {
                                properties[propertyMatch[1]] = propertyMatch[2] || propertyMatch[3];
                            }
                            var _tag = { name: matches[j][1], properties: properties };
                            tagStack.push(_tag);
                          
                            var ss = this.assign({}, styleStack[styleStack.length - 1] , this.textStyles[matches[j][1]]);
                            this.updateStyle(ss,_tag);
                            styleStack.push(ss);
                        }
                        currentSearchIdx = matches[j].index + matches[j][0].length;
                    }
                                        
                    if (currentSearchIdx < lines[i].length) {
                        lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx), styleStack[styleStack.length - 1], tagStack[tagStack.length - 1]));
                    }
                    
                    //  its an empty line
                    if(_length === lineTextData.length){
                            lineTextData.push(this.createTextData(lines[i].substring(currentSearchIdx), styleStack[styleStack.length - 1], tagStack[tagStack.length - 1]));
                   
                    }
                }
                
                outputTextData.push(lineTextData);
            }
            
            return outputTextData;
        };
        MultiStyleText.prototype.getFontString = function (style) {
            return new PIXI.TextStyle(style).toFontString();
        };
        MultiStyleText.prototype.createTextData = function (text, style, tag) {           
            return {
                text: text,
                style: style,
                width: 0,
                height: 0,
                fontProperties: undefined,
                tag: tag
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
        
        MultiStyleText.prototype.updateStyle = function (style,tag) {
            
                    var newStyles = {};
                    for (var prop in tag.properties) {
                        if (Object.prototype.hasOwnProperty.call(tag.properties, prop)) {
                            // do stuff
                            var value = tag.properties[prop];
                            if(prop === "style" && value){
                                var _vals = value.split(";");
                                for (var _i = 0; _i < _vals.length; _i++) {
                                    var _v = _vals[_i];
                                    var _keyValues = _v.split(':');
                                    if(_keyValues.length === 2){
                                        var _styleKey = _keyValues[0].trim();
                                        var _styleValue = _keyValues[1].trim();
                                        if(_styleKey === 'font-size'){
                                            _styleKey = 'fontSize';
                                        } else if(_styleKey === 'text-align'){
                                            _styleKey = 'align';
                                        }
                                        newStyles[_styleKey] = _styleValue;
                                    }                                    
                                }
                            } else if(prop === "face"){
                                newStyles['fontFamily'] = value;
                            } else if(prop === "color"){
                                newStyles['fill'] = value;
                            }
                        }
                    }
                    
                    for (var prop in newStyles) {
                        if (Object.prototype.hasOwnProperty.call(newStyles, prop)) {
                            style[prop] = newStyles[prop];
                        }
                    }
        };
        
        MultiStyleText.prototype.updateText = function () {
            var _this = this;
            if (!this.dirty) {
                return;
            }
            this.hitboxes = [];
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
            var maxLineHeight = 0;
            this.linesData = outputTextData;
        
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
                    
                    maxLineHeight = Math.max(maxLineHeight , outputTextData[i][j].height);
                }
                
                lineWidths[i] = lineWidth;
                lineYMins[i] = lineYMin;
                lineYMaxs[i] = Math.max(lineYMax, lineHeight);
                maxLineWidth = Math.max(maxLineWidth, lineWidth);
              
            }
            
            this.maxLineHeight = maxLineHeight;
            
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
                    var _a = line[j], style = _a.style, text = _a.text, fontProperties = _a.fontProperties, width_1 = _a.width, height_1 = _a.height, tag = _a.tag;
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
                            tag: tag
                        });
                        linePositionX += line[j].width;
                    }  else {
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
                                tag: tag
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
                var style = _a.style, text = _a.text, x = _a.x, y = _a.y, width = _a.width, ascent = _a.ascent, descent = _a.descent, tag = _a.tag;
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
                var offset = -_this._style.padding - _this.getDropShadowPadding();
                _this.hitboxes.push({
                    tag: tag,
                    hitbox: new PIXI.Rectangle(x + offset, y - ascent + offset, width, ascent + descent)
                });
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
                        _this.context.strokeText(tag.name, x, y - ascent + 8);
                        _this.context.fillText(tag.name, x, y - ascent + 8);
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
            var result = "";
            var re = this.getTagRegex(true, true);
            var lines = text.split("\n");
            var wordWrapWidth = this._style.wordWrapWidth;
            var styleStack = [this.assign({}, this.textStyles["default"])];
            this.context.font = this.getFontString(this.textStyles["default"]);
            for (var i = 0; i < lines.length; i++) {
                var spaceLeft = wordWrapWidth;
                var tagSplit = lines[i].split(re);
                var firstWordOfLine = true;
                for (var j = 0; j < tagSplit.length; j++) {
                    if (re.test(tagSplit[j])) {
                        result += tagSplit[j];
                        if (tagSplit[j][1] === "/") {
                            j += 2;
                            styleStack.pop();
                        }
                        else {
                            j++;
                            styleStack.push(this.assign({}, styleStack[styleStack.length - 1], this.textStyles[tagSplit[j]]));
                            j++;
                        }
                        this.context.font = this.getFontString(styleStack[styleStack.length - 1]);
                    }
                    else {
                        var words = tagSplit[j].split(" ");
                        for (var k = 0; k < words.length; k++) {
                            var wordWidth = this.context.measureText(words[k]).width;
                            if (this._style.breakWords && wordWidth > spaceLeft) {
                                var characters = words[k].split('');
                                if (k > 0) {
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
                                        result += characters[c];
                                        spaceLeft -= characterWidth;
                                    }
                                }
                            }
                            else if (this._style.breakWords) {
                                result += words[k];
                                spaceLeft -= wordWidth;
                            }
                            else {
                                var paddedWordWidth = wordWidth + (k > 0 ? this.context.measureText(" ").width : 0);
                                if (paddedWordWidth > spaceLeft) {
                                    if (!firstWordOfLine) {
                                        result += "\n";
                                    }
                                    result += words[k];
                                    spaceLeft = wordWrapWidth - wordWidth;
                                }
                                else {
                                    spaceLeft -= paddedWordWidth;
                                    if (k > 0) {
                                        result += " ";
                                    }
                                    result += words[k];
                                }
                            }
                            firstWordOfLine = false;
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
            texture.baseTexture.hasLoaded = true;
            texture.baseTexture.resolution = this.resolution;
            texture.baseTexture.realWidth = this.canvas.width;
            texture.baseTexture.realHeight = this.canvas.height;
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