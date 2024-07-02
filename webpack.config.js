const path = require('path');

module.exports = {
  mode: 'production', 
  entry: './game.mjs', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};