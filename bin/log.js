/* jshint node: true, strict: true */

"use strict";

const config = require('../config/config.js'),
      bunyan = require('bunyan');

module.exports = bunyan.createLogger({
    name: config.get('name'),
    application: config.get('name'),
    serverName: config.get('serverName'),
    streams: [
        {
            level: config.get('consoleLogLevel'),
            stream: process.stdout
        }
    ]
});
