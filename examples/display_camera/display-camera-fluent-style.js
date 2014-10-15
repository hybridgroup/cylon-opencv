var cylon = require('cylon');

cylon.robot({
  connection: { name: 'opencv', adaptor: 'opencv' },
  devices: [
    { name: 'window', driver: 'window' },
    {
      name: 'camera',
      driver: 'camera',
      camera: 0,
      haarcascade: __dirname + "/haarcascade_frontalface_alt.xml"
    }
  ]
})

.on('ready', function(robot) {
  robot.camera.once('cameraReady', function() {
    console.log('The camera is ready!');

    // We listen for frame ready event, when triggered
    // we display the frame/image passed as an argument to
    // the listener function, and we tell the window to wait 40 milliseconds
    robot.camera.on('frameReady', function(err, im) {
      console.log("FRAMEREADY!");
      robot.window.show(im, 40);
    });

    // Here we have two options to start reading frames from
    // the camera feed.
    // 1. 'As fast as possible': triggering the next frame read
    //    in the listener for frameReady, if you need video
    //    as smooth as possible uncomment #robot.camera.readFrame()
    //    in the listener above and the one below this comment.
    //    Also comment out the `every 50, robot.camera.readFrame`
    //    at the end of the comments.
    //
    // robot.camera.readFrame()
    //
    // 2. `Use an interval of time`: to try to get a set amount
    //    of frames per second (FPS), we use an `every 50, myFunction`,
    //    we are trying to get 1 frame every 50 milliseconds
    //    (20 FPS), hence the following line of code.
    //
    setInterval(function() {
      robot.camera.readFrame();
    }, 50);
  });
})

.start();
