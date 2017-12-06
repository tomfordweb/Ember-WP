const path = require('path');

module.exports = {
  entry: './src/babel/ember-admin.js',
  output: {
    filename: 'ember-admin.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  module: {

    rules: [
    		{ test: /\.js$/,
    		use: [
    			'babel-loader'
    		]},
    		{
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        }]
  }
};