class Back{

  constructor(){
    this.length = 50;
    this.leanForward = velocity*10;


}

update(){

let backHeight = dude.limbs[1].backHeight;
if(backHeight<0){
  backHeight = abs(backHeight*1.5);
};

this.leanForward =  map(-velocity, 0, 1.8, 0, 50) + sin(radians(frameCount))*10 + backHeight/2;

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
