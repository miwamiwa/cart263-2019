/*
MR. PARROT
*/

"use strict";

let mrParrot;
let startingChannels =3;
let channels = [];
let lastChannelIndex =0;
let dayLength = 1000;

$(document).ready(preload);

function preload(){

  $("html").click(setup);
}

function setup(){

  // remove preload
  $("html").off();
  $("#preload").remove();

  // setup parrot
  mrParrot = new Parrot();
  $("#parrot").on("click", parrotTalk);

  // setup channels
  for (let i=0; i<startingChannels; i++){

    channels.push(new Channel(  lastChannelIndex ));
    lastChannelIndex +=1;
  }

  // produce videos
  setInterval(selectAllChannels, dayLength);
}

function parrotTalk(){

  mrParrot.saySomething();
}

function selectAllChannels(){

  $(".activeChannel").each(produceVideos);
}

function produceVideos(){

  let videoWords = produceWords($(this).attr('id'));
  let videoElement = "<div class='videoElement' id='video"+this.length+"' hidden>"+videoWords+"</div>"
  $(this).append(videoElement);

}

function produceWords( whichChannel ){

  // get channel #
  let nameLength = whichChannel.length;
  let channelIndex = whichChannel.substring(7, nameLength);

  let result = "";
  let amountOfWords = 10;
  let goodWordsLength = goodWords.length;
  let badWordsLength = badWords.length;

  // if good human channel
  if(channels[channelIndex].type === 0){

    for(let i=0; i<amountOfWords; i++){

      let randomIndex = Math.floor( Math.random()*goodWordsLength );
      result += goodWords[randomIndex]+" ";
    }
  }

  // if bad human channel
  // throw in one bad word
  // chance
  if(channels[channelIndex].type === 1){

    let whichAreBad = [];
    for(let i=0; i<channels[channelIndex].badness; i++){

      whichAreBad.push(Math.floor( Math.random()*amountOfWords ));
    }
    console.log(channels[channelIndex].badness);

    for( let i=0; i<amountOfWords; i++ ){
for (let j=0; j<whichAreBad.length; j++){

      if( i===whichAreBad[j] ){

      let randomIndex = Math.floor( Math.random()*badWordsLength );
      result += badWords[randomIndex]+" ";
    }
    else {

      let randomIndex = Math.floor( Math.random()*goodWordsLength );
      result += goodWords[randomIndex]+" ";
    }
    }
  }
}

  // if copycat channel
  if(channels[channelIndex].type === 2){

  let videoContents="";
  let totalVideos;
  let randomVideo;
  let innerText;

  while(videoContents===""){

  // get number of videos
   totalVideos = $( ".videoElement" ).length;
  // pick a random video
  randomVideo = Math.floor( Math.random()*totalVideos );
  // get its contents
  innerText = $( ".videoElement" ).eq( randomVideo ).text();
  if(innerText!=""){
    videoContents = innerText;
  }else {
    console.log("yo")
  }
}

  // alter text
  let splitContents = videoContents.split(" ");
  let randomPick = Math.floor( Math.random() * splitContents.length );
  let randomWord;
  if(Math.random()<0.5){
    let whichWord = Math.floor( Math.random()* goodWordsLength);
    randomWord = goodWords[whichWord];
  }
  else {
    let whichWord = Math.floor( Math.random()* badWordsLength);
    randomWord = badWords[whichWord];
  }
  splitContents[randomPick] = randomWord;
  videoContents = splitContents.join(" ")

  result = videoContents;
  }
console.log(result);
  return result;
}
