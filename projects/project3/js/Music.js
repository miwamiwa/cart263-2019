class Music{

  constructor(){
    this.nextTimelineNote = [3];
    this.nextTimelineNote[0] = 0;
    this.nextTimelineNote[1] = 0;
    this.nextTimelineNote[2] = 0;
    this.loopStart = frameCount;
    this.subDivisionLength = 5;


  }
  playMusic(){

    // if loop ended, reset loop
    if( frameCount > this.loopStart + 16*this.subDivisionLength){
      this.loopStart = frameCount;
      // set each track's position back to start
      this.nextTimelineNote[0] =0;
      this.nextTimelineNote[1] =0;
      this.nextTimelineNote[2] =0;
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
        console.log("\nplink")
        let rootNote2 = 48;
        synths[input].freq( midiToFreq( rootNote2 + uiObject.timelines[input][this.nextTimelineNote[input]]));
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
