'use strict'

source 'mat'
EventEmitter = require('events').EventEmitter

describe 'Cylon.Drivers.OpenCV.Mat', ->
  mat = new Cylon.Drivers.OpenCV.Mat
    device: new EventEmitter

  it "provides a 'readImage' function", ->
    expect(mat.readImage).to.be.a 'function'

  it "provides a 'detectFaces' function", ->
    expect(mat.detectFaces).to.be.a 'function'
