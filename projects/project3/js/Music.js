class Music{

  constructor(){

    this.envelopes = [3];
    this.synths = [3];
    this.filters = [3];
    this.delays = [3];
    this.attack = [0.1, 0.1];
    this.release = [0.1, 0.1];
    this.filterFreq = [100, 100];
    this.filterRes = [10, 10];
    this.delayDividor = [0.5, 0.5];
    this.delayFeedback = [0.5, 0.5];

    this.nextTimelineNote = [3];
    this.nextTimelineNote[0] = 0;
    this.nextTimelineNote[1] = 0;
    this.nextTimelineNote[2] = 0;
    this.loopStart = frameCount;
    this.subDivisionLength = 3;
    this.subDivCounter =0;
    this.rootNotes = [60, 24, 0];
    this.drumDS = [0.15, 0.3];


  }

  // setupinstruments()
  //
  // create the appropriate p5.sound object for each synth,
  // create and connect each envelope
  // start sound

  setupInstruments(){

    // create sine wave synth
    this.synths[0] = new p5.Oscillator();
    this.synths[0].setType("triangle");
    this.synths[0].freq(50);

    // create square wave synth
    this.synths[1] = new p5.Oscillator();
    this.synths[1].setType("square");
    this.synths[1].freq(50);

    // create noise synth
    this.filters[2] = new p5.HighPass();
    this.synths[2] = new p5.Noise();

    this.envelopes[2] = new p5.Envelope();
    this.envelopes[2].setADSR(0.01, 0.05, 0.3, 0.4);
    this.envelopes[2].setRange(0.25, 0);
    this.synths[2].amp(this.envelopes[2]);
    this.synths[2].disconnect();
    this.synths[2].connect(this.filters[2]);
    this.synths[2].start();
    this.delays[2] = new p5.Delay();
    this.delays[2].amp(1);
    this.delays[2].process(this.synths[2], 0.1, 0.35);



    for (let i=0; i<2; i++){
      this.delays[i] = new p5.Delay();
      this.envelopes[i] = new p5.Envelope();
      this.envelopes[i].setADSR(this.attack[i], 0.15, 0.01, this.release[i]);
      this.envelopes[i].setRange(0.5, 0);
      this.filters[i] = new p5.LowPass();
      this.filters[i].freq( this.filterFreq[i] );
      this.filters[i].res( this.filterRes[i] );

      this.synths[i].disconnect();
      this.synths[i].connect(this.filters[i]);
      this.delays[i].process(this.filters[i], 0.2, 0.4);
      this.synths[i].amp(this.envelopes[i]);

      this.synths[i].start();
    }
  }

  // playmusic()
  //
  // manages the music loop:
  // plays each timeline, resets the loop
  // and keeps track of the current subdivision.

  playMusic(){

    // if frameCount has reached the next subdivision
    if( frameCount > this.loopStart + this.subDivCounter*this.subDivisionLength){
      // count subdivisions played so far
      this.subDivCounter +=1;
      // move time indicator by one unit
      uiObject.timeIndicatorX +=1;
    }

    // if loop ended
    if( frameCount > this.loopStart + 16*this.subDivisionLength){
      // new loop start time
      this.loopStart = frameCount;
      // set each track's note-value-check position back to start
      // (see playtimeline() description)
      this.nextTimelineNote[0] =0;
      this.nextTimelineNote[1] =0;
      this.nextTimelineNote[2] =0;
      // reset subdivision counter and time indicator position
      uiObject.timeIndicatorX =0;
      this.subDivCounter =0;
    }
    // play each timeline
    this.playTimeline(0);
    this.playTimeline(1);
    this.playTimeline(2);
  }

  // playtimeline()
  //
  // play a given timeline:
  // rather than checking for notes at every point on the timeline, this function
  // will find the next non-null note to play ONLY once a note has been played, OR
  // if the loop was reset and the first point on the timeline is empty.
  // in a nutshell:
  // if there is a note to play, play it
  // if there isn't, find the next note to play and standby until then

  playTimeline(input){

    // if this frame is the start the next subdivision that should be checked
    // for this timeline
    if(frameCount === this.loopStart + this.subDivisionLength*this.nextTimelineNote[input]){

      // if there is no note value at this point in the timeline
      if(uiObject.timelines[input][this.nextTimelineNote[input]]<0){
        // repeat checking the next timeline element for a value
        // until the next note on the timeline is found. that is the next
        // point which will be checked.
        let maxReached = false;
        while(uiObject.timelines[input][this.nextTimelineNote[input]]===-1 && !maxReached){
          this.nextTimelineNote[input] +=1;
          // if there are no notes, stop checking and check again next loop.
          if(this.nextTimelineNote[input]>16) {
            this.nextTimelineNote[input]=0;
            maxReached = true;
          }
        }
      }
      // if there is a note value at this point
      else if(uiObject.timelines[input][this.nextTimelineNote[input]]>=0){

        let noteValue = uiObject.timelines[input][this.nextTimelineNote[input]];
        // if this isn't the noise synth, set frequency
        if(input!=2){
          let freq = midiToFreq( this.rootNotes[input] + noteValue);
          this.synths[input].freq( freq );
      
          this.delays[input].delayTime(this.delayDividor[input]);
          this.delays[input].feedback(this.delayFeedback[input]);
          // start playing envelope
          this.envelopes[input].play();
        }
        else {
          if(noteValue===0) noteValue=1;
          let freq = (noteValue)*noteValue*20;
          this.filters[2].freq(freq);
          this.filters[2].res(30);
          let delay = map((noteValue)/24, 0, 1.1, 56, 0.01)/5000;
          this.delays[2].delayTime(delay);
          this.envelopes[2].play();
        }

        // increment next point to check by 1
        this.nextTimelineNote[input] +=1;
        // if there isn't a note value at that point, check the next
        // point on the timeline until the next note is found.
        let maxReached = false;
        while(uiObject.timelines[input][this.nextTimelineNote[input]]===-1 && !maxReached){
          this.nextTimelineNote[input] +=1;
          // if there are no notes, stop and check again next loop.
          if(this.nextTimelineNote[input]>16){
            maxReached = true;
            this.nextTimelineNote[input]=0;
          }
        }
      }
    }
  }
}
