class Back{

  constructor(){
    this.length = 50;
    this.leanForward = velocity*10;
    this.neck = {
      x:0,
      y:0,
    };
    this.butt = {
      x:0,
      y:0,
    };

}

update(){

let backHeight = dude.limbs[1].backHeight;
if(backHeight<0){
  backHeight = abs(backHeight*1.5);
};

this.leanForward =  map(-velocity, 0, 1.8, 0, 50) + sin(radians(frameCount))*10 + backHeight/2;
  this.neck = {
    x:0,
    y:0,
  };
  this.butt = {
    x:0,
    y:0,
  };


  this.butt.x+=dude.limbs[0].waist.x;
  this.butt.y+=dude.limbs[0].waist.y;
  this.butt.x+=dude.limbs[2].waist.x;
  this.butt.y+=dude.limbs[2].waist.y;

  this.neck.x+=dude.limbs[1].waist.x;
  this.neck.y+=dude.limbs[1].waist.y;
  this.neck.x+=dude.limbs[3].waist.x;
  this.neck.y+=dude.limbs[3].waist.y;

  this.butt.x /=2;
  this.butt.y /=2;
  this.neck.x /=2;
  this.neck.y /=2;
}

display(){

  push();
  translate(dude.shoulderDistance/2, this.length/2, 0);
//  rotateX( radians( this.leanForward))
let greenFill = cos(radians(frameCount))*25;
  fill(255);
  stroke(0);
  box(10, this.length, 10);

  pop();
}
}
