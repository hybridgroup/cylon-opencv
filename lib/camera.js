/*
 * Camera driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

/* eslint camelcase: 0 */

var Cylon = require("cylon");

var Camera = module.exports = function Camera(opts) {
  Camera.__super__.constructor.apply(this, arguments);

  this.cameraId = parseInt(opts.camera, 10);
  this.displayingVideo = false;
  this.haarcascade = opts.haarcascade;

  this.commands = {
    read_frame: this.readFrame,
    detect_faces: this.detectFaces
  };

  this.events = [
    /**
     * Emitted when the video feed from the Camera is initialized and ready for
     * capture
     *
     * @event cameraReady
     */
    "cameraReady",

    /**
     * Emitted whenever a new frame is available from the video feed.
     *
     * @event frameReady
     * @value err
     * @value frame
     */
    "frameReady",

    /**
     * Emitted when faces are detected in an image
     *
     * @event facesDetected
     * @value err
     * @value im
     * @value faces
     */
    "facesDetected",

    /**
     * Emitted when motion is detected in an image
     *
     * @event motionDetected
     * @value err
     * @value im
     * @value trackers
     */
    "motionDetected"    
  ];
};

Cylon.Utils.subclass(Camera, Cylon.Driver);

Camera.prototype.start = function(callback) {
  ["frameReady", "facesDetected", "motionDetected"].
    forEach(function(event) {
      this.defineDriverEvent({ eventName: event, sendUpdate: false });
    }.bind(this));

  this.defineDriverEvent({
    eventName: "videoFeedReady",
    targetEventName: "cameraReady",
    sendUpdate: false
  });

  this.connection.initVideoCapture(this.cameraId, this.haarcascade);

  callback();
};

Camera.prototype.halt = function(callback) {
  callback();
};

/**
 * Reads frames from a video feed
 *
 * @return {void}
 * @publish
 */
Camera.prototype.readFrame = function() {
  this.connection.readFrame(this.cameraId);
};

/**
 * Detects faces in an image
 *
 * @param {Object} frame image to scan for faces
 * @return {void}
 * @publish
 */
Camera.prototype.detectFaces = function(frame) {
  this.connection.detectFaces(frame, this.haarcascade);
};

/**
 * Detects motion in an image
 *
 * @param {Object} frame image to look for motion
 * @param {Object} rect in which to look for motion
 * @return {void}
 * @publish
 */
Camera.prototype.detectMotion = function(frame, rect) {
  this.connection.detectMotion(frame, rect);
};
