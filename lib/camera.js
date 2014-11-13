/*
 * Camera driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Camera = module.exports = function Camera(opts) {
  Camera.__super__.constructor.apply(this, arguments);

  this.cameraId = opts.camera;
  this.displayingVideo = false;
  this.haarcascade = opts.haarcascade;

  this.commands = {
    read_frame: this.readFrame,
    detect_faces: this.detectFaces
  };
};

Cylon.Utils.subclass(Camera, Cylon.Driver);

Camera.prototype.start = function(callback) {
  ['cameraReady', 'frameReady', 'facesDetected'].forEach(function(event) {
    this.defineDriverEvent({ eventName: event, sendUpdate: false });
  }.bind(this));

  this.adaptor.initCamera(this.cameraId, this.haarcascade);
  callback();
};

Camera.prototype.halt = function(callback) {
  callback();
};

Camera.prototype.readFrame = function() {
  this.adaptor.readFrame(this.cameraId);
};

Camera.prototype.detectFaces = function(frame) {
  this.adaptor.detectFaces(frame, this.haarcascade);
};
