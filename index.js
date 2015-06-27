"use strict";

var Adaptor = require("./lib/adaptor");

var Drivers = {
  mat: require("./lib/mat"),
  camera: require("./lib/camera"),
  video: require("./lib/video"),
  window: require("./lib/window")
};

module.exports = {
  adaptors: ["opencv"],
  drivers: Object.keys(Drivers),

  adaptor: function(opts) {
    return new Adaptor(opts);
  },

  driver: function(opts) {
    if (Drivers[opts.driver]) {
      return new Drivers[opts.driver](opts);
    }

    return null;
  }
};
