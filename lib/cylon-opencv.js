/*
 * cylon-opencv
 * http://cylonjs.com
 *
 * Copyright (c) 2013 Your Name Here
 * Your License Here
*/

'use strict';

var OpenCV = require('./opencv');

var Mat = require('./mat'),
    Camera = require('./camera'),
    Window = require('./window');

module.exports = {
  adaptor: function(opts) {
    return new OpenCV(opts);
  },

  driver: function(opts) {
    switch (opts.name) {
      case 'camera':
        return new Camera(opts);
        break;

      case 'window':
        return new Window(opts);
        break;

      case 'mat':
        return new Mat(opts);
        break;

      default:
        return null;
    }
  },

  register: function(robot) {
    robot.registerAdaptor('cylon-opencv', 'opencv');

    robot.registerDriver('cylon-opencv', 'camera');
    robot.registerDriver('cylon-opencv', 'window');
    robot.registerDriver('cylon-opencv', 'mat');
  }
};
