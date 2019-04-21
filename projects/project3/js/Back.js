/*
Back.js
This class handles displaying the back, updating its inclination, which will
effect the position of the entire body in dude.displayDude().

*/
class Back{

  constructor(){

    this.length = 50;
    this.leanForward = velocity*10;
  }

  // update()
  //
  // updates this.leanForward which in dude.displayDude() effects the position
  // of all limbs, head and back.

  update(){

    // get current y-position from a leg (either works)
    let backHeight = dude.limbs[1].backHeight;

    // correct height
    if(backHeight<0){
      backHeight = abs(backHeight*1.5);
    };

    // leaning is effected by frameCount (it bobs),
    // and height (leans forward when in the air)
    this.leanForward =  -27 + sin(radians(frameCount))*10 + backHeight/2;
  }


  // display()
  //
  // update fill and display back

  display(){

    push();
    translate(dude.shoulderDistance/2, this.length/2, 0);
    let greenFill = (cos(radians(frameCount))+1)*125;
    fill(greenFill);
    stroke(250-greenFill);
    box(10, this.length, 10);
    pop();
  }
}
