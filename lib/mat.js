/*
 * Window driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Mat = module.exports = function Mat() {
  Mat.__super__.constructor.apply(this, arguments);

  this.commands = {
    detect_faces: this.detectFaces,
    read_image: this.readImage
  }
};

Cylon.Utils.subclass(Mat, Cylon.Driver);

Mat.prototype.start = function(callback) {
  this.defineDriverEvent({ eventName: 'facesDetected', sendUpdate: false });
  callback();
};

Mat.prototype.halt = function(callback) {
  callback();
};

Mat.prototype.detectFaces = function(frame, haarcascade) {
  this.connection.detectFaces(frame, haarcascade);
};

Mat.prototype.readImage = function(image, cb) {
  this.connection.readImage(image, cb);
};
