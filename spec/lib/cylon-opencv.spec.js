"use strict";

var module = source("cylon-opencv");

var Adaptor = source('adaptor');

var Drivers = {
  'mat': source('mat'),
  'camera': source('camera'),
  'window': source('window')
};

describe("cylon-opencv", function() {
  describe("#adaptors", function() {
    it('is an array of supplied adaptors', function() {
      expect(module.adaptors).to.be.eql(['opencv']);
    });
  });

  describe("#drivers", function() {
    it('is an array of supplied drivers', function() {
      expect(module.drivers).to.be.eql(['mat', 'camera', 'window']);
    });
  });

  describe("#adaptor", function() {
    it("returns an instance of the OpenCV adaptor", function() {
      expect(module.adaptor()).to.be.an.instanceOf(Adaptor);
    });
  });

  describe("#driver", function() {
    var opts;

    beforeEach(function() {
      opts = { adaptor: {} };
    });

    context("when opts.driver is 'camera'", function() {
      it('returns an instance of the camera driver', function() {
        opts.driver = 'camera';
        expect(module.driver(opts)).to.be.an.instanceOf(Drivers.camera);
      });
    });

    context("when opts.driver is 'window'", function() {
      it('returns an instance of the window driver', function() {
        opts.driver = 'window';
        expect(module.driver(opts)).to.be.an.instanceOf(Drivers.window);
      });
    });

    context("when opts.driver is 'mat'", function() {
      it('returns an instance of the mat driver', function() {
        opts.driver = 'mat';
        expect(module.driver(opts)).to.be.an.instanceOf(Drivers.mat);
      });
    });
  });
});
