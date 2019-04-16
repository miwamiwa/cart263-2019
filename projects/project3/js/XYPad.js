class XYPad{

  constructor(x, y, index, selector){

    this.index = index;
    this.x =x+100;

    this.w = 90;
    this.h = 90;
      this.y =40+1.5*y*this.h;
    this.margin = 0.1*this.h;

    positionText(this.x, this.y, "#pad"+selector);

    this.valueX =this.x+this.w/2;
    this.valueY =this.y+this.h/2;
    this.selected = false;
    this.colour = color(255, 80);

  }

// display()
//
//

  display(){

    push();
    // display pad
    strokeWeight(8);
    stroke(255, 185);
    fill(this.colour);


    rect(this.x, this.y-this.margin, this.w, this.h+2*this.margin);
    rect(this.x-this.margin, this.y, this.w+2*this.margin, this.h);


    // display knob
    translate(0, 0, 10);
    noFill();
    strokeWeight(5);

    stroke(255);
    ellipse(this.valueX, this.valueY ,10, 10);
    translate(0, 0, 1);
    stroke(255, 0, 0);
    ellipse(this.valueX, this.valueY ,8, 8);
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
      musicObject.attack[0] = map(markerY, 0, this.h, 0.0001, 1);
      musicObject.release[0] = map(markerX, 0, this.w, 0.0001, 0.5);
      musicObject.envelopes[0].setADSR(musicObject.attack[0], 0.1, 0.3, musicObject.release[0]);
      break;

      case 12:
      musicObject.filterFreq[0] = map(markerY, 0, this.h, 10, 8000);
      musicObject.filterRes[0] = map(markerX, 0, this.w, 0.1, 50);
      musicObject.filters[0].freq( musicObject.filterFreq[0] );
      musicObject.filters[0].res( musicObject.filterRes[0] );
      break;

      case 13:
      musicObject.delayDividor[0] = map(markerY, 0, this.h, 0, 1);
      musicObject.delayFeedback[0] = constrain(map(markerX, 0, this.w, 0, 1), 0, 0.9);
      break;

      case 14:
      musicObject.attack[1] = map(markerY, 0, this.h, 0.0001, 1);
      musicObject.release[1] = map(markerX, 0, this.w, 0.0001, 0.5);
      musicObject.envelopes[1].setADSR(musicObject.attack[1], 0.1, 0.3, musicObject.release[1]);
      break;

      case 15:
      musicObject.filterFreq[1] = map(markerY, 0, this.h, 10, 8000);
      musicObject.filterRes[1] = map(markerX, 0, this.w, 0.1, 50);
      musicObject.filters[1].freq( musicObject.filterFreq[1] );
      musicObject.filters[1].res( musicObject.filterRes[1] );
      break;

      case 16:
      musicObject.delayDividor[1] = map(markerY, 0, this.h, 0, 1);
      musicObject.delayFeedback[1] = constrain(map(markerX, 0, this.w, 0, 1),0, 0.9);
      break;
    }
  }

  updatePos(){

    this.valueX = constrain(mouseX, this.x, this.x+this.w);
    this.valueY = constrain(mouseY, this.y, this.y+this.h);
  }
}
