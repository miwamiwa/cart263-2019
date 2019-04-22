/*
Slider.js
Creates a slider that can control a game parameter. This script handles creating
it, checking for mouse input, updating game parameter and doing the opposite
(updating knob position using game parameter value), and displaying it.
*/


class Slider{


// constructor()
// creates a few variables and positions html description

  constructor(x, y, index, w, h, selector){
    this.index = index;
    // position
    this.x =x;
    this.y =y;
    this.w = w;
    this.h = h;
    // knob position
    this.position =this.y+this.h;
    // double-rect layout margin
    this.margin = 0.1*this.h;
    // select for mouse interaction
    this.selected = false;

    // position the div that holds this slider's text description
    positionText(this.x, this.y, "#slid"+selector);
  }





  // display()
  //
  // display slider background and knob

  display(){

    push();

    // display background
    strokeWeight(8);
    stroke(255, 185);
    fill(255, 100);
    rect(this.x, this.y-this.margin, this.w, this.h+2*this.margin);
    rect(this.x-this.margin, this.y, this.w+2*this.margin, this.h);

    // display knob
    translate(0, 0, 1);
    fill(255, 0, 0);
    ellipse(this.x+this.w/2,  this.position, 10);
    pop();
  }






  // checkmouse()
  //
  // called within mousepressed(), mousedragged() and mousereleased() events.
  // marks this slider as selected if mouse is pressed while over it, which then
  // allows mouse drag() and released() events to update knob position.

  checkMouse(type){

    // if mouse is positioned over this slider
    if(
      mouseX>this.x
      && mouseX<this.x+this.w
      && mouseY>this.y
      && mouseY<this.y+this.h
    ){

      // if mouse was pressed
      if(type==="press"){
        // update knob position
        this.position = constrain(mouseY, this.y, this.y+this.h);
        // mark as selected
        this.selected = true;
        // if not done yet,
        // remove instructions from screen
        if(this.index<=7&&uiObject.text1Active) {
          uiObject.text1Active = false;
          $("#instruct1").remove();
        }
        else if(this.index>=9&&uiObject.text2Active) {
          uiObject.text2Active = false;
          $("#instruct2").remove();
        }
      }
    }

    // if mouse was dragged and is selected
    if(type==="drag" && this.selected){
      // update knob position
      this.position = constrain(mouseY, this.y, this.y+this.h);
    }

    // if mouse was release and is selected
    if(type==="stop" && this.selected){
      // deselect and update knob position
      this.position = constrain(mouseY, this.y, this.y+this.h);
      this.selected = false;
    }
  }







  // getvalue()
  //
  // maps slider position to a game parameter tied to its index number

  getValue(){

    // map this slider's ouptput
    let value = map(this.y+this.h - this.position, 0, this.h, 0, 1);
    // match its index number to a game parameter
    switch(this.index){
      case 6: // character height
      // map to correct range and update
      value = map(this.y+this.h-this.position, 0, this.h,window.innerHeight/96, -window.innerHeight/4);
      dude.legMoves[dude.currentMoves].height = value;
      break;
      case 7: // vigor
      dude.vigor[dude.currentMoves] = value;
      break;
      case 8: // synth volume
      musicObject.maxAmplitude[0] = value;
      musicObject.envelopes[0].setRange( musicObject.maxAmplitude[0], 0);
      break;
      case 9: // bass volume
      musicObject.maxAmplitude[1] = value;
      musicObject.envelopes[1].setRange( musicObject.maxAmplitude[1], 0);
      break;
      case 10: // drum volume
      musicObject.maxAmplitude[2] = value;
      musicObject.envelopes[2].setRange( musicObject.maxAmplitude[2], 0);
      musicObject.envelopes[2].setADSR(0.01, 0.05, 0.3*musicObject.maxAmplitude[2], 0.4);
      break;
      case 11:  // tempo
      // adapt dude speed to tempo
      for (let i=0; i<dude.limbs.length; i++){
        dude.limbs[i].speed =  1+value*value*15;
      }
      // map music playing speed to match "tempo"
      value = map(this.y+this.h-this.position, 0, this.h, 1, 0);
      musicObject.subDivisionLength = floor(2+20*value);
      break;
    }
  }






  // setvalue()
  //
  // converts game parameter to knob height. different parameters use different
  // modes.

  setValue(input, mode){
    let val;
    // match mode to a range to map input onto
    switch(mode){
      case 1: // character height
      val = map(input, window.innerHeight/96, -window.innerHeight/4, 0, this.h);

      break;

      case 2: // subdivision length
      val = map(  (input-2)/20 , 1, 0, 0, this.h);
      break;

      case 3:  // all other parameters other than
      val = map(input, 0, 1, 0,  this.h);
      break;
    }
    // update knob position
    this.position = this.y + this.h - val;
  }



}
