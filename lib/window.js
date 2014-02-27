/*
 * Window driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/

'use strict';

var namespace = require('node-namespace');

namespace("Cylon.Drivers.OpenCV", function() {
  return this.Window = (function(_parent) {
    subclass(Window, _parent);

    function Window(opts) {
      this.delay = opts.delay ? opts.delay : 0;
      Window.__super__.constructor.apply(this, arguments);
    }

    Window.prototype.commands = function() {
      return ['show', 'delay', 'showImage'];
    };

    Window.prototype.start = function() {
      Logger.debug("Window started");
      this.connection.createWindow(this.name);
      Window.__super__.start.apply(this, arguments);
    };

    Window.prototype.show = function(frame, delay) {
      this.connection.showFrame(this.name, frame, delay);
    };

    return Window;

  })(Cylon.Driver);
});
