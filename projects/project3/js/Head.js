class Head{

  constructor(){
    this.headBob;
    this.capture = createCapture(VIDEO);
    this.capture.hide();
    this.faceImage;
    this.camActive = true;
  }

  update(){
    this.headBob = map(sin(frameCount*velocity/7), -1, 1, -2, 2);
  }

  display(){
    push();
    // while camera is active (until picture is taken), display camera feed in head
    fill(0, 105);
    stroke(235, 85);
    if (this.capture.loadedmetadata && this.camActive) {
    var c = this.capture.get(0, 0, 640, 480);

  texture(c);
  if(pictureTaken){
    this.faceImage = c;
    this.camActive = false;
    this.capture.stop();
  }
  }

// once picture is taken display picture only
  if(!this.camActive) texture(this.faceImage);

    translate(dude.shoulderDistance/2, dude.back.length+20+this.headBob, 0);
      // align picture
    rotateY(PI/2);
    rotateX(PI);
    // display head
    sphere(20);
    pop();

  }
}
