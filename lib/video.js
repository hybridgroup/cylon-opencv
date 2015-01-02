/*
 * Video driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var Cylon = require("cylon");

var Video = module.exports = function Video(opts) {
  Video.__super__.constructor.apply(this, arguments);

  this.videoPath = opts.video.toString();
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
     * @event videoReady
     */
    "videoReady",

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
     * @event frameReady
     * @value err
     * @value im
     * @value faces
     */
    "facesDetected"
  ];
};

Cylon.Utils.subclass(Video, Cylon.Driver);

Video.prototype.start = function(callback) {
  ["frameReady", "facesDetected"].forEach(function(event) {
    this.defineDriverEvent({ eventName: event, sendUpdate: false });
  }.bind(this));

  this.defineDriverEvent({
    eventName: "videoFeedReady",
    targetEventName: "videoReady",
    sendUpdate: false
  });

  this.connection.initVideoCapture(this.videoPath, this.haarcascade);

  callback();
};

Video.prototype.halt = function(callback) {
  callback();
};

/**
 * Reads frames from a video feed
 *
 * @return {null}
 * @publish
 */
Video.prototype.readFrame = function() {
  this.connection.readFrame(this.videoPath);
};

/**
 * Detects faces in an image
 *
 * @param {Object} frame image to scan for faces
 * @return {null}
 * @publish
 */
Video.prototype.detectFaces = function(frame) {
  this.connection.detectFaces(frame, this.haarcascade);
};
