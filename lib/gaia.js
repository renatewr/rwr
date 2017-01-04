"use strict";

const Promise = require('bluebird'),
    config = require('../config/config.js'),
    GaiaClient = require('@amedia/gaia-client').GaiaClient,
    log = require('../bin/log.js'),
    NodeCache = require('node-cache'),
    cache = new NodeCache({stdTTL: 86400}); // One day


const cacheLimit = 100000000; // 100 MB

const gaiaClient = new GaiaClient(config.get('gaiaUrl'));

function getGaiaConfig(publication) {
    return new Promise(function(resolve, reject) {
        let result = cache.get(publication);

        if(result !== undefined) {
            resolve(result);
            return;
        }

        const cacheSize = cache.getStats().vsize + cache.getStats().ksize;
        if(cacheSize > cacheLimit) {
            cache.flushAll();
            log.info('Flushed gaia cache since size (' + cacheSize + ') exceeded ' + cacheLimit);
        }

        const gaiaProps = [
            'nedstat.site.id',
            'pipek.url.browser',
            'rubrikk.language',
            'obscura.url.browser',
            'classified.property.enable',
            'classified.job.enable'
        ];

        const gaiaPromises = [
            gaiaClient.getPublicationByDomain(publication),
            gaiaClient.getProperties(publication, gaiaProps)
        ];

        Promise.all(gaiaPromises).done(function(data) {
            const prop = {};

            data[1][0].map(function(entry) {
                prop[entry.name] = entry.value;
            });

            result = {
                pub : data[0][0],
                prop : prop
            };

            cache.set(publication, result);
            resolve(result);
        }, function(error) {
            reject(error);
        });
    });
}

module.exports.config = getGaiaConfig;