var ExtractTextPlugin = require("extract-text-webpack-plugin"),
    components = require("./lib/components"),
    autoprefixer = require('autoprefixer'),
    browsers = require('@amedia/postcss-config').autoprefixer,
    fs = require("./lib/fs");

var entries = {
    polyfills : './browser/polyfills.js',
    inline : './browser/inline.less'
};

components.forEach(entry => {
    var assets = [];

    const files = [entry.path + '/browser/index.js', entry.path + '/browser/styles.less'];
    files.map(file => {
        if(fs.isFile(file)) {
            assets.push(file);
        }
    });

    entries[entry.name] = assets;
});

console.log(entries);

var config = {
    // TODO: Add common Configuration
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?-autoprefixer!postcss-loader!less-loader")
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query:{
                  presets:['es2015']
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css', {
            allChunks: false
        })
    ],
    postcss: [ autoprefixer(2) ]
};


var bundlesConfig = Object.assign({}, config, {
    entry: entries,
    output: {
        path:     'assets/bundles',
        filename: '[name].js'
    },
});

var barEntries = {
    sw : './browser/sw.js'
};
var barConfig = Object.assign({}, config,{    
    entry: './browser/sw.js',
    output: {
       path: __dirname+'/',
       filename: 'sw2.js'
    },
});


module.exports = [bundlesConfig];