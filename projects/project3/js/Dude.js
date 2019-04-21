class Dude{

  constructor(){

    this.back = new Back();
    this.head = new Head();
    this.limbs = [];
    this.hipMove;
    this.hipDistance = 25;
    this.shoulderDistance = 20;

    this.groundFill =0;

    this.offsetX=0;
    this.offsetY =0;
    this.offsetZ =-100;



    this.currentMoves = 0;
    this.armMoves = [6];
    this.legMoves = [6];
    this.vigor = [0.5, 0.5, 0.5, 0.5];

    this.armSpecs = {
      thighAngle: 20,
      thighOrigin: -PI/8,
      thighDisplacement: 0.2*PI,
      thighAngle2: 20,
      thighOrigin2: 10,
      thighDisplacement2: 10,
      kneeAngle: 100,
      kneeOrigin: 0.8*PI,
      kneeDisplacement: 0.8*PI,
      kneeConstraint1:1* PI,
      kneeConstraint2:1.9* PI,
      leanX: 4,
      leanY: 10
    }

    this.legSpecs = {
      thighAngle: 20,
      thighOrigin: -PI/8,
      thighDisplacement: 3*PI/16,
      thighAngle2: 0,
      thighOrigin2: 0,
      thighDisplacement2: 3*PI/16,
      kneeAngle: 100,
      kneeOrigin: 20*PI/19,
      kneeDisplacement: 5*PI/7,
      kneeConstraint1: PI,
      kneeConstraint2:1.9* PI,
      leanX:0,
      leanY:-4,
    }

    for (let i=0; i<2; i++){
      // create arm
      this.limbs.push(new Limb(200, 240, window.innerHeight/16, this.armSpecs, 2,1-  2*i));
      // create leg
      this.limbs.push(new Limb(200, 130, window.innerHeight/14, this.legSpecs, 0,1- 2*i));
    }
  }

  displayDude(){

    push();
    // move to dude's position
    translate(this.offsetX, this.offsetY, this.offsetZ);

    // display "ground" below dude
    // that is the square that switches color on each footstep
    this.displayGround();

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
    this.limbs[1].display();
    // update & display leg 2
    translate(this.shoulderDistance, 0, 0);
    this.limbs[3].update();
    this.limbs[3].display();
    pop();
    // move to shoulder position
    push();
    translate(0, this.back.length, -this.shoulderDistance/2-this.hipDistance/2 );
    // update & display arm 1
    this.limbs[0].update();
    this.limbs[0].display();
    // update & display arm 2
    translate(this.hipDistance, 0, 0);
    this.limbs[2].update();
    this.limbs[2].display();
    pop();

    // update this.back and this.head position and display
    this.back.update();
    this.back.display();
    this.head.update();
    this.head.display();

    pop();
  }

  displayGround(){

    push();
    fill(this.groundFill);
    translate(-310,80, 99)
    rotateX(0)
    noStroke();
    rect(0, 0, 620, 230);
    pop();
  }


  // newdancemotion()
  //
  // assigns new motion parameters to each limb

    newDanceMotion(){

    this.limbs[0].changeCurrentMotion(this.armMoves[this.currentMoves], 20);
    this.limbs[2].changeCurrentMotion(this.armMoves[this.currentMoves], 20);
    this.limbs[1].changeCurrentMotion(this.legMoves[this.currentMoves], 20);
    this.limbs[3].changeCurrentMotion(this.legMoves[this.currentMoves], 20);
  }

}
