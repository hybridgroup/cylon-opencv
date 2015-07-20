/*
 * Cylonjs Opencv adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

"use strict";

var OpenCV = require("opencv"),
    Cylon = require("cylon"),
    path = require("path");

var Adaptor = module.exports = function Adaptor() {
  Adaptor.__super__.constructor.apply(this, arguments);

  this.videoFeeds = {};
  this.windows = {};

  this.events = [
    /**
     * Emitted when the video feed from the Camera is initialized and ready for
     * capture
     *
     * @event videoFeedReady
     */
    "videoFeedReady",

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
    "facesDetected"
  ];

  this.last = null;
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.commands = [
  "readFrame", "initVideoCapture",
  "detectFaces", "createWindow",
  "showFrame", "readImage"
];

Adaptor.prototype.connect = function(callback) {
  callback();
};

Adaptor.prototype.disconnect = function(callback) {
  callback();
};

/**
 * Initializes video capture from the supplied feed
 *
 * @param {Object} feed feed to capture video from
 * @return {void}
 * @publish
 */
Adaptor.prototype.initVideoCapture = function(feed) {
  var videoFeed,
      feedSource;

  feedSource = this._feedSource(feed);

  if (this.videoFeeds[feedSource.id] == null) {
    this.videoFeeds[feedSource.id] = new OpenCV.VideoCapture(feedSource.source);
  }

  videoFeed = this.videoFeeds[feedSource.id];

  var interval = setInterval(function() {
    var triggered = false;

    videoFeed.read(function(err, im) {
      if (err) { return; }

      var width = im.width(),
          height = im.height();

      if (width > 0 && height > 0 && triggered === false) {
        triggered = true;

        this.emit("videoFeedReady");

        if (interval) {
          clearInterval(interval);
        }
      }
    }.bind(this));
  }.bind(this), 100);
};

/**
 * Reads frames from a video feed
 *
 * @param {Object} feed feed to read video frames from
 * @return {void}
 * @publish
 */
Adaptor.prototype.readFrame = function(feed) {
  var feedSource = this._feedSource(feed);

  this.videoFeeds[feedSource.id].read(function(err, frame) {
    this.emit("frameReady", err, frame);
  }.bind(this));
};

/**
 * Reads an image through OpenCV
 *
 * @param {Object} image feed to read video frames from
 * @param {Function} cb callback to be triggered when the image is read
 * @return {void}
 * @publish
 */
Adaptor.prototype.readImage = function(image, cb) {
  OpenCV.readImage(image, cb);
};

/**
 * Detects faces in an image, using the provided haarcascade file
 *
 * @param {Object} im image to scan for faces
 * @param {Object} haarcascade file to use for image detection
 * @return {void}
 * @publish
 */
Adaptor.prototype.detectFaces = function(im, haarcascade) {
  im.detectObject(haarcascade, {}, function(err, faces) {
    this.emit("facesDetected", err, im, faces);
  }.bind(this));
};

/**
 * Detects motion in an image
 *
 * @param {Object} im image to scan for motion
 * @param {Object} rect rectangle to scan for motion
 * @return {void}
 * @publish
 */
Adaptor.prototype.detectMotion = function(im, rect) {
  if (!this.motionTracker) {
    this.motionTracker = new OpenCV.TrackedObject(im, rect, {channel: "value"});
  }

  function zip(a) {
    return a[0].map(function(_, i) {
      function ret(arr) { return arr[i]; }
      return a.map(ret);
    });
  }

  function delta(a, b) {
    function diff(arr) { return arr[0] - arr[1]; }
    return zip([a, b]).map(diff);
  }

  var r = this.motionTracker.track(im);

  if (this.last) {
    var difference = delta(this.last, r);
    this.emit("motionDetected", null, im, r, difference);
  }

  this.last = r;
};

/**
 * Creates a new, named OpenCV window
 *
 * @param {String} name name for OpenCV window
 * @return {Object} OpenCV NamedWindow instance
 * @publish
 */
Adaptor.prototype.createWindow = function(name) {
  if (!this.windows[name]) {
    this.windows[name] = new OpenCV.NamedWindow(name, 0);
  }

  return this.windows[name];
};

/**
 * Shows a video frame in an OpenCV window
 *
 * @param {String} name OpenCV NamedWindow to display in
 * @param {Object} frame frame to display
 * @param {Number} delay how long the delay should be
 * @return {Object} blocking delay
 * @publish
 */
Adaptor.prototype.showFrame = function(name, frame, delay) {
  var win = this.windows[name];
  win.show(frame);
  return win.blockingWaitKey(0, delay || 42);
};

Adaptor.prototype._feedSource = function(feed) {
  var feedSource;

  if (!isNaN(feed)) {
    feedSource = { id: feed, source: feed };
  } else if (typeof feed === "string") {
    feedSource = { id: path.basename(feed), source: path.resolve(feed) };
  }

  return feedSource;
};
