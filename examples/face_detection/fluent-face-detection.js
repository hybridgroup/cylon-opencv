"use strict";

var Cylon = require("cylon");

Cylon
  .robot()
  .connection("opencv", { name: "opencv", adaptor: "opencv" })
  .device("window", { driver: "window" })
  .device("camera", {
    driver: "camera",
    camera: 0,
    haarcascade: __dirname + "/haarcascade_frontalface_alt.xml"
  })

  .on("ready", function(bot) {
    // We setup our face detection when the camera is ready to
    // display images, we use `once` instead of `on` to make sure
    // other event listeners are only registered once.
    bot.camera.once("cameraReady", function() {
      console.log("The camera is ready!");

      // We add a listener for the facesDetected event
      // here, we will get (err, image/frame, faces) params back in
      // the listener function that we pass.
      // The faces param is an array conaining any face detected
      // in the frame (im).
      bot.camera.on("facesDetected", function(err, im, faces) {
        // We loop through the faces and manipulate the image
        // to display a square in the coordinates for the detected
        // faces.
        for (var i = 0; i < faces.length; i++) {
          var face = faces[i];
          im.rectangle(
            [face.x, face.y],
            [face.x + face.width, face.y + face.height],
            [0, 255, 0],
            2
          );
        }

        // The second to last param is the color of the rectangle
        // as an rgb array e.g. [r,g,b].
        // Once the image has been updated with rectangles around
        // the faces detected, we display it in our window.
        bot.window.show(im, 40);

        // After displaying the updated image we trigger another
        // frame read to ensure the fastest processing possible.
        // We could also use an interval to try and get a set
        // amount of processed frames per second, see below.
        bot.camera.readFrame();
      });

      // We listen for frameReady event, when triggered
      // we start the face detection passing the frame
      // that we just got from the camera feed.
      bot.camera.on("frameReady", function(err, im) {
        bot.camera.detectFaces(im);
      });

      bot.camera.readFrame();
    });
  });

Cylon.start();
