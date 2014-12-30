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
  };

  this.events = [
    /**
     * Emitted when faces are detected in an image
     *
     * @event frameReady
     * @value err
     * @value im
     * @value faces
     */
    "facesDetected"
  ];
};

Cylon.Utils.subclass(Mat, Cylon.Driver);

Mat.prototype.start = function(callback) {
  this.defineDriverEvent({ eventName: 'facesDetected', sendUpdate: false });
  callback();
};

Mat.prototype.halt = function(callback) {
  callback();
};

/**
 * Detects faces in an image, using the provided haarcascade file
 *
 * @param {Object} im image to scan for faces
 * @param {Object} haarcascade file to use for image detection
 * @return {null}
 * @publish
 */
Mat.prototype.detectFaces = function(frame, haarcascade) {
  this.connection.detectFaces(frame, haarcascade);
};

/**
 * Reads an image through OpenCV
 *
 * @param {Object} feed feed to read video frames from
 * @param {Function} cb callback to be triggered when the image is read
 * @return {null}
 * @publish
 */
Mat.prototype.readImage = function(image, cb) {
  this.connection.readImage(image, cb);
};
