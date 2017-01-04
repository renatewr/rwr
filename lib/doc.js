'use strict';

const fs = require('./fs'),
     components = require('./components'),
     NodeCache = require('node-cache'),
     cache = new NodeCache(),
     showdown  = require('showdown'),
     converter = new showdown.Converter();

const getFileName = function(path) {
    return path + '/README.md';
};

const hasDoc = function(component) {
    return fs.isFile(getFileName(component.path));
};

const getDoc = function(component) {
    return new Promise(function(resolve, reject) {
        let html = cache.get(component.name);

        if(html !== undefined) {
            resolve(html);
            return;
        }

        fs.readFile(getFileName(component.path)).then(function(md) {
            html = converter.makeHtml(md);
            cache.set(component.name, html);
            resolve(html);
        }, function(error) {
            reject('Could not find documentation for this component');
        });
    });
};

module.exports.hasDoc = hasDoc;
module.exports.getDoc = getDoc;