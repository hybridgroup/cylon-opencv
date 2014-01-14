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
      } else {
        return null;
      }
    },
    register: function(robot) {
      robot.registerAdaptor('cylon-opencv', 'opencv');
      robot.registerDriver('cylon-opencv', 'camera');
      return robot.registerDriver('cylon-opencv', 'window');
    }
  };

}).call(this);
