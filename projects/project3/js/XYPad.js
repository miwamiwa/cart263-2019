class XYPad{


// on start:
  constructor(x, y, index, selector, size){

    // index corresponds to uiObject.knobindex, which counts both pads and sliders.
    // selector refers to the list of pads only.
    // one could def replace the other if i have time to do that
    this.index = index;

    // corner position and size
    this.x =x;
    this.y =y;
    this.w = size;
    this.h = size;

    // this is the extra length added at the end of the two rects() that make up
    // each pad. the knob's x, y position is still calculated as if it was
    // contained in a square
    this.margin = 0.1*this.h;

    // position the div that holds this pad's text description
    positionText(this.x, this.y, "#pad"+selector);

    // knob's x, y position
    this.valueX =this.x+this.w/2;
    this.valueY =this.y+this.h/2;

    // tag for mouse control
    this.selected = false;
    // fill color
    this.colour = color(255, 80);

    // default output range
    this.minRangeX = -0.5*PI;
    this.maxRangeX = 0.5*PI;
    this.minRangeY = 0*PI;
    this.maxRangeY = 0.8*PI;
    // check index and update range accordingly
    this.setRange();
  }






// setrange()
//
// set the range of values this pad's output will be mapped to, if it isn't
// the default range (-2*PI to 2*PI). uses this pad's index value to assign
// the correct range.

  setRange(){
    if(this.index==2||this.index==5){
      this.minRangeX = -0.1*PI;
      this.maxRangeX = 1*PI;
      this.minRangeY = 0*PI;
      this.maxRangeY = 2*PI;
    }
    else if(this.index==3){
      this.minRangeX = -0.1*PI;
      this.maxRangeX = 0.75*PI;
      this.minRangeY = 0*PI;
      this.maxRangeY = 0.8*PI;
    }
    // range of thigh z-axis rotate pad
    else if(this.index==1){
      this.minRangeX = -50*PI;
      this.maxRangeX = 1*PI;
      this.minRangeY = 0*PI;
      this.maxRangeY = 15*PI;
    }
    else if(this.index==4){
      this.minRangeX = -10*PI;
      this.maxRangeX = 4*PI;
      this.minRangeY = 0*PI;
      this.maxRangeY = 15*PI;
    }
    // range of attack/release pad
    else if(this.index==12||this.index==15){
      this.minRangeX = 1;
      this.maxRangeX = 0.0001;
      this.minRangeY = 0.0001;
      this.maxRangeY = 0.5;
    }
    // range of filter freq/res pad
    else if(this.index==13){
      this.minRangeX = 50;
      this.maxRangeX = 0.1;
      this.minRangeY = 1;
      this.maxRangeY = 4000;
    }
    else if(this.index==16){
      this.minRangeX = 50;
      this.maxRangeX = 0.1;
      this.minRangeY = 1;
      this.maxRangeY = 12000;
    }
    // range of delay feedback/time pad
    else if(this.index==14||this.index==17){
      this.minRangeX = 0.9;
      this.maxRangeX = 0;
      this.minRangeY =0;
      this.maxRangeY =0.45;
    }
  }






  // display()
  //
  // display pad and knob

  display(){

    push();
    // pad:
    // stylize
    strokeWeight(8);
    stroke(255, 185);
    fill(this.colour);
    // display pad
    rect(this.x, this.y-this.margin, this.w, this.h+2*this.margin);
    rect(this.x-this.margin, this.y, this.w+2*this.margin, this.h);

    // knob:
    translate(0, 0, 10);
    noFill();
    strokeWeight(5);
    // white circle
    stroke(255);
    ellipse(this.valueX, this.valueY ,10, 10);
    translate(0, 0, 2);
    // red circle
    stroke(255, 0, 0);
    ellipse(this.valueX, this.valueY ,8, 8);
    pop();
  }






// checkmouse()
//
// called within mousepressed(), mousedragged() and mousereleased() events.
// marks this pad as selected if mouse is pressed while over it, which then
// allows mouse drag() and released() events to update knob position.

  checkMouse(type){

    // if mouse x, y overlaps this pad's x, y, w, h
    if(
      mouseX>this.x
      && mouseX<this.x+this.w
      && mouseY>this.y
      && mouseY<this.y+this.h
    ){
      // if mouse is pressed inside the pad,
      // update knob position and mark pad as selected.
      if(type==="press"){
        this.updatePos();
        this.selected = true;
      }
    }
    // if this pad was selected and mouse is dragged,
    // update knob position
    if(type==="drag" && this.selected){
      this.updatePos();
    }
    // if this pad was selected and mouse is released,
    // update knob position and deselect this pad
    if(type==="stop" && this.selected){
      this.updatePos();
      this.selected = false;
    }
  }






  // setvalue()
  //
  // set knob position by mapping it back using this pad's game parameter.
  // inputs are the current values of the game variables associated to this pad.

  setValue(inputX, inputY){

    // map associated variable's range to match this pad's height
    let val1 = map(inputY, this.minRangeY, this.maxRangeY, 0, this.h);
    // assign this pad's knob's y position
    let val2 = this.y + this.h - val1;
    this.valueY = val2;

    // map other variable's range to match this pad's width
    let val3 = map(inputX, this.minRangeX, this.maxRangeX, 0, this.w);
    // assign knob's x position
    let val4 = this.x + this.w - val3;
    this.valueX = val4;
  }






  // getvalue()
  //
  // map pad's x and y values to match the appropriate game parameter's range.
  // if the game parameter involves a p5.sound object, update that function.

  getValue(){

    // get knob position relative to pad position
    let markerY = this.y+this.h - this.valueY;
    let markerX = this.x+this.w - this.valueX;

    // map knob position according to game parameter
    let mapY = map(markerY, 0, this.h, this.minRangeY, this.maxRangeY);
    let mapX = map(markerX, 0, this.w, this.minRangeX, this.maxRangeX);

    // this is unfortunately redundant, but here's where i map this pad's
    // x and y values to the right game parameters

    switch(this.index){
      case 0: // shoulder x rotate
      dude.armMoves[dude.currentMoves].thighDisplacement = mapY;
      dude.armMoves[dude.currentMoves].thighOrigin = mapX;

      break; case 1: // shoulder z rotate
      dude.armMoves[dude.currentMoves].thighDisplacement2 = mapY;
      dude.armMoves[dude.currentMoves].thighOrigin2 = mapX;

      break; case 2: // elbow x rotate
      dude.armMoves[dude.currentMoves].kneeDisplacement = mapY;
      dude.armMoves[dude.currentMoves].kneeOrigin = mapX;

      break; case 3: // thigh x rotate
      dude.legMoves[dude.currentMoves].thighDisplacement = mapY;
      dude.legMoves[dude.currentMoves].thighOrigin = mapX;

      break; case 4: // thigh z rotate
      dude.legMoves[dude.currentMoves].thighDisplacement2 = mapY;
      dude.legMoves[dude.currentMoves].thighOrigin2 = mapX;

      break; case 5: // knee x rotate
      dude.legMoves[dude.currentMoves].kneeDisplacement = mapY;
      dude.legMoves[dude.currentMoves].kneeOrigin = mapX;

      break; case 12: // attack / release for synth1
      musicObject.attack[0] = mapY;
      musicObject.release[0] = mapX;
      musicObject.envelopes[0].setADSR(musicObject.attack[0], 0.1, 0.3, musicObject.release[0]);

      break; case 13: // filter freq/res for synth1
      musicObject.filterFreq[0] = mapY;
      musicObject.filterRes[0] = mapX;
      musicObject.filters[0].freq( musicObject.filterFreq[0] );
      musicObject.filters[0].res( musicObject.filterRes[0] );

      break; case 14: // delay feeback/time for synth1
      musicObject.delayDividor[0] = mapY;
      musicObject.delayFeedback[0] = mapX;

      break; case 15: // attack / release for synth2
      musicObject.attack[1] = mapY;
      musicObject.release[1] = mapX;
      musicObject.envelopes[1].setADSR(musicObject.attack[1], 0.1, 0.3, musicObject.release[1]);

      break; case 16: // filter freq/res for synth2
      musicObject.filterFreq[1] = mapY;
      musicObject.filterRes[1] = mapX;
      musicObject.filters[1].freq( musicObject.filterFreq[1] );
      musicObject.filters[1].res( musicObject.filterRes[1] );

      break; case 17: // delay feedback/time for synth2
      musicObject.delayDividor[1] = mapY;
      musicObject.delayFeedback[1] = mapX;
      break;
    }
  }






  // updatepos()
  //
  // constrain knob position to this pad's boundaries and update position.

  updatePos(){

    if(this.index<=5&&uiObject.text1Active) {
      uiObject.text1Active = false;
      $("#instruct1").remove();
    }
    else if(this.index>=12&&uiObject.text2Active) {
      uiObject.text2Active = false;
      $("#instruct2").remove();
    }
    this.valueX = constrain(mouseX, this.x, this.x+this.w);
    this.valueY = constrain(mouseY, this.y, this.y+this.h);
  }
}
