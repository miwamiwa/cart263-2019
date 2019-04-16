class UI{

  constructor(){
    // panel size
    this.w = width*6;
    this.h = height*6;

    this.padTitles = [ "thigh1", "thigh2", "knee","thigh1", "thigh2", "knee","attack/release", "filter freq/res", "delay feedback/time","attack/release", "filter freq/res", "delay feedback/time" ];

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

    // keyboard:
    this.kb = {
      w: 2*this.w/3,
      x: 0,
      y: 0,
      z: 100,
      h: this.h/8
    }
    this.kb.x= -this.kb.w/2;
    this.kb.y = 0.23* this.h;
    this.noteWidth = this.kb.w /24;

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
      this.pads.push(new XYPad(10, i, this.knobIndex, i ));
      this.knobIndex++;
    }

    // create second column of xy pads
    for (let i=0;i<3; i++){
      this.pads.push(new XYPad(120, i, this.knobIndex, i+3 ));
      this.knobIndex++;
    }

    // create sliders
    for (let i=0;i<2; i++){
      this.sliders.push(new Slider(100+i*80, 460, this.knobIndex));
      this.knobIndex++;
    }

    // create sliders
    for (let i=0;i<3; i++){
      this.sliders.push(new Slider(80+i*40, 460, this.knobIndex));
      this.knobIndex++;
    }

    for (let i=0;i<3; i++){
      this.pads.push(new XYPad(-120, i, this.knobIndex, i+6 ));
      this.knobIndex++;
    }
    for (let i=0;i<3; i++){
      this.pads.push(new XYPad(-240, i, this.knobIndex, i+9 ));
      this.knobIndex++;
    }
  }

  placeUI(){

    for(let i=0; i<3; i++){
      this.sliders[i+2].x = width - (100+i*80);
      this.sliders[i+2].valueX =this.sliders[i+2].x+this.sliders[i+2].w/2;
    }

    for(let i=0; i<6; i++){
      let margin = this.pads[i+6].x;
      console.log(margin);
      this.pads[i+6].x += width -160;

      let selector = i+6;
      let idName = "#pad"+selector;
      positionText(this.pads[i+6].x, this.pads[i+6].y, idName);
    }
  }

  // displayknobs()
  //
  // a function to display all knobs, used in draw()

  displayKnobs(){

    for(let i=0; i<this.pads.length; i++){
      this.pads[i].display();
    }
    for(let i=0; i<this.sliders.length; i++){
      this.sliders[i].display();
    }
  }

  // checkknobs()
  //
  // check knobs for mouse interaction,
  // update game parameters tied to knobs.
  // types of interaction: mouse pressed, dragged, or released.

  checkKnobs(type){
    for(let i=0; i<this.pads.length; i++){
      this.pads[i].checkMouse(type);
      this.pads[i].getValue();
    }
    for(let i=0; i<this.sliders.length; i++){
      this.sliders[i].checkMouse(type);
      this.sliders[i].getValue();
    }
  }


  getValues(){
    for(let i=0; i<this.pads.length; i++){
      this.pads[i].getValue();
    }
    for(let i=0; i<this.sliders.length; i++){
      this.sliders[i].getValue();
    }
  }

  // displaybackground()
  //
  // display panel behind the dancer and knobs

  displayBackground(){

    push();
    specularMaterial(250, 125);
    rotateX(0.078*PI);
    push();
    translate(-this.w/2, -1*this.h/16, -400);
    stroke(185, 50);
    rotateX( radians(frameCount));
    rotateZ(radians(frameCount));
    box(800);
    pop();

    push();
    translate(+this.w/2, 1*this.h/16, -400);
    stroke(185);
    rotateX( radians(frameCount*0.6));
    rotateZ(radians(frameCount*0.4));
    box(800);
    pop();

    push();
    translate(9, -1*this.h/16, -400);
    stroke(185);
    rotateX( radians(frameCount*0.3));
    rotateZ(radians(frameCount*0.4));
    box(800);
    pop();

    translate(0, 0, -300);
    fill(0, 205);
    rect(-width/2, -height/2, width, height);
    if(!soundStarted) positionText(250, height*0.65, "#instructions");
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
  // check for mouse interaction with the timeline:
  // mark squares on the timeline as being selected, hovered or
  // currently edited. delete note values on right-click.
  // start and stop edit mode which allows the user to update this square's
  // note value using the keyboard as input.

  updateTimeline(){

    // for each row
    for(let j=0; j<3; j++){
      // for each square on each row
      for(let i=0; i<this.beats; i++){

        // if mouse is hovering over this square
        if(
          mouseX > width/2+(this.timelineX+i*this.beatW)
          && mouseX < width/2+(this.timelineX+(i+1)*this.beatW)
          && mouseY > height/2+(this.timelineY+(j)*this.timelineH)
          && mouseY < height/2+(this.timelineY+(j+1)*this.timelineH)
        ){

          // mark the square as being hovered
          this.hoveredTimeline = j;
          this.hoveredElement = i;

          // if edit mode was cancelled (in the last frame),
          // stop edit mode now. stopping it here avoids certain bugs.
          if(this.editModeCancelled){
            this.noteEditMode = false;
            this.editModeCancelled = false;
          }

          // if mouse was clicked and edit mode not yet activated
          if(mouseIsPressed && !this.noteEditMode){
            // start edit mode
            this.noteEditMode = true;
            // mark this square as the selected square
            this.selectedTimelineElement = i;
            this.selectedTimeline = j;

            // if this was a right click
            if(mouseButton===RIGHT){
              // stop edit mode
              this.noteEditMode = false;
              // remove this square's note value
              this.timelines[j][i] = -1;
              // deselect this square
              this.selectedTimelineElement = -1;
              this.selectedTImeline = -1;
            }
          }
        }
      }
    }

    // if mouse is not hovering over the timeline,
    // remove the hovered-element marker.
    if (
      mouseX < width/2+(this.timelineX)
      || mouseX > width/2+(this.timelineX+(this.beats+1)*this.beatW)
      || mouseY < height/2+(this.timelineY)
      || mouseY >height/2+(this.timelineY+(4)*this.timelineH)
    ){
      this.hoveredTimeline = -1;
      this.hoveredElement = -1;
    }
  }

  // displaytimeline()
  //
  // pick appropriate colours for timeline elements,
  // then display the timeline squares, beatmarks, and the time
  // indicator over

  displayTimeline(){

    // move to timeline's x, y position
    push();
    translate(0, this.timelineY, 0);
    push();
    translate(this.timelineX, 0, 0);

    // for each square
    for(let i=0; i<this.beats; i++){
      // on each row
      for(let h=0; h<3; h++){

        // default fill is white
        fill(255);
        push();

        // if this square's note value isn't null, give it this row's colour
        if(this.timelines[h][i]!=-1 && h===0) fill(45, 145, 12);
        if(this.timelines[h][i]!=-1 && h===1) fill(145, 45, 12);
        if(this.timelines[h][i]!=-1 && h===2) fill(12, 45, 145);

        // if this is the hovered element, use a light red
        if(this.hoveredTimeline===h && this.hoveredElement === i ){
          fill(255, 100, 100);
        }

        // if this is the selected element and edit note is active (meaning
        // the note wasn't deleted), colour it bright red
        if(
          this.selectedTimeline===h
          && this.selectedTimelineElement === i
          && this.noteEditMode
        ){
          fill(255, 0, 0);
        }

        // move to this square's x, y position
        translate(i*this.beatW, (h)*this.timelineH, 0);
        strokeWeight(1);
        // display the timeline element.
        rect(0, 0, this.beatW, this.timelineH);

        // BEAT MARKS:
        // display beat marks on every 4th square on the timeline.
        if(i%4===0){
          strokeWeight(3);
          line(-this.beatW/8, 0, this.beatW/8, this.timelineH);
          // display an extra beat mark on top of the timeline,
          // so we can tell where the time indicator lies within the measure.
          if(h===0) line(-this.beatW/8, -this.timelineH, this.beatW/8, this.timelineH);
        }
        pop();
      }
    }

    // display time indicator above the grid
    pop();
    fill(85, 85, 185);
    this.timeIndicatorY = -this.timelineH;
    let timeIndicatorX = -this.timelineW/2 + (this.timeIndicatorX-1)*this.beatW;
    rect(timeIndicatorX, this.timeIndicatorY, this.beatW, this.timelineH);
    pop();
  }

  // displaykeyboard()
  //
  // check for mouse interaction with keyboard,
  // colour and display keys/rectangles accordingly

  displayKeyboard(){

    push();
    translate(this.kb.x, this.kb.y, this.kb.z);
    stroke(125, 125);
    strokeWeight(4);

    // for each note on the keyboard
    for(let i=0; i<24; i++){

      // if edit mode is active and mouse is hovering over this key
      if(
        mouseX > width/2+(this.kb.x+i*this.noteWidth)
        && mouseX < width/2+(this.kb.x+(i+1)*this.noteWidth)
        && mouseY > height/2+(this.kb.y)
        && mouseY < height/2+(this.kb.y+this.kb.h)
        && this.noteEditMode
      ){
        // set fill to red
        fill(255, 0, 0);

        // if mouse is pressed on this key
        if(mouseIsPressed){
          // assign this note's value to the selected timeline element
          this.timelines[this.selectedTimeline][ this.selectedTimelineElement ] = i;
          this.editModeCancelled = true;
        }
      }

      // if mouse ISN'T hovering over the keyboard or edit mode isn't active
      else {
        // default fill is white
        fill(255);

        // find black keys and set fill to black
        let thisKey = i%12;
        if(thisKey===1||thisKey===3||thisKey===6||thisKey===8||thisKey===10) fill(12, 12, 45);

        // if edit mode is active and this timeline element already has a note
        // value, and if the said value matches this key's value,
        // colour this key blue.
        if(
          this.noteEditMode
          && i === this.timelines[this.selectedTimeline][ this.selectedTimelineElement ]
        ){
          fill(12, 35, 145);
        }
      }

      // display this key
      rect(i*this.noteWidth, 0, this.noteWidth, this.kb.h);
    }
    pop();

    // if mouse is pressed off-keyboard while edit mode is active,
    // stop edit mode.

    if(
      (  mouseX < width/2+this.kb.x
        || mouseX > width/2+this.kb.x+24*this.noteWidth
        || mouseY < height/2+this.kb.y
        || mouseY > height/2+this.kb.y+this.kb.h )
        && mouseIsPressed
        && this.noteEditMode
      ){
        this.noteEditMode = false;
      }
    }
  }
