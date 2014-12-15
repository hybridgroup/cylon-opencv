var Cylon = require('cylon');

Cylon
  .robot()
  .connection("opencv", { name: 'opencv', adaptor: 'opencv' })
  .device("window", { driver: 'window' })
  .device("camera", { driver: 'camera', camera: 0 })
  .on('ready', function(bot) {
    bot.camera.on('cameraReady', function() {
      console.log('the camera is ready!');

      bot.camera.on('frameReady', function(err, im) {
        bot.window.show(im, 5000);
      });

      bot.camera.readFrame();
    });
  });

Cylon.start();
