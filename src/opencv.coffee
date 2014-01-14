###
 * Cylonjs Opencv adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

#require './cylon-opencv'
OpenCV = require 'opencv'
namespace = require 'node-namespace'

namespace "Cylon.Adaptors", ->
  class @OpenCV extends Cylon.Adaptor
    constructor: (opts = {}) ->
      super
      @cameras = {}
      @windows = {}

    commands: ->
      ['readFrame', 'cameraFeed', 'detectFace', 'openWindow']

    connect: (callback) ->
      @board = new LibFirmata.Board @connection.port.toString(), =>
        (callback)(null)
        @connection.emit 'connect'

      @proxyMethods @commands, @board, @myself

    disconnect: ->
      Logger.debug "Disconnecting from board '#{@name}'..."
      @board.reset()

    initCamera: (cameraId, callback) ->
      @cameras[cameraId] = OpenCV.VideoCapture(cameraId) unless @cameras[cameraId]?
      camera = @cameras[cameraId]

      everyId = every(0.1, () =>
        camera.read((err, im) =>
          if im.width() > 0 and im.height() > 0
            clearInterval(everyId) if everyId?
            (callback)(null)
            @connection.emit 'cameraReady'
        )
      )

    readFrame: (cameraId) ->
      camera = @cameras[cameraId] # = OpenCV.VideoCapture(cameraId) unless @cameras[cameraId]
      camera.read((err, frame) =>
        @connection.emit('frameReady', err, frame)
      )

    detectFaces: (im) ->
      im.detectObject('./haarcascade_frontalface_alt.xml', {}, (err, faces) =>
        @connection.emit('facesDetected', err, faces)

    createWindow: (windowName) ->
      @windows[windowName] = new cv.NamedWindow(windowName, 0) unless @windows[windowName]?
      @windows[windowName]

    showFrame: (windowName, frame, delay = 42) ->
      @windows[windowName] ?= @createWindow(windowName)
      window = @windows[windowName]
      window.show(frame)
      keyPressed = window.blockingWaitKey(0, delay)
      keyPressed

