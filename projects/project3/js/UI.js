/*
UI.js
a monstruous script indeed.
- sets up knobs,
- display knobs,
-  check knobs getvalues, display background, display music editor, update timeline,
display timeline, display keyboard, set knobs
*/

class UI{



  constructor(){

    // panel size
    this.w = window.innerWidth*6;
    this.h = window.innerHeight*6;

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
    this.timelineW = 520;
    this.timelineX = -window.innerWidth/2+30;
    this.timelineY = window.innerHeight/2 - 250;
    this.timelineH = 30;
    this.beatW = this.timelineW/this.beats;

    // keyboard:
    this.kb = {
      w: 400,
      x: 0,
      y: 0,
      z: 0,
      h: 70
    }
    this.kb.x= 50;
    this.kb.y = window.innerHeight/2 - 230;
    this.noteWidth = this.kb.w /24;

    // create music note arrays
    this.timelines = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.timelines[i] = new Array(16);
      for(let j=0; j<16; j++){
        this.timelines[i][j] = -1;
      }
    }
      //default timelines:
    this.timelines[1] =  [0, -1, -1, 0, -1, -1, 0, -1, -1, -1, 3, -1, 5, -1, 3, -1];
    this.timelines[2] = [0, -1, 22, -1, 14, 0, -1, -1, 0, -1, 22, -1, 12, 15, 18, -1];

    // click to start sound
    positionText(window.innerWidth*0.405 , window.innerHeight*0.5, "#instructions");
    // edit synths
    positionText(window.innerWidth*0.16, window.innerHeight*0.2, "#instruct1");
    // edit dancing
    positionText(window.innerWidth-window.innerWidth*0.28, window.innerHeight*0.2, "#instruct2");
    // use timeline and keyboard
    positionText(window.innerWidth*0.435, window.innerHeight*0.67, "#instruct3");
    // capture photo
    positionText(window.innerWidth*0.395, window.innerHeight*0.01, "#instruct4");
    this.text1Active = true;
    this.text2Active = true;
    this.text3Active = true;

    // create sliders and XY-pads
    this.setupKnobs();
  }






  // setupknobs()
  //
  // create sliders and xy-pad objects.

  setupKnobs(){

    let innerW = window.innerWidth;
    let innerH = window.innerHeight;
    let padsX = innerW/7;
    let sliderX = innerW/12;
    let padsY = 500;
    let padsMargin = 30;
    let padSize = innerH/12;
    let sliderW = innerW/48;

    for (let i=0;i<3; i++){  // create first column of xy pads
      this.pads.push(new XYPad(30+this.pads.length*(padSize+20), padsY, this.knobIndex, i, padSize ));
      this.knobIndex++;
    }
    for (let i=0;i<3; i++){  // create second column of xy pads
      this.pads.push(new XYPad(30+this.pads.length*(padSize+20), padsY, this.knobIndex, i+3, padSize  ));
      this.knobIndex++;
    }
    for (let i=0;i<2; i++){  // create sliders on the left
      let x = sliderX+i*(sliderW+padsMargin);
      let y = padsY + 3*padSize+4*padsMargin;
      this.sliders.push(new Slider(x, y, this.knobIndex, sliderW, padSize, i));
      this.knobIndex++;
    }
    for (let i=0;i<4; i++){ // create sliders on the right
      let x = innerW-sliderW-(sliderX+i*(sliderW+padsMargin));
      let y = padsY + 3*padSize+4*padsMargin;
      this.sliders.push(new Slider(x, y, this.knobIndex, sliderW, padSize, i+2));
      this.knobIndex++;
    }
    for (let i=0;i<3; i++){ //create third column of xy pads
      this.pads.push(new XYPad(30+100+this.pads.length*(padSize+20), padsY, this.knobIndex, i+6, padSize ));
      this.knobIndex++;
    }
    for (let i=0;i<3; i++){ // create fourth column of xy pads
      let x = 30+100+this.pads.length*(padSize+20);
      let y = padsY;
      this.pads.push(new XYPad(x, y, this.knobIndex, i+9, padSize  ));
      this.knobIndex++;
    }
  }






  // displayknobs()
  //
  // a function to display all knobs, called in draw()

  displayKnobs(){

    push();
    translate(-width/2, -height/2, 0);

    for(let i=0; i<this.pads.length; i++){
      this.pads[i].display();
    }
    for(let i=0; i<this.sliders.length; i++){
      this.sliders[i].display();
    }

    pop();
  }






  // checkknobs()
  //
  // called on mouse events, checks for interaction with knobs
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






  // getvalues()
  //
  // assign each knob's output to its associated game parameter.
  // triggered in setup()

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
  // display background and rotating cubes

  displayBackground(){

    background(25, 15, 55);

    push();
    // rotate a bit to align with camera (camera height is -100)
    rotateX(0.078*PI);

    push();
    // box 1:
    // position
    translate(-width/4, 0, -600);
    // rotate over time
    rotateX( radians(frameCount) );
    rotateZ( radians(frameCount) );
    // stylize
    stroke(185, 50);
    specularMaterial(210, 210, 12, 125);
    // display
    box(width/2);
    pop();

    push();
    // box 2:
    translate(+width/4, 0, -600);
    rotateX( -radians(frameCount*0.6));
    rotateZ(radians(frameCount*0.4));
    specularMaterial(210, 21, 210, 125);
    stroke(185);
    // display
    box(width/2);
    pop();

    push();
    // box 3:
    translate(9, 0, -600);
    rotateX( radians(frameCount*0.3));
    rotateZ(-radians(frameCount*0.4));
    specularMaterial(21, 210, 210, 125);
    stroke(185);
    // display
    box(width/2);
    pop();

    // place transparent grey rect 300px ahead
    translate(0, 0, -300);
    fill(255, 135);
    rect(-width/2, -height/2, width, height);

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
    translate(0,100,0)
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

            if(uiObject.text3Active) {
              uiObject.text3Active = false;
              $("#instruct3").remove();
            }

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
    translate(0, this.timelineY, 400);
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
        if(this.timelines[h][i]!=-1 && h===0) fill(45, 145, 12, 254);
        if(this.timelines[h][i]!=-1 && h===1) fill(145, 45, 12, 254);
        if(this.timelines[h][i]!=-1 && h===2) fill(12, 45, 145, 254);

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
        strokeWeight(4);
        stroke(125, 125)
        // display the timeline element.
        rect(0, 0, this.beatW, this.timelineH);

        // BEAT MARKS:
        // display beat marks on every 4th square on the timeline.
        if(i%4===0){
          strokeWeight(10);
          stroke(45, 200);
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





    // setknobs()
    //
    // set position of all slider and pad knobs after loading a new game
    // or after changing motions
    setKnobs(){

      // select current arm and leg motion
      let whichMove = dude.armMoves[dude.currentMoves];
      let whichMove2 = dude.legMoves[dude.currentMoves];

      // update pads
      this.pads[0].setValue(whichMove.thighOrigin, whichMove.thighDisplacement);
      this.pads[1].setValue(whichMove.thighOrigin2, whichMove.thighDisplacement2);
      this.pads[2].setValue(whichMove.kneeOrigin, whichMove.kneeDisplacement);
      this.pads[3].setValue(whichMove2.thighOrigin, whichMove2.thighDisplacement);
      this.pads[4].setValue(whichMove2.thighOrigin2, whichMove2.thighDisplacement2);
      this.pads[5].setValue(whichMove2.kneeOrigin, whichMove2.kneeDisplacement);
      this.pads[6].setValue(musicObject.release[0], musicObject.attack[0]);
      this.pads[7].setValue(musicObject.filterRes[0], musicObject.filterFreq[0]);
      this.pads[8].setValue(musicObject.delayFeedback[0], musicObject.delayDividor[0]);
      this.pads[9].setValue(musicObject.release[1], musicObject.attack[1]);
      this.pads[10].setValue(musicObject.filterRes[1], musicObject.filterFreq[1]);
      this.pads[11].setValue(musicObject.delayFeedback[1], musicObject.delayDividor[1]);

      // update sliders
      this.sliders[0].setValue(whichMove2.height, 1);
      this.sliders[1].setValue(dude.vigor[dude.currentMoves], 3);
      this.sliders[2].setValue(musicObject.maxAmplitude[0], 3);
      this.sliders[3].setValue(musicObject.maxAmplitude[1], 3);
      this.sliders[4].setValue(musicObject.maxAmplitude[2], 3);
      this.sliders[5].setValue(musicObject.subDivisionLength, 2);
    }



  }
