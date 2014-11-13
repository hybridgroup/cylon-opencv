'use strict';

var Cylon = require('cylon');

var Mat = source('mat');

describe('Mat', function() {
  var mat;

  beforeEach(function() {
    mat = new Mat({ adaptor: {} });
  });

  it("subclasses Cylon.Driver", function() {
    expect(mat).to.be.an.instanceOf(Cylon.Driver);
    expect(mat).to.be.an.instanceOf(Mat);
  });

  describe("#commands", function() {
    it("is an object containing Mat commands", function() {
      for (var c in mat.commands) {
        expect(mat.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#start", function() {
    beforeEach(function() {
      mat.defineDriverEvent = spy();
      mat.start(function() {});
    });

    it("defines the 'facesDetected' event", function() {
      expect(mat.defineDriverEvent).to.be.calledWith({
        eventName: 'facesDetected',
        sendUpdate: false
      });
    });
  });

  describe("#detectFaces", function() {
    beforeEach(function() {
      mat.adaptor = { detectFaces: spy() };
    });

    it("proxies to the adaptor's #detectFaces method", function() {
      mat.detectFaces('frame', 'cascade');
      expect(mat.adaptor.detectFaces).to.be.calledWith('frame', 'cascade');
    });
  });

  describe("#readImage", function() {
    beforeEach(function() {
      mat.adaptor = { readImage: spy() };
    });

    it("proxies to the adaptor's #readImage method", function() {
      mat.readImage('image', 'cb');
      expect(mat.adaptor.readImage).to.be.calledWith('image', 'cb');
    });
  });
});
