'use strict';

const fs = require('./fs'),
      components = require('./components'),
      config = require('../config/config'),
      path = require('path'),
      filesize = require('filesize'),
      gzipSize = require('gzip-size'),
      md5 = require('md5-file'),
      NodeCache = require('node-cache'),
      cache = new NodeCache();


const assetManifestFile = 'assets.json';

const bundleDir = path.resolve(__dirname, '../assets/bundles');

const createConfig = function(name, assetType) {
    const file = bundleDir + '/' + name + '.' + assetType;

    if(fs.isFile(file)) {
        return [{
            source : file,
            public: config.get('apiPath') + '/assets/bundles/' + name + '.' + md5.sync(file) + '.' + assetType,
            size: filesize(fs.statSync(file).size),
            gzip: filesize(gzipSize.sync(fs.readFileSync(file)))
        }];
    }

    return [];
};

const createManifest = function() {
    let assets = {};

    components.forEach(component => {
        assets[component.name] = {
            js: createConfig(component.name, 'js'),
            css: createConfig(component.name, 'css')
        };
    });

    assets.polyfills = {
        js: createConfig('polyfills', 'js'),
        css: []
    };
    
    assets.inline = {
      js:[],
      css:createConfig('inline', 'css')
    };
    
  
    return assets;
};

const readManifest = function() {
    let assets = cache.get(assetManifestFile);

    if(assets === undefined) {
        assets = JSON.parse(fs.readFileSync(assetManifestFile));
        cache.set(assetManifestFile, assets);
    }

    return assets;
};

const writeManifest = function() {
    fs.writeFileSync(assetManifestFile, JSON.stringify(createManifest(), null, 4));
};

module.exports.readManifest = readManifest;
module.exports.writeManifest = writeManifest;