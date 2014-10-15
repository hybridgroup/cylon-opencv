var cylon = require('cylon');

cylon.robot({
  connection: { name: 'opencv', adaptor: 'opencv' },
  devices: [
    { name: 'window', driver: 'window' },
    { name: 'camera', driver: 'camera', camera: 0 }
  ]
})

.on('ready', function(robot) {
  robot.camera.on('cameraReady', function() {
    console.log('THE CAMERA IS READY!');

    robot.camera.on('frameReady', function(err, im) {
      robot.window.show(im, 5000);
    });

    robot.camera.readFrame();
  });
})

.start();
