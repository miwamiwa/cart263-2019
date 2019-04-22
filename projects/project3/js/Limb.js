/*
Limb.js
This class handles displaying and updating the position of the two parts that
make a single limb (functions update() and display()). In here, the two parts
are called thigh and knee (it should be shin..) regardless of if this limb is
a leg or an arm. function currentMotion() handles ramping from one set of
motion values to another over time after a motion change. This combined with
what's going on in update() ensures smoothe and continuous motion throughout.
*/

class Limb{



  constructor(x, y, length, specs, direction, xflip){

    this.direction = direction*PI/2;
    this.legOverlap = false;
    this.speed =13.5;
    this.transition=0;
    this.currentHeight=0;
    this.backHeight =0;
    this.greenFill =0;
    // flip limb to correct position:
    // left limb or right limb
    this.xflip = xflip;
    // leg or arm
    this.flip = -1 + direction;

    // thigh's base configuration
    this.thigh = {
      length: length,
      angle: specs.thighAngle,
      origin: specs.thighOrigin,
      displacement: specs.thighDisplacement,
      angle2: specs.thighAngle2,
      origin2: specs.thighOrigin2,
      displacement2: specs.thighDisplacement2,
    }
    // knee's base configuration
    this.knee = {
      x: 0,
      y: 0,
      angle: specs.kneeAngle,
      origin: specs.kneeOrigin,
      displacement: specs.kneeDisplacement,
      constraint1: specs.kneeConstraint1,
      constraint2: specs.kneeConstraint2
    }
    // current set of motion parameters
    this.current = {
      height:0,
      thighDisplacement:0,
      kneeDisplacement:0,
      thighOrigin:0,
      kneeOrigin:0,
      thighOrigin2:0,
      thighDisplacement2:0
    }
    // last set of motion parameters
    this.last = this.current;
  }





  // update()
  //
  // update this limb's parts' position, and listen for leg overlaps
  //
  // in a nutshell: each part's rotation is given by a sin() or cos()
  // function which constantly oscillates around an origin angle, from negative
  // max displacement value to positive max displacement value. User alters
  // motion by manipulating origin and max displacement values.

  update(){

    // --------------------- CALCULATE ROTATION --------------------- //

    // get this origin and max displacement values for this frame.
    // currentmotion() allows a slow ramp from one set of values to another
    // when switching motions.
    let thisFrame = this.currentMotion();
    // get this frame's max displacement for each part
    let thighDisplacement = dude.vigor[dude.currentMoves] * thisFrame.thighDisplacement;
    let thighDisplacement2 = dude.vigor[dude.currentMoves] * thisFrame.thighDisplacement2;
    let kneeDisplacement = dude.vigor[dude.currentMoves] * thisFrame.kneeDisplacement;
    // get this frame's angle origin for each part
    // by adding together default origin and current origin
    let thighOrigin = this.thigh.origin + thisFrame.thighOrigin;
    let thighOrigin2 = this.thigh.origin2 + thisFrame.thighOrigin2;
    let kneeOrigin = this.knee.origin + thisFrame.kneeOrigin;

    // get current arm position from framecount and this limb's speed
    let currentPosition = radians(frameCount * velocity * this.speed);

    // get current angle of each part by mapping arm position to range defined
    // by origin and displacement

    // get thigh x-rotate range
    let min1 = thighOrigin - thighDisplacement;
    let max1 = thighOrigin + thighDisplacement;
    // map thigh x-rotate,
    this.thigh.angle = map( sin(currentPosition), -1*this.xflip, this.xflip, min1, max1 );

    // get thigh z-rotate range
    let min2 = thighOrigin2 + thighDisplacement2;
    let max2 = thighOrigin2 - thighDisplacement2;
    // map thigh z-rotate
    this.thigh.angle2 = map( cos(currentPosition), -1, 1, min2, max2 );

    // get knee x-rotate range
    let min3 = kneeOrigin - kneeDisplacement;
    let max3 = kneeOrigin + kneeDisplacement;
    // map knee x-rotate
    this.knee.angle = map( sin(currentPosition), -1*this.xflip, this.xflip, min3, max3 );

    // get the current height value.
    this.currentHeight = thisFrame.height;

    // constrain knee angle
    if(this.knee.constraint1!=0){
      this.knee.angle = constrain(
        this.knee.angle,
        this.knee.constraint1, this.knee.constraint2  )
      }

      // --------------------- CHECK OVERLAP --------------------- //
      // i'm not using this a whole lot, but this part allows me to trigger
      // events in sync with footstep rate
      // if this limb is a leg (not an arm)
      if(this.flip===-1){
        // check "feet hit ground" / leg overlap:
        // get current thigh angle from origin
        let angle = sin(this.thigh.angle-thighOrigin);
        // if thigh angle excedes 0,
        if(angle<0&& !this.legOverlap){
          // mark leg as having overlapped 0
          this.legOverlap = true;
          // change ground fill depending on if left/right leg
          if(this.xflip ===1) dude.groundFill = color(185, 45, 45, 205);
          if(this.xflip ===-1) dude.groundFill = color(45, 185, 45, 205);
        }
        // if thigh angle is less than 0, reset overlap marker.
        if(angle>0 && this.legOverlap){
          this.legOverlap = false;
        }
      }
    }






    // display()
    //
    // apply fills, rotates and display boxes that make up the limb

    display(){

      push();
      // stylize this limb
      strokeWeight(1);
      stroke(45, 255);

      // vary fill values
      if(this.legOverlap) this.greenFill = 100+cos(radians(frameCount*8 ))*85;
      let redFill = 100+cos(radians(frameCount/1.1))*95;


      // give arms and legs a different fill
      if(this.flip===1){
        if(this.xflip===1) fill(redFill, musicObject.filterRes[1]*2, 45);
        if(this.xflip===-1) fill(250-redFill, musicObject.filterRes[0]*2, 45);
      }
      if(this.flip===-1) fill(this.greenFill, this.greenFill, redFill)

      // apply thigh rotation
      rotateZ(this.xflip*radians(this.thigh.angle2));
      rotateX(this.flip*this.thigh.angle - radians(dude.back.leanForward));
      rotateY(this.direction*PI - 2* this.xflip*dude.hipMove);
      translate(0, -this.thigh.length/2, 0);

      // draw thigh
      box(10, this.thigh.length, 10);

      // apply knee rotation
      translate(0, -this.thigh.length/2, 0)
      rotateX(this.knee.angle);
      // rotate this limb to match hip motion
      rotateZ(radians(-3*dude.hipMove));
      translate(0,  this.thigh.length/2, 0);

      // draw knee
      box(10, this.thigh.length, 10);
      pop();
    }





    // changecurrentmotion()
    //
    // starts transition and sets its length.
    // updates which is the last motion and which is the current motion.

    changeCurrentMotion(motion, transition){

      // start transition
      this.transition = 1;
      // set its length
      this.transitionLength = transition;
      // update current and last motion
      this.last = this.current;
      this.current = motion;
    }





    // currentMotion()
    //
    // if we are currently in transition between motions, this function will
    // ramp between the last and current motion values over time. if not, it
    // returns the current motion.

    currentMotion(){

      // an object to hold this function's result
      let result = {
        height:0,
        thighDisplacement:0,
        thighDisplacement2:0,
        kneeDisplacement:0,
        thighOrigin:0,
        thighOrigin2:0,
        kneeOrigin:0,
      }
      // if transition is active, ramp from this.last values to this.current values
      if(this.transition>0){
        result.height=lerp(this.current.height, this.last.height, this.transition);
        result.thighDisplacement=lerp(this.current.thighDisplacement, this.last.thighDisplacement, this.transition);
        result.kneeDisplacement=lerp(this.current.kneeDisplacement, this.last.kneeDisplacement, this.transition);
        result.thighOrigin=lerp(this.current.thighOrigin, this.last.thighOrigin, this.transition);
        result.kneeOrigin=lerp(this.current.kneeOrigin, this.last.kneeOrigin, this.transition);
        result.thighOrigin2=lerp(this.current.thighOrigin2, this.last.thighOrigin2, this.transition);
        result.thighDisplacement2=lerp(this.current.thighDisplacement2, this.last.thighDisplacement2, this.transition);
        this.backHeight = result.height;
        // increment transition by removing 1/length.
        // transition stops when it reaches 0.
        this.transition-=1/this.transitionLength;
      }
      else {
        // if transition isn't active, result becomes current motion values.
        result = this.current;
        this.backHeight = this.current.height;
      }
      // return result
      return result;
    }
  }
