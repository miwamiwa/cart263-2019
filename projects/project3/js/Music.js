class Music{

  constructor(){
    this.nextTimelineNote = [3];
    this.nextTimelineNote[0] = 0;
    this.nextTimelineNote[1] = 0;
    this.nextTimelineNote[2] = 0;
    this.loopStart = frameCount;
    this.subDivisionLength = 10;
    this.subDivCounter =0;
    this.rootNotes = [60, 24];


  }
  setupInstruments(){

    for (let i=0; i<3; i++){
      switch(i){
        case 0:
        synths[i] = new p5.Oscillator();
        synths[i].setType("sine");
        synths[i].freq(50);
        break;

        case 1: synths[i] = new p5.Oscillator();
        synths[i].setType("square");
        synths[i].freq(50);
        break;

        case 2: synths[i] = new p5.Noise();

        break;
      }

      envelopes[i] = new p5.Envelope();
      envelopes[i].setADSR(0.01, 0.05, 0.01, 0.2);
      envelopes[i].setRange(1, 0);

      synths[i].amp(envelopes[i]);
      synths[i].start();
    }
  }
  
  playMusic(){

    if( frameCount > this.loopStart + this.subDivCounter*this.subDivisionLength){

      this.subDivCounter +=1;
      uiObject.timeIndicatorX +=1;
    }
    // if loop ended, reset loop
    if( frameCount > this.loopStart + 16*this.subDivisionLength){
      this.loopStart = frameCount;
      // set each track's position back to start
      this.nextTimelineNote[0] =0;
      this.nextTimelineNote[1] =0;
      this.nextTimelineNote[2] =0;

      uiObject.timeIndicatorX =0;
      this.subDivCounter =0;
    }

    this.playTimeline(0);
    this.playTimeline(1);
    this.playTimeline(2);
  }

  playTimeline(input){

    //
    if(frameCount === this.loopStart + this.subDivisionLength*this.nextTimelineNote[input]){

      if(uiObject.timelines[input][this.nextTimelineNote[input]]<0){
        while(uiObject.timelines[input][this.nextTimelineNote[input]]===-1){
          this.nextTimelineNote[input] +=1;
          if(this.nextTimelineNote[input]>16) this.nextTimelineNote[input]=0;
        }

      }
      else if(uiObject.timelines[input][this.nextTimelineNote[input]]>=0){

        if(input===0||input===1){
          let rootNote2 = this.rootNotes[input];
          synths[input].freq( midiToFreq( rootNote2 + uiObject.timelines[input][this.nextTimelineNote[input]]));
        }

        envelopes[input].play();
        this.nextTimelineNote[input] +=1;

        while(uiObject.timelines[input][this.nextTimelineNote[input]]===-1){
          this.nextTimelineNote[input] +=1;
          if(this.nextTimelineNote[input]>16) this.nextTimelineNote[input]=0;
        }

      }
    }
  }
}
