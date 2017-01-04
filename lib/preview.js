'use strict';

const Promise = require('bluebird'),
    request = require('request'),
    config = require('../config/config'),
    assets = require('./assets'),
    log = require('../bin/log.js'),
    NodeCache = require('node-cache'),
    cache = new NodeCache({stdTTL: 86400}); // One day


const cacheLimit = 100000000; // 100 MB

const translateUrl = function(url, params) {
    let real = url;
    params.map(param => {
        real = real.replace('{' + param.name + '}', param.value);
    });

    return real;
};

const missingValues = function(params) {
    return params.filter(param => {
        return param.value === undefined || param.value === '' || param.value === null;
    });
};

const fetchComponentMarkup = function(url, queryParams) {
    return new Promise(function(resolve, reject) {
        request({ url : url, qs : queryParams }, function (error, response, body) {
            if(!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(body);
            }
        });
    });
};

const preview = function(req, component) {
    return new Promise(function(resolve, reject) {
        let result = cache.get(req.originalUrl);

        if(result !== undefined) {
            resolve(result);
            return;
        }

        const cacheSize = cache.getStats().vsize + cache.getStats().ksize;
        if(cacheSize > cacheLimit) {
            cache.flushAll();
            log.info('Flushed preview cache since size (' + cacheSize + ') exceeded ' + cacheLimit);
        }

        let foundPathParams = [], foundRequiredQueryParams = [];

        if(component.pathParameters) {
            foundPathParams = component.pathParameters.map(param => {
                return {
                    name: param.name,
                    value: req.query[param.name],
                    examples: param.examples
                };
            });
        }

        if(component.queryParameters) {
            const required = component.queryParameters.filter(param => !param.optional);
            foundRequiredQueryParams = required.map(param => {
                return {
                    name: param.name,
                    value: req.query[param.name],
                    examples: param.examples
                };
            });
        }

        const missingRequiredValues = missingValues(foundPathParams).concat(missingValues(foundRequiredQueryParams));

        if(missingRequiredValues.length > 0) {
            result = {
                component : component,
                apiPath: config.get('apiPath') + '/',
                missingParams : missingRequiredValues,
            };

            cache.set(req.originalUrl, result);
            resolve(result);
        } else {
            const assetsManifest = assets.readManifest();
            const url = translateUrl('http://localhost:' + config.get('httpServerPort') + config.get('apiPath') + '/' + component.route, foundPathParams);
            fetchComponentMarkup(url, req.query)
                .then(function(markup) {
                    result = {
                        component: component,
                        assets: assetsManifest[component.name],
                        polyfills: assetsManifest.polyfills,
                        inline: assetsManifest.inline,
                        sw: assetsManifest.sw,
                        missingParams : missingRequiredValues,
                        apiPath: config.get('apiPath') + '/',
                        markup : markup
                    };

                    cache.set(req.originalUrl, result);
                    resolve(result);
                }, function(error) {
                    reject(error);
                }
            );
        }
    });
};

module.exports = preview;