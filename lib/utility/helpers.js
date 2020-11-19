
Array.matrix = function (m, n, initial) {
    var a, i, j, mat = [];
    for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
};

Math.getDistance = function (p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

Math.getAngle = function (p1, p2) {
    if (p1 === null || p2 === null) {
        return 0;
    }
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

Math.getDistanceFromLine = function (p, a, b) {

    var atob = {x: b.x - a.x, y: b.y - a.y};
    var atop = {x: p.x - a.x, y: p.y - a.y};
    var len = atob.x * atob.x + atob.y * atob.y;
    var dot = atop.x * atob.x + atop.y * atob.y;
    var t = Math.min(1, Math.max(0, dot / len));

    dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);

    var pp = {
        x: a.x + atob.x * t,
        y: a.y + atob.y * t
    };

    return Math.getDistance(p, pp);

};

Math.insertionSort = function (sortMe, fnc) {

    for (var i = 0, j, tmp; i < sortMe.length; ++i) {
        tmp = sortMe[i];
        for (j = i - 1; j >= 0 && fnc(sortMe[j], tmp); --j) {
            sortMe[j + 1] = sortMe[j];
        }
        sortMe[j + 1] = tmp;
    }
};

Math.bubbleSort = function (a, fnc) {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (fnc(a[i], a[i + 1])) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
};

Math.degreesToRadians = function (degrees) {
    return degrees / 180 * Math.PI;
};

Math.radiansToDegrees = function (radians) {
    return radians * 180 / Math.PI;
};

Math.randomFloat = function (min, max) {
    return min + Math.random() * (max - min);
};

Math.randomInt = function (min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
};

Math.inRange = function (value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
};

Math.normalize = function (value, min, max) {
    return (value - min) / (max - min);
};

Math.lerp = function (norm, min, max) {
    return (max - min) * norm + min;
};

Math.map = function (value, sourceMin, sourceMax, destMin, destMax) {
    return Math.lerp(Math.normalize(value, sourceMin, sourceMax), destMin, destMax);
};

Math.clamp = function (value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

Math.roundDecimal = function (value, places) {
    var mult = Math.pow(10, places);
    return Math.round(value * mult) / mult;
};

if (typeof (log) == "undefined") {
    function log(msg) {
        console.log(msg);
    }
}

function trace(msg) {
    console.trace(msg);
}

//TODO consider
// console.table();

String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function generateString(length,hasWhitespace) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   if(hasWhitespace){
       characters = ' ' + characters + ' ';;
   }
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function toHHMMSS(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var s = seconds - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (s < 10) {
        s = "0" + s;
    }
    return hours + ':' + minutes + ':' + s;
}

function toMMSS(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var s = seconds - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (s < 10) {
        s = "0" + s;
    }
    return minutes + ':' + s;
}

function timeout(callback, duration, context, tag) {
    var t = new Timer(callback, duration, context);
    tag = tag || 0;
    t.run(tag);
    return t;
}

Object.defineProperty(Array.prototype, "removeElement", {

    enumerable: false,
    value: function (itemToRemove) {
        var removeCounter = 0;

        for (var index = 0; index < this.length; index++) {
            if (this[index] === itemToRemove) {
                this.splice(index, 1);
                removeCounter++;
                index--;
            }
        }
        return removeCounter;
    }
});

Object.defineProperty(Array.prototype, "getRandom", {
    enumerable: false,
    value: function () {
        return this[Math.randomInt(0, this.length - 1)];
    }
});

function serialize(obj, prefix) {
    var str = [];
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(typeof v == "object" ?
                    serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}
;

function createAjax() {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xhttp;
}

function ajaxGet(url, callback , headers) {

    var xhttp = createAjax();
    
    if (headers) {

        for (var prop in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, prop)) {
                xhttp.setRequestHeader(prop, headers[prop]);
            }
        }
    } 

    xhttp.onreadystatechange = function () {

        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                var ct = xhttp.getResponseHeader("content-type") || "";
                if (ct.indexOf('json') > -1) {
                    callback(JSON.parse(xhttp.responseText), xhttp);
                } else {
                    callback(xhttp.responseText, xhttp);
                }
            } else {
                if (callback) {
                    callback(null, xhttp);
                }
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();

}

function ajaxPost(url, data, callback, headers) {


    var xhttp = createAjax();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
                if (callback) {

                    var ct = xhttp.getResponseHeader("content-type") || "";
                    if (ct.indexOf('json') > -1) {
                        var response = xhttp.responseText;
                        try {
                            response = JSON.parse(xhttp.responseText);
                        } catch (e) {
                            response = xhttp.responseText;
                        }
                        callback(response, xhttp);
                    } else {
                        callback(xhttp.responseText, xhttp);
                    }
                }
            } else {
                if (callback) {
                    callback(null, xhttp);
                }
            }
        }
    };

    xhttp.open("POST", url, true);

    if (headers) {

        for (var prop in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, prop)) {
                xhttp.setRequestHeader(prop, headers[prop]);
            }
        }
    } else {
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }

    if (data instanceof FormData) {
        xhttp.send(data);
    } else {
        var data_string = serialize(data);
        xhttp.send(data_string);
    }

}

function lang(key) {
    var text = Localization.instance().text[key];
    return text ? text : key;
}

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
}

function daysBetween(start_date, end_date) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(end_date) - treatAsUTC(start_date)) / millisecondsPerDay;
}

function createPointsInSpace(n, width, height, check_center, distance) {

    var distance_center = 350;
    var distance_between = distance || 250;

    var created = 0;

    var points = [];

    var center = new V(width / 2, height / 2);

    var cycles = 0;

    while (created < n) {

        var is_valid = true;
        var p = new V(Math.randomInt(0, width), Math.randomInt(0, height));

        cycles++;

        if (cycles > 1000) {
            distance_between--;
        }

        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            if (Math.getDistance(p, point) < distance_between) {
                is_valid = false;
                break;
            }
        }

        if (check_center && Math.getDistance(p, center) < distance_center) {
            is_valid = false;
        }

        if (is_valid) {
            created++;
            points.push(p);
        }

    }

    return points;
}

function getQueryString(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.search);
    if (results === null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function leadingZeros(number, zeros) {

    var s = number + "";
    while (s.length < zeros)
        s = "0" + s;
    return s;

}

/**
 * 
 * @param {String} {item:item,name:name}
 * @returns {String.prototype@call;replace}
 */
String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
    );
};

String.prototype.smartShort = function (words_count, text_length) {

    text_length = text_length || 20;

    if (words_count === 0) {
        return this.substr(0, text_length - 3) + '...';
    }

    var text = shorten(this, words_count, text_length);

    if (text.length > text_length) {
        return this.smartShort(words_count - 1, text_length);
    }

    return text;
};

function shorten(text, wordsCount, textLength) {
    var buffer = '';
    var delimiters = [' ', ',', '.', '!', '?'];
    var br = 0;
    for (var i = 0; i < text.length; i++) {
        buffer += text[i];
        if (delimiters.indexOf(text[i]) !== -1) {
            br++;
            if (br >= wordsCount || i >= textLength) {
                buffer += "...";
                break;
            }
        }
    }
    return buffer;
}

function googleAnalytics(pageName) {

    if (!app.device.isLocalhost) {

        if (window["_gTagID"]) {
            gtag('config', _gTagID, {
                'page_path': pageName
            });
        } else {
            console.warn("SaberJS: You need to define a global variable _gTagID");
        }

    } else {
        log('localhost pageview : ' + pageName);
    }

}

function inArray(array, element) {
    return (array.indexOf(element) !== -1);
}

function convertColor(hex) {
    if (hex === "transparent" || hex === "#ffffff" || hex === "#FFFFFF") {
        return 0xffffff;
    }
    var color = hex || "";
    color = color.replace('#', '0x');
    color = PIXI.utils.hex2rgb(color);
    return Color.get_color_32(1, color[0] * 255, color[1] * 255, color[2] * 255);
}

function getDateByTimeZone(offset) {

    offset = offset || 0;

    var clientDate = new Date();
    var utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);

    return new Date(utc + (3600000 * offset));

}

function isDateBetween(current_date, start_date, end_date) {
    var date = new Date(current_date.getFullYear(), current_date.getMonth(), current_date.getDate());

    if (date >= start_date && date <= end_date) {
        return true;
    }

    return false;
}

function applyToConstructor(constructor, argArray) {
    var args = [null].concat(argArray);
    var factoryFunction = constructor.bind.apply(constructor, args);
    return new factoryFunction();
}

function uuid() {

    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}