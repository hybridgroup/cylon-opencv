/*
 * Cylonjs Opencv adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var LibOpenCV = require('opencv'),
    namespace = require('node-namespace');

namespace("Cylon.Adaptors", function() {
  this.OpenCV = (function(_parent) {
    subclass(OpenCV, _parent);

    function OpenCV(opts) {
      if (opts == null) {
        opts = {};
      }
      OpenCV.__super__.constructor.apply(this, arguments);
      this.cameras = {};
      this.windows = {};
    }

    OpenCV.prototype.commands = function() {
      return ['readFrame', 'initCamera', 'detectFaces', 'createWindow', 'showFrame', 'readImage'];
    };

    OpenCV.prototype.connect = function(callback) {
      return OpenCV.__super__.connect.apply(this, arguments);
    };

    OpenCV.prototype.disconnect = function() {
      return Logger.debug("Disconnecting from opencv '" + this.name + "'...");
    };

    OpenCV.prototype.initCamera = function(cameraId) {
      var camera, everyId,
          _this = this;

      if (this.cameras[cameraId] == null) {
        this.cameras[cameraId] = new LibOpenCV.VideoCapture(parseInt(cameraId));
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

    OpenCV.prototype.readFrame = function(cameraId) {
      var camera,
          _this = this;

      camera = this.cameras[cameraId];

      camera.read(function(err, frame) {
        _this.connection.emit('frameReady', err, frame);
      });
    };

    OpenCV.prototype.readImage = function(image, cb) {
      LibOpenCV.readImage(image, cb);
    };

    OpenCV.prototype.detectFaces = function(im, haarcascade) {
      var _this = this;

      im.detectObject(haarcascade, {}, function(err, faces) {
        _this.connection.emit('facesDetected', err, im, faces);
      });
    };

    OpenCV.prototype.createWindow = function(windowName) {

      if ((this.windows[windowName] === null) || (this.windows[windowName] === undefined)) {
        this.windows[windowName] = new LibOpenCV.NamedWindow(windowName, 0);
      }

      return this.windows[windowName];
    };

    OpenCV.prototype.showFrame = function(windowName, frame, delay) {
      var keyPressed, window;

      if (delay == null) {
        delay = 42;
      }

      window = this.windows[windowName];
      window.show(frame);
      keyPressed = window.blockingWaitKey(0, delay);

      return keyPressed;
    };

    return OpenCV;

  })(Cylon.Adaptor);
});
