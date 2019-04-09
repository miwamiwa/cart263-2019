class XYPad{

  constructor(x, y, index){
    this.index = index;
    this.x =x;
    this.y =y;
    this.w = 150;
    this.h = 150;
    this.valueX =this.x+this.w/2;
    this.valueY =this.y+this.h/2;
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
    let posX = this.valueX;
    let posY = this.valueY;
    fill(255, 0, 0);
    ellipse(posX, posY ,10, 10);

    pop();
  }


  checkMouse(type){
    if(
      mouseX>this.x
      && mouseX<this.x+this.w
      && mouseY>this.y
      && mouseY<this.y+this.h
    ){

      if(type==="press"){
        this.updatePos();
        this.selected = true;
      }
    }

    if(type==="drag" && this.selected){
      this.updatePos();
    }
    if(type==="stop" && this.selected){
      this.updatePos();
      this.selected = false;
    }
  }

  getValue(){
    let valueY = map(this.y+this.h - this.valueY, 0, 150, -2*PI, 2*PI);
    let valueX = map(this.x+this.w - this.valueX, 0, 150, -2*PI, 2*PI);

    switch(this.index){
      case 0:
      armRunMotion.thighPos = valueY;
      armRunMotion.thighDif = valueX; break;
      case 1:
      valueY = 10*valueY;
      valueX = 10*valueX;
      armRunMotion.thighPos2 = valueY;
      armRunMotion.thighDif2 = valueX; break;
      case 2:
      armRunMotion.kneePos = valueY;
      armRunMotion.kneeDif = valueX; break;
      case 3: break;
      case 4: break;
      case 5: break;
    }
  }

  updatePos(){

    this.valueX = constrain(mouseX, this.x, this.x+this.w);
    this.valueY = constrain(mouseY, this.y, this.y+this.h);
  }
}
