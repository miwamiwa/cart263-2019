class UI{

  constructor(){
this.w = 800;
this.h = 550;
  }

  display(){
    push();

fill(255);
//if(mouseX > width/2-this.w/2 && mouseX < width/2+this.w/2) fill(0);

rotateX(0.078*PI);
translate(-this.w/2, -7*height/16, -115);
stroke(0);
rect(0, 0, this.w, this.h);

let keyboardWidth = 2*width/7;
translate(this.w/2-keyboardWidth/2, this.h-120,0);
rect(0, 0, keyboardWidth, 50);

let noteWidth = keyboardWidth /24;

for(let i=0; i<24; i++){
  fill(255);
  let thiskey = i%12;
  if(thiskey===1||thiskey===3||thiskey===6||thiskey===8||thiskey===10) fill(0);
  rect(i*noteWidth, 0, noteWidth, 50);
}

    pop();
  }
}
