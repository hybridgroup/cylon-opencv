###
 * Cylonjs Opencv adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

#require './cylon-opencv'
LibOpenCV = require 'opencv'
namespace = require 'node-namespace'

namespace "Cylon.Adaptors", ->
  class @OpenCV extends Cylon.Adaptor
    constructor: (opts = {}) ->
      super
      @cameras = {}
      @windows = {}

    commands: ->
      ['readFrame', 'initCamera', 'detectFaces', 'createWindow', 'showFrame']

    connect: (callback) ->
      super

    disconnect: ->
      Logger.debug "Disconnecting from opencv '#{@name}'..."
      #@board.reset()

    initCamera: (cameraId) ->
      @cameras[cameraId] = new LibOpenCV.VideoCapture(parseInt(cameraId)) unless @cameras[cameraId]?
      camera = @cameras[cameraId]

      everyId = setInterval(() =>
        triggered = 0
        camera.read((err, im) =>
          if im.width() > 0 and im.height() > 0 and triggered == 0
            triggered = 1
            @connection.emit 'cameraReady'
            clearInterval(everyId) if everyId?
        )
      , 100)

    readFrame: (cameraId) ->
      camera = @cameras[cameraId] # = LibOpenCV.VideoCapture(cameraId) unless @cameras[cameraId]
      camera.read((err, frame) =>
        @connection.emit('frameReady', err, frame)
      )

    detectFaces: (im, haarcascade) ->
      im.detectObject(haarcascade, {}, (err, faces) =>
        @connection.emit('facesDetected', err, im, faces)
      )

    createWindow: (windowName) ->
      @windows[windowName] = new LibOpenCV.NamedWindow(windowName, 0) unless @windows[windowName]?
      @windows[windowName]

    showFrame: (windowName, frame, delay = 42) ->
      #@windows[windowName] ?= @createWindow(windowName)
      window = @windows[windowName]
      window.show(frame)
      keyPressed = window.blockingWaitKey(0, delay)
      keyPressed

