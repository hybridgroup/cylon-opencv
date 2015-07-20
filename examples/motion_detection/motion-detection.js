"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    opencv: { adaptor: "opencv" }
  },

  devices: {
    window: { driver: "window" },
    camera: {
      driver: "camera",
      camera: 0
    }
  },

  work: function(my) {
    // We setup our motion detection when the camera is ready to
    // display images, we use `once` instead of `on` to make sure
    // other event listeners are only registered once.
    my.camera.once("cameraReady", function() {
      console.log("The camera is ready!");

      // We add a listener for the motionDetected event
      // here, we will get (err, image/frame, rect) params back in
      // the listener function that we pass.
      // The rect param is an array conaining rect of any motion detected
      // in the frame (im).
      my.camera.on("motionDetected", function(err, im, rect) {
        if (err) { console.log(err); }

        console.log("rect:", rect);

        // draws a rectangle on the image, using the motion tracking coordinates
        // im.rectangle([x, y], [x, y], [r, g, b], stroke-thickness)
        im.rectangle(
          [rect[0], rect[1]],
          [rect[2], rect[3]],
          [0, 255, 0],
          2
        );

        // Once the image has been updated with rectangles around
        // the faces detected, we display it in our window.
        my.window.show(im, 40);

        // After displaying the updated image, we trigger another
        // frame read to ensure the fastest processing possible.
        my.camera.readFrame();
      });

      // We listen for frameReady event, when triggered
      // we start the motion detection passing the frame
      // that we just got from the camera feed.
      my.camera.on("frameReady", function(err, im) {
        if (err) { console.log(err); }
        my.camera.detectMotion(im, [420, 110, 490, 170]);
      });

      my.camera.readFrame();
    });
  }
}).start();
