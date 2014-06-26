/*
 * Cylonjs Opencv adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var OpenCV = require('opencv'),
    Cylon = require('cylon');

var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  this.cameras = {};
  this.windows = {};
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.commands = [
  'readFrame', 'initCamera',
  'detectFaces', 'createWindow',
  'showFrame', 'readImage'
];

Adaptor.prototype.initCamera = function(cameraId) {
  var camera, everyId,
      _this = this;

  if (this.cameras[cameraId] == null) {
    this.cameras[cameraId] = new OpenCV.VideoCapture(parseInt(cameraId));
  }

  camera = this.cameras[cameraId];

  everyId = setInterval(function() {
    var triggered;
    triggered = 0;

    camera.read(function(err, im) {
      if (im.width() > 0 && im.height() > 0 && triggered === 0) {
        triggered = 1;
        _this.connection.emit('cameraReady');

        if (everyId != null) {
          return clearInterval(everyId);
        }
      }
    });
  }, 100);
};

Adaptor.prototype.readFrame = function(cameraId) {
  var camera,
      _this = this;

  camera = this.cameras[cameraId];

  camera.read(function(err, frame) {
    _this.connection.emit('frameReady', err, frame);
  });
};

Adaptor.prototype.readImage = function(image, cb) {
  OpenCV.readImage(image, cb);
};

Adaptor.prototype.detectFaces = function(im, haarcascade) {
  var _this = this;

  im.detectObject(haarcascade, {}, function(err, faces) {
    _this.connection.emit('facesDetected', err, im, faces);
  });
};

Adaptor.prototype.createWindow = function(windowName) {

  if ((this.windows[windowName] === null) || (this.windows[windowName] === undefined)) {
    this.windows[windowName] = new OpenCV.NamedWindow(windowName, 0);
  }

  return this.windows[windowName];
};

Adaptor.prototype.showFrame = function(windowName, frame, delay) {
  var keyPressed, window;

  if (delay == null) {
    delay = 42;
  }

  window = this.windows[windowName];
  window.show(frame);
  keyPressed = window.blockingWaitKey(0, delay);

  return keyPressed;
};
