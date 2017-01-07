/* jshint node: true, strict: true */

/**
 * querySelector wrapper
 *
 * @param {string} selector Selector to query
 * @param {Element} [scope] Optional scope element for the selector
 */
export function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

/**
 * querySelector wrapper
 *
 * @param {string} selector Selector to query
 * @param {Element} [scope] Optional scope element for the selector
 */
export function qsAll(selector, scope) {
  return (scope || document).querySelectorAll(selector);
}

/**
 * Parses the values of a attribute on a DOM element to a array
 *
 * @param {HTMLElement} element A DOM element
 * @param {String} attribute The attribute on the element which should be parsed
 * @returns {Array}
 */

module.exports.attributeToArray = function attributeToArray(element, attribute) {
  return element.getAttribute(attribute) ? element.getAttribute(attribute).split(' ') : [];
};


/**
 * Removes a CSS class name from a DOM element
 *
 * @param {element} HTMLElement A DOM element
 * @param {className} String Name of the class to remove
 * @returns {HTMLElement}
 */

module.exports.removeClass = function removeClass(target, className) {
  if (target) {
    if (target.classList) {
      target.classList.remove(className);
    }
  }
  return target;
};

/**
 * Check if a DOM element contains a class name
 *
 * @param {HTMLElement} element A DOM element
 * @param {String} className The name of the class to check for
 * @returns {Boolean}
 */

module.exports.contains = function(element, className) {
    var classNames = this.attributeToArray(element, 'class');
    return classNames.indexOf(className) !== -1;
};

module.exports.createDate = function(date) {
    return new Date(date).getTime();
};

module.exports.periodFormatted = function periodFormatted(amount) {
    var delimiter = ".", minus = '', parsedAsInt = parseInt(amount), n, a;
    if (isNaN(parsedAsInt)) {
        return '0';
    }

    if (parsedAsInt < 0) {
        minus = '-';
    }

    n = new String(Math.abs(parsedAsInt));
    a = [];
    while (n.length > 3) {
        var nn = n.substr(n.length - 3);
        a.unshift(nn);
        n = n.substr(0, n.length - 3);
    }

    if (n.length > 0) {
        a.unshift(n);
    }

    return minus + a.join(delimiter);
};

module.exports.shorten = function (text, maxLength) {
    var result = text;

    if (maxLength < text.length) {
        result = text.substr(0, maxLength - 3) + '...';
    }
    return result;
};

module.exports.addClass = function(target, className) {
    if(target) {
        if(target.classList){
            target.classList.add(className);
        } else {
            // IE9 compat
            target.className += target.className ? ' ' + className : '' + className + '';
        }
        return target;
    }
};

module.exports.jsonFromUrl = function(search) {
    var result = {};
    var params = search.substr(1);

    if(params !== "") {
        params.split("&").forEach(function (part) {
            var item = part.split("=");
            if(item.length > 0 && item[1].length > 0) {
                var matches = /(\w+)\[(\w+)\]/.exec(item[0]);
                if(matches != null && matches.length == 3) {
                    result[matches[1]] = result[matches[1]] || {};
                    result[matches[1]][matches[2]] = item[1];
                } else {
                    result[item[0]] = decodeURIComponent(item[1]);
                }
            }
        });
    }

    return result;
};

module.exports.areEqualIgnoreCase = function areEqualIgnoreCase(string1, string2) {
  return string1.toUpperCase() === string2.toUpperCase();
};

module.exports.m2 = function m2(value) {
  return value !== undefined ? `${value}m\xB2` : '';
};

module.exports.price = function price(value) {
  return value !== undefined ? `Kr ${value}` : '';
};
