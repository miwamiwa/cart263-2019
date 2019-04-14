class XYPad{

  constructor(x, y, index){
    this.index = index;
    this.x =x;
    this.y =y;
    this.w = 100;
    this.h = 100;
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

  setValue(inputX, inputY, mode){
let val1;
let val3;

if(mode===0){
  val1 = map(inputY, -2*PI, 2*PI, 0, this.h);
  val3 = map(inputX, -2*PI, 2*PI, 0, this.w);
}
else if(mode===1){
  val1 = map(inputY, -20*PI, 20*PI, 0, this.h);
  val3 = map(inputX, -20*PI, 20*PI, 0, this.w);
}

    let val2 = this.y + this.h - val1;
    this.valueY = val2;


    let val4 = this.x + this.w - val3;
    this.valueX = val4;
  }

  getValue(){

    let valueY = map(this.y+this.h - this.valueY, 0, this.h, -2*PI, 2*PI);
    let valueX = map(this.x+this.w - this.valueX, 0, this.w, -2*PI, 2*PI);

    switch(this.index){
      case 0:
      armMoves[currentMoves].thighPos = valueY;
      armMoves[currentMoves].thighDif = valueX; break;
      case 1:
      valueY = 10*valueY;
      valueX = 10*valueX;
      armMoves[currentMoves].thighPos2 = valueY;
      armMoves[currentMoves].thighDif2 = valueX; break;
      case 2:
      armMoves[currentMoves].kneePos = valueY;
      armMoves[currentMoves].kneeDif = valueX; break;
      case 3:
      legMoves[currentMoves].thighPos = valueY;
      legMoves[currentMoves].thighDif = valueX; break;
      case 4:
      valueY = 10*valueY;
      valueX = 10*valueX;
      legMoves[currentMoves].thighPos2 = valueY;
      legMoves[currentMoves].thighDif2 = valueX; break;
      case 5:
      legMoves[currentMoves].kneePos = valueY;
      legMoves[currentMoves].kneeDif = valueX; break;
      case 10:
      valueY = map(this.y+this.h - this.valueY, 0, this.h, 200, 1200);
      valueX = map(this.x+this.w - this.valueX, 0, this.w, 0.1, 50);
      filters[0].freq( valueY);
      filters[0].res( valueX);
      break;
      case 11:
      valueY = map(this.y+this.h - this.valueY, 0, this.h, 10, 8000);
      valueX = map(this.x+this.w - this.valueX, 0, this.w, 0.1, 50);
      filters[1].freq( valueY);
      filters[1].res( valueX);
      break;
      case 12:
      valueY = map(this.y+this.h - this.valueY, 0, this.h, 0.0001,1);
      valueX = map(this.x+this.w - this.valueX, 0, this.w, 0.0001, 0.5);
      envelopes[0].setADSR(valueX, 0.1, 0.3, valueY);
      break;
      case 13:
      valueY = map(this.y+this.h - this.valueY, 0, this.h, 0.0001,1);
      valueX = map(this.x+this.w - this.valueX, 0, this.w, 0.0001, 0.5);
      envelopes[1].setADSR(valueX, 0.1, 0.3, valueY);
      break;

    }
  }

  updatePos(){

    this.valueX = constrain(mouseX, this.x, this.x+this.w);
    this.valueY = constrain(mouseY, this.y, this.y+this.h);
  }
}
