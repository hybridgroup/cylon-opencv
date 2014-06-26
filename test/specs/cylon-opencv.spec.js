"use strict";

var module = source("cylon-opencv");

var Adaptor = source('adaptor');

var Drivers = {
  Mat: source('mat'),
  Camera: source('camera'),
  Window: source('window')
};

describe("cylon-opencv", function() {
  describe("#register", function() {
    var bot, adaptor, driver;

    beforeEach(function() {
      bot = {};

      adaptor = bot.registerAdaptor = spy();
      driver = bot.registerDriver = spy();

      module.register(bot);
    });

    it("registers the 'opencv' adaptor with the robot", function() {
      expect(adaptor).to.be.calledWith('cylon-opencv', 'opencv');
    });

    it("registers the 'camera' driver with the robot", function() {
      expect(driver).to.be.calledWith('cylon-opencv', 'camera');
    });

    it("registers the 'window' driver with the robot", function() {
      expect(driver).to.be.calledWith('cylon-opencv', 'window');
    });

    it("registers the 'mat' driver with the robot", function() {
      expect(driver).to.be.calledWith('cylon-opencv', 'mat');
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
      opts = { device: {}, extraParams: {} };
    });

    context("when opts.name is 'camera'", function() {
      it('returns an instance of the camera driver', function() {
        opts.name = 'camera';
        expect(module.driver(opts)).to.be.an.instanceOf(Drivers.Camera);
      });
    });

    context("when opts.name is 'window'", function() {
      it('returns an instance of the window driver', function() {
        opts.name = 'window';
        expect(module.driver(opts)).to.be.an.instanceOf(Drivers.Window);
      });
    });

    context("when opts.name is 'mat'", function() {
      it('returns an instance of the mat driver', function() {
        opts.name = 'mat';
        expect(module.driver(opts)).to.be.an.instanceOf(Drivers.Mat);
      });
    });
  });
});
