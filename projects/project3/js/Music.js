/*
Music.js
This class handles creating instruments and playing them using the notes
which the user entered in the uiObject.timelines.
*/


class Music{


  constructor(){
    // p5.soun objects
    this.envelopes = [3];
    this.synths = [3];
    this.filters = [3];
    this.delays = [3];
    this.drumSynth;
    this.drumSynthFilter;
    // values tied to xy pads
    this.attack = [0.1, 0.1];
    this.release = [0.1, 0.1];
    this.filterFreq = [400, 400];
    this.filterRes = [10, 10];
    this.delayDividor = [0.1, 0.1];
    this.delayFeedback = [0.2, 0.2];
    this.maxAmplitude = [0.5, 0.5, 0.5]
    // music playing
    this.nextTimelineNote = [3];
    this.nextTimelineNote[0] = 0;
    this.nextTimelineNote[1] = 0;
    this.nextTimelineNote[2] = 0;
    this.loopStart = frameCount;
    this.subDivisionLength = 5;
    this.subDivCounter =0;
    this.rootNotes = [60, 24, 0];
  }






  // setupinstruments()
  //
  // create the appropriate p5.sound object for each synth,
  // create and connect each envelope, filter and delay, then start sound.

  setupInstruments(){

    // --------------- setup drums: -----------------

    // create noise synth:
    this.filters[2] = new p5.HighPass();
    this.synths[2] = new p5.Noise();
    this.envelopes[2] = new p5.Envelope();
    // setup amplitude envelope
    this.envelopes[2].setADSR(0.01, 0.05, 0.3*this.maxAmplitude[2], 0.4);
    this.envelopes[2].setRange(this.maxAmplitude[2], 0);
    this.synths[2].amp(this.envelopes[2]);
    // setup filter
    this.synths[2].disconnect();
    this.synths[2].connect(this.filters[2]);
    // start sound
    this.synths[2].start();
    // setup delay
    this.delays[2] = new p5.Delay();
    this.delays[2].amp(1);
    this.delays[2].process(this.synths[2], 0.3, 0.55);

    // add an ocsillator to add some kick to the lower notes
    this.drumSynth = new p5.Oscillator();
    this.drumSynth.setType("square");
    this.drumSynth.freq(100);
    // filter out high tones
    this.drumSynthFilter = new p5.LowPass();
    this.drumSynthFilter.freq(100);
    this.drumSynthFilter.res(10);
    this.drumSynth.amp(this.envelopes[2]);
    // connect filter
    this.drumSynth.disconnect();
    this.drumSynth.connect(this.drumSynthFilter);
    // start sound
    this.drumSynth.start();


    // --------------- setup synth and bass: ------------------

    // create sine wave synth
    this.synths[0] = new p5.Oscillator();
    this.synths[0].setType("triangle");
    this.synths[0].freq(50);

    // create square wave bass
    this.synths[1] = new p5.Oscillator();
    this.synths[1].setType("square");
    this.synths[1].freq(50);

    for (let i=0; i<2; i++){
      // setup envelopes
      this.envelopes[i] = new p5.Envelope();
      this.envelopes[i].setADSR(this.attack[i], 0.15, 0.01, this.release[i]);
      this.envelopes[i].setRange(this.maxAmplitude[i], 0);
      // setup filters
      this.filters[i] = new p5.LowPass();
      this.filters[i].freq( this.filterFreq[i] );
      this.filters[i].res( this.filterRes[i] );
      this.synths[i].disconnect();
      this.synths[i].connect(this.filters[i]);
      // setup delays
      this.delays[i] = new p5.Delay();
      this.delays[i].process(this.filters[i], 0.2, 0.4);
      this.synths[i].amp(this.envelopes[i]);
      // start sound
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

      // ------ if there ISN'T a note value at this point in the timeline
      if(uiObject.timelines[input][this.nextTimelineNote[input]]<0){
        // repeat checking the next timeline element for a note value
        // until the next note on the timeline is found. that is the next
        // point which will be checked.
        let maxReached = false;
        while(uiObject.timelines[input][this.nextTimelineNote[input]]===-1 && !maxReached){
          this.nextTimelineNote[input] +=1;
          // if there are no notes, stop checking until next loop.
          if(this.nextTimelineNote[input]>16) {
            this.nextTimelineNote[input]=0;
            maxReached = true;
          }
        }
      }

      // ----- if there IS a note value at this point
      else if(uiObject.timelines[input][this.nextTimelineNote[input]]>=0){

        // note value (scale 0-24) of next note to play
        let noteValue = uiObject.timelines[input][this.nextTimelineNote[input]];

        // --- if input is synth or bass ---
        if(input!=2){
          // convert next note value to a frequency value
          let freq = midiToFreq( this.rootNotes[input] + noteValue);
          // set frequency
          this.synths[input].freq( freq );
          // update delay time and feedback
          this.delays[input].delayTime(this.delayDividor[input]);
          this.delays[input].feedback(this.delayFeedback[input]);
          // play envelope
          this.envelopes[input].play();
        }

        // --- if input is drums ---
        else {

          // get filter frequency
          if(noteValue===0) noteValue=1; // must be at least 1
          let freq = (1+noteValue)*noteValue*20;
          // setup filter
          this.filters[2].freq(freq);
          this.filters[2].res(25);
          this.drumSynth.freq(map(noteValue, 0, 25, 20, 500));
          // setup delay
          let delay = map((noteValue)/24, 0, 1.1, 56, 0.01)/5000;
          this.delays[2].delayTime(delay);
          // play envelope
          this.envelopes[2].play();
        }

        // once note is played:

        // increment next point to check by 1
        this.nextTimelineNote[input] +=1;

        // if there isn't a note value at that point, check the next
        // point on the timeline until the next note is found.
        let maxReached = false;
        while(uiObject.timelines[input][this.nextTimelineNote[input]]===-1 && !maxReached){
          this.nextTimelineNote[input] +=1;

          // if there are no notes, prevent checking until next loop.
          if(this.nextTimelineNote[input]>16){
            maxReached = true;
            this.nextTimelineNote[input]=0;
          }
        }
      }
    }
  }
}
