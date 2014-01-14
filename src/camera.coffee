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
  class @OpenCV extends Cylon.Driver

    constructor: (opts) ->
      super
      @device = opts.device
      @connection = @device.connection
      @cameraId = opts.cameraId
      @cameraName = if opts.name? then opts.name else "camera#{cameraId}"
      @displayingVideo = false
      #@proxyMethods @commands, @connection, this

    commands: ->
      ['readFrame', 'detectFaces', 'displayVideo']

    start: (callback) ->
      Logger.debug "Camera started"
      @connection.initCamera(@cameraId, callback)
      @defineDriverEvent eventName: 'frameReady'
      @defineDriverEvent eventName: 'facesDetected'
      @device.emit 'cameraStarted'

    displayVideo: (fps, windowName = null) ->
      delay = Math.round(1000 / fps)
      windowName ?= @cameraName
      every(delay, () =>
        @connection.on('frameReady', (err, frame) =>
          @connection.showFrame(windowName, frame, delay)
        )
      )

    readFrame: (callback) ->
      @connection.readFrame(@cameraId)

