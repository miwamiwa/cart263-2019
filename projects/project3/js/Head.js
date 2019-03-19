class Head{

  constructor(){
    this.headBob;
  }

  update(){
    this.headBob = map(sin(frameCount*velocity/7), -1, 1, -2, 2);
  }

  display(){
    push();
fill(0, 105);
stroke(235, 85);
    translate(shoulderDistance/2, back.length+20, 0);
    sphere(20);
    pop();
        //ellipse(limbs[1].waist.x+limbs[1].thigh.length/2, limbs[1].waist.y+this.headBob-limbs[1].thigh.length, 60, 60)
  }
}
