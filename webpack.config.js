var ExtractTextPlugin = require("extract-text-webpack-plugin"),
    components = require("./lib/components"),
    autoprefixer = require('autoprefixer'),
    fs = require("./lib/fs");
    
    
var browsers = {
  browsers: [
     'last 1 chrome versions',
     'last 1 ff versions',
     'last 1 edge versions',
     'safari 7-10',
     'ios_saf 7-10',
     'chrome 38',
     'chrome 34',
     'ie 11',
     'ie_mob 11' ]
};
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

module.exports = {
    entry:  entries,
    output: {
        path:     'assets/bundles',
        filename: '[name].js'
      },  
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
    postcss: [ autoprefixer() ]
};