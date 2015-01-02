/*
 * cylon-opencv
 * http://cylonjs.com
 *
 * Copyright (c) 2013 Your Name Here
 * Your License Here
*/

"use strict";

var Adaptor = require("./adaptor");

var Drivers = {
  "mat": require("./mat"),
  "camera": require("./camera"),
  "video": require("./video"),
  "window": require("./window")
};

module.exports = {
  adaptors: ["opencv"],
  drivers: Object.keys(Drivers),

  adaptor: function(opts) {
    return new Adaptor(opts);
  },

  driver: function(opts) {
    for (var d in Drivers) {
      if (opts.driver === d) {
        return new Drivers[d](opts);
      }
    }
  }
};
