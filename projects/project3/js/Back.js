class Back{

  constructor(){
    this.length = 70;
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

let backHeight = limbs[1].backHeight;
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


  this.butt.x+=limbs[0].waist.x;
  this.butt.y+=limbs[0].waist.y;
  this.butt.x+=limbs[2].waist.x;
  this.butt.y+=limbs[2].waist.y;

  this.neck.x+=limbs[1].waist.x;
  this.neck.y+=limbs[1].waist.y;
  this.neck.x+=limbs[3].waist.x;
  this.neck.y+=limbs[3].waist.y;

  this.butt.x /=2;
  this.butt.y /=2;
  this.neck.x /=2;
  this.neck.y /=2;
}

display(){

  push();
  translate(shoulderDistance/2, this.length/2, 0);
//  rotateX( radians( this.leanForward))
let greenFill = cos(radians(frameCount))*25;
  fill(40+greenFill, 145);
  stroke(85, 86);
  box(10, 80, 10);

  pop();
}
}
