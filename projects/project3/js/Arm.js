class Arm{

  constructor(x, y, phase){
    this.centerX = x;
    this.centerY = y;
    this.phase = phase;
    this.speed =8;
    this.transition=0;

    this.waist = {
      x: 100,
      y:50,
      minDY:-5,
      maxDY:5,
      minDX:-5,
      maxDX:3
    };

    this.thigh = {
      length: 55,
      angle:20,
      origin: -PI/8,
      displacement: 0.4*PI
    }

    this.knee = {
      x: 0,
      y: 0,
      angle: 100,
      origin: 1.5*PI,
      displacement: 0.8*PI
    }

    this.shin = {
      length: 55
    }

    this.foot = {
      x: 0,
      y: 0
    }
  }

  update(){

  let thighPos;
  let kneePos;
  let thighDif;


    if(frameCount >= jumpTimer){
      if(this.transition>0){
        this.transition-=0.05;

        thighPos=lerp(1.4, 0.1, this.transition);
        kneePos=lerp(0.4, 0.4, this.transition);
        thighDif=lerp(0, - 0.2*PI, this.transition);

      } else {
        thighPos= 1.4;
        kneePos= 0.4;
        thighDif =0;
      }

    }

    else if (frameCount < jumpTimer){
     if(this.transition<1){
       this.transition+=0.05;

       thighPos=lerp(1.4, 0.1, this.transition);
       kneePos=lerp(0.4, 0.4, this.transition);
       thighDif=lerp(0,- 0.2*PI, this.transition);

     } else {
       thighPos= 0.1;
       kneePos= 0.4;
       thighDif = - 0.2*PI;
     }

    }


    let frame = frameCount * velocity - this.phase;
    let speedFact = map(mouseX, 0, width, 0, 1)
    let thighDisplacement = this.thigh.displacement * speedFact * thighPos;
    let kneeDisplacement = this.knee.displacement * speedFact * kneePos;
    let currentPos = radians(frame*this.speed);
    let thighOrigin = this.thigh.origin + thighDif;

    this.waist.y = this.centerY + map (sin( currentPos ), -1, 1, this.waist.minDY, this.waist.maxDY)+leanForward/5;
    this.waist.x = this.centerX + map (sin( currentPos ), -1, 1, this.waist.minDX, this.waist.maxDX)+leanForward;
    this.thigh.angle = map (sin( currentPos ), -1, 1, thighOrigin-thighDisplacement, thighOrigin+thighDisplacement);
    this.knee.angle = map (sin( currentPos ), -1, 1, this.knee.origin- kneeDisplacement, this.knee.origin+ kneeDisplacement);


    let adj1 = this.thigh.length * cos( this.thigh.angle );
    let opp1 = this.thigh.length * sin( this.thigh.angle );
    this.knee.x = this.waist.x + opp1;
    this.knee.y = this.waist.y + adj1;

    let ang = this.knee.angle - ( 90 - this.thigh.angle );
    let adj2 = this.shin.length * cos (ang);
    let opp2 = this.shin.length * sin (ang);
    this.foot.x = this.knee.x - adj2;
    this.foot.y = this.knee.y + opp2;
  }

  display(){

    line(this.waist.x,this.waist.y, this.knee.x, this.knee.y);
    line(this.knee.x, this.knee.y, this.foot.x, this.foot.y);
  }
}
