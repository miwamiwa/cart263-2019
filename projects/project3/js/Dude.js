/*
Dude.js()
This class handles creating and displaying the dude's head, back and limbs,
as well as the "ground" below him. It also includes a function to update each
limb's motion at once.
*/
class Dude{

  constructor(){

    // dude position
    this.offsetX=0;
    this.offsetY =-50;
    this.offsetZ =100;
    // hip motion
    this.hipMove;
    // distance between limbs
    this.hipDistance = 25;
    this.shoulderDistance = 20;
    // ground
    this.groundFill =color(45, 185, 45, 205);
    // moves
    this.currentMoves = 0;
    this.armMoves = [4];
    this.legMoves = [4];
    this.vigor = [0.5, 0.5, 0.5, 0.5];

    // this configures a new limb object for arm motion
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
    }
    // this configures a new limb object for leg motion
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
    }

    // Create objects:
    this.limbs = [];

    for (let i=0; i<2; i++){
      // create arm
      this.limbs.push(new Limb(200, 240, window.innerHeight/16, this.armSpecs, 2,1-  2*i));
      // create leg
      this.limbs.push(new Limb(200, 130, window.innerHeight/14, this.legSpecs, 0,1- 2*i));
    }

    this.back = new Back();
    this.head = new Head();
  }

  // displaydude()
  //
  // rotate, translate and display the four limbs, back and head.

  displayDude(){

    push();
    // move to dude's position
    translate(this.offsetX, this.offsetY, this.offsetZ);

    // display "ground" below dude
    this.displayGround();

    // scale the entire dude
    scale(2);

    // calculate hip motion
    this.hipMove = sin( radians(frameCount*4))/20 * velocity;

    // move to hip position
    translate(this.hipMove*100, this.limbs[1].currentHeight, 0)
    // bob back left/right
    rotateZ(PI+2*this.hipMove);
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

  // displayground()
  //
  // display the "ground", a rect that changes color with leg overlaps

  displayGround(){

    push();
    fill(this.groundFill);
    translate(-310,80, 99)
    noStroke();
    rect(10, 20, 600, 200);
    rect(0, 30, 620, 180);
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
