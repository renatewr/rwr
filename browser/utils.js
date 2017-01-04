/* jshint node: true, strict: true */

/** @module comscore params */

"use strict";

/**
 * Parses the values of a attribute on a DOM element to a array
 *
 * @param {HTMLElement} element A DOM element
 * @param {String} attribute The attribute on the element which should be parsed
 * @returns {Array}
 */

module.exports.attributeToArray = function(element, attribute) {
    return element.getAttribute(attribute) ? element.getAttribute(attribute).split(' ') : [];
};


/**
 * Parses the values of a attribute on a DOM element to an object
 *
 * @param {string} name The value of a_click_area in comscore
 * @param {string} nedstatCode The nedstatCode for the publication
 * @returns {object}
 */

module.exports.comscoreParams = function(name, nedstatCode, category, device){
    return {
        a_click_area : name,
        a_edition : device || 'mobile',
        a_view : device || 'mobile',
        a_virtual : nedstatCode,
        ns_category : category || 'home'
    };
};

/**
 * Removes a CSS class name from a DOM element
 *
 * @param {element} HTMLElement A DOM element
 * @param {className} String Name of the class to remove
 * @returns {HTMLElement}
 */

module.exports.removeClass = function(target, className) {
    if(target) {
        if (target.classList){
            target.classList.remove(className);
        } else {
            // IE9 compat
            target.className = target.className.replace(new RegExp('\\b' + className + '\\b'), '').trim();
        }
        return target;
    }
};

/**
 * Check if a DOM element contains a class name - NOT IN USE
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

module.exports.areEqualIgnoreCase = function(string1, string2) {
    return string1.toUpperCase() === string2.toUpperCase();
};

module.exports.m2 = function (value) {
    return value !== undefined ? value + "m\xB2" : '';
};

module.exports.price = function(value){
    return value !== undefined ? "Kr " + value : '';
};