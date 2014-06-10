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
  if (opts == null) {
    opts = {};
  }

  this.delay = opts.delay ? opts.delay : 0;
  Window.__super__.constructor.apply(this, arguments);
};

Cylon.Utils.subclass(Window, Cylon.Driver);

Window.prototype.commands = ['show', 'delay', 'showImage'];

Window.prototype.start = function() {
  Cylon.Logger.debug("Window started");
  this.connection.createWindow(this.name);
  Window.__super__.start.apply(this, arguments);
};

Window.prototype.show = function(frame, delay) {
  this.connection.showFrame(this.name, frame, delay);
};
