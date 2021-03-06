#!/usr/bin/env node

"use strict";

const config = require('../config/config.js'),
      log = require('./log.js'),
      webpack = require('webpack'),
      webpackConfig = require('../webpack.config'),
      assets = require('../lib/assets');


const start = function() {
    const server  = require('./app.js');

    // Start application
    server.listen(config.get('httpServerPort'), () => {
        log.info('server running at http://localhost:' + server.address().port);
        log.info('server process has pid ' + process.pid);
        log.info('api routes available under http://localhost:' + server.address().port + config.get('apiPath'));
    });

    // Catch uncaught exceptions, log it and take down server in a nice way.
    // Upstart or forever should handle kicking the process back into life!
    process.on('uncaughtException', (error) => {
        log.error('shutdown - server taken down by force due to a uncaughtException');
        log.error(error.message);
        log.error(error.stack);
        server.close();
        process.nextTick(() => {
            process.exit(1);
        });
    });

    // Listen for SIGINT (Ctrl+C) and do a gracefull takedown of the server
    process.on('SIGINT', () => {
        log.info('shutdown - got SIGINT - taking down server gracefully');
        server.close();
        process.nextTick(() => {
            process.exit(0);
        });
    });

    // Listen for SIGTERM (Upstart) and do a gracefull takedown of the server
    process.on('SIGTERM', () => {
        log.info('shutdown - got SIGTERM - taking down server gracefully');
        server.close();
        process.nextTick(() => {
            process.exit(0);
        });
    });
};


// On development we build every time the app starts. In production, this is done as a build step in the Dockerfile.
if (config.get('env') === 'development') {
    log.info("Bundling assets...");
    webpack(webpackConfig, function (err) {
        if (err) {
            log.error(err, "Error webpacking");
            process.exit();
        }
        assets.writeManifest();
        start();
    });
} else {
    start();
}