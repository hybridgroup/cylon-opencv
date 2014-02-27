/*
 * Window driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var namespace = require('node-namespace');

namespace("Cylon.Drivers.OpenCV", function() {
  return this.Mat = (function(_parent) {
    subclass(Mat, _parent);

    Mat.prototype.commands = function() {
      return ['readImage', 'detectFaces'];
    };

    function Mat() {
      Mat.__super__.constructor.apply(this, arguments);
    }

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

    return Mat;

  })(Cylon.Driver);
});
