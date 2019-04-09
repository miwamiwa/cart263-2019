class Slider{

  constructor(x, y, index){
    this.index = index;
    this.x =x;
    this.y =y;
    this.w = 50;
    this.h = 150;
    this.position =this.y+this.h;
    this.maxValue=200;
    this.minValue =-200;
    this.lastX =0;
    this.lastY =0;
    this.selected = false;
  }

  display(){

    push();
    strokeWeight(1);
    stroke(0);
    fill(225);
    rect(this.x, this.y, this.w, this.h);
    translate(0, 0, 1);
    //let level = map(this.position, this.minValue-1, this.maxValue+1, 0, 2*PI);
    fill(255, 0, 0);
    ellipse(this.x+this.w/2,  this.position, 10);
    pop();
  }

  update(value, minval, maxval){
    this.position = value;
    this.minValue = minval;
    this.maxValue = maxval;
  }

  checkMouse(type){
    if(
      mouseX>this.x
      && mouseX<this.x+this.w
      && mouseY>this.y
      && mouseY<this.y+this.h
    ){

      if(type==="press"){
        this.position = constrain(mouseY, this.y, this.y+this.h);
        this.selected = true;
      }
    }

    if(type==="drag" && this.selected){
      this.position = constrain(mouseY, this.y, this.y+this.h);
    }
    if(type==="stop" && this.selected){
      this.position = constrain(mouseY, this.y, this.y+this.h);
      this.selected = false;
    }
  }

  getValue(){
    let value = map(this.y+this.h - this.position, 0, 150, 0, 1);
    switch(this.index){
      case 6:  break;
      case 7:  break;
      case 8:
      vigor = value; break;
    }
  }
}
