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
    return this.OpenCV = (function(_super) {
      __extends(OpenCV, _super);

      OpenCV.prototype.commands = function() {
        return ['readImage', 'detectFaces'];
      };

      function OpenCV(opts) {
        OpenCV.__super__.constructor.apply(this, arguments);
      }

      OpenCV.prototype.start = function(callback) {
        this.defineDriverEvent({
          eventName: 'facesDetected',
          sendUpdate: false
        });
        return OpenCV.__super__.start.apply(this, arguments);
      };

      OpenCV.prototype.detectFaces = function(frame, haarcascade) {
        return this.connection.detectFaces(frame, haarcascade);
      };

      OpenCV.prototype.readImage = function(image, cb) {
        return this.connection.readImage(image, cb);
      };

      return OpenCV;

    })(Cylon.Driver);
  });

}).call(this);
