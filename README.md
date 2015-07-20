# Cylon.js For OpenCV

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics, physical computing, and the Internet of Things (IoT).

This repository contains the Cylon adaptor and drivers for OpenCV (http://opencv.org/), the powerful open source computer vision platform. It uses the node-opencv module [https://github.com/peterbraden/node-opencv](https://github.com/peterbraden/node-opencv) created by [@peterbraden](https://github.com/peterbraden) thank you!

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

[![Build Status](https://secure.travis-ci.org/hybridgroup/cylon-opencv.png?branch=master)](http://travis-ci.org/hybridgroup/cylon-opencv) [![Code Climate](https://codeclimate.com/github/hybridgroup/cylon-opencv/badges/gpa.svg)](https://codeclimate.com/github/hybridgroup/cylon-opencv) [![Test Coverage](https://codeclimate.com/github/hybridgroup/cylon-opencv/badges/coverage.svg)](https://codeclimate.com/github/hybridgroup/cylon-opencv)

## How to Install

    $ npm install cylon cylon-opencv

In order to use OpenCV you first need to install it and make sure it is working correctly on your computer.
You can follow the tutorials in the [OpenCV site][site] to install it in your particular OS:

[site]: http://docs.opencv.org/doc/tutorials/introduction/table_of_content_introduction/table_of_content_introduction.html#table-of-content-introduction

### Ubuntu

```bash
#!/bin/bash
sudo apt-get -y install autoconf automake build-essential git libass-dev libgpac-dev \
  libsdl1.2-dev libtheora-dev libtool libva-dev libvdpau-dev libvorbis-dev libx11-dev \
  libxext-dev libxfixes-dev pkg-config texi2html zlib1g-dev yasm libmp3lame-dev \
  libopus-dev libvpx-dev cmake libgtk2.0-dev pkg-config libjpeg8 libjpeg8-dev \
  libgstreamer0.10-0 libgstreamer0.10-dev gstreamer0.10-tools gstreamer0.10-plugins-base \
  libgstreamer-plugins-base0.10-dev gstreamer0.10-plugins-good gstreamer0.10-plugins-ugly \
  gstreamer0.10-plugins-bad gstreamer0.10-ffmpeg
mkdir ~/ffmpeg_sources
cd ~/ffmpeg_sources
git clone --depth 1 git://git.videolan.org/x264.git
cd x264
./configure --prefix="/usr/local" --bindir="/usr/local/bin" --enable-shared --enable-pic
make
sudo make install
cd ~/ffmpeg_sources
git clone --depth 1 git://git.code.sf.net/p/opencore-amr/fdk-aac
cd fdk-aac
autoreconf -fiv
./configure --prefix="/usr/local" --bindir="/usr/local/bin" --enable-shared --with-pic
make
sudo make install
cd ~/ffmpeg_sources
git clone --depth 1 git://source.ffmpeg.org/ffmpeg
cd ffmpeg
export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig"
./configure --prefix="/usr/local"   --extra-cflags="-I/usr/local/include" --extra-ldflags="-L/usr/local/lib"   --bindir="/usr/local/bin" \
  --extra-libs="-ldl" --enable-gpl --enable-libass --enable-libfdk-aac   --enable-libmp3lame --enable-libopus --enable-libtheora \
  --enable-libvorbis --enable-libvpx   --enable-libx264 --enable-nonfree --enable-x11grab --enable-shared --enable-pic
make
sudo make install
hash -r
cd ~
git clone --depth 1 -b 2.4.6.2 https://github.com/Itseez/opencv.git
cd opencv
mkdir release
cd release
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local ..
make
sudo make install
```

### Intel Edison

IMPORTANT NOTE: if you are using the latest Edison firmware then DO NOT run `opkg install kernel-module-uvcvideo` as the UVC drivers are already installed, and it will cause them to stop working!

Follow instructions from [http://alextgalileo.altervista.org/edison-package-repo-configuration-instructions.html](http://alextgalileo.altervista.org/edison-package-repo-configuration-instructions.html) to add the "official unofficial" package repo.

Then run these commands:

```
opkg install libopencv-core-dev
opkg install libopencv-calib3d-dev
opkg install libopencv-contrib-dev
opkg install libopencv-features2d-dev
opkg install libopencv-flann-dev
opkg install libopencv-gpu-dev
opkg install libopencv-highgui-dev
opkg install libopencv-imgproc-dev
opkg install libopencv-legacy-dev
opkg install libopencv-ml-dev
opkg install libopencv-nonfree-dev
opkg install libopencv-objdetect-dev
opkg install libopencv-ocl-dev
opkg install libopencv-photo-dev
opkg install libopencv-stitching-dev
opkg install libopencv-superres-dev
opkg install libopencv-video-dev
opkg install libopencv-videostab-dev
opkg install opencv-staticdev
```


## How to Use

Using cylon-opencv is pretty easy, same as any other cylon adaptor making use of the appropiate cylon drivers.

The following example shows how to connect to a camera and display the video feed in a window.

Before running it be sure that `haarcascade_frontalface_alt.xml` file is referenced to the correct location.
You can download the file [here](https://github.com/hybridgroup/cylon-opencv/blob/master/examples/display_camera/haarcascade_frontalface_alt.xml).

```javascript
var Cylon = require('cylon');

Cylon.robot({
  connections: {
    opencv: { adaptor: 'opencv' }
  },


  devices: {
    window: { driver: 'window' },
    camera: {
      driver: 'camera',
      camera: 1,
      haarcascade: __dirname + "/examples/opencv/haarcascade_frontalface_alt.xml"
    }
  },

  work: function(my) {
    my.camera.once('cameraReady', function() {
      console.log('The camera is ready!')

      // We listen for frame ready event, when triggered
      // we display the frame/image passed as an argument
      // and we tell the window to wait 40 milliseconds
      my.camera.on('frameReady', function(err, im) {
        console.log("FRAMEREADY!");
        my.window.show(im, 40);
      });

      // Here we have two options to start reading frames from
      // the camera feed.
      // 1. As fast as possible triggering the next frame read
      //    in the listener for frameReady, if you need video
      //    as smooth as possible uncomment #my.camera.readFrame()
      //    in the listener above and the one below this comment.
      //
      // my.camera.readFrame()
      //
      // 2. Use an interval of time to try and get aset amount
      //    of frames per second  (FPS), in the next example
      //    we are trying to get 1 frame every 50 milliseconds
      //    (20 FPS).
      //
      every(50, function() { my.camera.readFrame(); });
    });
  }
});

Cylon.start();
```

## How to Connect

In order to use OpenCV you first need to install it and make sure it is working correctly on your computer. You can follow the tutorials in the OpenCV site to install it in your particular OS:

[How to install OpenCV](http://docs.opencv.org/doc/tutorials/introduction/table_of_content_introduction/table_of_content_introduction.html#table-of-content-introduction)

## Documentation

We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing

For our contribution guidelines, please go to [https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
](https://github.com/hybridgroup/cylon/blob/master/CONTRIBUTING.md
).

## Release History

For the release history, please go to [https://github.com/hybridgroup/cylon-opencv/blob/master/RELEASES.md
](https://github.com/hybridgroup/cylon-opencv/blob/master/RELEASES.md
).

## License

Copyright (c) 2013-2015 The Hybrid Group. Licensed under the Apache 2.0 license.
