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
  class @Window extends Cylon.Driver

    constructor: (opts) ->
      @delay = if opts.delay then opts.delay else 0
      super

    commands: ->
      ['show', 'delay']

    start: (callback) ->
      Logger.debug "Window started"
      @connection.createWindow(@name)
      super

    show: (frame, delay) ->
      @connection.showFrame(@name, frame, delay)
