"use strict";

var Cylon = require("cylon");

Cylon.robot({
  connections: {
    opencv: { adaptor: "opencv" }
  },

  devices: {
    window: { driver: "window" },
    video: {
      driver: "video",
      video: "./video1.avi",
      haarcascade: __dirname + "/haarcascade_frontalface_alt.xml"
    }
  },

  work: function(my) {
    my.video.once("videoReady", function() {
      console.log("The video is ready!");

      // We listen for frame ready event, when triggered
      // we display the frame/image passed as an argument to
      // the listener function, and we tell the window to wait 40 milliseconds
      my.video.on("frameReady", function(err, im) {
        console.log("FRAMEREADY!");
        my.window.show(im, 50);
      });

      // Here we have two options to start reading frames from
      // the video feed.
      // 1. "As fast as possible": triggering the next frame read
      //    in the listener for frameReady, if you need video
      //    as smooth as possible uncomment #my.video.readFrame()
      //    in the listener above and the one below this comment.
      //    Also comment out the `every 50, my.video.readFrame`
      //    at the end of the comments.
      //
      // my.video.readFrame()
      //
      // 2. `Use an interval of time`: to try to get a set amount
      //    of frames per second (FPS), we use an `every 50, myFunction`,
      //    we are trying to get 1 frame every 50 milliseconds
      //    (20 FPS), hence the following line of code.
      //
      every(50, my.video.readFrame);
    });
  }
}).start();
