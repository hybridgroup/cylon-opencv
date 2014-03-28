# Cylon.js For OpenCV

Cylon.js (http://cylonjs.com) is a JavaScript framework for robotics and physical computing using Node.js

This repository contains the Cylon adaptor and drivers for OpenCV (http://opencv.org/), the powerful open source computer vision platform.

Want to use Ruby on robots? Check out our sister project Artoo (http://artoo.io)

Want to use the Go programming language to power your robots? Check out our sister project Gobot (http://gobot.io).

## Installing

    npm install cylon-opencv

## Using

Using cylon-opencv is pretty easy, same as any other cylon adaptor making use of the appropiate cylon drivers.

The following example shows how to connect to a camera and display the video feed in a window.

```coffeescript
Cylon = require('../..')

Cylon.robot
  connection:
    name: 'opencv', adaptor: 'opencv'

  devices: [
    { name: 'window', driver: 'window' }
    {
      name: 'camera',
      driver: 'camera',
      camera: 1,
      haarcascade: "#{ __dirname }/examples/opencv/haarcascade_frontalface_alt.xml"
    } # Default camera is 0
  ]

  work: (my) ->
    my.camera.once('cameraReady', ->
      console.log('The camera is ready!')
      # We listen for frame ready event, when triggered
      # we display the frame/image passed as an argument
      # and we tell the window to wait 40 milliseconds
      my.camera.on('frameReady', (err, im) ->
        console.log("FRAMEREADY!")
        my.window.show(im, 40)
        #my.camera.readFrame()
      )
      # Here we have two options to start reading frames from
      # the camera feed.
      # 1. As fast as possible triggering the next frame read
      #    in the listener for frameReady, if you need video
      #    as smooth as possible uncomment #my.camera.readFrame()
      #    in the listener above and the one below this comment.
      #
      # my.camera.readFrame()
      #
      # 2. Use an interval of time to try and get aset amount
      #    of frames per second  (FPS), in the next example
      #    we are trying to get 1 frame every 50 milliseconds
      #    (20 FPS).
      #
      every 50, my.camera.readFrame
    )
.start()
```
## Installing OpenCV and Connecting

In order to use OpenCV you first need to install it and make sure it is working correctly on your computer. You can follow the tutorials in the OpenCV site to install it in your particular OS:

[How to install OpenCV](http://docs.opencv.org/doc/tutorials/introduction/table_of_content_introduction/table_of_content_introduction.html#table-of-content-introduction)

## Documentation
We're busy adding documentation to our web site at http://cylonjs.com/ please check there as we continue to work on Cylon.js

Thank you!

## Contributing

* All patches must be provided under the Apache 2.0 License
* Please use the -s option in git to "sign off" that the commit is your work and you are providing it under the Apache 2.0 License
* Submit a Github Pull Request to the appropriate branch and ideally discuss the changes with us in IRC.
* We will look at the patch, test it out, and give you feedback.
* Avoid doing minor whitespace changes, renamings, etc. along with merged content. These will be done by the maintainers from time to time but they can complicate merges and should be done seperately.
* Take care to maintain the existing coding style.
* Add unit tests for any new or changed functionality & Lint and test your code using [Grunt](http://gruntjs.com/).
* All pull requests should be "fast forward"
  * If there are commits after yours use “git rebase -i <new_head_branch>”
  * If you have local changes you may need to use “git stash”
  * For git help see [progit](http://git-scm.com/book) which is an awesome (and free) book on git

## Release History

Version 0.4.0 - Release for Cylon.js 0.12.0

Version 0.3.0 - Release for Cylon.js 0.11.0, refactor to pure JavaScript, driver for general image processing

Version 0.2.0 - Release for Cylon.js 0.10.0

Version 0.1.0 - Initial release

## License

Copyright (c) 2013-2014 The Hybrid Group. Licensed under the Apache 2.0 license.
