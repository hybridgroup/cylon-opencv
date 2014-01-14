###
 * cylon-opencv
 * http://cylonjs.com
 *
 * Copyright (c) 2013 Your Name Here
 * Your License Here
###

'use strict'

require 'cylon'
require './camera'
require './window'

module.exports =
  adaptor: (args...) ->
    new Cylon.Adaptors.OpenCV(args...)

  driver: (args...) ->
    if args.name is 'camera'
      new Cylon.Drivers.Camera(args...)
    else if args.name is 'window'
      new Cylon.Drivers.Window(args...)
    else
      null

  register: (robot) ->
    robot.registerAdaptor 'cylon-opencv', 'opencv'
    robot.registerDriver 'cylon-camera', 'camera'
    robot.registerDriver 'cylon-window', 'window'
