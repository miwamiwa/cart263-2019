class Head{

  constructor(){

    this.headBob;
    // start webcam
    this.capture = createCapture(VIDEO);
    // hide source feed
    this.capture.hide();
    this.faceImage;
    this.camActive = true;
    this.size = 20;
  }

  // update()
  //
  // update head's y position so that it bobs a little

  update(){

    this.headBob = map(sin(frameCount*velocity/7), -1, 1, -2, 2);
  }

  // display()
  //
  // handles getting input from the webcam and saving the user's picture.
  // displays the head with webcam feed or frozen picture as texture.

  display(){
    push();

    // while camera is active (until picture is taken), display camera feed in head
    fill(0, 105);
    stroke(235, 85);
    // if cam is available and webcam is active
    if (this.capture.loadedmetadata && this.camActive) {
      // capture frame from webcam
      var c = this.capture.get(0, 0, 640, 480);
      // assign it to head texture
      texture(c);

      // if picture was taken
      if(pictureTaken){
        // save this frame
        this.faceImage = c;
        // stop webcam feed
        this.camActive = false;
        this.capture.stop();
      }
    }

    // if webcam is inactive, use saved image as texture
    if(!this.camActive) texture(this.faceImage);

    // move to head position and apply head bob
    translate(dude.shoulderDistance/2, dude.back.length+20+this.headBob, 0);
    // align picture
    rotateY(PI/2+this.headBob/32*PI);
    rotateX(PI);
    // display head
    sphere(this.size);
    pop();

  }
}
