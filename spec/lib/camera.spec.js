'use strict';

var Cylon = require('cylon');

var Camera = source('camera');

describe('Camera', function() {
  var camera;

  beforeEach(function() {
    camera = new Camera({
      adaptor: {},
      camera: 0,
      haarcascade: 'path/to/cascade.xml'
    });
  });

  it('subclasses Cylon.Driver', function() {
    expect(camera).to.be.an.instanceOf(Cylon.Driver);
    expect(camera).to.be.an.instanceOf(Camera);
  });

  describe("constructor", function() {
    it("defaults @displayingVideo to false", function() {
      expect(camera.displayingVideo).to.be.eql(false);
    });

    it("sets @cameraId to the provided camera ID", function() {
      expect(camera.cameraId).to.be.eql(0);
    });

    it("sets @haarcascade to the provided file", function() {
      expect(camera.haarcascade).to.be.eql("path/to/cascade.xml");
    });
  });

  describe("#commands", function() {
    it("is an object containing Camera commands", function() {
      for (var c in camera.commands) {
        expect(camera.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#start", function() {
    var args;

    beforeEach(function() {
      camera.adaptor = { initCamera: spy() };
      camera.defineDriverEvent = spy();

      camera.start(function() { });

      args = { eventName: '', sendUpdate: false };
    });

    it("defines a 'cameraReady' driver event", function() {
      args.eventName = "cameraReady";
      expect(camera.defineDriverEvent).to.be.calledWith(args);
    });

    it("defines a 'frameReady' driver event", function() {
      args.eventName = "frameReady";
      expect(camera.defineDriverEvent).to.be.calledWith(args);
    });

    it("defines a 'facesDetected' driver event", function() {
      args.eventName = "facesDetected";
      expect(camera.defineDriverEvent).to.be.calledWith(args);
    });

    it("tells the adaptor to initialize the camera", function() {
      var initCamera = camera.adaptor.initCamera;
      expect(initCamera).to.be.calledWith(0, "path/to/cascade.xml");
    });
  });

  describe("readFrame", function() {
    beforeEach(function() {
      camera.adaptor = { readFrame: spy() }
    });

    it("tells the adaptor to read a frame from the camera", function() {
      camera.readFrame();
      expect(camera.adaptor.readFrame).to.be.calledWith(0);
    });
  });

  describe("detectFaces", function() {
    beforeEach(function() {
      camera.adaptor = { detectFaces: spy() }
    });

    it("tells the adaptor to detect faces from the camera", function() {
      var detectFaces = camera.adaptor.detectFaces;
      camera.detectFaces('frame');
      expect(detectFaces).to.be.calledWith('frame', 'path/to/cascade.xml');
    });
  });
});
