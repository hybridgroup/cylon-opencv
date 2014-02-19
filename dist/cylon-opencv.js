/*
 * cylon-opencv
 * http://cylonjs.com
 *
 * Copyright (c) 2013 Your Name Here
 * Your License Here
*/


(function() {
  'use strict';
  var namespace;

  namespace = require('node-namespace');

  require('cylon');

  require('./opencv');

  require('./mat');

  require('./camera');

  require('./window');

  module.exports = {
    adaptor: function(opts) {
      return new Cylon.Adaptors.OpenCV(opts);
    },
    driver: function(opts) {
      if (opts.name === 'camera') {
        return new Cylon.Drivers.OpenCV.Camera(opts);
      } else if (opts.name === 'window') {
        return new Cylon.Drivers.OpenCV.Window(opts);
      } else if (opts.name === 'mat') {
        return new Cylon.Drivers.OpenCV.Mat(opts);
      } else {
        return null;
      }
    },
    register: function(robot) {
      robot.registerAdaptor('cylon-opencv', 'opencv');
      robot.registerDriver('cylon-opencv', 'camera');
      robot.registerDriver('cylon-opencv', 'window');
      return robot.registerDriver('cylon-opencv', 'mat');
    }
  };

}).call(this);
