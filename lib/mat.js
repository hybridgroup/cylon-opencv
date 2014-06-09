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
};

Cylon.Utils.subclass(Mat, Cylon.Driver);

Mat.prototype.commands = function() {
  return ['readImage', 'detectFaces'];
};

Mat.prototype.start = function() {
  this.defineDriverEvent({
    eventName: 'facesDetected',
    sendUpdate: false
  });
  Mat.__super__.start.apply(this, arguments);
};

Mat.prototype.detectFaces = function(frame, haarcascade) {
  this.connection.detectFaces(frame, haarcascade);
};

Mat.prototype.readImage = function(image, cb) {
  this.connection.readImage(image, cb);
};
