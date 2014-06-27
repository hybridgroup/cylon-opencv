'use strict';

var Cylon = require('cylon');

var Mat = source('mat');

describe('Mat', function() {
  var mat;

  beforeEach(function() {
    mat = new Mat({ device: {} });
  });

  it("subclasses Cylon.Driver", function() {
    expect(mat).to.be.an.instanceOf(Cylon.Driver);
    expect(mat).to.be.an.instanceOf(Mat);
  });

  describe("#commands", function() {
    it("is an array of Mat commands", function() {
      var commands = mat.commands;
      expect(commands).to.be.an('array');
      commands.forEach(function(command) {
        expect(command).to.be.a('string');
      });
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
      mat.connection = { detectFaces: spy() };
    });

    it("proxies to the connection's #detectFaces method", function() {
      mat.detectFaces('frame', 'cascade');
      expect(mat.connection.detectFaces).to.be.calledWith('frame', 'cascade');
    });
  });

  describe("#readImage", function() {
    beforeEach(function() {
      mat.connection = { readImage: spy() };
    });

    it("proxies to the connection's #readImage method", function() {
      mat.readImage('image', 'cb');
      expect(mat.connection.readImage).to.be.calledWith('image', 'cb');
    });
  });
});
