/*
 * Window driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = require('node-namespace');

  namespace("Cylon.Drivers.OpenCV", function() {
    return this.Mat = (function(_super) {
      __extends(Mat, _super);

      Mat.prototype.commands = function() {
        return ['readImage', 'detectFaces'];
      };

      function Mat(opts) {
        Mat.__super__.constructor.apply(this, arguments);
      }

      Mat.prototype.start = function(callback) {
        this.defineDriverEvent({
          eventName: 'facesDetected',
          sendUpdate: false
        });
        return Mat.__super__.start.apply(this, arguments);
      };

      Mat.prototype.detectFaces = function(frame, haarcascade) {
        return this.connection.detectFaces(frame, haarcascade);
      };

      Mat.prototype.readImage = function(image, cb) {
        return this.connection.readImage(image, cb);
      };

      return Mat;

    })(Cylon.Driver);
  });

}).call(this);
