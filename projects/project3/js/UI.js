class UI{

  constructor(){
    this.w = width/2;
    this.h = height/2;

    this.camScaleX = -this.camScalingX(0);
    this.camScaleY = -this.camScalingY(0);

    this.noteEditMode = false;

    this.timelineNotes = [16];

    for (let i=0; i<16; i++){
      this.timelineNotes[i] = -1;
    }
    this.selectedTimelineElement = 0;
    this.selectedTimeline =-1;
    this.hoveredTimeline =-1;
    this.hoveredElement = -1;

    this.timeIndicatorX = 0;
    this.timeIndicatorY = 0;
    this.editModeCancelled = false;

    this.timelines = new Array(3);

    for (let i = 0; i < 3; i++) {
      this.timelines[i] = new Array(16);
      for(let j=0; j<16; j++){
        this.timelines[i][j] = -1;
      }
    }
  }

  camScalingX(input){
    let camHeight = width+input;
    let theta = atan(camHeight/200)*200;
    let segAD = sqrt( sq(camHeight/2)+ sq(200) );
    let segAC = 200/ cos(theta);
    let segBC =  segAC * camHeight / segAD;
    let scaleIt = height/segBC;

    return scaleIt;
  }

  camScalingY(input){
    let camHeight = height+input;
    let theta = atan(camHeight/200)*200;
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
    let timelineH = this.h/32;
    let beatW = timelineW/beats;
    translate(0, timelineY, 0);

    push();
    for(let i=0; i<3; i++){
      translate(0, timelineH, 0);
      rect(timelineX, 0, timelineW, timelineH);
    }
    pop();


    for(let j=0; j<3; j++){
      for(let i=0; i<16; i++){

        if(this.noteEditMode && i=== this.selectedTimelineElement) fill(185, 200, 85);

        if(
          mouseX > width/2+(timelineX+i*beatW)*this.camScaleX
          && mouseX < width/2+(timelineX+(i+1)*beatW)*this.camScaleX
          && mouseY > height/2+(timelineY+(j)*timelineH)*this.camScaleY
          && mouseY < height/2+(timelineY+(j+1)*timelineH)*this.camScaleY


        ){
          //fill(255, 0, 0);
          this.hoveredTimeline = j;
          this.hoveredElement = i;

          if(this.editModeCancelled){
            this.noteEditMode = false;
            this.editModeCancelled = false;
          }

          if(mouseIsPressed && !this.noteEditMode){


            this.noteEditMode = true;
            this.selectedTimelineElement = i;
            this.selectedTimeline = j;



            console.log("\n edit mode start. timeline is "+this.selectedTimeline+", element is "+this.selectedTimelineElement);
            // clicked on timeline element i

          }
        }
      }
    }

    if (
      mouseX < width/2+(timelineX)*this.camScaleX
      && mouseX > width/2+(timelineX+(17)*beatW)*this.camScaleX
      && mouseY < height/2+(timelineY)*this.camScaleY
      && mouseY >height/2+(timelineY+(4)*timelineH)*this.camScaleY
    ){
      this.hoveredTimeline = -1;
      this.hoveredElement = -1;
    }
    push();
    translate(timelineX, 0, 0);
    for(let i=0; i<16; i++){
      for(let h=0; h<3; h++){
        fill(255);
        push();

        if(!this.noteEditMode) {
          if(this.timelines[h][i]<0){
            fill(255);
          }
          else {
            fill(255, 100, 100);
          }
        }

        if(this.timelines[h][i]!=-1) fill(45, 145, 12);

        if(this.hoveredTimeline===h && this.hoveredElement === i ){
          fill(255, 100, 100);
        }

        if(this.selectedTimeline===h && this.selectedTimelineElement === i){
          fill(255, 0, 0);
        }




        translate(i*beatW, (h+2)*timelineH, 0);
        strokeWeight(1);
        rect(0, 0, beatW, timelineH);
        if(i%4===0){
          strokeWeight(3);
          line(-beatW/8, 0, beatW/8, timelineH);

        }

        pop();
      }
    }
    pop();
    fill(85, 85, 185);
    this.timeIndicatorY = timelineH;
    rect(-timelineW/2 + (this.timeIndicatorX-1)*beatW, this.timeIndicatorY, beatW, timelineH);
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
    strokeWeight(1);
    rect(0, 0, keyboardWidth, kbH);

    let noteWidth = keyboardWidth /24;

    for(let i=0; i<24; i++){

      fill(255);

      let thiskey = i%12;
      if(thiskey===1||thiskey===3||thiskey===6||thiskey===8||thiskey===10) fill(0);

      if(
        this.noteEditMode
        && i === this.timelines[this.selectedTimeline][ this.selectedTimelineElement ]
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
          this.timelines[this.selectedTimeline][ this.selectedTimelineElement ] = i;
          this.selectedTimeline = -1;
          this.selectedTimelineElement = -1;

          console.log("\nset timeline element "+this.selectedTimelineElement+" to value "+i);
        }
      }
      else {
        if (mouseIsPressed && this.noteEditMode){
        this.timelines[this.selectedTimeline][ this.selectedTimelineElement ] = -1;
        this.editModeCancelled = true;
          fill(12, 35, 145);
        }
      }
      rect(i*noteWidth, 0, noteWidth, kbH);
    }
    pop();
  }
}
