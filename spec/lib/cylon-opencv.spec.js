"use strict";

var opencv = lib("cylon-opencv");

var Adaptor = lib("adaptor");

var Drivers = {
  mat: lib("mat"),
  camera: lib("camera"),
  video: lib("video"),
  window: lib("window")
};

describe("cylon-opencv", function() {
  describe("#adaptors", function() {
    it("is an hash of supplied adaptors", function() {
      expect(opencv.adaptors).to.be.eql(["opencv"]);
    });
  });

  describe("#drivers", function() {
    it("is an hash of supplied drivers", function() {
      expect(opencv.drivers).to.be.eql(["mat", "camera", "video", "window"]);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the OpenCV adaptor", function() {
      expect(opencv.adaptor()).to.be.an.instanceOf(Adaptor);
    });
  });

  describe("#driver", function() {
    var opts;

    beforeEach(function() {
      opts = { adaptor: {} };
    });

    context("when opts.driver is 'camera'", function() {
      it("returns an instance of the camera driver", function() {
        opts.driver = "camera";
        expect(opencv.driver(opts)).to.be.an.instanceOf(Drivers.camera);
      });
    });

    context("when opts.driver is 'window'", function() {
      it("returns an instance of the window driver", function() {
        opts.driver = "window";
        expect(opencv.driver(opts)).to.be.an.instanceOf(Drivers.window);
      });
    });

    context("when opts.driver is 'mat'", function() {
      it("returns an instance of the mat driver", function() {
        opts.driver = "mat";
        expect(opencv.driver(opts)).to.be.an.instanceOf(Drivers.mat);
      });
    });
  });
});
