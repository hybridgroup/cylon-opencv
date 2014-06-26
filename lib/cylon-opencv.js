/*
 * cylon-opencv
 * http://cylonjs.com
 *
 * Copyright (c) 2013 Your Name Here
 * Your License Here
*/

'use strict';

var Adaptor = require('./adaptor');

var Drivers = {
  'mat': require('./mat'),
  'camera': require('./camera'),
  'window': require('./window')
}

module.exports = {
  adaptor: function(opts) {
    return new Adaptor(opts);
  },

  driver: function(opts) {
    for (var d in Drivers) {
      if (opts.name === d) {
        return new Drivers[d](opts);
      }
    }
  },

  register: function(robot) {
    robot.registerAdaptor('cylon-opencv', 'opencv');

    for (var d in Drivers) {
      robot.registerDriver('cylon-opencv', d);
    }
  }
};
