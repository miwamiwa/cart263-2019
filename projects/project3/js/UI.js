class UI{

  constructor(){
    // panel size
    this.w = width*6;
    this.h = height*6;

    // knobs and such
    this.sliders = [];
    this.pads = [];
    this.knobIndex =0;

    // music timeline:
    this.noteEditMode = false;
    this.editModeCancelled = false;
    this.selectedTimelineElement = -1;
    this.selectedTimeline =-1;
    this.hoveredTimeline =-1;
    this.hoveredElement = -1;
    this.timeIndicatorX = 0;
    this.timeIndicatorY = 0;
    this.beats = 16;
    this.timelineW = this.w/2;
    this.timelineX = -this.timelineW/2;
    this.timelineY = this.h*0.42;
    this.timelineH = this.h/32;
    this.beatW = this.timelineW/this.beats;

    // create music note arrays
    this.timelines = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.timelines[i] = new Array(16);
      for(let j=0; j<16; j++){
        this.timelines[i][j] = -1;
      }
    }

    // create sliders and XY-pads
    this.setupKnobs();
  }

  // setupknobs()
  //
  // create sliders and xy-pad objects.

  setupKnobs(){

    // create first column of xy pads
    for (let i=0;i<3; i++){
      this.pads.push(new XYPad(10, 10+i*160, this.knobIndex));
      this.knobIndex++;
    }

    // create second column of xy pads
    for (let i=0;i<3; i++){
      this.pads.push(new XYPad(160, 10+i*160, this.knobIndex));
      this.knobIndex++;
    }

    // create sliders
    for (let i=0;i<3; i++){
      this.sliders.push(new Slider(10+i*80, 490, this.knobIndex));
      this.knobIndex++;
    }
  }

  // displayknobs()
  //
  // a function to display all knobs, used in draw()

  displayKnobs(){

    for(let i=0; i<6; i++){
      this.pads[i].display();
    }
    for(let i=0; i<3; i++){
      this.sliders[i].display();
    }
  }

  // checkknobs()
  //
  // check knobs for mouse interaction,
  // update game parameters tied to knobs.

  checkKnobs(type){
    for(let i=0; i<6; i++){
      this.pads[i].checkMouse(type);
      this.pads[i].getValue();
    }
    for(let i=0; i<3; i++){
      this.sliders[i].checkMouse(type);
      this.sliders[i].getValue();
    }
  }

  // displaybackground()
  //
  // display panel behind the dancer and knobs

  displayBackground(){

    push();
    fill(255, 125);
    rotateX(0.078*PI);
    translate(-this.w/2, -7*this.h/16, -200);
    stroke(185, 125);
    rect(0, 0, this.w, this.h);
    pop();
  }

  // displaymusiceditor()
  //
  // a function to display both keyboard and timeline, called in draw().

  displayMusicEditor(){

    push();
    rotateX(0.078*PI);
    this.displayKeyboard();
    this.updateTimeline();
    this.displayTimeline();
    pop();
  }

  // updatetimeline()
  //
  // check for mouse interaction with the timeline

  updateTimeline(){

    for(let j=0; j<3; j++){
      for(let i=0; i<this.beats; i++){

        if(this.noteEditMode && i=== this.selectedTimelineElement) fill(185, 200, 85);

        if(
          mouseX > width/2+(this.timelineX+i*this.beatW)
          && mouseX < width/2+(this.timelineX+(i+1)*this.beatW)
          && mouseY > height/2+(this.timelineY+(j)*this.timelineH)
          && mouseY < height/2+(this.timelineY+(j+1)*this.timelineH)
        ){

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

            if(mouseButton===RIGHT){

              this.noteEditMode = false;
              this.timelines[j][i] = -1;
              this.selectedTimelineElement = -1;
              this.selectedTImeline = -1;
            }
          }
        }
      }
    }

    if (
      mouseX < width/2+(this.timelineX)
      && mouseX > width/2+(this.timelineX+(this.beats+1)*this.beatW)
      && mouseY < height/2+(this.timelineY)
      && mouseY >height/2+(this.timelineY+(4)*this.timelineH)
    ){
      this.hoveredTimeline = -1;
      this.hoveredElement = -1;
    }
  }

  // displaytimeline()
  //
  // pick appropriate colours for timeline elements,
  // then display the timeline

  displayTimeline(){

    push();
    translate(0, this.timelineY, 0);
    push();
    translate(this.timelineX, 0, 0);

    for(let i=0; i<this.beats; i++){
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

        if(
          this.selectedTimeline===h
          && this.selectedTimelineElement === i
          && this.noteEditMode
        ){
          fill(255, 0, 0);
        }

        translate(i*this.beatW, (h)*this.timelineH, 0);
        strokeWeight(1);
        rect(0, 0, this.beatW, this.timelineH);
        if(i%4===0){
          strokeWeight(3);
          line(-this.beatW/8, 0, this.beatW/8, this.timelineH);
          if(h===0) line(-this.beatW/8, -this.timelineH, this.beatW/8, this.timelineH);
        }

        pop();
      }
    }
    pop();
    fill(85, 85, 185);
    this.timeIndicatorY = -this.timelineH;
    rect(-this.timelineW/2 + (this.timeIndicatorX-1)*this.beatW, this.timeIndicatorY, this.beatW, this.timelineH);
    pop();

  }

  displayKeyboard(){
    push();
    fill(255);

    let keyboardWidth = 2*this.w/3;
    let kbX = -keyboardWidth/2;
    let kbY = 0.23*height;
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
        mouseX > width/2+(kbX+i*noteWidth)
        && mouseX < width/2+(kbX+(i+1)*noteWidth)
        && mouseY > height/2+(kbY)
        && mouseY < height/2+(kbY+kbH)
        && this.noteEditMode
      ){
        fill(255, 0, 0);
        if(mouseIsPressed){
          // clicked on note i
          this.timelines[this.selectedTimeline][ this.selectedTimelineElement ] = i;
        }
      }
      else {
        if (mouseIsPressed && this.noteEditMode){
          this.editModeCancelled = true;
          fill(12, 35, 145);
        }
      }
      rect(i*noteWidth, 0, noteWidth, kbH);
    }
    pop();
  }
}
