const path = require("path");

module.exports = {
  entry: [
    "./js/modules/main-element.js",
    "./js/modules/constants.js",
    "./js/modules/util.js",
    "./js/modules/debounce.js",
    "./js/modules/message.js",
    "./js/modules/beckend.js",
    "./js/modules/filter.js",
    "./js/modules/form.js",
    "./js/modules/pin.js",
    "./js/modules/card.js",
    "./js/modules/preview.js",
    "./js/modules/draganddrop.js",
    "./js/modules/main.js",
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
