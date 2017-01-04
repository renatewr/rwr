'use strict';

const express = require('express'),
      config = require('../config/config'),
      metrics = require('@amedia/statsd-metrics'),
      components = require('./components'),
      preview = require('./preview'),
      builder = require('./builder'),
      router = express.Router(),
      manifest = require('./manifest'),
      assets = require('./assets'),
      fs = require('./fs'),
      path = require('path'),
      doc = require('./doc');


const translateToExpress = function(route) {
    return route.replace(/{/g, ':').replace(/}/g, '');
};

const assetsManifest = assets.readManifest();

router.get('/',
    metrics.label('index'),
    (req, res) => {
        components.forEach(component => {
            component.assets = assetsManifest[component.name],
            component.hasDoc = doc.hasDoc(component)
        });

        res.render('index', {
            components : components,
            apiPath : config.get('apiPath') + '/'
        });
    });
    
router.get('/sw2.js',
    metrics.label('sw'),
    (req, res) => {       
      const filePath = path.resolve(__dirname, '../sw2.js');
      //res.headerManager.setLocalMaxAge(31536000);
      //res.headerManager.setLocalChannelMaxAge(31536000);          
      res.sendFile(filePath);
    });
    
    
router.get('/assets.json',
    (req,res) => {
      const filePath = path.resolve(__dirname, '../assets.json');
      //res.headerManager.setLocalMaxAge(31536000);
      //res.headerManager.setLocalChannelMaxAge(31536000);          
      res.sendFile(filePath);
    });    


router.get('/assets/bundles/:asset',
    metrics.label('hashed-asset-bundles'),
    (req, res) => {
        const assetDesc = req.params.asset.split('.');
        const file = assetDesc[0] + '.' + assetDesc[2];
        const filePath = path.resolve(__dirname, '../assets/bundles') + '/' + file;
        if(fs.isFile(filePath)) {
            //res.headerManager.setLocalMaxAge(31536000);
            //res.headerManager.setLocalChannelMaxAge(31536000);
            res.contentType(file);
            res.sendFile(filePath);
        } else {
            res.status(500).render('error', {error : 'Could not find file ' + file });
        }
    });

router.get('/assets/:component/img/:asset',
    metrics.label('component-images'),
    (req, res) => {
        const filePath = path.resolve(__dirname, '../views') + '/' + req.params.component + '/browser/img/' + req.params.asset;
        if(fs.isFile(filePath)) {
            //res.headerManager.setLocalMaxAge(31536000);
            //res.headerManager.setLocalChannelMaxAge(31536000);
            res.contentType(req.params.asset);
            res.sendFile(filePath);
        } else {
            res.status(500).render('error', {error : 'Could not find file ' + filePath });
        }
    });

components.map(component => {
    router.get(translateToExpress(component.route),
        metrics.label(component.name + '-markup'),
        (req, res) => {
            component.controller(req, res, function(errorMsg) {
                res.status(500).render('error', {error : errorMsg });
            });
        });

    router.get('/' + component.name + '/manifest.json',
        metrics.label(component.name + '-manifest'),
        (req, res) => {
            res.json(manifest.create({
                req,
                id: component.name,
                description: component.description,
                baseUrlTemplate: config.get('apiPath') + component.route,
                queryParameters : component.queryParameters.map(queryParam => {
                    return { name : queryParam.name, optional : queryParam.optional };
                }),
                js: assetsManifest[component.name].js.map(js => js.public),
                css: assetsManifest[component.name].css.map(css => css.public)
            }));
        });

    router.get('/' + component.name + '/builder',
        metrics.label(component.name + '-builder'),
        (req, res) => {
            res.render('builder', builder(req, component));
        });

    router.get('/' + component.name + '/doc',
        metrics.label(component.name + '-doc'),
        (req, res) => {
            doc.getDoc(component).then(function(data) {
                res.render('doc', {
                    componentName : component.name,
                    markup : data
                });
            }, function(error) {
                res.status(500).render('error', {error : error });
            });            
        });

    router.get('/' + component.name + '/preview',
        metrics.label(component.name + '-preview'),
        (req, res) => {
            preview(req, component).then(function(model) {
                res.render('preview', model);
            }, function(error) {
                res.status(500).render('error', {error : error });
            });
        });
});

module.exports = router;
