###
 * cylon-opencv
 * http://cylonjs.com
 *
 * Copyright (c) 2013 Your Name Here
 * Your License Here
###

'use strict'

namespace = require 'node-namespace'

require 'cylon'
require './opencv'
require './cv'
require './camera'
require './window'

module.exports =
  adaptor: (opts) ->
    new Cylon.Adaptors.OpenCV(opts)

  driver: (opts) ->
    if opts.name is 'camera'
      new Cylon.Drivers.OpenCV.Camera(opts)
    else if opts.name is 'window'
      new Cylon.Drivers.OpenCV.Window(opts)
    else if opts.name is 'opencv'
      new Cylon.Drivers.OpenCV.OpenCV(opts)
    else
      null

  register: (robot) ->
    robot.registerAdaptor 'cylon-opencv', 'opencv'
    robot.registerDriver 'cylon-opencv', 'camera'
    robot.registerDriver 'cylon-opencv', 'window'
    robot.registerDriver 'cylon-opencv', 'opencv'
