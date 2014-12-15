var Cylon = require('cylon');

Cylon.robot({
  connections: {
    opencv: { adaptor: 'opencv' }
  },

  devices: {
    window: { driver: 'window' },
    camera: { driver: 'camera', camera: 0 }
  },

  work: function(my) {
    my.camera.on('cameraReady', function() {
      console.log('THE CAMERA IS READY!');

      my.camera.on('frameReady', function(err, im) {
        my.window.show(im, 5000);
      });

      my.camera.readFrame();
    });
  }
}).start();
