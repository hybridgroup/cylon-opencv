/*
 * Window driver
 * http://cylonjs.com
 *
 * Copyright (c) 2014 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = require('node-namespace');

  namespace("Cylon.Drivers.OpenCV", function() {
    return this.Window = (function(_super) {
      __extends(Window, _super);

      function Window(opts) {
        this.delay = opts.delay ? opts.delay : 0;
        Window.__super__.constructor.apply(this, arguments);
      }

      Window.prototype.commands = function() {
        return ['show', 'delay'];
      };

      Window.prototype.start = function(callback) {
        Logger.debug("Window started");
        this.connection.createWindow(this.name);
        return Window.__super__.start.apply(this, arguments);
      };

      Window.prototype.show = function(frame, delay) {
        return this.connection.showFrame(this.name, frame, delay);
      };

      return Window;

    })(Cylon.Driver);
  });

}).call(this);
