(function() {
  'use strict';
  var EventEmitter;

  source('mat');

  EventEmitter = require('events').EventEmitter;

  describe('Cylon.Drivers.OpenCV.Mat', function() {
    var mat;
    mat = new Cylon.Drivers.OpenCV.Mat({
      device: new EventEmitter
    });
    it("provides a 'readImage' function", function() {
      return expect(mat.readImage).to.be.a('function');
    });
    return it("provides a 'detectFaces' function", function() {
      return expect(mat.detectFaces).to.be.a('function');
    });
  });

}).call(this);
