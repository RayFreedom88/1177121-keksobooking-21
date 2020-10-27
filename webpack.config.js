const path = require("path");

module.exports = {
  entry: [
    "./js/modules/main.js",
    "./js/modules/util.js",
    "./js/modules/debounce.js",
    "./js/modules/message.js",
    "./js/modules/beckend.js",
    "./js/modules/pin.js",
    "./js/modules/card.js",
    "./js/modules/form.js",
    "./js/modules/filter.js",
    "./js/modules/preview.js",
    "./js/modules/draganddrop.js",
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "js"),
    iife: true
  },
  devtool: false
};
