"use strict";

var Cylon = require("cylon"),
    OpenCV = require("opencv");

var Adaptor = lib("adaptor");

describe("Adaptor", function() {
  var adaptor;

  beforeEach(function() {
    adaptor = new Adaptor();
  });

  it("subclasses Cylon.Adaptor", function() {
    expect(adaptor).to.be.an.instanceOf(Cylon.Adaptor);
    expect(adaptor).to.be.an.instanceOf(Adaptor);
  });

  describe("#constructor", function() {
    it("sets @videoFeeds to an empty object by default", function() {
      expect(adaptor.videoFeeds).to.be.eql({});
    });

    it("sets @windows to an empty object by default", function() {
      expect(adaptor.windows).to.be.eql({});
    });
  });

  describe("#commands", function() {
    it("is an array of Adaptor commands", function() {
      var commands = adaptor.commands;
      expect(commands).to.be.an("array");
      commands.forEach(function(command) {
        expect(command).to.be.a("string");
      });
    });
  });

  describe("#initVideoCapture", function() {
    var clock, videoFeed;

    beforeEach(function() {
      clock = sinon.useFakeTimers();
      videoFeed = { read: stub() };
      stub(OpenCV, "VideoCapture").returns(videoFeed);
    });

    afterEach(function() {
      OpenCV.VideoCapture.restore();
    });

    it("initializes a new video capture with the provided feed ID", function() {
      adaptor.initVideoCapture(1);
      expect(OpenCV.VideoCapture).to.be.calledWithNew;
      expect(OpenCV.VideoCapture).to.be.calledWith(1);
    });

    it("attempts to read from the video feed every 100ms", function() {
      adaptor.initVideoCapture("1");

      clock.tick(100);
      expect(videoFeed.read).to.be.calledOnce;

      clock.tick(100);
      expect(videoFeed.read).to.be.calledTwice;
    });

    context("if the video feed is already initialized", function() {
      it("doesn't try to register it again", function() {
        adaptor.videoFeeds[1] = {};
        adaptor.initVideoCapture("1");
        expect(OpenCV.VideoCapture).to.not.be.called;
      });
    });

    context("when the video feed starts sending images", function() {
      var im;

      beforeEach(function() {
        adaptor.emit = spy();

        im = { width: stub().returns(50), height: stub().returns(50) };

        videoFeed.read.yields(null, im);

        adaptor.initVideoCapture("1");

        clock.tick(100);
      });

      it("emits 'videoFeedReady'", function() {
        expect(adaptor.emit).to.be.calledWith("videoFeedReady");
      });

      it("stops reading from the video feed", function() {
        expect(videoFeed.read).to.be.calledOnce;
        clock.tick(500);
        expect(videoFeed.read).to.be.calledOnce;
      });
    });
  });

  describe("readFrame", function() {
    var videoFeed;

    beforeEach(function() {
      adaptor.emit = spy();
      videoFeed = adaptor.videoFeeds[1] = { read: stub() };
      videoFeed.read.yields(null, "frame");
    });

    it("reads a frame from the video feed", function() {
      adaptor.readFrame(1);
      expect(videoFeed.read).to.be.called;
    });

    it("emits the frame on the 'frameReady' event", function() {
      var emit = adaptor.emit;
      adaptor.readFrame(1);
      expect(emit).to.be.calledWith("frameReady", null, "frame");
    });
  });

  describe("#readImage", function() {
    beforeEach(function() {
      stub(OpenCV, "readImage");
    });

    afterEach(function() {
      OpenCV.readImage.restore();
    });

    it("proxies to the #readImage method in OpenCV", function() {
      adaptor.readImage("image", "cb");
      expect(OpenCV.readImage).to.be.calledWith("image", "cb");
    });
  });

  describe("#detectFaces", function() {
    var image, cascade, faces;

    beforeEach(function() {
      adaptor.emit = spy();
      faces = ["faces"];
      cascade = "cascade";
      image = { detectObject: stub().yields(null, faces) };
    });

    it("calls the image's #detectObject method", function() {
      adaptor.detectFaces(image, cascade);
      expect(image.detectObject).to.be.calledWith(cascade);
    });

    it("emits detected faces on the 'facesDetected' event", function() {
      adaptor.detectFaces(image, cascade);
      var emit = adaptor.emit;
      expect(emit).to.be.calledWith("facesDetected", null, image, faces);
    });
  });

  describe("#detectMotion", function() {
    var image, start, rect;

    beforeEach(function() {
      spy(adaptor, "emit");
      image = {};
      start = [100, 200, 300, 400];

      rect = [1, 2, 3, 4];

      adaptor.last = [1, 1, 1, 1];

      adaptor.motionTracker = { track: stub().returns(rect) };
    });

    context("if adaptor.motionTracker isn't set", function() {
      beforeEach(function() {
        stub(OpenCV, "TrackedObject").returns({ track: stub() });
        adaptor.motionTracker = null;
        adaptor.last = null;
        adaptor.detectMotion(image, start);
      });

      afterEach(function() {
        OpenCV.TrackedObject.restore();
      });

      it("creates a new TrackedObject with start", function() {
        expect(OpenCV.TrackedObject).to.be.calledWithNew;
        expect(OpenCV.TrackedObject).to.be.calledWith(
          image, start, { channel: "value" }
        );
      });
    });

    context("if there's no last image to compare against", function() {
      beforeEach(function() {
        adaptor.last = false;
      });

      it("doesn't emit an event", function() {
        adaptor.detectMotion(image, start);
        expect(adaptor.emit).to.not.be.calledWith("motionDetected");
      });
    });

    it("calls motionTracker#track with the new image", function() {
      adaptor.detectMotion(image, start);
      expect(adaptor.motionTracker.track).to.be.calledWith(image);
    });

    it("triggers the event with the image, rect, and delta", function() {
      adaptor.detectMotion(image, start);
      expect(adaptor.emit).to.be.calledWith(
        "motionDetected",
        null, image, rect, [0, -1, -2, -3]
      );
    });

    it("stores the tracked rect in adaptor.last", function() {
      adaptor.detectMotion(image, start);
      expect(adaptor.last).to.be.eql(rect);
    });
  });

  describe("createWindow", function() {
    var mockWindow;

    beforeEach(function() {
      mockWindow = {};
      stub(OpenCV, "NamedWindow").returns(mockWindow);
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
        adaptor.windows.window = mockWindow;
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
      adaptor.windows = { window: win };
      frame = "frame";
    });

    it("tells the window to show the provided frame", function() {
      adaptor.showFrame("window", frame);
      expect(win.show).to.be.calledWith(frame);
    });

    it("sets a blocking delay", function() {
      adaptor.showFrame("window", frame, 100);
      expect(win.blockingWaitKey).to.be.calledWith(0, 100);
    });

    it("defaults the delay to 42 if one isn't provided", function() {
      adaptor.showFrame("window", frame);
      expect(win.blockingWaitKey).to.be.calledWith(0, 42);
    });
  });
});
