'use strict';

var Cylon = require('cylon');

var Window = source('window');

describe("Cylon.Drivers.OpenCV", function() {
  var win;

  beforeEach(function() {
    win = new Window({ device: {}, name: 'window' });
  });

  it("subclasses Cylon.Driver", function() {
    expect(win).to.be.an.instanceOf(Cylon.Driver);
    expect(win).to.be.an.instanceOf(Window);
  });

  describe("#constructor", function() {
    it ("sets @delay to the provided delay, or 0 by default", function() {
      expect(win.delay).to.be.eql(0);

      win = new Window({ device: {}, extraParams: { delay: 10 } });
      expect(win.delay).to.be.eql(10);
    });
  });

  describe("#commands", function() {
    it("is an array of Window commands", function() {
      var commands = win.commands;
      expect(commands).to.be.an('array');
      commands.forEach(function(command) {
        expect(command).to.be.a('string');
      });
    });
  });

  describe("#start", function() {
    beforeEach(function() {
      win.connection = { createWindow: spy() };
    });

    it("tells the connection to create a Window", function() {
      win.start(function() {});
      expect(win.connection.createWindow).to.be.calledWith(win.name);
    });
  });

  describe("#show", function() {
    beforeEach(function() {
      win.connection = { showFrame: spy() };
    });

    it("tells the connection to show a frame", function() {
      var showFrame = win.connection.showFrame;

      win.show('frame', 'delay');
      expect(showFrame).to.be.calledWith(win.name, 'frame', 'delay')
    });
  });
});
