// spack.config.js
const path = require('path');

module.exports = {
  entry: {
    index: path.join(__dirname, "/app.jsx"),
  },
  output: {
    path: path.join(__dirname, "../dist/react-app"),
  }
};