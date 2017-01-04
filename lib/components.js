'use strict';

const fs = require('./fs'),
      path = require('path');

const createComponent = function(path) {
    const component = path + '/component.js';

    if(fs.isFile(component)) {
        const config = require(component);

        return {
            path : path,
            name : config.name,
            route : config.route,
            description : config.description,
            controller : config.controller,
            pathParameters : config.pathParameters || [],
            queryParameters : config.queryParameters || []
        };
    }
};

const componentDir = path.resolve(__dirname, '../views');
const componentFiles = fs.directories(componentDir).map(name => componentDir + '/' + name);

module.exports = componentFiles.map(path => createComponent(path)).filter(e => e !== undefined);