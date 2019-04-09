class UI{

  constructor(){
this.w = 800;
this.h = 550;
  }

  display(){
    push();

fill(255);
if(mouseX > width/2-this.w/2 && mouseX < width/2+this.w/2) fill(0);

rotateX(0.078*PI);
translate(-this.w/2, -7*height/16, -115);
stroke(0);
rect(0, 0, this.w, this.h);

    pop();
  }
}
