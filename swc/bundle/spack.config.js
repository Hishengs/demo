// spack.config.js
const path = require('path');

module.exports = {
  entry: {
    index: path.join(__dirname, "/index.js"),
  },
  output: {
    path: path.join(__dirname, "../dist/bundle"),
  },
  options: {
    "module": {
      "type": "commonjs",
    }
  }
};