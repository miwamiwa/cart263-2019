class Dude{

  constructor(){

    this.back = new Back();
    this.head = new Head();
    this.limbs = [];
    this.hipMove;
    this.hipDistance = 25;
    this.shoulderDistance = 20;

    for (let i=0; i<2; i++){
      // create arm
      this.limbs.push(new Limb(200, 240, height/16, armSpecs, 2,1-  2*i));
      // create leg
      this.limbs.push(new Limb(200, 130, height/14, legSpecs, 0,1- 2*i));
    }
  }

  displayDude(){
    // scale the entire dude
    scale(2);

    // calculate hip motion
    this.hipMove = sin( radians(frameCount*4))/20 * velocity;


    translate(this.hipMove*100, this.limbs[1].currentHeight, 0)
    rotateZ(PI+this.hipMove);
    rotateX( radians(this.back.leanForward));
    translate(-this.shoulderDistance/2,0,0);

    // update & display leg 1
    push();
    rotateZ(-3*this.hipMove);
    this.limbs[1].update();
    // update & display leg 2
    translate(this.shoulderDistance, 0, 0);
    this.limbs[3].update();
    pop();
    // move to shoulder position
    push();
    translate(0, this.back.length, -this.shoulderDistance/2-this.hipDistance/2 );
    // update & display arm 1
    this.limbs[0].update();
    // update & display arm 2
    translate(this.hipDistance, 0, 0);
    this.limbs[2].update();
    pop();

    // update this.back and this.head position and display
    this.back.update();
    this.back.display();
    this.head.update();
    this.head.display();
  }
}
