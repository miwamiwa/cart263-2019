class Slider{

  constructor(x, y, index){
    this.index = index;
    this.x =x;
    this.y =y;
    this.w = 30;
    this.h = 120;
    this.position =this.y+this.h;
    this.margin = 0.1*this.h;
    this.maxValue=200;
    this.minValue =-200;
    this.lastX =0;
    this.lastY =0;
    this.selected = false;
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
    let value = map(this.y+this.h - this.position, 0, this.h, 0.01, 1);


    switch(this.index){
      case 6:
      value = map(this.y+this.h-this.position, 0, this.h, -50, 50);
      legMoves[currentMoves].height = value;
      break;
      case 7:
      vigor[currentMoves] = value;
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

      break;
    }
  }

  setValue(input, mode){
    let val;

    switch(mode){
      case 1:
      val = map(input, -50, 50, 0, this.h);
      break;

      case 2:
      val = map(input, 0, 1, 0,  this.h);
      break;

      case 3:
      val = map(input, 0, 1, 0, this.h);
      break;

      this.position = this.y + this.h - val;

    }
  }
}
