'use strict';

var Cylon = require('cylon'),
    OpenCV = require('opencv');

var Adaptor = source('adaptor');

describe("Adaptor", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new Adaptor();
  });

  it("subclasses Cylon.Adaptor", function() {
    expect(adaptor).to.be.an.instanceOf(Cylon.Adaptor);
    expect(adaptor).to.be.an.instanceOf(Adaptor);
  })

  describe("#constructor", function() {
    it('sets @cameras to an empty object by default', function() {
      expect(adaptor.cameras).to.be.eql({});
    });

    it('sets @windows to an empty object by default', function() {
      expect(adaptor.windows).to.be.eql({});
    });
  });

  describe("#commands", function() {
    it("is an array of Adaptor commands", function() {
      var commands = adaptor.commands;
      expect(commands).to.be.an('array');
      commands.forEach(function(command) {
        expect(command).to.be.a('string');
      });
    });
  });

  describe("#initCamera", function() {
    var clock, camera;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
      camera = { read: stub() };
      stub(OpenCV, 'VideoCapture').returns(camera);
    });

    afterEach(function() {
      OpenCV.VideoCapture.restore();
    });

    it("initializes a new OpenCV video capture with the provided camera ID", function() {
      adaptor.initCamera("1");
      expect(OpenCV.VideoCapture).to.be.calledWithNew;
      expect(OpenCV.VideoCapture).to.be.calledWith(1);
    });

    it("attempts to read from the camera every 100ms", function() {
      adaptor.initCamera("1");

      clock.tick(100);
      expect(camera.read).to.be.calledOnce;

      clock.tick(100);
      expect(camera.read).to.be.calledTwice;
    });

    context("if the camera is already initialized", function() {
      it("doesn't try to register it again", function() {
        adaptor.cameras[1] = {};
        adaptor.initCamera("1");
        expect(OpenCV.VideoCapture).to.not.be.called;
      });
    })

    context("when the camera starts sending images", function() {
      var im;

      beforeEach(function() {
        adaptor.connection = { emit: spy() };
        im = { width: stub().returns(50), height: stub().returns(50) };

        camera.read.yields(null, im);

        adaptor.initCamera('1');

        clock.tick(100);
      });

      it("emits 'cameraReady'", function() {
        expect(adaptor.connection.emit).to.be.calledWith("cameraReady")
      });

      it("stops reading from the camera", function() {
        expect(camera.read).to.be.calledOnce;
        clock.tick(500);
        expect(camera.read).to.be.calledOnce;
      });
    });
  });

  describe("readFrame", function() {
    var camera;

    beforeEach(function() {
      adaptor.connection = { emit: spy() };
      camera = adaptor.cameras[1] = { read: stub() };
      camera.read.yields(null, "frame");
    });

    it('reads a frame from the camera', function() {
      adaptor.readFrame(1);
      expect(camera.read).to.be.called;
    });

    it("emits the frame on the 'frameReady' event", function() {
      var emit = adaptor.connection.emit;
      adaptor.readFrame(1);
      expect(emit).to.be.calledWith("frameReady", null, "frame");
    });
  });

  describe("#readImage", function() {
    beforeEach(function() {
      stub(OpenCV, 'readImage');
    });

    afterEach(function() {
      OpenCV.readImage.restore();
    });

    it("proxies to the #readImage method in OpenCV", function() {
      adaptor.readImage('image', 'cb');
      expect(OpenCV.readImage).to.be.calledWith('image', 'cb');
    });
  });

  describe("#detectFaces", function() {
    var image, cascade, faces;

    beforeEach(function() {
      adaptor.connection = { emit: spy() };
      faces = ["faces"];
      cascade = "cascade";
      image = { detectObject: stub().yields(null, faces) };
    });

    it("calls the image's #detectObject method with passed haarcascade", function() {
      adaptor.detectFaces(image, cascade);
      expect(image.detectObject).to.be.calledWith(cascade);
    });

    it("emits detected faces on the 'facesDetected' event", function() {
      adaptor.detectFaces(image, cascade);
      var emit = adaptor.connection.emit;
      expect(emit).to.be.calledWith('facesDetected', null, image, faces);
    })
  });

  describe("createWindow", function() {
    var mockWindow;

    beforeEach(function() {
      mockWindow = {};
      stub(OpenCV, 'NamedWindow').returns(mockWindow);
    });

    afterEach(function() {
      OpenCV.NamedWindow.restore();
    });

    it("creates a new OpenCV NamedWindow", function() {
      var win = adaptor.createWindow("window");

      expect(win).to.be.eql(mockWindow);

      expect(OpenCV.NamedWindow).to.be.calledWithNew;
      expect(OpenCV.NamedWindow).to.be.calledWith("window", 0);
    });

    context("if a window with the provided name already exists", function() {
      beforeEach(function() {
        adaptor.windows["window"] = mockWindow;
      });

      it("returns the existing window", function() {
        var win = adaptor.createWindow("window");
        expect(OpenCV.NamedWindow).to.not.be.called;
        expect(win).to.be.eql(mockWindow);
      });
    });
  });

  describe("#showFrame", function() {
    var win, frame;

    beforeEach(function() {
      win = { show: spy(), blockingWaitKey: spy() };
      adaptor.windows = { 'window': win };
      frame = "frame";
    });

    it("tells the window to show the provided frame", function() {
      adaptor.showFrame('window', frame);
      expect(win.show).to.be.calledWith(frame);
    });

    it('sets a blocking delay', function() {
      adaptor.showFrame('window', frame, 100);
      expect(win.blockingWaitKey).to.be.calledWith(0, 100);
    });

    it("defaults the delay to 42 if one isn't provided", function() {
      adaptor.showFrame('window', frame);
      expect(win.blockingWaitKey).to.be.calledWith(0, 42);
    });
  });
});
