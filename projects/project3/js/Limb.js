class Limb{

  constructor(x, y, phase, length, specs, direction, xflip){

    this.direction = direction*PI/2;
    this.xflip = xflip;

    if(direction===0){
      this.flip = -1;
    }
    if(direction===2){
      this.flip = 1;
    }

    this.centerX = x;
    this.centerY = y;
    this.phase = phase;
    this.speed =8;
    this.transition=0;

    this.leanX = specs.leanX;
    this.leanY = specs.leanY;

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
  }

  update(){

    let thisFrame;

    if(frameCount >= this.tempTimer){

      thisFrame = this.currentMotion();
    }
    else if (frameCount < this.tempTimer){

      thisFrame = this.tempMotion();
    }

    let frame = frameCount * velocity - this.phase;
    let speedFact = map(mouseX, 0, width, 0, 1) * thisFrame.speedDif;
//let speedFact = 0.5;

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
    if(this.xflip===-1 ){
      inverseMotion = -1;
      console.log("HI")
    }
    else {
      console.log("HEY")
    }

    this.waist.y = this.centerY + map (sin( currentAngle), -1, 1, this.waist.minDY, this.waist.maxDY)+leanX;
    this.waist.x = this.centerX + map (sin( currentAngle), -1, 1, this.waist.minDX, this.waist.maxDX)+leanY;
    this.thigh.angle = map (sin( radians(frame*this.speed )), inverseMotion*(-1), inverseMotion*1, thighOrigin- thighDisplacement, thighOrigin+thighDisplacement);

    this.thigh.angle2 = map (cos( currentAngle), -1, 1,thighOrigin2 + thighDisplacement2, thighOrigin2- thighDisplacement2);

    this.knee.angle = map (sin( currentAngle), -1, 1, kneeOrigin- kneeDisplacement, kneeOrigin+ kneeDisplacement);

    if(this.knee.constraint1!=0){
      this.knee.angle = constrain(this.knee.angle,  this.knee.constraint1, this.knee.constraint2  )
    }


    push();
    strokeWeight(1);
    stroke(45, 255);
    let greenFill = 100+cos(radians(frameCount*2 ))*85;
    let redFill = 100+cos(radians(frameCount/1.1))*65;
    fill(redFill, greenFill, 45, 115);

    rotateZ(this.xflip*radians(this.thigh.angle2))
    rotateX(this.flip*this.thigh.angle - radians(back.leanForward));
    rotateY(this.direction*PI);

    //rotateZ(this.xflip*this.thigh.angle2)


    translate(0, -this.thigh.length/2, 0);


    box(10, this.thigh.length, 10);

    translate(0, -this.thigh.length/2, 0)
    rotateX(this.knee.angle);
    translate(0,  this.thigh.length/2, 0);

    box(10, this.thigh.length, 10);
    pop();

if(mouseHasBeenPressedOnce){
    this.checkPos(thighOrigin);
}

  }

  checkPos(input){

    if(
      this.thigh.angle - this.current.thighDif <= - 1/(4)
    && this.flip === 1
  ){
      groundFill = color(255, 0, 0);


        //console.log(this.thigh.angle);

      if(this.xflip ===1){
         beatStarted1 = false
      }
      else if (this.xflip ===-1){
           beatStarted2 = false
      }
    }
    else if(
   this.flip === 1 && this.xflip ===1
  ){
      groundFill = color(0);
      if(!beatStarted1){
        beatStarted1 = true;
      //  beatStarted1 = setTimeout(function(){ beatStarted1 = false }, velocity/4)
        console.log("hey")
        synth.freq( random(1, 4) * 100)
        env1.play();
      }
    }
    else if(
   this.flip === 1 && this.xflip ===-1
  ){
      groundFill = color(0);
      if(!beatStarted2){
        beatStarted2 = true;
    //    beatStarted2 = setTimeout(function(){ beatStarted2 = false }, velocity/4)
        console.log("hey2")
        synth2.freq( random(1, 4) * 100)
        env2.play();
      }
    }
  }

  fireTempMotion(motion, length, transition){

    this.transitionLength = transition;
    this.tempTimer = frameCount + length;
    this.temp = motion;

    this.last = motion;
  }

  changeCurrentMotion(motion, transition){

    this.transitionLength = transition;
    this.last = this.current;
    this.current = motion;
  }

  tempMotion(){

    let result = {
      thighPos:0,
      thighPos2:0,
      kneePos:0,
      thighDif:0,
      thighDif2:0,
      kneeDif:0,
      speedDif:0
    }
    if(this.transition<1){
      result.thighPos=lerp(this.current.thighPos, this.temp.thighPos, this.transition);
      result.kneePos=lerp(this.current.kneePos, this.temp.kneePos, this.transition);
      result.thighDif=lerp(this.current.thighDif, this.temp.thighDif, this.transition);
      result.kneeDif=lerp(this.current.kneeDif, this.temp.kneeDif, this.transition);
      result.speedDif=lerp(this.current.speedDif, this.temp.speedDif, this.transition);
      result.thighDif2=lerp(this.current.thighDif2, this.temp.thighDif2, this.transition);
      result.thighPos2=lerp(this.current.thighPos2, this.temp.thighPos2, this.transition);

      this.transition+=1/this.transitionLength;
    } else {
      result.thighPos=this.temp.thighPos;
      result.kneePos=this.temp.kneePos;
      result.thighDif =this.temp.thighDif;
      result.kneeDif =this.temp.kneeDif;
      result.speedDif =this.temp.speedDif;
      result.thighPos2 = this.temp.thighPos2;
      result.thighDif2 = this.temp.thighDif2;
    }
    return result;
  }

  currentMotion(){

    let result = {
      thighPos:0,
      thighPos2:0,
      kneePos:0,
      thighDif:0,
      thighDif2:0,
      kneeDif:0,
      speedDif:0
    }
    if(this.transition>0){
      result.thighPos=lerp(this.current.thighPos, this.last.thighPos, this.transition);
      result.kneePos=lerp(this.current.kneePos, this.last.kneePos, this.transition);
      result.thighDif=lerp(this.current.thighDif, this.last.thighDif, this.transition);
      result.kneeDif=lerp(this.current.kneeDif, this.last.kneeDif, this.transition);
      result.speedDif=lerp(this.current.speedDif, this.last.speedDif, this.transition);
      result.thighDif2=lerp(this.current.thighDif2, this.last.thighDif2, this.transition);
      result.thighPos2=lerp(this.current.thighPos2, this.last.thighPos2, this.transition);

      this.transition-=1/this.transitionLength;
    }
    else {
      result.thighPos=this.current.thighPos;
      result.kneePos=this.current.kneePos;
      result.thighDif =this.current.thighDif;
      result.kneeDif =this.current.kneeDif;
      result.speedDif =this.current.speedDif;
      result.thighPos2 = this.current.thighPos2;
      result.thighDif2 = this.current.thighDif2;
    }
    return result;
  }

  display(){

    //line(this.waist.x,this.waist.y, this.knee.x, this.knee.y);
    //line(this.knee.x, this.knee.y, this.foot.x, this.foot.y);
  }
}
