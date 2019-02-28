class Channel{

  constructor( channelIndex ){
    this.index = channelIndex;
    this.channelName = "channel name";
    this.badness = Math.floor( Math.random()*3+1 );

    // channel types: good (0), bads (1), copycat (2)
    this.type = Math.floor( Math.random()*3 );
    if(this.type===0)
    this.typeClass = "goodhuman";
    if(this.type===1)
    this.typeClass = "badhuman";
    if(this.type===2)
    this.typeClass = "copycat";

    console.log("channel type: "+ this.type + ", bad lvl "+this.badness);
  // this.type = 2;
    // need a var for channel human or copycat
    // need a var for human channel goodness

    // make the channel a hidden div,
    // so that we can retrieve info easily using its ID.
    // there is a class which indicates whether the channel is active or not (might be useful at some point).
    // div channel1 contains the channel name (its html content), and div vids1.

    $("body").append(
      "<div class='activeChannel "+this.typeClass+"' id='channel"+channelIndex+"' hidden>"+this.channelName+"<div id='vids"+channelIndex+"'></div></div>"
    );
  }

  display(){

  }
}
