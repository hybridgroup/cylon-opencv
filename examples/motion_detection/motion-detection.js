"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    opencv: { adaptor: "opencv" }
  },

  devices: {
    window: { driver: "window" },
    camera: { driver: "camera", camera: 0 }
  },

  work: function(my) {
    // We setup our motion detection when the camera is ready to
    // display images, we use `once` instead of `on` to make sure
    // other event listeners are only registered once.
    my.camera.once("cameraReady", function() {
      console.log("The camera is ready!");

      // here, we add a listener for the `motionDetected` event.
      //
      // when motion is detected, we will get passed the following parameters:
      //
      // err - any error that occured
      // im - the current image
      // rect - an array of rectangle coordinates containing the detected motion
      // delta - the difference between the previous frame's rect and this one
      my.camera.on("motionDetected", function(err, im, rect, delta) {
        if (err) { console.log(err); }

        console.log("rect:", rect);
        console.log("delta:", delta);

        // draws a rectangle on the image, using the motion tracking coordinates
        // im.rectangle([x, y], [x, y], [r, g, b], stroke-thickness)
        im.rectangle(
          [rect[0], rect[1]],
          [rect[2], rect[3]],
          [0, 255, 0],
          2
        );

        // once we've updated the image with the motion-detection rectangle,
        // display it in our window.
        my.window.show(im, 40);
      });

      // when opencv tells us that a frame has been read with the `frameReady`
      // event, we start motion detection, passing along the frame we just
      // received.
      my.camera.on("frameReady", function(err, im) {
        if (err) { console.log(err); }
        my.camera.detectMotion(im, [420, 110, 490, 170]);

        // when the frame is ready, request another one.
        my.camera.readFrame();
      });

      // start things off by requesting a frame
      my.camera.readFrame();
    });
  }
}).start();
