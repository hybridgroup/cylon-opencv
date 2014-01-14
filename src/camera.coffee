###
 * Camera driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

#require './cylon-opencv'

namespace = require 'node-namespace'

namespace "Cylon.Drivers.OpenCV", ->
  class @Camera extends Cylon.Driver

    constructor: (opts) ->
      super
      @cameraId = opts.extraParams.camera
      @displayingVideo = false
      @haarcascade = opts.extraParams.haarcascade
      #@proxyMethods @commands, @connection, this

    commands: ->
      ['readFrame', 'detectFaces', 'displayVideo']

    start: (callback) ->
      @defineDriverEvent eventName: 'cameraReady', sendUpdate: false
      @defineDriverEvent eventName: 'frameReady', sendUpdate: false
      @defineDriverEvent eventName: 'facesDetected', sendUpdate: false
      @connection.initCamera(@cameraId, @haar)
      super

    #displayVideo: (fps, windowName = null) ->
      #delay = Math.round(1000 / fps)
      #windowName ?= @cameraName
      #every(delay, () =>
        #@connection.on('frameReady', (err, frame) =>
          #@connection.showFrame(windowName, frame, delay)
        #)
      #)

    readFrame: () ->
      @connection.readFrame(@cameraId)

    detectFaces: (frame) ->
      @connection.detectFaces(frame, @haarcascade)
