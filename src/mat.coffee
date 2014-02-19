###
 * Window driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

namespace = require 'node-namespace'

namespace "Cylon.Drivers.OpenCV", ->
  class @Mat extends Cylon.Driver
    commands: ->
      ['readImage', 'detectFaces']

    constructor: (opts) ->
      super

    start: (callback) ->
      @defineDriverEvent eventName: 'facesDetected', sendUpdate: false
      super

    detectFaces: (frame, haarcascade) ->
      @connection.detectFaces(frame, haarcascade)

    readImage: (image, cb) ->
      @connection.readImage(image, cb)
