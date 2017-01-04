'use strict';

const fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird');


const isFile = function(sourcePath) {
    try {
        return fs.statSync(sourcePath).isFile();
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
};

const isDirectory = function(sourcePath) {
    try {
        return fs.statSync(sourcePath).isDirectory();
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
};

const directories = function(sourcePath) {
    return fs.readdirSync(sourcePath).filter(function(file) {
        return fs.statSync(path.join(sourcePath, file)).isDirectory();
    });
};

const files = function(sourcePath) {
    return fs.readdirSync(sourcePath).filter(function(file) {
        return fs.statSync(path.join(sourcePath, file)).isFile();
    });
};

const statSync = function(sourcePath) {
    return fs.statSync(sourcePath);
};

const readFileSync = function(sourcePath) {
    return fs.readFileSync(sourcePath, 'utf8');
};

const readFile = function(sourcePath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(sourcePath, 'utf8', function(err, data) {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const writeFileSync = function(file, data) {
    return fs.writeFileSync(file, data);
};

module.exports.isFile = isFile;
module.exports.isDirectory = isDirectory;
module.exports.directories = directories;
module.exports.files = files;
module.exports.statSync = statSync;
module.exports.readFileSync = readFileSync;
module.exports.readFile = readFile;
module.exports.writeFileSync = writeFileSync;