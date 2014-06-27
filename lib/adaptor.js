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

Adaptor.prototype.initCamera = function(id) {
  var self = this,
      camera;

  id = parseInt(id);

  if (this.cameras[id] == null) {
    this.cameras[id] = new OpenCV.VideoCapture(id);
  }

  camera = this.cameras[id];

  var interval = setInterval(function() {
    var triggered = false;

    camera.read(function(err, im) {
      var width = im.width(),
          height = im.height();

      if (width > 0 && height > 0 && triggered === false) {
        triggered = true;
        self.connection.emit('cameraReady');

        if (!!interval) {
          return clearInterval(interval);
        }
      }
    });
  }, 100);
};

Adaptor.prototype.readFrame = function(id) {
  var self = this;

  id = parseInt(id);

  this.cameras[id].read(function(err, frame) {
    self.connection.emit('frameReady', err, frame);
  });
};

Adaptor.prototype.readImage = function(image, cb) {
  OpenCV.readImage(image, cb);
};

Adaptor.prototype.detectFaces = function(im, haarcascade) {
  var self = this;

  im.detectObject(haarcascade, {}, function(err, faces) {
    self.connection.emit('facesDetected', err, im, faces);
  });
};

Adaptor.prototype.createWindow = function(name) {
  if (!this.windows[name]) {
    this.windows[name] = new OpenCV.NamedWindow(name, 0);
  }

  return this.windows[name];
};

Adaptor.prototype.showFrame = function(name, frame, delay) {
  var win = this.windows[name];
  win.show(frame);
  return win.blockingWaitKey(0, delay || 42);
};
