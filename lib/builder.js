'use strict';

const config = require('../config/config');


const builder = function(req, component) {
    let params = [];

    if(component.pathParameters) {
        params = params.concat(component.pathParameters.map(param => {
            return {
                name : param.name,
                value : req.query[param.name],
                optional : false,
                examples: param.examples
            };
        }));
    }

    if(component.queryParameters) {
        params = params.concat(component.queryParameters.map(param => {
            return {
                name : param.name,
                value : req.query[param.name],
                optional : param.optional,
                examples: param.examples
            };
        }));
    }

    return {
        component: component,
        params: params,
        apiPath: config.get('apiPath') + '/'
    };
};

module.exports = builder;