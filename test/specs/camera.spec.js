'use strict';

var Camera = source('camera');

var EventEmitter = require('events').EventEmitter;

describe('Cylon.Drivers.OpenCV.Mat', function() {
  var camera = new Camera({
    device: new EventEmitter,
    extraParams: { camera: {} }
  });

  it("needs tests");
});
