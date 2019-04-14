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
    switch(this.index){
      case 0: fill(0, 0, 100); break;
      case 1: fill(0, 0, 140); break;
      case 2: fill(0, 0, 180); break;
      case 3: fill(0, 100, 0); break;
      case 4: fill(0, 140, 0); break;
      case 5: fill(0, 180, 0); break;
      case 11: fill(0, 0, 100); break;
      case 12: fill(0, 0, 140); break;
      case 13: fill(0, 0, 180); break;
      case 14: fill(0, 100, 0); break;
      case 15: fill(0, 140, 0); break;
      case 16: fill(0, 180, 0); break;
    }
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

switch(mode){
  case 0:
  val1 = map(inputY, -2*PI, 2*PI, 0, this.h);
  val3 = map(inputX, -2*PI, 2*PI, 0, this.w);break;
  case 1:
  val1 = map(inputY, -20*PI, 20*PI, 0, this.h);
  val3 = map(inputX, -20*PI, 20*PI, 0, this.w);break;
  case 2:
  val1 = map(inputY, 0.0001, 1, 0, this.h);
  val3 = map(inputX,  0.0001, 0.5, 0, this.w);break;
  case 3:
  val1 = map(inputY, 10, 8000, 0, this.h);
  val3 = map(inputX, 0.1, 50, 0, this.w);break;
  case 4:
  val1 = map(inputY, 0, 1, 0, this.h);
  val3 = map(inputX, 0, 1, 0, this.w);break;
}

    let val2 = this.y + this.h - val1;
    this.valueY = val2;

    let val4 = this.x + this.w - val3;
    this.valueX = val4;
  }

  getValue(){

    let markerY = this.y+this.h - this.valueY;
    let markerX = this.x+this.w - this.valueX;

    switch(this.index){

      case 0:
      armMoves[currentMoves].thighPos = map(markerY, 0, this.h, -2*PI, 2*PI);
      armMoves[currentMoves].thighDif = map(markerX, 0, this.w, -2*PI, 2*PI);
      break;

      case 1:
      armMoves[currentMoves].thighPos2 = map(markerY, 0, this.h, -20*PI, 20*PI);
      armMoves[currentMoves].thighDif2 = map(markerX, 0, this.w, -20*PI, 20*PI);
      break;

      case 2:
      armMoves[currentMoves].kneePos = map(markerY, 0, this.h, -2*PI, 2*PI);
      armMoves[currentMoves].kneeDif = map(markerX, 0, this.w, -2*PI, 2*PI);
      break;

      case 3:
      legMoves[currentMoves].thighPos = map(markerY, 0, this.h, -2*PI, 2*PI);
      legMoves[currentMoves].thighDif = map(markerX, 0, this.w, -2*PI, 2*PI);
      break;

      case 4:
      legMoves[currentMoves].thighPos2 = map(markerY, 0, this.h, -20*PI, 20*PI);
      legMoves[currentMoves].thighDif2 = map(markerX, 0, this.w, -20*PI, 20*PI);
      break;

      case 5:
      legMoves[currentMoves].kneePos = map(markerY, 0, this.h, -2*PI, 2*PI);
      legMoves[currentMoves].kneeDif = map(markerX, 0, this.w, -2*PI, 2*PI);
      break;

      case 11:
      attack[0] = map(markerY, 0, this.h, 0.0001, 1);
      release[0] = map(markerX, 0, this.w, 0.0001, 0.5);
      envelopes[0].setADSR(attack[0], 0.1, 0.3, release[0]);
      break;

      case 12:
      filterFreq[0] = map(markerY, 0, this.h, 10, 8000);
      filterRes[0] = map(markerX, 0, this.w, 0.1, 50);
      filters[0].freq( filterFreq[0] );
      filters[0].res( filterRes[0] );
      break;

      case 13:
      delayDividor[0] = map(markerY, 0, this.h, 0, 1);
      delayFeedback[0] = constrain(map(markerX, 0, this.w, 0, 1), 0, 0.9);
      break;

      case 14:
      attack[1] = map(markerY, 0, this.h, 0.0001, 1);
      release[1] = map(markerX, 0, this.w, 0.0001, 0.5);
      envelopes[1].setADSR(attack[1], 0.1, 0.3, release[1]);
      break;

      case 15:
      filterFreq[1] = map(markerY, 0, this.h, 10, 8000);
      filterRes[1] = map(markerX, 0, this.w, 0.1, 50);
      filters[1].freq( filterFreq[1] );
      filters[1].res( filterRes[1] );
      break;

      case 16:
      delayDividor[1] = map(markerY, 0, this.h, 0, 1);
      delayFeedback[1] = constrain(map(markerX, 0, this.w, 0, 1),0, 0.9);
      break;
    }
  }

  updatePos(){

    this.valueX = constrain(mouseX, this.x, this.x+this.w);
    this.valueY = constrain(mouseY, this.y, this.y+this.h);
  }
}
