/*
 * Window driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var Cylon = require('cylon');

var Window = module.exports = function Window(opts) {
  Window.__super__.constructor.apply(this, arguments);

  this.delay = opts.delay || 0;

  this.commands = {
    show: this.show
  };
};

Cylon.Utils.subclass(Window, Cylon.Driver);

Window.prototype.start = function(callback) {
  Cylon.Logger.debug("Window started");
  this.adaptor.createWindow(this.name);
  callback();
};

Window.prototype.halt = function(callback) {
  callback();
};

Window.prototype.show = function(frame, delay) {
  this.adaptor.showFrame(this.name, frame, delay);
};
