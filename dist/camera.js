/*
 * Camera driver
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
    return this.Camera = (function(_super) {
      __extends(Camera, _super);

      function Camera(opts) {
        Camera.__super__.constructor.apply(this, arguments);
        this.cameraId = opts.extraParams.camera;
        this.displayingVideo = false;
        this.haarcascade = opts.extraParams.haarcascade;
      }

      Camera.prototype.commands = function() {
        return ['readFrame', 'detectFaces', 'displayVideo'];
      };

      Camera.prototype.start = function(callback) {
        this.defineDriverEvent({
          eventName: 'cameraReady',
          sendUpdate: false
        });
        this.defineDriverEvent({
          eventName: 'frameReady',
          sendUpdate: false
        });
        this.defineDriverEvent({
          eventName: 'facesDetected',
          sendUpdate: false
        });
        this.connection.initCamera(this.cameraId, this.haar);
        return Camera.__super__.start.apply(this, arguments);
      };

      Camera.prototype.readFrame = function() {
        return this.connection.readFrame(this.cameraId);
      };

      Camera.prototype.detectFaces = function(frame) {
        return this.connection.detectFaces(frame, this.haarcascade);
      };

      return Camera;

    })(Cylon.Driver);
  });

}).call(this);
