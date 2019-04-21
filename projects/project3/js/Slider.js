class Slider{

  constructor(x, y, index, w, h, selector){
    this.index = index;
    this.x =x;
    this.y =y;
    this.w = w;
    this.h = h;
    this.position =this.y+this.h;
    this.margin = 0.1*this.h;
    this.maxValue=200;
    this.minValue =-200;
    this.lastX =0;
    this.lastY =0;
    this.selected = false;

    // position the div that holds this pad's text description
    positionText(this.x, this.y, "#slid"+selector);
  }

  display(){

    push();
    strokeWeight(8);
    stroke(255, 185);
    fill(255, 100);


    rect(this.x, this.y-this.margin, this.w, this.h+2*this.margin);
    rect(this.x-this.margin, this.y, this.w+2*this.margin, this.h);
    translate(0, 0, 1);
    //let level = map(this.position, this.minValue-1, this.maxValue+1, 0, 2*PI);
    fill(255, 0, 0);
    ellipse(this.x+this.w/2,  this.position, 10);
    pop();
  }
/*
  update(value, minval, maxval){
    this.position = value;
    this.minValue = minval;
    this.maxValue = maxval;
  }
*/
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

    if(type==="drag" && this.selected){
      this.position = constrain(mouseY, this.y, this.y+this.h);
    }
    if(type==="stop" && this.selected){
      this.position = constrain(mouseY, this.y, this.y+this.h);
      this.selected = false;
    }
  }

  getValue(){
    let value = map(this.y+this.h - this.position, 0, this.h, 0, 1);


    switch(this.index){
      case 6:
      value = map(this.y+this.h-this.position, 0, this.h,window.innerHeight/96, -window.innerHeight/4);
      dude.legMoves[dude.currentMoves].height = value;
      break;
      case 7:
      dude.vigor[dude.currentMoves] = value;
      break;
      case 8:
      musicObject.maxAmplitude[0] = value;
      musicObject.envelopes[0].setRange( musicObject.maxAmplitude[0], 0);
      break;
      case 9:
      musicObject.maxAmplitude[1] = value;
      musicObject.envelopes[1].setRange( musicObject.maxAmplitude[1], 0);
      break;
      case 10:
      musicObject.maxAmplitude[2] = value;
      musicObject.envelopes[2].setRange( musicObject.maxAmplitude[2], 0);
      musicObject.envelopes[2].setADSR(0.01, 0.05, 0.3*musicObject.maxAmplitude[2], 0.4);
      break;
      case 11:
      for (let i=0; i<dude.limbs.length; i++){
        dude.limbs[i].speed =  1+value*value*15;
      }
      value = map(this.y+this.h-this.position, 0, this.h, 1, 0);
      musicObject.subDivisionLength = floor(2+30*value);
      break;
    }
  }

  setValue(input, mode){
    let val;

    switch(mode){
      case 1:
      val = map(input, this.h,window.innerHeight/96, -window.innerHeight/4, 0, this.h);
      break;

      case 3:
      val = map(input, 0, 1, 0,  this.h);
      break;

      case 2:
      val = map(  (input-2)/30 , 1, 0, 0, this.h);
      break;

      case 4:
      val = map(input, 1, 0, 0, this.h);
      break;
    }

    this.position = this.y + this.h - val;
  }
}
