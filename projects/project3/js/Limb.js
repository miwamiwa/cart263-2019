class Limb{

  constructor(x, y, length, specs, direction, xflip){

    this.direction = direction*PI/2;
    this.xflip = xflip;

    if(direction===0){
      this.flip = -1;
    }

    if(direction===2){
      this.flip = 1;
    }

    this.footHitGround = false;
    this.centerX = x;
    this.centerY = y;
    this.speed =8;
    this.transition=0;

    this.leanX = specs.leanX;
    this.leanY = specs.leanY;

    this.currentHeight=0;

    this.waist = {

      x: 100,
      y:50,
      minDY:-5,
      maxDY:5,
      minDX:-5,
      maxDX:3
    };

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

    this.shin = {
      length: this.thigh.length
    }

    this.foot = {
      x: 0,
      y: 0
    }

    this.current = {
      height:0,
      thighPos:0,
      kneePos:0,
      thighDif:0,
      kneeDif:0,
      speedDif:0,
      thighDif2:0,
      thighPos2:0
    }

    this.last = this.current;
    this.temp = this.current;

    this.tempTimer = 0;
    this.backHeight =0;
  }

  update(){

    // get this limb's current motion pattern for this frame.
    let thisFrame;

    // get either the "current" motion
    if(frameCount >= this.tempTimer){
      thisFrame = this.currentMotion();
    }

    // or get the "temporary" motion.
    else if (frameCount < this.tempTimer){
      thisFrame = this.tempMotion();
      this.last = thisFrame;
    }

    let frame = frameCount * velocity;

    // speedfact is actually the force with which movements are executed
    // (it scales the range of movement)

     let speedFact = map(vigor, 0, 1, 0, 1) * thisFrame.speedDif;


    let thighDisplacement = this.thigh.displacement * speedFact * thisFrame.thighPos;
    let thighDisplacement2 = this.thigh.displacement2 * speedFact * thisFrame.thighPos2;
    let kneeDisplacement = this.knee.displacement * speedFact * thisFrame.kneePos;

    let thighOrigin = this.thigh.origin + thisFrame.thighDif;
    let thighOrigin2 = this.thigh.origin2 + thisFrame.thighDif2;
    let kneeOrigin = this.knee.origin + thisFrame.kneeDif;

    let leanX = this.leanX*velocity;
    let leanY = this.leanY*velocity;

    let currentAngle = radians(frame*this.speed);

    let inverseMotion=1;
    if(this.xflip===-1 )
    inverseMotion = -1;


    this.thigh.angle = map (sin( currentAngle ), inverseMotion*(-1), inverseMotion*1, thighOrigin- thighDisplacement, thighOrigin+thighDisplacement);

    this.thigh.angle2 = map (cos( currentAngle ), -1, 1,thighOrigin2 + thighDisplacement2, thighOrigin2- thighDisplacement2);

    this.knee.angle = map (sin( currentAngle ), inverseMotion*(-1), inverseMotion*1, kneeOrigin- kneeDisplacement, kneeOrigin+ kneeDisplacement);

    this.currentHeight = thisFrame.height;

    if(this.knee.constraint1!=0){
      this.knee.angle = constrain(this.knee.angle,  this.knee.constraint1, this.knee.constraint2  )
    }

    push();

    // stylize this limb
    strokeWeight(1);
    stroke(45, 255);
    let greenFill = 100+cos(radians(frameCount*2 ))*85;
    let redFill = 100+cos(radians(frameCount/1.1))*65;
    fill(redFill, greenFill, 45, 115);

    // apply thigh rotation
    rotateZ(this.xflip*radians(this.thigh.angle2));
    rotateX(this.flip*this.thigh.angle - radians(back.leanForward));
    rotateY(this.direction*PI - 2* this.xflip*hipMove);
    translate(0, -this.thigh.length/2, 0);

    // draw thigh
    box(10, this.thigh.length, 10);

    // apply knee rotation
    translate(0, -this.thigh.length/2, 0)
    rotateX(this.knee.angle);


    if(this.flip===-1)
    rotateZ(radians(-3*hipMove))

    translate(0,  this.thigh.length/2, 0);

    // draw knee
    box(10, this.thigh.length, 10);
    pop();

    // ----------------- DETECT COMBINED THIGH AND KNEE ANGLE!!!!!!! -------------------

    let translate1 = this.thigh.length * ( sin(this.flip*this.thigh.angle - radians(back.leanForward)) + sin(this.knee.angle) );
    let translate2 = this.thigh.length * ( cos(this.direction*this.thigh.angle - radians(back.leanForward)) + cos(this.knee.angle) );
    let translate3 = this.thigh.length * ( this.xflip*radians(this.thigh.angle2) );

    // the following events are triggered ONCE, not each frame.
    if(this.flip===-1){
      if(translate2<0&& !this.footHitGround){

        //nextLegNote();

        this.footHitGround = true;

        if(this.xflip ===1)
        groundFill = color(185, 45, 45);

        if(this.xflip ===-1)
        groundFill = color(45, 185, 45);
      }
      if(translate2>0 && this.footHitGround){
        this.footHitGround = false;
      }
    }

    if(this.flip===1){
      if(translate2<0&& !this.footHitGround){

        //nextArmNote();
        this.footHitGround = true;
      }
      if(translate2>0 && this.footHitGround){
        this.footHitGround = false;
      }
    }
  }

  fireTempMotion(motion, length, transition){

    if(frameCount> this.tempTimer + this.transitionLength){
      this.transitionLength = transition;
      this.tempTimer = frameCount + length;
      this.temp = motion;

      this.last = motion;

    }
  }

  changeCurrentMotion(motion, transition){

    this.transitionLength = transition;
    this.last = this.current;
    this.current = motion;
    this.transition = 1;
  }

  tempMotion(){

    let result = {
      height:0,
      thighPos:0,
      thighPos2:0,
      kneePos:0,
      thighDif:0,
      thighDif2:0,
      kneeDif:0,
      speedDif:0
    }

    if(this.transition<1){

      result.height=lerp(this.current.height, this.temp.height, this.transition);
      result.thighPos=lerp(this.current.thighPos, this.temp.thighPos, this.transition);
      result.kneePos=lerp(this.current.kneePos, this.temp.kneePos, this.transition);
      result.thighDif=lerp(this.current.thighDif, this.temp.thighDif, this.transition);
      result.kneeDif=lerp(this.current.kneeDif, this.temp.kneeDif, this.transition);
      result.speedDif=lerp(this.current.speedDif, this.temp.speedDif, this.transition);
      result.thighDif2=lerp(this.current.thighDif2, this.temp.thighDif2, this.transition);
      result.thighPos2=lerp(this.current.thighPos2, this.temp.thighPos2, this.transition);
      this.backHeight = result.height;
      this.transition+=1/this.transitionLength;
    } else {


      result = this.temp;
      this.backHeight = this.temp.height;
    }

    return result;
  }


  currentMotion(){

    let result = {
      height:0,
      thighPos:0,
      thighPos2:0,
      kneePos:0,
      thighDif:0,
      thighDif2:0,
      kneeDif:0,
      speedDif:0
    }
    if(this.transition>0){
      result.height=lerp(this.current.height, this.last.height, this.transition);
      result.thighPos=lerp(this.current.thighPos, this.last.thighPos, this.transition);
      result.kneePos=lerp(this.current.kneePos, this.last.kneePos, this.transition);
      result.thighDif=lerp(this.current.thighDif, this.last.thighDif, this.transition);
      result.kneeDif=lerp(this.current.kneeDif, this.last.kneeDif, this.transition);
      result.speedDif=lerp(this.current.speedDif, this.last.speedDif, this.transition);
      result.thighDif2=lerp(this.current.thighDif2, this.last.thighDif2, this.transition);
      result.thighPos2=lerp(this.current.thighPos2, this.last.thighPos2, this.transition);
      this.backHeight = result.height;
      this.transition-=1/this.transitionLength;
    }
    else {
      result = this.current;
      this.backHeight = this.current.height;
    }
    return result;
  }
}
