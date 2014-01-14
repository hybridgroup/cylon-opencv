###
 * Window driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
###

'use strict'

#require './cylon-opencv'

namespace = require 'node-namespace'

namespace "Cylon.Drivers.OpenCV", ->
  class @Window extends Cylon.Driver

    constructor: (opts) ->
      super
      @device = opts.device
      @connection = @device.connection
      @name = if opts.name? then opts.name else "window"
      @delay = if opts.delay then opts.delay else 0
      #@proxyMethods @commands, @connection, this

    commands: ->
      ['show', 'delay']

    start: (callback) ->
      Logger.debug "Window started"
      @connection.createWindow(@name)
      #@defineDriverEvent eventName: 'frameReady'
      #@defineDriverEvent eventName: 'facesDetected'
      @device.emit 'windowStarted'

    show: (frame, delay) ->
      @connection.showFrame(@name, frame, delay)
