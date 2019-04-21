class Limb{

  constructor(x, y, length, specs, direction, xflip){

    this.direction = direction*PI/2;
    this.xflip = xflip;
    this.flip = -1 + direction;
    this.legOverlap = false;
    this.speed =13.5;
    this.transition=0;
    this.currentHeight=0;
    this.backHeight =0;

    this.thigh = {
      length: length,
      angle: specs.thighAngle,
      origin: specs.thighOrigin,
      displacement: specs.thighDisplacement,
      angle2: specs.thighAngle2,
      origin2: specs.thighOrigin2,
      displacement2: specs.thighDisplacement2,
    }

    this.knee = {
      x: 0,
      y: 0,
      angle: specs.kneeAngle,
      origin: specs.kneeOrigin,
      displacement: specs.kneeDisplacement,
      constraint1: specs.kneeConstraint1,
      constraint2: specs.kneeConstraint2
    }

    this.current = {
      height:0,
      thighDisplacement:0,
      kneeDisplacement:0,
      thighOrigin:0,
      kneeOrigin:0,
      thighOrigin2:0,
      thighDisplacement2:0
    }

    this.last = this.current;
  }

  // update()
  //
  // update this limb's parts' position, and listen for leg overlaps
  //
  // each part's rotation is given by a variable controlled by a sinusiodal
  // function that oscillates around an Origin, following a maximum range of
  // displacement - these are the two parameters which the user can manipulate
  // using the xy-pads to create custom motion. "vigor" is also used to extend
  // both the range and speed of motion.

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

    // get "angle" to process from framecount and this limb's speed
    let currentAngle = radians(frameCount * velocity * this.speed);

    // get the current angle of each part by mapping sin(angle) or cos(angle)
    // to a range that reflects the current origin and max displacement:

    // map thigh x-rotate,
    let min1 = thighOrigin - thighDisplacement;
    let max1 = thighOrigin+thighDisplacement;
    this.thigh.angle = map (
      sin( currentAngle ), -1*this.xflip, this.xflip, min1, max1
    );

    // map thigh z-rotate
    let min2 = thighOrigin2 + thighDisplacement2;
    let max2 = thighOrigin2- thighDisplacement2;
    this.thigh.angle2 = map (
      cos( currentAngle ), -1, 1, min2, max2
    );

    // map knee x-rotate
    let min3 = kneeOrigin- kneeDisplacement;
    let max3 = kneeOrigin+ kneeDisplacement;
    this.knee.angle = map (
      sin( currentAngle ), -1*this.xflip, this.xflip, min3, max3
    );

    // get the current height value.
    this.currentHeight = thisFrame.height;

    // constrain knee angle
    if(this.knee.constraint1!=0){
      this.knee.angle = constrain(
        this.knee.angle,
        this.knee.constraint1, this.knee.constraint2  )
      }

      // --------------------- CHECK OVERLAP --------------------- //
      // if this limb is a leg
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
    // apply rotates and display

    display(){

      push();
      // stylize this limb
      strokeWeight(1);
      stroke(45, 255);

      // vary fill values
      let greenFill = 100+cos(radians(frameCount*2 ))*85;
      let redFill = 100+cos(radians(frameCount/1.1))*65;

      // give arms and legs a different fill
      if(this.flip===1) fill(redFill, greenFill, 45);
      if(this.flip===-1) fill(greenFill, 45, redFill)

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
