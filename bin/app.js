/* jshint node: true, strict: true */

"use strict";

const http            = require('http'),
      path            = require('path'),
      express         = require('express'),
      compression     = require('compression'),
      cors            = require('cors'),
      //Header  = require('@amedia/-header'),
      //ErrorMid        = require('@amedia/error-kjerneteam').middleware,
      //metrics         = require('@amedia/statsd-metrics'),
      //access          = require('@amedia/amedia-access-log'),
      config          = require('../config/config.js'),
      log             = require('./log.js'),
      Lib             = require('../lib/main');


//const errorMid = new ErrorMid();
const app = express();


// Set up handlebars as template engine
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, '../views/'));

// Set up the library this app exposes
const lib = new Lib();




// Configure application
app.disable('x-powered-by');
app.enable('trust proxy');

// Set middleware
//app.use(metrics.middleware);
app.use(compression());
app.use(cors());


app.use(function(req, res, next) {
    return next();
});

// Attach lib routers
app.use(config.get('apiPath') + '/assets',
    function(req, res, next) {
        next();
    },
    //metrics.label('assets'),
    express.static('./assets')
);

app.get(config.get('contextPath') + '/apiadmin/ping',
    function(req, res, next) {
        res.headerManager.setLocalChannelMaxAge(0);
        next();
    },
    (req, res) => {
        let message = 'OK ' + config.get('version');
        res.statusMessage = message;
        res.status(200).send(message);
    });

// After ping because we do not want ping in the access log
//app.use(access(log));
app.use(config.get('apiPath'), lib.routes);

// Log errors
app.use((error, req, res, next) => {
    log.error(error);
    next(error);
});

// Error handling
app.use((error, req, res, next) => {
    // This might become obsolete if the errorMid.middleWare() starts to set a channel-maxage
    //res.headerManager.setLocalChannelMaxAge(15);
    next(error);
});

//app.use(errorMid.middleware());

// Catch all requests which fall through the
// middleware chain, not matching any routes,
// and serve a 404 page

//app.use(errorMid.response({code : 404, message : 'File Not Found'}));

// Set up http server and Export application
module.exports = http.createServer(app);
