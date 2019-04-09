class Slider{

  constructor(){

    this.x =200;
    this.y =200;
    this.w = 50;
    this.h = 150;
    this.value =0;
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
    ellipse(this.x, this.y, this.w+15, this.w+15)
    translate(0, 0, 1);
    let level = map(this.value, this.minValue-1, this.maxValue+1, 0, 2*PI);
    fill(255, 0, 0);
    arc(this.x, this.y, this.w+10, this.w+10, 0, level);
    translate(0, 0, 1);
    stroke(0);
    fill(225);
    ellipse(this.x, this.y, this.w, this.w)

    noStroke(0);
    fill(125);
  //  rect(this.x, this.y + this.h-level, this.w, level);
    pop();
  }

  update(value, minval, maxval){
    this.value = value;
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
        this.lastX = mouseX;
        this.lastY = mouseY;
        this.selected = true;
      }

    }
    if(type==="drag"){
      this.value -= (mouseX-this.lastX)/4;
      this.value = constrain(this.value, -200, 200);
    }
    if(type==="stop"){
      this.value -= (mouseX-this.lastX)/4;
      this.value = constrain(this.value, -200, 200);
      this.selected = false;
      console.log("value "+this.value)
    }

  }
}
