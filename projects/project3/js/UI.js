class UI{

  constructor(){
    this.w = width/2;
    this.h = height/2;

    //this.camScale = width/height +1;
    console.log("\nwidth "+width+"\nheight "+height);

    this.camScale = (width + height)/ ((this.h + this.h )/2);
    this.camScaleX = -this.camScaling(300);
    this.camScaleY = -this.camScaling(300);

    console.log("\nw "+this.camScaleX+"\nh "+this.camScaleY);

  }

  camScaling(input){
    let camHeight = height+input;
    let theta = atan(camHeight/400)*2;
    let segAD = sqrt( sq(camHeight/2)+ sq(200) );
    let segAC = 200/ cos(theta);
    let segBC =  segAC * camHeight / segAD;

    let scaleIt = height/segBC;
    console.log("scale "+scaleIt);
    return scaleIt;
  }

  displayBackground(){
    push();

    fill(255);
    //if(mouseX > width/2-this.w/2 && mouseX < width/2+this.w/2) fill(0);

    rotateX(0.078*PI);
    translate(-this.w/2, -7*this.h/16, -200);
    stroke(0);
    rect(0, 0, this.w, this.h);


    pop();
  }

  displayMusicEditor(){
    push();
    rotateX(0.078*PI);
    this.displayKeyboard();
    this.displayTimeline();

    pop();
  }

  displayTimeline(){
    push();
    let timelineW = this.w/2;
    let beats = 16;
    let timelineX = -timelineW/2;
    let timelineY = this.h*0.45;
    let timelineH = this.h/16;
    let beatW = timelineW/beats;


    translate(0, timelineY, 0);
    rect(timelineX, 0, timelineW, timelineH);

    for(let i=0; i<16; i++){
      fill(255);
      if(
        mouseX > width/2+(timelineX+i*beatW)*this.camScaleX
        && mouseX < width/2+(timelineX+(i+1)*beatW)*this.camScaleX
        && mouseY > height/2+(timelineY)*this.camScaleY
        && mouseY < height/2+(timelineY+timelineH)*this.camScaleY
      ){
        fill(255, 0, 0);
        if(mousePressed){
          // clicked on note i
        }
      }

      rect(timelineX+i*beatW, 0, beatW, timelineH);
    }
    pop();
  }

  displayKeyboard(){
    push();
    fill(255);

    let keyboardWidth = 2*this.w/3;
    let kbX = -keyboardWidth/2;
    let kbY = 0.15*height;
    let kbZ = 0;
    let kbH = this.h/8;

    translate(kbX, kbY, kbZ);
    stroke(125);
    strokeWeight(0.5);
    rect(0, 0, keyboardWidth, kbH);

    let noteWidth = keyboardWidth /24;

    for(let i=0; i<24; i++){

      fill(255);
      let thiskey = i%12;
      if(thiskey===1||thiskey===3||thiskey===6||thiskey===8||thiskey===10) fill(0);

      if(
        mouseX > width/2+(kbX+i*noteWidth)*this.camScaleX
        && mouseX < width/2+(kbX+(i+1)*noteWidth)*this.camScaleX
        && mouseY > height/2+(kbY)*this.camScaleY
        && mouseY < height/2+(kbY+kbH)*this.camScaleY
      ){
        fill(255, 0, 0);
        if(mousePressed){
          // clicked on note i
        }
      }
      rect(i*noteWidth, 0, noteWidth, kbH);
    }
    pop();
  }
}
