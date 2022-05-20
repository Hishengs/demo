const path = require('path');

module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: path.resolve(__dirname, './index'),
  output: {
    path: path.resolve(__dirname, '../dist/swc-loader'),
    filename: 'index.js',
    // library: {
    //   name: 'MyLib',
    //   type: 'umd'
    // }
  },
  module: {
    rules: [
      /* {
        test: /\.js$/,
        use: 'babel-loader'
      }, */
      {
        test: /\.js$/,
        use: 'swc-loader'
      }
    ]
  },
  optimization: {
    minimize: false
  },
  /* experiments: {
    outputModule: true
  } */
};