const path = require('path');
const MyPlugin = require('./my-plugin');

module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: path.resolve(__dirname, './'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    // library: {
    //   name: 'MyLib',
    //   type: 'umd'
    // }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  optimization: {
    // minimize: false
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new MyPlugin()
  ]
};