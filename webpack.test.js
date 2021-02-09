// const { merge } = require('webpack-merge');
const { mergeWithCustomize, customizeArray } = require('webpack-merge');
const glob = require('glob');
const common = require('./webpack.common.js');

module.exports = mergeWithCustomize({
  customizeArray: customizeArray({
    'plugins': 'replace'
  }),
})
(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
   contentBase: './test-dist',
  },
  entry: glob.sync(__dirname + '/app/test/**/*.test.js'),
  output: {
    path: __dirname + '/test-dist',
  },
  plugins: []
});
