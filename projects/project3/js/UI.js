class UI{

  constructor(){
    this.w = width/2;
    this.h = height/2;

    //this.camScale = width/height +1;
    //console.log("\nwidth "+width+"\nheight "+height);

    //this.camScale = (width + height)/ ((this.h + this.h )/2);
    this.camScaleX = -this.camScaling(300);
    this.camScaleY = -this.camScaling(300);

    this.noteEditMode = false;

    this.timelineNotes = [16];
    for (let i=0; i<16; i++){
      this.timelineNotes[i] = -1;
    }
    this.timelineSelector = 0;

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
    let timelineY = this.h*0.38;
    let timelineH = this.h/16;
    let beatW = timelineW/beats;


    translate(0, timelineY, 0);
    rect(timelineX, 0, timelineW, timelineH);

    for(let i=0; i<16; i++){
      fill(255);

      if(this.timelineNotes[i]!=-1) fill(45, 145, 12);

      if(this.noteEditMode && i=== this.timelineSelector) fill(185, 200, 85);

      if(
        mouseX > width/2+(timelineX+i*beatW)*this.camScaleX
        && mouseX < width/2+(timelineX+(i+1)*beatW)*this.camScaleX
        && mouseY > height/2+(timelineY)*this.camScaleY
        && mouseY < height/2+(timelineY+timelineH)*this.camScaleY
        && !this.noteEditMode
      ){
        fill(255, 0, 0);

        if(mouseIsPressed){
          console.log("\n edit mode start");
          this.noteEditMode = true;
          this.timelineSelector = i;
          // clicked on timeline element i

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
    let kbY = 0.11*height;
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
        this.noteEditMode
        && i === this.timelineNotes [ this.timelineSelector ]
      ){
        fill(12, 35, 145);
      }

      if(
        mouseX > width/2+(kbX+i*noteWidth)*this.camScaleX
        && mouseX < width/2+(kbX+(i+1)*noteWidth)*this.camScaleX
        && mouseY > height/2+(kbY)*this.camScaleY
        && mouseY < height/2+(kbY+kbH)*this.camScaleY
        && this.noteEditMode
      ){
        fill(255, 0, 0);
        if(mouseIsPressed){
          // clicked on note i
          console.log("\n edit mode stop");
          this.noteEditMode = false;
          this.timelineNotes[ this.timelineSelector ] = i;
          console.log("\nset timeline element "+this.timelineSelector+" to value "+i);
        }
      }
      rect(i*noteWidth, 0, noteWidth, kbH);
    }
    pop();
  }
}
