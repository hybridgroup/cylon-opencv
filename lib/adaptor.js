/*
 * Cylonjs Opencv adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var OpenCV = require('opencv'),
    Cylon = require('cylon'),
    path = require('path');

var Adaptor = module.exports = function Adaptor() {
    Adaptor.__super__.constructor.apply(this, arguments);

  this.videoFeeds = {};
  this.windows = {};
};

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

Adaptor.prototype.commands = [
  'readFrame', 'initVideoCapture',
  'detectFaces', 'createWindow',
  'showFrame', 'readImage'
];

Adaptor.prototype.connect = function(callback) {
  callback();
};

Adaptor.prototype.disconnect = function(callback) {
  callback();
};

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
      var width = im.width(),
          height = im.height();

      if (width > 0 && height > 0 && triggered === false) {
        triggered = true;

        this.emit('videoFeedReady');

        if (!!interval) {
          clearInterval(interval);
        }
      }
    }.bind(this));
  }.bind(this), 100);
};

Adaptor.prototype.readFrame = function(feed) {
  var feedSource = this._feedSource(feed);

  this.videoFeeds[feedSource.id].read(function(err, frame) {
    this.emit('frameReady', err, frame);
  }.bind(this));
};

Adaptor.prototype.readImage = function(image, cb) {
  OpenCV.readImage(image, cb);
};

Adaptor.prototype.detectFaces = function(im, haarcascade) {
  im.detectObject(haarcascade, {}, function(err, faces) {
    this.emit('facesDetected', err, im, faces);
  }.bind(this));
};

Adaptor.prototype.createWindow = function(name) {
  if (!this.windows[name]) {
    this.windows[name] = new OpenCV.NamedWindow(name, 0);
  }

  return this.windows[name];
};

Adaptor.prototype.showFrame = function(name, frame, delay) {
  var win = this.windows[name];
  win.show(frame);
  return win.blockingWaitKey(0, delay || 42);
};

Adaptor.prototype._feedSource = function(feed) {
  var feedSource;

  if (!isNaN(feed)) {
    feedSource = { id: feed, source: feed };
  } else if (typeof(feed) === 'string') {
    feedSource = { id: path.basename(feed), source: path.resolve(feed) };
  }

  return(feedSource);
};
