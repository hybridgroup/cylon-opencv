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

var Adaptor = module.exports = function Adaptor() {
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

Adaptor.prototype.connect = function(callback) {
  callback();
};

Adaptor.prototype.disconnect = function(callback) {
  callback();
};

Adaptor.prototype.initCamera = function(id) {
  var camera;

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
        this.connection.emit('cameraReady');

        if (!!interval) {
          return clearInterval(interval);
        }
      }
    }.bind(this));
  }.bind(this), 100);
};

Adaptor.prototype.readFrame = function(id) {
  id = parseInt(id);

  this.cameras[id].read(function(err, frame) {
    this.connection.emit('frameReady', err, frame);
  }.bind(this));
};

Adaptor.prototype.readImage = function(image, cb) {
  OpenCV.readImage(image, cb);
};

Adaptor.prototype.detectFaces = function(im, haarcascade) {
  im.detectObject(haarcascade, {}, function(err, faces) {
    this.connection.emit('facesDetected', err, im, faces);
  }.bind(this));
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
