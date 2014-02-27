'use strict';
var module = source("cylon-opencv");

describe("cylon-opencv", function() {
  it("standard async test", function(done) {
    var bool = false;

    bool.should.be["false"];

    setTimeout(function() {
      bool.should.be["false"];
      bool = true;
      return bool.should.be["true"];
    });

    150;

    setTimeout(function() {
      bool.should.be["true"];
      done();
    });

    300;
  });

  it("standard sync test", function() {
    var data = [],
        obj = {
          id: 5,
          name: 'test'
        };

    data.should.be.empty;
    data.push(obj);
    data.should.have.length(1);
    data[0].should.be.eql(obj);
    data[0].should.be.equal(obj);
  });

  it("should be able to register", function() {
    module.register.should.be.a('function');
  });

  it("should be able to create adaptor", function() {
    module.adaptor.should.be.a('function');
  });
});
