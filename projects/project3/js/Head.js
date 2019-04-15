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
    fill(0, 105);
    stroke(235, 85);
    if (this.capture.loadedmetadata && this.camActive) {
    var c = this.capture.get(0, 0, 640, 480);
  //  image(c, 0, 0);
  texture(c);
  if(pictureTaken){
    this.faceImage = c;
    this.camActive = false;
    this.capture.stop();
  }
  }

  if(!this.camActive) texture(this.faceImage);

    translate(dude.shoulderDistance/2, dude.back.length+20, 0);
    rotateY(PI/2);
    rotateX(PI);
    sphere(20);
    pop();

  }
}
