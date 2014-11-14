'use strict';

var Cylon = require('cylon');

var Window = source('window');

describe("Cylon.Drivers.OpenCV", function() {
  var win;

  beforeEach(function() {
    win = new Window({ adaptor: {}, name: 'window' });
  });

  it("subclasses Cylon.Driver", function() {
    expect(win).to.be.an.instanceOf(Cylon.Driver);
    expect(win).to.be.an.instanceOf(Window);
  });

  describe("#constructor", function() {
    it ("sets @delay to the provided delay, or 0 by default", function() {
      expect(win.delay).to.be.eql(0);

      win = new Window({ adaptor: {}, delay: 10 });
      expect(win.delay).to.be.eql(10);
    });
  });

  describe("#commands", function() {
    it("is an object containing Window commands", function() {
      for (var c in win.commands) {
        expect(win.commands[c]).to.be.a('function');
      }
    });
  });

  describe("#start", function() {
    beforeEach(function() {
      win.adaptor = { createWindow: spy() };
    });

    it("tells the adaptor to create a Window", function() {
      win.start(function() {});
      expect(win.adaptor.createWindow).to.be.calledWith(win.name);
    });
  });

  describe("#show", function() {
    beforeEach(function() {
      win.adaptor = { showFrame: spy() };
    });

    it("tells the adaptor to show a frame", function() {
      var showFrame = win.adaptor.showFrame;

      win.show('frame', 'delay');
      expect(showFrame).to.be.calledWith(win.name, 'frame', 'delay')
    });
  });
});
