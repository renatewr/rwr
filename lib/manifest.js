"use strict";


function create(options) {
    const req = options.req;
    const host = req.protocol + '://' + req.header('host');

    const urlTemplate = host + options.baseUrlTemplate;

    const componentFiles = {};

    if (options.js && options.js.length > 0) {
        componentFiles['application/javascript'] = options.js.map(path =>
            host + path
        );
    }

    if (options.css && options.css.length > 0) {
        componentFiles['text/css'] = options.css.map(path =>
            host + path
        );
    }

    return {
        manifestVersion: '1.0',
        provider: {
            'id': 'rwr-ku'
        },
        component: {
            id: options.id,
            description: options.description,
            markup: {
                'urlTemplate': urlTemplate,
                queryParameters: options.queryParameters || [],
            },
            componentFiles: componentFiles,
            dependencies: options.dependencies || {}
        }
    };
}

module.exports.create = create;